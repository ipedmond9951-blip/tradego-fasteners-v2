#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble the final article JSON, run validation, deploy."""
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

WORKDIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
CONTENT_DIR = WORKDIR / "content" / "articles"
SLUG = "railway-track-fastener-specifications"

LANGS = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']

def t(en, zh, es, ar, fr, pt, ru, ja, de, hi):
    return {
        'en': en, 'zh': zh, 'es': es, 'ar': ar, 'fr': fr,
        'pt': pt, 'ru': ru, 'ja': ja, 'de': de, 'hi': hi
    }


# Title / description / keywords
title = t(
    "Railway Track Fastener Specifications: Pandrol, Vossloh, and AREMA",
    "铁路轨道紧固件规格：Pandrol、Vossloh 和 AREMA",
    "Especificaciones de Sujetadores de Vía Férrea: Pandrol, Vossloh y AREMA",
    "مواصفات مثبتات مسارات السكك الحديدية: Pandrol وVossloh وAREMA",
    "Spécifications des Attaches Ferroviaires : Pandrol, Vossloh et AREMA",
    "Especificações de Fixadores de Trilhos Ferroviários: Pandrol, Vossloh e AREMA",
    "Спецификации крепежа железнодорожных путей: Pandrol, Vossloh и AREMA",
    "鉄道軌道締結装置仕様：Pandrol、Vossloh、AREMA",
    "Eisenbahnschienen-Befestigungsspezifikationen: Pandrol, Vossloh und AREMA",
    "रेलवे ट्रैक फास्टनर विशिष्टताएं: Pandrol, Vossloh, और AREMA"
)

description = t(
    "Complete guide to railway track fastener specifications covering Pandrol e-clip and Fastclip, Vossloh Skl/W/DFF systems, and AREMA standards. Includes material grades, mechanical properties, testing protocols, and quality control for global tenders.",
    "铁路轨道紧固件规格完整指南，涵盖 Pandrol e-clip 和 Fastclip、Vossloh Skl/W/DFF 系统和 AREMA 标准。包括材料等级、机械性能、测试协议和全球招标的质量控制。",
    "Guía completa de especificaciones de sujetadores de vía férrea que cubre Pandrol e-clip y Fastclip, sistemas Vossloh Skl/W/DFF, y estándares AREMA. Incluye grados de material, propiedades mecánicas, protocolos de prueba y control de calidad para licitaciones globales.",
    "دليل شامل لمواصفات مثبتات مسارات السكك الحديدية يغطي Pandrol e-clip وFastclip وأنظمة Vossloh Skl/W/DFF ومعايير AREMA. يشمل درجات المواد والخصائص الميكانيكية وبروتوكولات الاختبار ومراقبة الجودة للمناقصات العالمية.",
    "Guide complet des spécifications des attaches ferroviaires couvrant Pandrol e-clip et Fastclip, les systèmes Vossloh Skl/W/DFF, et les normes AREMA. Comprend les grades de matériaux, les propriétés mécaniques, les protocoles d'essai et le contrôle qualité pour les appels d'offres mondiaux.",
    "Guia completo de especificações de fixadores de trilhos ferroviários cobrindo Pandrol e-clip e Fastclip, sistemas Vossloh Skl/W/DFF e padrões AREMA. Inclui graus de material, propriedades mecânicas, protocolos de teste e controle de qualidade para licitações globais.",
    "Полное руководство по спецификациям крепежа железнодорожных путей, охватывающее Pandrol e-clip и Fastclip, системы Vossloh Skl/W/DFF и стандарты AREMA. Включает марки материалов, механические свойства, протоколы испытаний и контроль качества для мировых тендеров.",
    "Pandrol e-clip および Fastclip、Vossloh Skl/W/DFF システム、AREMA 規格を網羅する鉄道軌道締結装置仕様の完全ガイド。材料グレード、機械的特性、試験プロトコル、品質管理を含む。",
    "Vollständiger Leitfaden zu Eisenbahnschienen-Befestigungsspezifikationen, der Pandrol e-clip und Fastclip, Vossloh Skl/W/DFF-Systeme und AREMA-Standards abdeckt. Enthält Materialgüten, mechanische Eigenschaften, Prüfprotokolle und Qualitätskontrolle für globale Ausschreibungen.",
    "Pandrol e-clip और Fastclip, Vossloh Skl/W/DFF सिस्टम, और AREMA मानकों को कवर करने वाला रेलवे ट्रैक फास्टनर विशिष्टताओं के लिए पूर्ण गाइड। वैश्विक निविदाओं के लिए सामग्री ग्रेड, यांत्रिक गुण, परीक्षण प्रोटोकॉल और गुणवत्ता नियंत्रण शामिल हैं।"
)

keywords = t(
    "railway track fastener specifications, Pandrol e-clip, Vossloh Skl, AREMA track bolts, fish plate, elastic rail clip, EN 13146, UIC 60 rail fastening, concrete sleeper fastener, heavy-haul rail clip",
    "铁路轨道紧固件规格, Pandrol e-clip, Vossloh Skl, AREMA 轨道螺栓, 鱼尾板, 弹性轨道扣件, EN 13146, UIC 60 钢轨扣件, 混凝土轨枕紧固件, 重载轨道扣件",
    "especificaciones sujetadores vía férrea, Pandrol e-clip, Vossloh Skl, pernos vía AREMA, placa de empalme, clip elástico, EN 13146, sujeción riel UIC 60, sujetador traviesa hormigón, clip carga pesada",
    "مواصفات مثبتات مسارات السكك الحديدية, Pandrol e-clip, Vossloh Skl, مسامير مسار AREMA, صفيحة سمك, مشبك سكة مرن, EN 13146, تثبيت سكة UIC 60, مثبت نائمة خرسانية, مشبك سكة ثقيلة",
    "spécifications attaches ferroviaires, Pandrol e-clip, Vossloh Skl, boulons voie AREMA, éclisse, clip élastique, EN 13146, fixation rail UIC 60, attache traverse béton, clip rail lourd",
    "especificações fixadores trilhos ferroviários, Pandrol e-clip, Vossloh Skl, parafusos via AREMA, tala de junção, clipe elástico, EN 13146, fixação trilho UIC 60, fixador dormente concreto, clipe carga pesada",
    "спецификации крепежа железнодорожных путей, Pandrol e-clip, Vossloh Skl, путевые болты AREMA, стыковая накладка, упругий рельсовый зажим, EN 13146, крепление рельса UIC 60, крепеж бетонной шпалы, зажим тяжеловесного рельса",
    "鉄道軌道締結装置仕様, Pandrol e-clip, Vossloh Skl, AREMA 軌道ボルト, 継目板, 弾性レールクリップ, EN 13146, UIC 60 レール締結, コンクリート枕木締結具, 重荷重レールクリップ",
    "Eisenbahnschienen-Befestigungsspezifikationen, Pandrol e-clip, Vossloh Skl, AREMA-Schienenschrauben, Lasche, elastischer Schienenclip, EN 13146, UIC 60 Schienenbefestigung, Betonschwellenbefestigung, Schwerlast-Schienenclip",
    "रेलवे ट्रैक फास्टनर विशिष्टताएं, Pandrol e-clip, Vossloh Skl, AREMA ट्रैक बोल्ट, फिश प्लेट, लोचदार रेल क्लिप, EN 13146, UIC 60 रेल फास्टनिंग, कंक्रीट स्लीपर फास्टनर, भारी-भार रेल क्लिप"
)


# Load partials
print("Loading sections...")
with open('/tmp/railway_partial.json') as f:
    p13 = json.load(f)
with open('/tmp/railway_s45.json') as f:
    p45 = json.load(f)
with open('/tmp/railway_s6.json') as f:
    p6 = json.load(f)

# Build the sections array
sections = []
for body_key, body in [
    ('s1', p13['s1_body']),
    ('s2', p13['s2_body']),
    ('s3', p13['s3_body']),
    ('s4', p45['s4_body']),
    ('s5', p45['s5_body']),
]:
    hkey = body_key + '_heading'
    heading = p13.get(hkey) or p45.get(hkey)
    sections.append({
        'heading': heading,
        'body': body,
    })

# Section 6 is FAQ
sections.append({
    'heading': p6['s6_heading'],
    'body': p6['s6_body'],
    'faqItems': p6['faq_items'],
})


# Build complete article
article = {
    'slug': SLUG,
    'category': 'industry',
    'image': '/images/articles/railway-track-fastener-specifications.jpg',
    'imageAlt': t(
        "Railway track fastener system showing Pandrol e-clip, Vossloh Skl tension clamp, and AREMA track bolts on a concrete sleeper section",
        "铁路轨道紧固件系统显示混凝土轨枕部分上的 Pandrol e-clip、Vossloh Skl 弹条和 AREMA 轨道螺栓",
        "Sistema de sujetadores de vía férrea mostrando Pandrol e-clip, grapa de tensión Vossloh Skl y pernos de vía AREMA en una sección de traviesa de hormigón",
        "نظام مثبتات مسارات السكك الحديدية يوضح Pandrol e-clip ومشبك التوتر Vossloh Skl ومسامير المسار AREMA على مقطع نائمة خرسانية",
        "Système d'attaches ferroviaires montrant Pandrol e-clip, bride de tension Vossloh Skl et boulons de voie AREMA sur une section de traverse en béton",
        "Sistema de fixadores de trilhos ferroviários mostrando Pandrol e-clip, braçadeira de tensão Vossloh Skl e parafusos de via AREMA em uma seção de dormente de concreto",
        "Система крепежа железнодорожных путей, показывающая Pandrol e-clip, натяжной зажим Vossloh Skl и путевые болты AREMA на участке бетонной шпалы",
        "コンクリート枕木セクションの Pandrol e-clip、Vossloh Skl テンションクランプ、AREMA 軌道ボルトを示す鉄道軌道締結システム",
        "Eisenbahnschienen-Befestigungssystem mit Pandrol e-clip, Vossloh Skl-Spannklemme und AREMA-Schienenschrauben auf einem Betonschwellenabschnitt",
        "कंक्रीट स्लीपर सेक्शन पर Pandrol e-clip, Vossloh Skl टेंशन क्लैम्प और AREMA ट्रैक बोल्ट दिखाने वाला रेलवे ट्रैक फास्टनर सिस्टम"
    ),
    'title': title,
    'description': description,
    'keywords': keywords,
    'author': t(
        "TradeGo Engineering Team",
        "TradeGo 工程团队",
        "Equipo de Ingeniería de TradeGo",
        "فريق الهندسة في TradeGo",
        "Équipe d'Ingénierie TradeGo",
        "Equipe de Engenharia TradeGo",
        "Инженерная команда TradeGo",
        "TradeGo エンジニアリングチーム",
        "TradeGo Engineering Team",
        "TradeGo इंजीनियरिंग टीम"
    ),
    'datePublished': '2026-06-08',
    'dateModified': '2026-06-08',
    'readingTime': 18,
    'sections': sections,
    'relatedProducts': [
        {
            'slug': 'track-bolts',
            'name': t(
                "Track Bolts and Hex Nuts",
                "轨道螺栓和六角螺母",
                "Pernos de Vía y Tuercas Hexagonales",
                "مسامير المسار والصواميل السداسية",
                "Boulons de Voie et Écrous Hexagonaux",
                "Parafusos de Via e Porcas Hexagonais",
                "Путевые болты и шестигранные гайки",
                "軌道ボルトと六角ナット",
                "Schienenschrauben und Sechskantmuttern",
                "ट्रैक बोल्ट और हेक्स नट"
            )
        },
        {
            'slug': 'fish-plates',
            'name': t(
                "Fish Plates and Joint Bars",
                "鱼尾板和接联板",
                "Placas de Empalme y Barras de Junta",
                "صفائح السمك وقضبان الوصل",
                "Éclisses et Barres de Joint",
                "Talas de Junção e Barras de Junta",
                "Стыковые накладки и соединительные планки",
                "継目板と接続バー",
                "Laschen und Verbindungsstangen",
                "फिश प्लेट और जॉइंट बार"
            )
        },
        {
            'slug': 'spring-washers',
            'name': t(
                "Spring Washers and Lock Washers",
                "弹簧垫圈和锁紧垫圈",
                "Arandelas Elásticas y Arandelas de Seguridad",
                "حلقات زنبركية وحلقات قفل",
                "Rondelles Élastiques et Rondelles de Blocage",
                "Arruelas de Pressão e Arruelas de Trava",
                "Пружинные шайбы и стопорные шайбы",
                "スプリングワッシャーとロックワッシャー",
                "Federringe und Sicherungsringe",
                "स्प्रिंग वॉशर और लॉक वॉशर"
            )
        },
        {
            'slug': 'anchor-bolts',
            'name': t(
                "Anchor Bolts and Foundation Bolts",
                "地脚螺栓和基础螺栓",
                "Pernos de Anclaje y Pernos de Cimentación",
                "مسامير التثبيت ومسامير الأساس",
                "Boulons d'Ancrage et Boulons de Fondation",
                "Parafusos de Ancoragem e Parafusos de Fundação",
                "Анкерные болты и фундаментные болты",
                "アンカーボルトと基礎ボルト",
                "Ankerschrauben und Fundamentschrauben",
                "एंकर बोल्ट और फाउंडेशन बोल्ट"
            )
        },
        {
            'slug': 'hex-nuts',
            'name': t(
                "Heavy Hex Nuts and Structural Nuts",
                "重型六角螺母和结构螺母",
                "Tuercas Hexagonales Pesadas y Tuercas Estructurales",
                "الصواميل السداسية الثقيلة والصواميل الهيكلية",
                "Écrous Hexagonaux Lourds et Écrous Structurels",
                "Porcas Hexagonais Pesadas e Porcas Estruturais",
                "Тяжелые шестигранные гайки и конструкционные гайки",
                "ヘビーヘックスナットと構造用ナット",
                "Schwere Sechskantmuttern und Strukturmuttern",
                "हेवी हेक्स नट और स्ट्रक्चरल नट"
            )
        }
    ],
    'tags': ['railway', 'fasteners', 'Pandrol', 'Vossloh', 'AREMA', 'EN 13146', 'heavy-haul', 'high-speed rail'],
}

# Compute total words for logging
total_en = sum(len(s['body']['en'].split()) for s in sections)
print(f"Total en words across sections: {total_en}")
print(f"Sections: {len(sections)}")
print(f"FAQ items: {len(sections[-1].get('faqItems', []))}")


# Write article file
CONTENT_DIR.mkdir(parents=True, exist_ok=True)
out_path = CONTENT_DIR / f"{SLUG}.json"
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(article, f, ensure_ascii=False, indent=2)
print(f"Written: {out_path}")
print(f"Size: {out_path.stat().st_size} bytes")

#!/usr/bin/env python3
"""southern-africa-fastener-market-southafrica-botswana §5：es/fr/pt/de 正文整段还是英文，
按英文原文重写成本地语（同时把 zh 从 151 字的摘要补成整节）。

用法：python3 scripts/oneoff-southern-s5.py [--apply]
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, "content", "articles",
                    "southern-africa-fastener-market-southafrica-botswana.json")

BODIES = {}

BODIES["es"] = """El South African Bureau of Standards (SABS) es el organismo nacional de normalización. Para importar tornillos y fijaciones, el cumplimiento de las normas SABS suele exigirse en:

- Licitaciones públicas (Transnet, Eskom, SANRAL)
- Sector minero (Anglo American, Sibanye, Gold Fields)
- Construcción de gran escala (comercial e industrial)

SANS 1700 (Fijaciones - General)
- SANS 1700-1: Tornillos, tuercas y pernos (general)
- SANS 1700-2: Roscas y perfiles de rosca
- SANS 1700-3: Propiedades mecánicas

SANS 1395 (Pernos de alta resistencia)
- Se usan en uniones de acero estructural
- Clases de propiedad 8.8, 10.9 y 12.9
- Opción de galvanizado por inmersión en caliente para resistencia a la corrosión

SANS 1288 (Fijaciones resistentes a la corrosión)
- Aceros inoxidables 304 (A2) y 316 (A4)
- Obligatorias en ambientes costeros y químicos

Botsuana sigue las normas del BOS (Botswana Bureau of Standards), en gran medida alineadas con SANS:
- BOS ISO 898: propiedades mecánicas
- BOS ISO 3506: fijaciones de acero inoxidable resistentes a la corrosión

Para el comercio transfronterizo, los productos con marca SABS sudafricana suelen aceptarse en Botsuana sin recertificación.

La industria minera sudafricana (platino, oro, carbón) tiene requisitos específicos de fijaciones:

1. Minería subterránea
- Pernos de alta resistencia (10.9, 12.9)
- Recubrimientos resistentes a la corrosión
- Documentación de trazabilidad específica

2. Minería a cielo abierto
- Fijaciones para equipos pesados
- Tamaños mayores (M16-M48)
- Galvanizadas para uso exterior

3. Procesamiento de minerales
- Acero inoxidable 316 para exposición química
- Recubrimientos especiales (PTFE, Geomet)

| Empresa | Sede | Gama de producto |
|---------|------|------------------|
| Triton Express | Johannesburgo | Gama completa |
| Bearing Man Group | Durban | Rodamientos + fijaciones |
| Mevacor | Ciudad del Cabo | Enfoque en construcción |
| Bolt and Engineering | Vereeniging | Minería/industria |
| Fastener World | Pretoria | Mayorista |

Al importar fijaciones de China a Sudáfrica conviene prever:
- Derechos antidumping: algunas categorías (por ejemplo, ciertos pernos de acero) están sujetas a ADD
- Permiso de importación: necesario para volúmenes grandes
- Ensayos SABS: muestreo aleatorio en el puerto de entrada
- Plazo de entrega: 35-45 días de China a Durban

Para pedidos más pequeños existen opciones de almacenamiento local en Johannesburgo o Durban.

Para más información, consulte nuestra <a href="/en/industry/south-africa-fasteners-china-import-guide" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">guía de importación de fijaciones de China a Sudáfrica</a> y <a href="/en/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">nuestro catálogo de productos</a>. Los compradores B2B que operan en varios países deben armonizar las especificaciones con las normas regionales y los requisitos aduaneros locales. Marcos regionales habituales: SABS (Sudáfrica), KEBS (Kenia), TBS (Tanzania), ZIMRA (Zimbabue), SON (Nigeria) y las normas AfCFTA para el comercio panafricano. El cumplimiento de la norma local suele ser obligatorio en infraestructura pública, minería y licitaciones gubernamentales."""

BODIES["fr"] = """Le South African Bureau of Standards (SABS) est l'organisme national de normalisation. Pour les importations de fixations, la conformité aux normes SABS est souvent exigée pour :

- Les marchés publics (Transnet, Eskom, SANRAL)
- Le secteur minier (Anglo American, Sibanye, Gold Fields)
- La grande construction (commerciale et industrielle)

SANS 1700 (Fixations - Généralités)
- SANS 1700-1 : vis, boulons, goujons et écrous (généralités)
- SANS 1700-2 : filetages et profils de filetage
- SANS 1700-3 : propriétés mécaniques

SANS 1395 (Boulons à haute résistance)
- Utilisés dans les assemblages en acier de structure
- Classes de propriété 8.8, 10.9 et 12.9
- Option de galvanisation à chaud pour la résistance à la corrosion

SANS 1288 (Fixations résistantes à la corrosion)
- Nuances inoxydables 304 (A2) et 316 (A4)
- Obligatoires en environnement littoral et chimique

Le Botswana applique les normes du BOS (Botswana Bureau of Standards), largement alignées sur les SANS :
- BOS ISO 898 : propriétés mécaniques
- BOS ISO 3506 : fixations inoxydables résistantes à la corrosion

Pour le commerce transfrontalier, les produits portant la marque SABS sud-africaine sont généralement acceptés au Botswana sans nouvelle certification.

L'industrie minière sud-africaine (platine, or, charbon) impose des exigences spécifiques :

1. Mines souterraines
- Boulons à haute résistance (10.9, 12.9)
- Revêtements résistants à la corrosion
- Documentation de traçabilité spécifique

2. Mines à ciel ouvert
- Fixations pour engins lourds
- Tailles plus grandes (M16-M48)
- Galvanisées pour usage extérieur

3. Traitement des minerais
- Inox 316 pour exposition chimique
- Revêtements spécialisés (PTFE, Geomet)

| Entreprise | Siège | Gamme de produits |
|------------|-------|-------------------|
| Triton Express | Johannesburg | Gamme complète |
| Bearing Man Group | Durban | Roulements + fixations |
| Mevacor | Le Cap | Orientation construction |
| Bolt and Engineering | Vereeniging | Mines/industrie |
| Fastener World | Pretoria | Grossiste |

Pour importer des fixations de Chine vers l'Afrique du Sud, prévoyez :
- Droits antidumping : certaines catégories (par exemple certains boulons en acier) sont soumises à des droits antidumping
- Permis d'importation : nécessaire pour les gros volumes
- Essais SABS : prélèvements aléatoires au port d'entrée
- Délai : 35 à 45 jours de la Chine à Durban

Pour les petites commandes, un stockage local à Johannesburg ou Durban est possible.

Pour en savoir plus, consultez notre <a href="/en/industry/south-africa-fasteners-china-import-guide" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">guide d'importation de fixations de Chine vers l'Afrique du Sud</a> et <a href="/en/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">notre catalogue produits</a>. Les acheteurs B2B présents dans plusieurs pays doivent harmoniser leurs spécifications avec les normes régionales et les exigences douanières locales. Cadres régionaux courants : SABS (Afrique du Sud), KEBS (Kenya), TBS (Tanzanie), ZIMRA (Zimbabwe), SON (Nigeria) et les normes AfCFTA pour le commerce panafricain. La conformité à la norme locale est souvent obligatoire pour les infrastructures publiques, les opérations minières et les marchés publics."""

BODIES["pt"] = """O South African Bureau of Standards (SABS) é o organismo nacional de normalização. Para importações de fixadores, a conformidade com as normas SABS costuma ser exigida em:

- Licitações públicas (Transnet, Eskom, SANRAL)
- Setor de mineração (Anglo American, Sibanye, Gold Fields)
- Construção de grande porte (comercial e industrial)

SANS 1700 (Fixadores - Geral)
- SANS 1700-1: parafusos, porcas e prisioneiros (geral)
- SANS 1700-2: roscas e perfis de rosca
- SANS 1700-3: propriedades mecânicas

SANS 1395 (Parafusos de alta resistência)
- Usados em ligações de aço estrutural
- Classes de propriedade 8.8, 10.9 e 12.9
- Opção de galvanização por imersão a quente para resistência à corrosão

SANS 1288 (Fixadores resistentes à corrosão)
- Aços inoxidáveis 304 (A2) e 316 (A4)
- Obrigatórios em ambientes costeiros e químicos

Botsuana segue as normas do BOS (Botswana Bureau of Standards), em grande parte alinhadas às SANS:
- BOS ISO 898: propriedades mecânicas
- BOS ISO 3506: fixadores de aço inoxidável resistentes à corrosão

No comércio transfronteiriço, produtos com a marca SABS sul-africana costumam ser aceitos em Botsuana sem nova certificação.

A indústria de mineração sul-africana (platina, ouro, carvão) tem requisitos específicos de fixadores:

1. Mineração subterrânea
- Parafusos de alta resistência (10.9, 12.9)
- Revestimentos resistentes à corrosão
- Documentação específica de rastreabilidade

2. Mineração a céu aberto
- Fixadores para equipamentos pesados
- Tamanhos maiores (M16-M48)
- Galvanizados para uso externo

3. Processamento de minérios
- Aço inoxidável 316 para exposição química
- Revestimentos especiais (PTFE, Geomet)

| Empresa | Sede | Linha de produtos |
|---------|------|-------------------|
| Triton Express | Joanesburgo | Linha completa |
| Bearing Man Group | Durban | Rolamentos + fixadores |
| Mevacor | Cidade do Cabo | Foco em construção |
| Bolt and Engineering | Vereeniging | Mineração/industrial |
| Fastener World | Pretória | Atacado |

Ao importar fixadores da China para a África do Sul, considere:
- Direitos antidumping: algumas categorias (por exemplo, certos parafusos de aço) estão sujeitas a ADD
- Licença de importação: exigida para grandes volumes
- Ensaios SABS: amostragem aleatória no porto de entrada
- Prazo: 35-45 dias da China a Durban

Para pedidos menores, há opções de armazenagem local em Joanesburgo ou Durban.

Para mais informações, veja nosso <a href="/en/industry/south-africa-fasteners-china-import-guide" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">guia de importação de fixadores da China para a África do Sul</a> e <a href="/en/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">nosso catálogo de produtos</a>. Compradores B2B que atuam em vários países devem harmonizar as especificações com as normas regionais e as exigências aduaneiras locais. Estruturas regionais comuns: SABS (África do Sul), KEBS (Quênia), TBS (Tanzânia), ZIMRA (Zimbábue), SON (Nigéria) e as normas AfCFTA para o comércio pan-africano. A conformidade com a norma local costuma ser obrigatória em infraestrutura pública, mineração e licitações governamentais."""

BODIES["de"] = """Das South African Bureau of Standards (SABS) ist die nationale Normungsorganisation. Bei der Einfuhr von Verbindungselementen wird die Einhaltung der SABS-Normen häufig verlangt für:

- Öffentliche Ausschreibungen (Transnet, Eskom, SANRAL)
- Bergbau (Anglo American, Sibanye, Gold Fields)
- Große Bauvorhaben (Gewerbe und Industrie)

SANS 1700 (Verbindungselemente - Allgemein)
- SANS 1700-1: Schrauben, Muttern, Bolzen (allgemein)
- SANS 1700-2: Gewinde und Gewindeformen
- SANS 1700-3: Mechanische Eigenschaften

SANS 1395 (Hochfeste Schrauben)
- Für Anschlüsse im Stahlbau
- Festigkeitsklassen 8.8, 10.9, 12.9
- Optional feuerverzinkt für Korrosionsbeständigkeit

SANS 1288 (Korrosionsbeständige Verbindungselemente)
- Edelstahlsorten 304 (A2) und 316 (A4)
- Erforderlich in Küsten- und Chemieumgebungen

Botswana folgt den Normen des BOS (Botswana Bureau of Standards), die weitgehend den SANS entsprechen:
- BOS ISO 898: Mechanische Eigenschaften
- BOS ISO 3506: Korrosionsbeständige Edelstahl-Verbindungselemente

Im grenzüberschreitenden Handel werden Produkte mit südafrikanischer SABS-Kennzeichnung in Botswana in der Regel ohne erneute Zertifizierung akzeptiert.

Der südafrikanische Bergbau (Platin, Gold, Kohle) stellt besondere Anforderungen:

1. Untertagebergbau
- Hochfeste Schrauben (10.9, 12.9)
- Korrosionsbeständige Beschichtungen
- Spezifische Rückverfolgbarkeitsunterlagen

2. Tagebau
- Verbindungselemente für Schwermaschinen
- Größere Abmessungen (M16-M48)
- Verzinkt für den Außeneinsatz

3. Erzaufbereitung
- Edelstahl 316 bei Chemikalienkontakt
- Spezialbeschichtungen (PTFE, Geomet)

| Unternehmen | Sitz | Produktspektrum |
|-------------|------|-----------------|
| Triton Express | Johannesburg | Vollsortiment |
| Bearing Man Group | Durban | Lager + Verbindungselemente |
| Mevacor | Kapstadt | Schwerpunkt Bau |
| Bolt and Engineering | Vereeniging | Bergbau/Industrie |
| Fastener World | Pretoria | Großhandel |

Bei der Einfuhr von Verbindungselementen aus China nach Südafrika ist zu beachten:
- Antidumpingzölle: für einige Kategorien (etwa bestimmte Stahlschrauben) gelten ADD
- Einfuhrgenehmigung: erforderlich bei großen Mengen
- SABS-Prüfungen: Stichproben am Eingangshafen
- Lieferzeit: 35-45 Tage von China nach Durban

Für kleinere Bestellungen gibt es Lageroptionen in Johannesburg oder Durban.

Weitere Informationen finden Sie in unserem <a href="/en/industry/south-africa-fasteners-china-import-guide" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Leitfaden zur Einfuhr von Verbindungselementen aus China nach Südafrika</a> und in <a href="/en/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">unserem Produktkatalog</a>. B2B-Einkäufer, die in mehreren Ländern tätig sind, sollten die Spezifikationen an regionale Normen und lokale Zollanforderungen anpassen. Gängige regionale Rahmen: SABS (Südafrika), KEBS (Kenia), TBS (Tansania), ZIMRA (Simbabwe), SON (Nigeria) sowie AfCFTA-Normen für den panafrikanischen Handel. Die Einhaltung lokaler Normen ist bei öffentlicher Infrastruktur, Bergbaubetrieben und staatlichen Ausschreibungen oft verpflichtend."""

BODIES["zh"] = """南非标准局（SABS）是南非的国家标准化机构。进口紧固件时，下列场景通常要求符合 SABS 标准：

- 政府招标（Transnet、Eskom、SANRAL）
- 矿业（Anglo American、Sibanye、Gold Fields）
- 大型建筑（商业与工业项目）

SANS 1700（紧固件通用）
- SANS 1700-1：螺栓、螺钉、螺柱与螺母（通用）
- SANS 1700-2：螺纹与螺纹型式
- SANS 1700-3：机械性能

SANS 1395（高强度螺栓）
- 用于钢结构连接
- 性能等级 8.8、10.9、12.9
- 可选热浸镀锌以满足耐蚀要求

SANS 1288（耐蚀紧固件）
- 不锈钢牌号 304（A2）与 316（A4）
- 沿海与化工环境必备

博茨瓦纳采用 BOS（博茨瓦纳标准局）标准，与 SANS 基本对齐：
- BOS ISO 898：机械性能
- BOS ISO 3506：耐蚀不锈钢紧固件

跨境贸易中，带南非 SABS 标志的产品在博茨瓦纳通常可直接接受，无需重新认证。

南非矿业（铂金、黄金、煤炭）对紧固件有专门要求：

1. 井下开采
- 高强度螺栓（10.9、12.9）
- 耐蚀涂层
- 专门的追溯文件

2. 露天开采
- 重型设备紧固件
- 更大规格（M16–M48）
- 户外使用需镀锌

3. 选矿与加工
- 接触化学品处用 316 不锈钢
- 专用涂层（PTFE、Geomet）

| 企业 | 总部 | 产品范围 |
|------|------|----------|
| Triton Express | 约翰内斯堡 | 全品类 |
| Bearing Man Group | 德班 | 轴承 + 紧固件 |
| Mevacor | 开普敦 | 以建筑为主 |
| Bolt and Engineering | 弗里尼欣 | 矿山/工业 |
| Fastener World | 比勒陀利亚 | 批发 |

从中国进口紧固件到南非时需要注意：
- 反倾销税：部分品类（如某些钢制螺栓）适用反倾销税
- 进口许可：大批量进口需要许可
- SABS 检测：入境口岸抽检
- 交期：从中国到德班约 35–45 天

订单较小时，可在约翰内斯堡或德班安排本地仓储。

更多信息可参阅我们的<a href="/en/industry/south-africa-fasteners-china-import-guide" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">南非紧固件中国进口指南</a>与<a href="/en/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">产品目录</a>。在多个国家经营的 B2B 买家，应把规格与区域标准、当地海关要求对齐。常见区域框架：SABS（南非）、KEBS（肯尼亚）、TBS（坦桑尼亚）、ZIMRA（津巴布韦）、SON（尼日利亚），以及泛非贸易的 AfCFTA 标准。公共基础设施、矿山作业与政府招标通常强制要求符合当地标准。"""


def main():
    do_apply = "--apply" in sys.argv
    d = json.load(open(FILE, encoding="utf-8"))
    sec = d["sections"][5]
    for lang, body in BODIES.items():
        old = sec["body"].get(lang, "")
        sec["body"][lang] = body
        print(f"{lang}: {len(old)} → {len(body)} 字符")
    # 英文正文里出现的关键事实必须都能在本地语里找到
    for kw in ("SANS 1700", "SANS 1395", "SANS 1288", "AfCFTA"):
        for lang, body in BODIES.items():
            assert kw in body, (lang, kw)
    # 交期数字必须都在（法语写法是"35 à 45"，中文是"35–45"）
    for lang, body in BODIES.items():
        assert "35" in body and "45" in body, lang
    if do_apply:
        open(FILE, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
        print("已写回", os.path.relpath(FILE, ROOT))
    else:
        print("（报告模式，加 --apply 落盘）")


if __name__ == "__main__":
    main()

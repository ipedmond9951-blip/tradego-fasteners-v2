#!/usr/bin/env python3
"""africa-solar-energy-fastener-procurement-guide：葡语正文尾部成段中文 → 译成葡语。

这篇 §1/§3/§4 的 pt 正文末尾各粘了一大段中文（同一句话还重复了两遍），是本地化管线
追加的伪翻译。按"逐段翻译"处理（整段删会丢内容），重复的句子只保留一次。

用法：python3 scripts/oneoff-solar-pt.py [--apply]
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, "content", "articles", "africa-solar-energy-fastener-procurement-guide.json")

# (section, 中文尾巴的起始标记, 译成葡语后的整段)
PATCHES = [
    (1, "基于标准的compras需要持续学习",
     "<p>Comprar com base em normas exige aprendizado contínuo, porque as normas ISO, ASTM, DIN e GB são revisadas a cada 3 a 5 anos. Assine os alertas de atualização e revise as especificações anualmente. As normas mais usadas no comércio internacional de fixadores são ISO 898-1 (propriedades mecânicas), ISO 3506-1 (aço inoxidável), ISO 3269 (inspeção de aceitação), ISO 4042 (revestimentos) e ISO 1502 (calibres de rosca). Para compradores B2B, é essencial manter uma biblioteca de referência com pelo menos 20 normas principais ligadas ao portfólio. Na prática, recomenda-se criar uma função dedicada de normalização, responsável por acompanhar as revisões das normas internacionais e ajustar especificações e controles de qualidade. Também vale treinar periodicamente a equipe de compras nas normas e especificações mais recentes. Em projetos críticos, convide um organismo de inspeção independente para uma pré-avaliação da conformidade do fornecedor. Um sistema documental padronizado, com versão e escopo de aplicação de cada norma, é igualmente importante para a consistência da qualidade. Com essas medidas, a empresa eleva a eficiência de compra e a qualidade do produto e reduz o risco e o custo de não conformidade com as normas.</p>"),
    (3, "验证清单适用于初始供应商资格认证",
     "<p>A lista de verificação vale para a homologação inicial do fornecedor e para a inspeção contínua de cada lote. Para aplicações de alto risco (estruturas portantes, vasos de pressão, mineração, ambiente marinho), acrescente ensaio de fadiga, névoa salina (ASTM B117), torque-tração e inspeção após a instalação. A verificação adicional custa 0,1-0,3% do valor do pedido, enquanto uma falha de qualidade não detectada pode causar de 10 a 100 vezes esse valor em danos. Recomenda-se padronizar o processo e os registros da inspeção pré-embarque, com critérios de aprovação e reprovação claros para cada item e registros completos para referência futura. Itens reprovados devem ser tratados com o fornecedor de imediato, exigindo ação corretiva ou substituição. Treine e avalie periodicamente os inspetores para que dominem as normas e métodos mais recentes. Quando possível, use equipamentos automatizados para maior consistência e precisão. Com esses controles, o risco de receber produto não conforme cai de forma significativa e o projeto segue seu curso.</p>"),
    (4, "供应商评估应该是一个持续的过程",
     "<p>A avaliação de fornecedores deve ser um processo contínuo, não um exercício pontual. Reavalie anualmente com base no desempenho de entrega, indicadores de qualidade, competitividade de preço e capacidade de resposta. Mantenha um scorecard com pesos de entrega no prazo (25%), taxa de aceitação de qualidade (30%), competitividade de preço (20%), capacidade de resposta (15%) e precisão documental (10%). Desqualifique fornecedores com pontuação abaixo de 70% por seis meses e qualifique substitutos. Recomenda-se uma gestão em camadas: fornecedores estratégicos, preferenciais e qualificados, ajustados dinamicamente conforme o desempenho. Estratégicos justificam parceria de longo prazo e desenvolvimento conjunto de produtos e cadeia; preferenciais ganham preço e serviço com volume; qualificados ficam como fonte alternativa para reduzir risco de suprimento. Com essas práticas, a cadeia se torna mais eficiente, confiável e econômica. Revisões periódicas de negócio com os fornecedores, discutindo problemas e oportunidades de melhoria, estreitam a relação em benefício mútuo.</p>"),
]


def main():
    do_apply = "--apply" in sys.argv
    d = json.load(open(FILE, encoding="utf-8"))
    for sec, marker, new in PATCHES:
        body = d["sections"][sec]["body"]["pt"]
        i = body.find(marker)
        if i < 0:
            if new[:40] in body:
                print(f"  · §{sec} 已应用")
                continue
            print(f"❌ §{sec} 找不到中文尾巴标记：{marker}")
            sys.exit(1)
        tail = body[i:]
        # 尾巴里不该再夹成句葡语（夹了就说明标记切早了）
        if len(re.findall(r"[A-Za-z]{4,}", re.sub(r"<[^>]+>", "", tail))) > 12:
            print(f"❌ §{sec} 尾巴里混着成句葡语，标记位置需复核")
            sys.exit(1)
        d["sections"][sec]["body"]["pt"] = body[:i].rstrip() + " " + new
    left = sum(len(re.findall(r"[\u4e00-\u9fff]", s["body"]["pt"])) for s in d["sections"])
    print(f"pt 正文剩余中文字符：{left}")
    if do_apply:
        open(FILE, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
        print("已写回", os.path.relpath(FILE, ROOT))
    else:
        print("（报告模式，加 --apply 落盘）")


if __name__ == "__main__":
    main()

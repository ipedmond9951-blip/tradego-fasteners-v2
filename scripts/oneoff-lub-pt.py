#!/usr/bin/env python3
"""把 fastener-lubrication-thread-locking-guide 的葡语正文里夹的中文段落翻成葡语。

背景：本地化管线往 pt 正文尾部追加了成段中文（伪翻译），此前脚本按"整段删除"处理，
但其中部分段落是本篇独有的信息（不是重复），删掉会丢内容、还会让小节编号断档。
这里改为逐段翻译替换；完全重复的段落（与前面段落同义）才删除。

fail-closed：每条替换必须恰好命中一次，否则退出码非 0，不写文件。
用法：python3 scripts/oneoff-lub-pt.py [--apply]
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, "content", "articles", "fastener-lubrication-thread-locking-guide.json")

# (段落序号所属 section, 原文, 译文)；译文为空字符串表示删除（仅用于完全重复的段落）
PATCHES = [
    (0,
     "<p>Para compradores B2B que采购来自全球供应商，框架 below 帮助标准化采购决策并最大程度地减少质量风险。</p>",
     "<p>Para compradores B2B que compram de fornecedores globais, a estrutura abaixo ajuda a padronizar as decisões de compra e a reduzir ao mínimo o risco de qualidade.</p>"),
    (0,
     "<p>这个采购框架适用于建筑、采矿、能源、汽车和一般工业应用的紧固件采购。决策逻辑优先考虑质量一致性、供应商可靠性和总拥有成本，而非短期单价。对于非洲、拉丁美洲和东南亚的 B2B 买家，还需要考虑地区海关要求、集装箱整合选项和支付安全机制。可以在各个项目中通用的标准化规格可以减少培训时间、询价处理时间和供应商入职工作量。</p>",
     "<p>Esta estrutura de compra aplica-se à aquisição de fixadores para construção, mineração, energia, automotivo e aplicações industriais em geral. A lógica de decisão prioriza consistência de qualidade, confiabilidade do fornecedor e custo total de propriedade em vez do preço unitário de curto prazo. Para compradores B2B na África, América Latina e Sudeste Asiático, é preciso considerar também exigências aduaneiras regionais, opções de consolidação de contêineres e mecanismos de segurança de pagamento. Especificações padronizadas que se repetem entre projetos reduzem o tempo de treinamento, o tempo de processamento de cotações e o esforço de homologação de fornecedores.</p>"),
    (0,
     "<p>对于在多个地区运营的 B2B 买家，建议建立统一的规格库，以便在不同的项目和市场之间保持一致性。这种方法不仅简化了供应链管理，还提高了与供应商谈判的效率。标准化规格还便于进行批量采购，从而获得更好的价格和交货条件。</p>",
     "<p>Para compradores B2B que operam em várias regiões, recomenda-se criar uma biblioteca de especificações unificada para manter a consistência entre projetos e mercados. Isso simplifica a gestão da cadeia de suprimentos e aumenta a eficiência das negociações com fornecedores. Especificações padronizadas também facilitam compras em volume, o que melhora preços e prazos de entrega.</p>"),
    (0,
     "<p>在选择正确的 thread locking 和 lubrication 方法时，重要的是要了解应用的具体要求，包括负载条件、环境暴露、维护周期和预期使用寿命。这些因素将直接影响所选解决方案的总拥有成本和长期性能。</p>",
     "<p>Ao escolher o método certo de travamento de rosca e lubrificação, é importante entender os requisitos específicos da aplicação: condições de carga, exposição ambiental, intervalos de manutenção e vida útil esperada. Esses fatores influenciam diretamente o custo total de propriedade e o desempenho de longo prazo da solução escolhida.</p>"),
    # 与上面"这个采购框架…"段末句完全重复，删掉
    (0,
     "<p>对于非洲、拉丁美洲和东南亚的 B2B 买家，额外的考虑因素包括地区海关要求、集装箱整合选项和支付安全机制。可以在各个项目中通用的标准化规格可以减少培训时间、询价处理时间和供应商入职工作量。</p>",
     ""),
    (1,
     "<p>A采购基于标准的 requires 需要持续学习，因为 ISO、ASTM、DIN 和 GB 标准每 3-5 年修订一次。订阅标准更新通知并每年审查规格。在国际紧固件贸易中使用的最常见标准是 ISO 898-1（机械性能）、ISO 3506-1（不锈钢）、ISO 3269（验收检验）、ISO 4042（涂层）和 ISO 1502（螺纹量规）。对于 B2B 买家，建立包含至少 20 个与您的产品组合相关的主要标准的标准参考库至关重要。</p>",
     "<p>Comprar com base em normas exige aprendizado contínuo, porque as normas ISO, ASTM, DIN e GB são revisadas a cada 3 a 5 anos. Assine os alertas de atualização de normas e revise as especificações anualmente. As normas mais usadas no comércio internacional de fixadores são ISO 898-1 (propriedades mecânicas), ISO 3506-1 (aço inoxidável), ISO 3269 (inspeção de aceitação), ISO 4042 (revestimentos) e ISO 1502 (calibres de rosca). Para um comprador B2B, é essencial manter uma biblioteca com pelo menos 20 normas principais ligadas ao seu portfólio.</p>"),
    (1,
     "<p>对于在特定市场中的应用，可能需要遵守额外的区域标准。非洲基础设施项目应参考南非 SABS 要求，而拉丁美洲市场可能需要符合当地标准组织的规格。东南亚市场通常接受 ISO 或 ASTM 标准，但某些国家可能有自己的国家标准版本。</p>",
     "<p>Aplicações em mercados específicos podem exigir normas regionais adicionais. Projetos de infraestrutura na África devem observar os requisitos SABS da África do Sul, enquanto mercados latino-americanos podem exigir conformidade com as normas locais. Os mercados do Sudeste Asiático geralmente aceitam ISO ou ASTM, mas alguns países mantêm versões nacionais próprias.</p>"),
    (1,
     "<p>持续学习和标准更新追踪对于保持竞争优势至关重要。建议订阅相关标准组织的新闻通讯，参加行业会议，并与其他 B2B 买家交流最佳实践。这将帮助您及时了解可能影响您的采购决策的标准变化。</p>",
     "<p>O aprendizado contínuo e o acompanhamento das atualizações de normas são essenciais para manter a competitividade. Assine as newsletters dos organismos de normalização, participe de feiras do setor e troque boas práticas com outros compradores B2B. Isso mantém você informado sobre mudanças que podem afetar suas decisões de compra.</p>"),
    (2,
     "<p>上述比较方法使用行业数据和 TradeGo 采购经验的典型范围 2018-2024。实际市场价格随原材料成本（钢材、锌、镍）、能源成本劳动力成本和汇率波动。为了进行准确比较，请从 3-5 个合格的供应商处请求相同的询价，并比较落地成本（产品 + 运费 + 保险 + 关税）。最低单价很少是最低的总拥有成本。</p>",
     "<p>O método comparativo acima usa dados do setor e as faixas típicas da experiência de compra da TradeGo em 2018-2024. Os preços reais variam com o custo das matérias-primas (aço, zinco, níquel), o custo de energia, a mão de obra e o câmbio. Para comparar com precisão, solicite a mesma cotação a 3 a 5 fornecedores qualificados e compare o custo desembarcado (produto + frete + seguro + tarifa). O menor preço unitário raramente é o menor custo total de propriedade.</p>"),
    (2,
     "<p>在评估不同选项时，重要的是要考虑不仅仅是初始购买成本，还要考虑整个产品生命周期的成本。这包括维护成本、更换频率、停机时间成本以及与故障相关的潜在风险。 premium 选项虽然前期成本较高，但通常在整个生命周期内提供更好的价值。</p>",
     "<p>Ao avaliar opções, considere não só o custo de compra inicial, mas o custo ao longo de todo o ciclo de vida do produto: manutenção, frequência de substituição, custo de parada e risco de falha. As opções premium custam mais no início, mas normalmente entregam melhor valor ao longo da vida útil.</p>"),
    (2,
     "<p>对于在多个地区运营的 B2B 买家，还应考虑地区特定的成本因素，如运费、海关关税和当地法规合规成本。这些因素可能会显着影响不同选项的相对成本效益。</p>",
     "<p>Compradores B2B que operam em várias regiões devem considerar também fatores de custo locais, como frete, tarifas aduaneiras e custo de conformidade regulatória. Esses fatores podem alterar bastante a relação custo-benefício entre as opções.</p>"),
    (3,
     "<p>验证清单适用于供应商初始资格认证和 ongoing 批次检验。对于高风险应用（承重结构、压力容器、采矿、海洋），添加疲劳测试、盐雾测试（ASTM B117）、扭矩-张力测试和安装后检验。额外验证的成本为订单价值的 0.1-0.3%，而未检测到的质量故障可能达到订单价值的 10-100 倍。</p>",
     "<p>A lista de verificação vale para a homologação inicial do fornecedor e para a inspeção contínua de cada lote. Para aplicações de alto risco (estruturas portantes, vasos de pressão, mineração, ambiente marinho), acrescente ensaio de fadiga, névoa salina (ASTM B117), torque-tração e inspeção após a instalação. A verificação adicional custa 0,1-0,3% do valor do pedido, enquanto uma falha de qualidade não detectada pode custar de 10 a 100 vezes esse valor.</p>"),
    (3,
     "<p>建议为关键应用建立额外的测试协议，包括材料成分分析、显微组织检查和功能性能测试。这些测试虽然增加了成本，但可以显著降低与产品故障相关的风险和成本。</p>",
     "<p>Para aplicações críticas, estabeleça protocolos de ensaio adicionais: análise de composição química, exame metalográfico e ensaios de desempenho funcional. Esses ensaios custam mais, mas reduzem de forma significativa o risco e o custo associados a falhas do produto.</p>"),
    (3,
     "<p>对于在高风险环境中使用的紧固件，还应考虑环境测试，如耐腐蚀性测试、温度循环测试和振动测试。这些测试有助于确保紧固件在极端条件下的长期可靠性。</p>",
     "<p>Fixadores usados em ambientes de alto risco também exigem ensaios ambientais: resistência à corrosão, ciclos de temperatura e vibração. Esses ensaios ajudam a garantir a confiabilidade de longo prazo em condições extremas.</p>"),
    (4,
     "<p>供应商评估应该是一个持续的过程，而不是一次性的练习。根据交付绩效、质量指标、价格竞争力和响应能力每年重新评估供应商。维护一个供应商记分卡，权重指标为：按时交付（25%）、质量接受率（30%）、价格竞争力（20%）、响应能力（15%）和文档准确性（10%）。淘汰在 6 个月期间得分低于 70% 的供应商，并限定替代者。</p>",
     "<p>A avaliação de fornecedores deve ser um processo contínuo, não um exercício pontual. Reavalie cada fornecedor anualmente com base no desempenho de entrega, nos indicadores de qualidade, na competitividade de preço e na capacidade de resposta. Mantenha um scorecard com pesos de entrega no prazo (25%), taxa de aceitação de qualidade (30%), competitividade de preço (20%), capacidade de resposta (15%) e precisão documental (10%). Desqualifique fornecedores com pontuação abaixo de 70% por seis meses e qualifique substitutos.</p>"),
    (4,
     "<p>对于在全球多个市场运营的 B2B 买家，建议建立供应商多元化战略，减少对单一供应商的依赖。这包括为不同地区指定备份供应商，并定期进行供应商绩效评估。</p>",
     "<p>Compradores B2B que atuam em vários mercados devem adotar uma estratégia de diversificação de fornecedores para reduzir a dependência de um único parceiro: designe fornecedores de backup por região e reavalie o desempenho periodicamente.</p>"),
    (4,
     "<p>建立强有力的供应商关系可以带来显着的长期利益，包括更好的定价、更优先的交货安排以及获得新产品开发的支持。定期沟通和透明的反馈对于维护这些关系至关重要。</p>",
     "<p>Relações sólidas com fornecedores trazem benefícios de longo prazo: melhores preços, prioridade na programação de entregas e apoio no desenvolvimento de novos produtos. Comunicação regular e feedback transparente são essenciais para manter essas relações.</p>"),
    (5,
     "<p>对于在多个国家运营的 B2B 买家，规格应与地区标准和当地海关要求保持一致。常见区域框架：SABS（南非）、KEBS（肯尼亚）、TBS（坦桑尼亚）、ZIMRA（津巴布韦）、SON（尼日利亚）以及泛非贸易的 AfCFTA 标准。当地标准合规通常是公共基础设施项目、采矿作业和政府招标的强制性要求。</p>",
     "<p>Para compradores B2B que operam em vários países, as especificações devem acompanhar as normas regionais e as exigências aduaneiras locais. Estruturas regionais comuns: SABS (África do Sul), KEBS (Quênia), TBS (Tanzânia), ZIMRA (Zimbábue), SON (Nigéria) e as normas AfCFTA para o comércio pan-africano. A conformidade com a norma local costuma ser obrigatória em infraestrutura pública, mineração e licitações governamentais.</p>"),
    (5,
     "<p>在选择 thread locking 和 lubrication 方法时，重要的是要考虑具体应用的要求，包括负载条件、环境暴露、维护周期和预期使用寿命。这些因素将直接影响所选解决方案的性能和成本效益。</p>",
     "<p>Ao escolher entre métodos de travamento de rosca e lubrificação, avalie os requisitos específicos da aplicação: condições de carga, exposição ambiental, intervalos de manutenção e vida útil esperada. Esses fatores influenciam diretamente o desempenho e o custo-benefício da solução escolhida.</p>"),
    (5,
     "<p>B2B 买家还应考虑与不同 thread locking 和 lubrication 方法相关的培训和技能要求。某些解决方案可能需要专门的安装设备或培训，而其他解决方案可能更容易实施且容错率更高。</p>",
     "<p>Compradores B2B devem considerar também os requisitos de treinamento e qualificação associados a cada método. Algumas soluções exigem equipamento de instalação dedicado ou treinamento específico; outras são mais fáceis de aplicar e toleram mais erros.</p>"),
    (5,
     "<p>对于涉及多个供应商的项目，标准化规格和方法可以简化供应链管理，减少培训要求，并提高整体效率。建议与所有相关利益相关者（包括设计团队、安装团队和维护人员）协商，以确保所选方法满足所有要求。</p>",
     "<p>Em projetos com vários fornecedores, especificações e métodos padronizados simplificam a cadeia de suprimentos, reduzem o treinamento e aumentam a eficiência. Consulte todas as partes interessadas (projeto, instalação e manutenção) para garantir que o método escolhido atenda a todos os requisitos.</p>"),
    (5,
     "<p>持续改进和定期审查是保持最佳实践的关键。建议定期收集安装人员和其他最终用户的反馈，以识别潜在问题并实施改进措施。</p>",
     "<p>A melhoria contínua e a revisão periódica sustentam as boas práticas. Colete regularmente o feedback dos instaladores e dos usuários finais para identificar problemas e implementar melhorias.</p>"),
]


def main():
    do_apply = "--apply" in sys.argv
    d = json.load(open(FILE, encoding="utf-8"))
    miss = 0
    for sec_idx, old, new in PATCHES:
        body = d["sections"][sec_idx]["body"]["pt"]
        cnt = body.count(old)
        if cnt == 0 and (new == "" or new in body):
            print(f"  · 已应用 §{sec_idx}")
            continue
        if cnt != 1:
            print(f"❌ §{sec_idx} 命中 {cnt} 次（应为 1）：{old[:50]}")
            miss += 1
            continue
        d["sections"][sec_idx]["body"]["pt"] = body.replace(old, new)
    if miss:
        print(f"❌ {miss} 条未按预期命中，未写文件")
        sys.exit(1)

    import re
    left = sum(len(re.findall(r"[\u4e00-\u9fff]", s["body"]["pt"])) for s in d["sections"])
    print(f"pt 正文剩余中文字符：{left}")

    if do_apply:
        open(FILE, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
        print("已写回", os.path.relpath(FILE, ROOT))


if __name__ == "__main__":
    main()

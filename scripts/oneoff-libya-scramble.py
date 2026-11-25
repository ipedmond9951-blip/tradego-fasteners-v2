#!/usr/bin/env python3
"""修复 libya-tripoli-construction-fastener-sourcing 的整字段错语种：
de §2/§4/§5 混入印地语/阿拉伯语，es §2(内容实际是物流)§4§5 错位到洛美港/印地语，pt §4(德语/拉各斯)§5(印地语/洛美)。
按英文原文重写 de/es/pt 的 §2/§4/§5，并把"认证等级"类标题改为 ISO 898-1 性能等级口径。
"""
import json

P = 'content/articles/libya-tripoli-construction-fastener-sourcing.json'
d = json.load(open(P))
S = d['sections']

de = {
 'h2': 'Einfuhrzoll- und Dokumentenvorschriften für Baubefestigungslieferungen nach Tripolis',
 'b2': (
  '<p>Der bürokratisch aufwendigste Teil der Beschaffung von Baubefestigungen für Tripolis ist die Einfuhrkontrolle: '
  'Unvollständige oder fehlerhafte Papiere sind am Hafen von Tripolis die häufigste Ursache für Containeraufenthalt und '
  'teures Demurrage. Das libysche Wirtschaftsministerium verlangt für Baustoffe – auch für Schüttgut-Kretefixierung in '
  'Seecontainern – eine förmliche Vorab-Einfuhrgenehmigung der Abteilung Baumaterialien. Ohne gültige Genehmigung darf '
  'kein Container am Verladehafen verladen werden.</p>'
  '<p>Der Antrag verlangt Handelsregisterauszug des libyschen Importeurs, Tendervergabe- oder Auftragsunterlagen, eine '
  'detaillierte Produktliste der Befestigungen (Werkstoff, Festigkeitsklasse, Oberfläche, Abmessungen) sowie die Adresse '
  'der Baustelle in Tripolis als Endverwendung. Die Bearbeitung dauert üblicherweise 14 bis 21 Werktage und muss in die '
  'Beschaffungsvorlaufzeit eingeplant werden. Eilgenehmigungen bei akutem Materialengpass sind möglich, kosten aber '
  'einen Aufschlag in Höhe von rund 7 % des erklärten Warenwerts.</p>'
  '<p>Jeder Container braucht einen vollständigen Dokumentensatz: Handelsrechnung, Packliste, Original-Konnossement, '
  'Ursprungszeugnis, Werkszeugnisse nach EN 10204 3.1 sowie Chargenprüfprotokolle. Wir liefern die Unterlagen '
  'abgestimmt auf die Sendung; Zertifizierungen (etwa ISO 9001 oder SABS) werden nur auf ausdrückliche Bestellung '
  'und projektbezogen beantragt, nicht als vorhandene Zertifikate zugesagt.</p>'
 ),
 'h4': 'Risikominderung bei Verträgen zur Baubefestigungsbeschaffung in Tripolis',
 'b4': (
  '<p>Finanz-, Qualitäts- und Lieferrisiken sind in Libyen eng miteinander verknüpft, weil sich Handelsregeln und '
  'Devisenzugang kurzfristig ändern können. Die belastbarste Absicherung ist ein gestuftes Zahlungsmodell: '
  '30 % Anzahlung per Überweisung nach Vertragsunterzeichnung, damit das Werk Rohstahl reserviert und die Produktion '
  'einplant; die restlichen 70 % erst, nachdem der Käufer klare digitale Kopien des vollständigen Versanddokumentensatzes '
  'erhalten hat – Original-Konnossement, Ursprungszeugnis, Werkszeugnisse, Prüfprotokolle und den bestandenen '
  'Vorversandbericht einer unabhängigen Inspektion (SGS oder BV).</p>'
  '<p>Diese Aufteilung verhindert Vorauszahlung ohne nachprüfbare Ware, lässt dem Werk aber die Sicherheit, '
  'Stahlverarbeitung und Oberflächenbehandlung ohne unbezahlte Vorleistung zu starten. Anzahlungen von 50 % oder mehr '
  'sollten Käufer ablehnen, sofern sie nicht mit langjährig geprüften Partnern arbeiten, die bereits mehrfach für '
  'libysche Projekte geliefert haben.</p>'
  '<p>Ergänzend gehört in jeden Vertrag: eine klar definierte Charge, dokumentierte Prüfmerkmale je Los, ein '
  'Nachprüfungsrecht vor Verladung und eine Regelung für den Fall, dass die Einfuhrgenehmigung später erteilt wird als '
  'geplant. Wer diese drei Punkte vor Auftragserteilung schriftlich fixiert, trägt deutlich weniger Streitkosten.</p>'
 ),
 'h5': 'Warum TradeGo Baubefestigungen für Tripolis verlässlich liefert',
 'b5': (
  '<p>TradeGo ist ein vertikal integrierter chinesischer Hersteller mit eigenem Exportrahmen für libysche Bauprojekte. '
  'Der entscheidende Preisunterschied entsteht zwischen Direktbezug und Zwischenhandel: Händler, die Fertigware aus '
  'mehreren Fabriken zusammenkaufen und weiterverkaufen, liegen typischerweise 18 % bis 25 % über dem '
  'Direktpreis ab Werk.</p>'
  '<p>Die Fertigung bleibt durchgängig im Haus: Bezug von warmgewalztem Kohlenstoffstahl, Kaltumformung von '
  'Schrauben- und Ankerrohlingen, Wärmebehandlung zur Einstellung der Festigkeitsklassen 8.8 bis 12.9 nach ISO 898-1, '
  'Feuerverzinkung, Gewindewalzen und Chargenprüfung, auf Wunsch mit begleitender SGS-Überwachung. Diese geschlossene '
  'Kette reduziert Streuung zwischen Lieferungen und macht Stückpreise für Rahmenverträge kalkulierbar.</p>'
  '<p>Für Programme wie den Ausbau des Hafens von Tripolis oder den Wiederaufbau öffentlicher Schulen liefern wir '
  'Festpreisrahmen pro Quartal, Losgrößen nach Bauabschnitt und eine Dokumentenabwicklung, die auf die oben genannten '
  'libyschen Einfuhrvorschriften abgestimmt ist. Zertifizierungen werden bei Bedarf projektbezogen beantragt.</p>'
 ),
}

es = {
 'h2': 'Normas aduaneras y documentales para envíos de fijaciones a Trípoli',
 'b2': (
  '<p>El control administrativo es la parte más lenta del suministro de fijaciones para obra en Trípoli: documentación '
  'incompleta o mal confeccionada es la primera causa de retención de contenedores y de demoras costosas en el puerto '
  'de Trípoli. El Ministerio de Economía exige una autorización previa de importación para materiales de construcción, '
  'incluidos los cargamentos de fijación de acero en contenedor marítimo. Sin permiso válido no se puede cargar en el '
  'puerto de origen.</p>'
  '<p>La solicitud requiere registro mercantil del importador libio, documentación de la adjudicación del proyecto, '
  'una lista detallada de productos (material, clase de resistencia, recubrimiento y medidas) y la dirección de la obra '
  'en Trípoli como destino final. La tramitación suele tardar entre 14 y 21 días hábiles y debe incorporarse al plazo '
  'total de suministro. Existen permisos acelerados para faltantes críticos de obra, con un recargo administrativo de '
  'alrededor del 7 % del valor declarado de la mercancía.</p>'
  '<p>Cada contenedor necesita un expediente completo: factura comercial, lista de empaque, conocimiento de embarque '
  'original, certificado de origen, certificados de material EN 10204 3.1 y protocolos de ensayo por lote. Preparamos '
  'esos documentos según la carga; las certificaciones (por ejemplo ISO 9001 o SABS) se solicitan por pedido y por '
  'proyecto, nunca se declaran como certificados ya obtenidos.</p>'
 ),
 'h4': 'Cómo reducir riesgos al contratar fijaciones para obra en Trípoli',
 'b4': (
  '<p>El riesgo financiero, de calidad y de continuidad está muy ligado en Libia, donde las reglas comerciales y el '
  'acceso a divisas pueden cambiar en pocas semanas. La protección más sólida es un esquema de pago por etapas: '
  '30 % de anticipo por transferencia al firmar el contrato, para que la fábrica reserve acero y programe producción, '
  'y el 70 % restante solo cuando el comprador reciba copias digitales legibles del expediente completo de embarque: '
  'conocimiento de embarque original, certificado de origen, certificados de material, protocolos de ensayo y el '
  'informe favorable de inspección previa al embarque de un organismo independiente (SGS o BV).</p>'
  '<p>Este reparto evita pagar por adelantado sin mercancía verificable y a la vez permite a la fábrica iniciar el '
  'procesamiento del acero y el tratamiento superficial sin asumir costos sin respaldo. Anticipos del 50 % o superiores '
  'deberían rechazarse, salvo con fabricantes de largo recorrido que ya hayan entregado varias veces a proyectos libios.</p>'
  '<p>Conviene además fijar por escrito tres puntos antes del pedido: definición clara del lote, características de '
  'inspección documentadas por lote y el derecho a verificación antes de la carga, junto con una regla para el caso de '
  'que la autorización de importación llegue más tarde de lo previsto.</p>'
 ),
 'h5': 'Por qué TradeGo entrega fijaciones para Trípoli de forma confiable',
 'b5': (
  '<p>TradeGo es un fabricante chino integrado verticalmente, con un marco de exportación específico para proyectos '
  'libios. La diferencia de precio decisiva aparece entre comprar directo y comprar a intermediarios: los '
  'comercializadores que reúnen producto terminado de varias fábricas y lo revenden suelen quedar entre 18 % y 25 % '
  'por encima del precio directo de fábrica.</p>'
  '<p>La producción permanece íntegramente en casa: acero al carbono laminado en caliente, forja en frío de piezas '
  'para tornillos y anclajes, tratamiento térmico para alcanzar las clases 8.8 a 12.9 según ISO 898-1, galvanizado en '
  'caliente, laminado de rosca y ensayo por lote, con supervisión SGS si se solicita. Esa cadena cerrada reduce la '
  'variación entre entregas y hace calculable el precio unitario para contratos marco.</p>'
  '<p>Para programas como la modernización del puerto de Trípoli o la reconstrucción de escuelas públicas ofrecemos '
  'precios marco por trimestre, lotes por fase de obra y una gestión documental alineada con las normas de importación '
  'libias descritas arriba. Las certificaciones se tramitan por proyecto cuando el cliente las requiere.</p>'
 ),
}

pt = {
 'h4': 'Como reduzir riscos em contratos de fixadores para obra em Trípoli',
 'b4': (
  '<p>Em Líbia, risco financeiro, de qualidade e de continuidade andam juntos: as regras comerciais e o acesso a '
  'divisas podem mudar em poucas semanas. A proteção mais sólida é um pagamento em etapas: 30 % de adiantamento por '
  'transferência na assinatura do contrato, para a fábrica reservar aço e programar a produção, e os 70 % restantes '
  'somente depois que o comprador receber cópias digitais legíveis do dossiê completo de embarque — conhecimento de '
  'embarque original, certificado de origem, certificados de material, relatórios de ensaio e o laudo favorável de '
  'inspeção pré-embarque de organismo independente (SGS ou BV).</p>'
  '<p>Essa divisão evita pagar adiantado sem mercadoria verificável e, ao mesmo tempo, permite à fábrica iniciar o '
  'processamento do aço e o tratamento superficial sem custo sem cobertura. Adiantamentos de 50 % ou mais devem ser '
  'recusados, a menos que o fornecedor seja um fabricante com histórico comprovado de entregas a projetos líbios.</p>'
  '<p>Vale ainda fixar por escrito, antes do pedido: definição clara do lote, características de inspeção por lote, '
  'direito de verificação antes do carregamento e uma regra para o caso de a licença de importação sair depois do '
  'previsto.</p>'
 ),
 'h5': 'Por que a TradeGo entrega fixadores para Trípoli com confiabilidade',
 'b5': (
  '<p>A TradeGo é fabricante chinês verticalmente integrado, com estrutura de exportação dedicada a projetos líbios. '
  'A diferença de preço decisiva está entre comprar direto e comprar de intermediários: revendedores que juntam '
  'produto acabado de várias fábricas costumam ficar entre 18 % e 25 % acima do preço direto de fábrica.</p>'
  '<p>A produção fica inteiramente em casa: aço-carbono laminado a quente, forjamento a frio de peças para parafusos '
  'e chumbadores, tratamento térmico para atingir as classes 8.8 a 12.9 conforme ISO 898-1, galvanização a quente, '
  'laminação de rosca e ensaio por lote, com acompanhamento SGS quando solicitado. Essa cadeia fechada reduz a variação '
  'entre lotes e torna o preço unitário calculável em contratos-quadro.</p>'
  '<p>Para programas como a modernização do porto de Trípoli ou a reconstrução de escolas públicas, oferecemos preço '
  'quadro por trimestre, lotes por fase de obra e gestão documental alinhada às regras de importação líbias descritas '
  'acima. Certificações são solicitadas por projeto quando o cliente exige.</p>'
 ),
}

S[2]['heading']['de'] = de['h2']; S[2]['body']['de'] = de['b2']
S[4]['heading']['de'] = de['h4']; S[4]['body']['de'] = de['b4']
S[5]['heading']['de'] = de['h5']; S[5]['body']['de'] = de['b5']
S[2]['heading']['es'] = es['h2']; S[2]['body']['es'] = es['b2']
S[4]['heading']['es'] = es['h4']; S[4]['body']['es'] = es['b4']
S[5]['heading']['es'] = es['h5']; S[5]['body']['es'] = es['b5']
S[4]['heading']['pt'] = pt['h4']; S[4]['body']['pt'] = pt['b4']
S[5]['heading']['pt'] = pt['h5']; S[5]['body']['pt'] = pt['b5']

# "认证等级"类标题改为 ISO 898-1 性能等级口径（不暗示已持有认证）
S[1]['heading'].update({
 'en': 'Fastener Grades per ISO 898-1 for Libya Tripoli Construction Projects',
 'de': 'Festigkeitsklassen nach ISO 898-1 für Bauprojekte in Tripolis',
 'es': 'Clases de resistencia según ISO 898-1 para obra en Trípoli',
 'pt': 'Classes de resistência conforme ISO 898-1 para obra em Trípoli',
})

open(P, 'w').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print('rewritten: de/es/pt §2,§4,§5 + §1 headings')

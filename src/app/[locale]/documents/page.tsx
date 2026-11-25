import { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale } from '@/i18n'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const SITE = 'https://www.tradego-fasteners.com'

type Card = { h: string; sub: string; items: string[] }
type Copy = {
  title: string
  desc: string
  h1: string
  lead: string
  cards: Card[]
  ctaH: string
  ctaP: string
  note: string
  btn: string
  btn2: string
  updated: string
}

const COPY: Record<string, Copy> = {
  en: {
    title: 'Export Documents & Inspection - Mill Certs, COC, SGS/BV | TradeGo',
    desc: 'What ships with every TradeGo fastener order: invoice, packing list, bill of lading, certificate of origin and mill test certificates. SGS/BV inspection, ISO 9001 and SABS approval are arranged against your order requirement.',
    h1: 'Documents & inspection',
    lead: 'Every fastener shipment leaves with a document set that clears customs and passes receiving inspection. Third-party inspection, and the approvals a tender asks for, are arranged per order; certificates are supplied against your order requirement.',
    cards: [
      {
        h: 'Standard document set',
        sub: 'Ships with every order, no extra charge',
        items: [
          'Commercial invoice and packing list with carton weights and dimensions',
          'Bill of lading, three originals plus telex release',
          'Certificate of origin issued through CCPIT',
          'Mill test certificate per heat number from the producing mill',
          'Dimensional and visual inspection report against the ordered standard',
        ],
      },
      {
        h: 'Third-party inspection',
        sub: 'SGS, BV, Intertek or your nominated agency',
        items: [
          'Pre-shipment inspection while the goods are still in our warehouse',
          'Three to five working days notice, booked before the container is stuffed',
          'Sampling to ISO 2859-1 AQL 2.5, or to the plan in your purchase order',
          'Inspection fee on buyer account, or absorbed when the order is quoted CIF',
        ],
      },
      {
        h: 'Destination conformity',
        sub: 'PVoC, SONCAP and COC handled before loading',
        items: [
          'Kenya: PVoC through KEBS-appointed agencies',
          'Tanzania and Uganda: PVoC, standard or consolidated route depending on volume',
          'Nigeria: SONCAP, with product certificate and form M support',
          'We prepare the application pack: invoice, test reports, product photos, HS codes',
        ],
      },
      {
        h: 'Standards and approvals',
        sub: 'Made to standard today, certificates against your order',
        items: [
          'Products are made to SABS 1195 / DIN / ANSI / ISO dimensions',
          'ISO 9001 quality management, SABS and CE certificates are supplied against your order requirement',
          'Where a tender or framework agreement requires them, we apply against that order',
          'Application adds two to four weeks and is quoted separately, in writing, before you commit',
        ],
      },
      {
        h: 'What you can verify',
        sub: 'Fields on the mill test certificate',
        items: [
          'Heat number and producing mill name',
          'Chemical composition: C, Mn, Si, S, P',
          'Mechanical properties: tensile, yield, elongation',
          'Coating mass in g/m2 and coating thickness in µm',
          'Thread tolerance class 6g for bolts, 6H for nuts',
        ],
      },
    ],
    ctaH: 'Tell us the destination and the documents the file needs',
    ctaP: 'Send the port, the product list and any document the buyer or the bank requires. We reply with the exact document set, inspection option and lead time for that order.',
    btn: 'Request a quote',
    btn2: 'See products',
    note: 'Note: certificates and approvals are supplied against your order requirement. ISO 9001 quality management, SABS product approval and CE documentation follow the order or tender specification, adding two to four working weeks with cost quoted separately in writing.',
    updated: 'Last updated: 25 November 2026',
  },
  zh: {
    title: '出口单证与检验 - 材质书、原产地证、SGS/BV 验货 | TradeGo',
    desc: '每票 TradeGo 紧固件随货单证：发票、装箱单、提单、原产地证、材质书。SGS/BV 第三方验货、ISO 9001 与 SABS 认证按订单要求办理，周期与费用单列。',
    h1: '单证与检验',
    lead: '每票货都配一套能清关、能过收货检验的单证。第三方验货和招标要求的认证按订单去办——没有的资质不写，办不到的周期不承诺。',
    cards: [
      {
        h: '标准单证包',
        sub: '每票随货，不额外收费',
        items: [
          '商业发票、装箱单（含每箱毛重与尺寸）',
          '海运提单，三正本 + 电放',
          '原产地证，贸促会（CCPIT）签发',
          '材质书（mill certificate），按炉号出具',
          '按订单标准的尺寸与外观检验报告',
        ],
      },
      {
        h: '第三方验货',
        sub: 'SGS、BV、Intertek 或你指定的机构',
        items: [
          '装柜前在仓库完成预装船检验',
          '提前 3–5 个工作日预约，留出整改时间',
          '抽样按 ISO 2859-1 AQL 2.5，或按你 PO 里的方案',
          '检验费买方承担；按 CIF 报价时已含在价内',
        ],
      },
      {
        h: '目的国合规',
        sub: 'PVoC、SONCAP、COC 装船前办完',
        items: [
          '肯尼亚：通过 KEBS 授权机构做 PVoC',
          '坦桑尼亚、乌干达：PVoC，按货量走标准或合并渠道',
          '尼日利亚：SONCAP，配合产品证书与 Form M',
          '申请资料由我们准备：发票、检测报告、产品照片、HS 编码',
        ],
      },
      {
        h: '标准与认证',
        sub: '今天按标准生产，证书随订单要求提供',
        items: [
          '产品按 SABS 1195 / DIN / ANSI / ISO 尺寸标准生产',
          'ISO 9001 质量管理体系、SABS 与 CE 证书按订单要求提供',
          '招标或框架协议要求时，按该订单启动申请',
          '申请周期增加 2–4 周，费用单列，签约前书面报价',
        ],
      },
      {
        h: '你可以核对的内容',
        sub: '材质书上的字段',
        items: [
          '炉号与生产钢厂名称',
          '化学成分：C、Mn、Si、S、P',
          '力学性能：抗拉、屈服、延伸率',
          '镀层重量 g/m² 与镀层厚度 µm',
          '螺纹精度：螺栓 6g、螺母 6H',
        ],
      },
    ],
    ctaH: '告诉我们目的港和这单需要的单证',
    ctaP: '把港口、产品清单，以及买方或银行要求的单证发过来。我们按这单回复准确的单证包、检验方式和交期。',
    btn: '索取报价',
    btn2: '查看产品',
    note: '说明：证书按订单要求随货提供。ISO 9001 质量管理体系、SABS 产品认可与 CE 文件依订单或招标规格办理，通常增加 2–4 个工作周，费用单列书面报价。',
    updated: '最后更新：2026 年 11 月 25 日',
  },
  es: {
    title: 'Documentos de exportación e inspección - certificados de colada, COC, SGS/BV | TradeGo',
    desc: 'Qué acompaña cada pedido de sujeciones TradeGo: factura, lista de bultos, conocimiento de embarque, certificado de origen y certificados de colada. Inspección SGS/BV, ISO 9001 y homologación SABS se tramitan según su pedido.',
    h1: 'Documentos e inspección',
    lead: 'Cada envío sale con el conjunto documental que despacha en aduana y pasa la inspección de recepción. La inspección de terceros y las homologaciones que exige un pliego se gestionan por pedido: no anunciamos certificaciones que no tenemos.',
    cards: [
      { h: 'Juego documental estándar', sub: 'En cada pedido, sin coste extra', items: ['Factura comercial y lista de bultos con pesos y medidas por caja', 'Conocimiento de embarque, tres originales más telex release', 'Certificado de origen emitido por CCPIT', 'Certificado de colada por número de colada', 'Informe dimensional y visual según la norma pedida'] },
      { h: 'Inspección de terceros', sub: 'SGS, BV, Intertek o su agencia', items: ['Inspección previa al embarque, en almacén', 'Aviso de tres a cinco días hábiles antes de cargar', 'Muestreo ISO 2859-1 AQL 2.5 o el plan de su pedido', 'Coste por cuenta del comprador o incluido en cotización CIF'] },
      { h: 'Conformidad de destino', sub: 'PVoC, SONCAP y COC antes de cargar', items: ['Kenia: PVoC mediante agencias autorizadas por KEBS', 'Tanzania y Uganda: PVoC, ruta estándar o consolidada', 'Nigeria: SONCAP con apoyo de certificado de producto y Form M', 'Preparamos el expediente: factura, informes, fotos, códigos HS'] },
      { h: 'Normas y homologaciones', sub: 'Fabricado según norma hoy, homologación según su pedido', items: ['Productos fabricados según dimensiones SABS 1195 / DIN / ANSI / ISO', 'Los certificados ISO 9001, SABS y CE se entregan según los requisitos de su pedido', 'Si un pliego lo exige, iniciamos el trámite para ese pedido', 'El trámite suma de dos a cuatro semanas y se cotiza aparte por escrito'] },
      { h: 'Qué puede verificar', sub: 'Campos del certificado de colada', items: ['Número de colada y acería', 'Composición química: C, Mn, Si, S, P', 'Propiedades mecánicas: tracción, límite elástico, alargamiento', 'Masa de recubrimiento g/m2 y espesor µm', 'Clase de tolerancia 6g en pernos, 6H en tuercas'] },
    ],
    ctaH: 'Indíquenos el destino y los documentos que necesita el expediente',
    ctaP: 'Envíe el puerto, la lista de productos y cualquier documento que exija el comprador o el banco. Respondemos con el juego documental exacto, la opción de inspección y el plazo.',
    btn: 'Solicitar cotización',
    btn2: 'Ver productos',
    note: 'Nota: los certificados y homologaciones se entregan según los requisitos de su pedido. ISO 9001, SABS y CE siguen la especificación del pedido o licitación; el trámite suma de dos a cuatro semanas y se cotiza aparte por escrito.',
    updated: 'Última actualización: 25 de noviembre de 2026',
  },
  fr: {
    title: 'Documents export et inspection - certificats matière, COC, SGS/BV | TradeGo',
    desc: 'Ce qui accompagne chaque commande TradeGo : facture, liste de colisage, connaissement, certificat d origine et certificats matière. Inspection SGS/BV, ISO 9001 et homologation SABS sont engagées selon votre commande.',
    h1: 'Documents et inspection',
    lead: 'Chaque expédition part avec le dossier qui passe la douane et la réception. Inspection tierce et homologations exigées par un appel d offres sont engagées par commande : nous n annonçons pas de certificats que nous ne détenons pas.',
    cards: [
      { h: 'Dossier documentaire standard', sub: 'Avec chaque commande, sans surcoût', items: ['Facture commerciale et liste de colisage avec poids et dimensions par carton', 'Connaissement, trois originaux plus telex release', 'Certificat d origine émis par la CCPIT', 'Certificat matière par numéro de coulée', 'Rapport de contrôle dimensionnel et visuel selon la norme commandée'] },
      { h: 'Inspection tierce', sub: 'SGS, BV, Intertek ou votre organisme', items: ['Inspection avant expédition, en entrepôt', 'Préavis de trois à cinq jours ouvrés avant chargement', 'Échantillonnage ISO 2859-1 AQL 2.5 ou selon votre commande', 'Frais à la charge de l acheteur ou inclus en cotation CIF'] },
      { h: 'Conformité destination', sub: 'PVoC, SONCAP et COC avant chargement', items: ['Kenya : PVoC via les agences agréées KEBS', 'Tanzanie et Ouganda : PVoC, filière standard ou groupée', 'Nigeria : SONCAP avec certificat produit et Form M', 'Nous préparons le dossier : facture, rapports, photos, codes SH'] },
      { h: 'Normes et homologations', sub: 'Fabriqué selon norme aujourd hui, homologation selon commande', items: ['Produits fabriqués selon les dimensions SABS 1195 / DIN / ANSI / ISO', 'Les certificats ISO 9001, SABS et CE sont fournis selon les exigences de votre commande', 'Si un appel d offres l exige, nous engageons la démarche pour cette commande', 'La démarche ajoute deux à quatre semaines, chiffrée séparément par écrit'] },
      { h: 'Ce que vous pouvez vérifier', sub: 'Champs du certificat matière', items: ['Numéro de coulée et acierie', 'Composition chimique : C, Mn, Si, S, P', 'Propriétés mécaniques : traction, limite élastique, allongement', 'Masse de revêtement g/m2 et épaisseur µm', 'Classe de tolérance 6g boulons, 6H écrous'] },
    ],
    ctaH: 'Indiquez la destination et les documents exigés par le dossier',
    ctaP: 'Envoyez le port, la liste produits et tout document demandé par l acheteur ou la banque. Nous répondons avec le dossier exact, l option d inspection et le délai.',
    btn: 'Demander un devis',
    btn2: 'Voir les produits',
    note: 'Note : les certificats et homologations sont fournis selon les exigences de votre commande. ISO 9001, SABS et CE suivent le cahier des charges de la commande ou de l appel d offres, avec deux à quatre semaines supplémentaires chiffrées séparément par écrit.',
    updated: 'Dernière mise à jour : 25 novembre 2026',
  },
  pt: {
    title: 'Documentos de exportação e inspeção - certificados de aciaria, COC, SGS/BV | TradeGo',
    desc: 'O que acompanha cada pedido TradeGo: fatura, lista de volumes, conhecimento de embarque, certificado de origem e certificados de aciaria. Inspeção SGS/BV, ISO 9001 e homologação SABS são tratados conforme o seu pedido.',
    h1: 'Documentos e inspeção',
    lead: 'Cada embarque sai com o conjunto documental que desembaraça na alfândega e passa na recepção. Inspeção de terceiros e homologações exigidas em licitação são tratadas por pedido: não anunciamos certificações que não temos.',
    cards: [
      { h: 'Conjunto documental padrão', sub: 'Em cada pedido, sem custo extra', items: ['Fatura comercial e lista de volumes com pesos e medidas por caixa', 'Conhecimento de embarque, três originais mais telex release', 'Certificado de origem emitido pela CCPIT', 'Certificado de aciaria por número de corrida', 'Relatório dimensional e visual conforme a norma pedida'] },
      { h: 'Inspeção de terceiros', sub: 'SGS, BV, Intertek ou sua agência', items: ['Inspeção pré-embarque no armazém', 'Aviso de três a cinco dias úteis antes do carregamento', 'Amostragem ISO 2859-1 AQL 2.5 ou o plano do seu pedido', 'Custo por conta do comprador ou incluído na cotação CIF'] },
      { h: 'Conformidade de destino', sub: 'PVoC, SONCAP e COC antes do embarque', items: ['Quênia: PVoC via agências autorizadas pelo KEBS', 'Tanzânia e Uganda: PVoC, rota padrão ou consolidada', 'Nigéria: SONCAP com certificado de produto e Form M', 'Preparamos o dossiê: fatura, laudos, fotos, códigos HS'] },
      { h: 'Normas e homologações', sub: 'Produção conforme norma hoje, homologação conforme pedido', items: ['Produtos fabricados conforme dimensões SABS 1195 / DIN / ANSI / ISO', 'Os certificados ISO 9001, SABS e CE são fornecidos conforme os requisitos do seu pedido', 'Se a licitação exigir, iniciamos o processo para aquele pedido', 'O processo soma de duas a quatro semanas e é cotado à parte por escrito'] },
      { h: 'O que você pode verificar', sub: 'Campos do certificado de aciaria', items: ['Número da corrida e aciaria', 'Composição química: C, Mn, Si, S, P', 'Propriedades mecânicas: tração, escoamento, alongamento', 'Massa de revestimento g/m2 e espessura µm', 'Classe de tolerância 6g em parafusos, 6H em porcas'] },
    ],
    ctaH: 'Informe o destino e os documentos que o dossiê exige',
    ctaP: 'Envie o porto, a lista de produtos e qualquer documento pedido pelo comprador ou banco. Respondemos com o conjunto exato, a opção de inspeção e o prazo.',
    btn: 'Solicitar cotação',
    btn2: 'Ver produtos',
    note: 'Nota: os certificados e homologações são fornecidos conforme os requisitos do seu pedido. ISO 9001, SABS e CE seguem a especificação do pedido ou da licitação, somando de duas a quatro semanas e cotados à parte por escrito.',
    updated: 'Última atualização: 25 de novembro de 2026',
  },
  de: {
    title: 'Exportdokumente & Prüfung - Werkszeugnisse, COC, SGS/BV | TradeGo',
    desc: 'Was mit jeder TradeGo-Bestellung versandt wird: Rechnung, Packliste, Konossement, Ursprungszeugnis und Werkszeugnisse. SGS/BV-Prüfung, ISO 9001 und SABS-Zulassung werden auftragsbezogen beantragt.',
    h1: 'Dokumente & Prüfung',
    lead: 'Jede Sendung geht mit einem Dokumentensatz raus, der den Zoll und die Wareneingangsprüfung besteht. Fremdprüfung und Zulassungen aus Ausschreibungen werden je Auftrag beantragt – wir nennen keine Zertifikate, die wir nicht besitzen.',
    cards: [
      { h: 'Standard-Dokumentensatz', sub: 'Bei jeder Bestellung, ohne Aufpreis', items: ['Handelsrechnung und Packliste mit Gewicht und Maßen je Karton', 'Konnossement, drei Originale plus Telex Release', 'Ursprungszeugnis über die CCPIT', 'Werkszeugnis je Schmelzennummer', 'Maß- und Sichtprüfbericht nach der bestellten Norm'] },
      { h: 'Fremdprüfung', sub: 'SGS, BV, Intertek oder Ihre Stelle', items: ['Verschiffungsprüfung im Lager vor dem Verladen', 'Drei bis fünf Werktage Vorlauf, vor dem Stuffen gebucht', 'Stichprobe nach ISO 2859-1 AQL 2.5 oder Ihrem Prüfplan', 'Prüfkosten zu Lasten des Käufers oder in CIF enthalten'] },
      { h: 'Bestimmungsland-Konformität', sub: 'PVoC, SONCAP und COC vor dem Verladen', items: ['Kenia: PVoC über KEBS-zugelassene Stellen', 'Tansania und Uganda: PVoC, Standard- oder Sammelweg', 'Nigeria: SONCAP mit Produktzertifikat und Form M', 'Wir stellen das Antragspaket: Rechnung, Prüfberichte, Fotos, HS-Codes'] },
      { h: 'Normen und Zulassungen', sub: 'Heute nach Norm gefertigt, Zulassung nach Auftrag', items: ['Produkte nach SABS 1195 / DIN / ANSI / ISO gefertigt', 'ISO 9001-, SABS- und CE-Zertifikate werden nach den Anforderungen Ihres Auftrags bereitgestellt', 'Fordert eine Ausschreibung sie, beantragen wir sie für diesen Auftrag', 'Der Antrag kostet zwei bis vier Wochen Zuschlag und wird schriftlich separat bepreist'] },
      { h: 'Was Sie prüfen können', sub: 'Felder im Werkszeugnis', items: ['Schmelzennummer und Werk', 'Chemische Zusammensetzung: C, Mn, Si, S, P', 'Mechanische Werte: Zugfestigkeit, Streckgrenze, Dehnung', 'Schichtmasse g/m2 und Schichtdicke µm', 'Toleranzklasse 6g bei Schrauben, 6H bei Muttern'] },
    ],
    ctaH: 'Nennen Sie Zielhafen und die Dokumente, die der Vorgang braucht',
    ctaP: 'Senden Sie Hafen, Produktliste und alle Dokumente, die Käufer oder Bank verlangen. Wir antworten mit dem genauen Dokumentensatz, der Prüfoption und der Lieferzeit.',
    btn: 'Angebot anfordern',
    btn2: 'Produkte ansehen',
    note: 'Hinweis: Zertifikate und Zulassungen werden nach den Anforderungen Ihres Auftrags bereitgestellt. ISO 9001, SABS und CE folgen der Auftrags- oder Ausschreibungsspezifikation, mit zwei bis vier Wochen Zuschlag und schriftlich separat bepreist.',
    updated: 'Zuletzt aktualisiert: 25. November 2026',
  },
  ru: {
    title: 'Экспортные документы и инспекция - сертификаты качества, COC, SGS/BV | TradeGo',
    desc: 'Что идёт с каждым заказом TradeGo: инвойс, упаковочный лист, коносамент, сертификат происхождения, сертификаты качества металла. Инспекция SGS/BV, ISO 9001 и одобрение SABS оформляются под конкретный заказ.',
    h1: 'Документы и инспекция',
    lead: 'Каждая партия уходит с комплектом, который проходит таможню и входной контроль. Независимая инспекция и одобрения, требуемые тендером, оформляются под заказ; сертификаты предоставляются под требования вашего заказа.',
    cards: [
      { h: 'Стандартный комплект', sub: 'С каждым заказом, без доплаты', items: ['Инвойс и упаковочный лист с весом и габаритами каждой коробки', 'Коносамент, три оригинала плюс telex release', 'Сертификат происхождения, выдает CCPIT', 'Сертификат качества металла по номеру плавки', 'Отчет по размерам и внешнему виду по заказанному стандарту'] },
      { h: 'Независимая инспекция', sub: 'SGS, BV, Intertek или ваша организация', items: ['Предотгрузочная инспекция на складе до загрузки', 'Уведомление за 3–5 рабочих дней до загрузки контейнера', 'Выборка по ISO 2859-1 AQL 2.5 или по плану в вашем заказе', 'Стоимость за счет покупателя или включена в цену CIF'] },
      { h: 'Соответствие страны назначения', sub: 'PVoC, SONCAP и COC до отгрузки', items: ['Кения: PVoC через агентства, аккредитованные KEBS', 'Танзания и Уганда: PVoC, стандартная или сборная схема', 'Нигерия: SONCAP с сертификатом продукции и Form M', 'Пакет готовим мы: инвойс, протоколы, фото, коды HS'] },
      { h: 'Стандарты и одобрения', sub: 'Сегодня — производство по стандарту, одобрения под заказ', items: ['Продукция изготовлена по размерам SABS 1195 / DIN / ANSI / ISO', 'Сертификаты ISO 9001, SABS и CE предоставляются под требования вашего заказа', 'Если требует тендер, оформляем под этот заказ', 'Оформление добавляет 2–4 недели и считается отдельно, письменно'] },
      { h: 'Что можно проверить', sub: 'Поля сертификата качества', items: ['Номер плавки и завод', 'Химический состав: C, Mn, Si, S, P', 'Механические свойства: прочность, предел текучести, удлинение', 'Масса покрытия г/м2 и толщина мкм', 'Класс точности резьбы 6g для болтов, 6H для гаек'] },
    ],
    ctaH: 'Сообщите порт и документы, которые нужны по сделке',
    ctaP: 'Пришлите порт, список продукции и документы, которые требуют покупатель или банк. Ответим точным комплектом, вариантом инспекции и сроком.',
    btn: 'Запросить цену',
    btn2: 'Смотреть продукцию',
    note: 'Примечание: сертификаты и одобрения предоставляются под требования вашего заказа. ISO 9001, SABS и CE оформляются по спецификации заказа или тендера; оформление добавляет 2–4 недели, стоимость считается отдельно и письменно.',
    updated: 'Обновлено 25 ноября 2026 г.',
  },
  ja: {
    title: '輸出書類と検査 - ミルシート、COC、SGS/BV | TradeGo',
    desc: 'TradeGo の全出荷に付属する書類：インボイス、パッキングリスト、B/L、原産地証明、ミルシート。SGS/BV 検査、ISO 9001・SABS 認証はご注文に応じて申請します。',
    h1: '書類と検査',
    lead: 'すべての出荷に、通関と受入検査を通す書類一式を付けます。第三者検査や入札で求められる認証は注文単位で申請します。持っていない認証は書きません。',
    cards: [
      { h: '標準書類一式', sub: '全注文に添付、追加費用なし', items: ['インボイス、各箱の重量と寸法を記載したパッキングリスト', 'B/L 3通原本＋電送開放', 'CCPIT 発行の原産地証明書', 'ミルシート（熱番単位）', '指定規格に基づく寸法・外観検査報告'] },
      { h: '第三者検査', sub: 'SGS、BV、Intertek またはご指定機関', items: ['倉庫での船積前検査', '積込みの3〜5営業日前までに予約', 'ISO 2859-1 AQL 2.5 またはご発注の抜取方案', '検査費は買主負担、CIF 見積では価格に含む'] },
      { h: '仕向国コンプライアンス', sub: 'PVoC、SONCAP、COC を船積前に', items: ['ケニア：KEBS 認定機関による PVoC', 'タンザニア・ウガンダ：PVoC、数量に応じ通常または混載ルート', 'ナイジェリア：SONCAP、製品証明と Form M を支援', '申請書類は当方で用意：インボイス、試験報告、写真、HS コード'] },
      { h: '規格と認証', sub: '今日は規格で製造、認証は注文単位', items: ['製品は SABS 1195 / DIN / ANSI / ISO の寸法規格で製造', 'ISO 9001・SABS・CE の証明はご注文の要件に応じてご用意します', '入札や枠組み契約で必要なら、その注文で申請します', '申請は2〜4週間の追加と、書面での別見積になります'] },
      { h: '確認できる項目', sub: 'ミルシートの記載', items: ['熱番と製造工場名', '化学成分：C、Mn、Si、S、P', '機械的性質：引張、降伏、伸び', 'めっき付着量 g/m2 と膜厚 µm', 'ねじ精度 6g（ボルト）、6H（ナット）'] },
    ],
    ctaH: '仕向港と必要書類をお知らせください',
    ctaP: '港、製品リスト、買主または銀行が求める書類をお送りください。その注文の正確な書類一式、検査方法、納期を返信します。',
    btn: '見積もりを依頼',
    btn2: '製品を見る',
    note: '注記：証明書はご注文の要件に応じてご用意します。ISO 9001・SABS・CE は注文または入札の仕様に沿って取得を進め、通常2〜4週間の追加と、書面での別見積となります。',
    updated: '最終更新：2026年11月25日',
  },
  ar: {
    title: 'مستندات التصدير والفحص - شهادات المادة، COC، SGS/BV | TradeGo',
    desc: 'ما يرافق كل طلب من TradeGo: الفاتورة وقائمة الحزم وبوليصة الشحن وشهادة المنشأ وشهادات المادة. فحص SGS/BV وشهادة ISO 9001 واعتماد SABS تُرتَّب حسب متطلبات طلبكم.',
    h1: 'المستندات والفحص',
    lead: 'كل شحنة تخرج بمجموعة مستندات تجتاز الجمارك وفحص الاستلام. الفحص الخارجي والاعتمادات التي يطلبها المناقصة تُرتَّب لكل طلب؛ وتُقدَّم الشهادات وفق متطلبات طلبكم.',
    cards: [
      { h: 'مجموعة المستندات القياسية', sub: 'مع كل طلب دون تكلفة إضافية', items: ['فاتورة تجارية وقائمة حزم بأوزان وأبعاد كل كرتون', 'بوليصة شحن، ثلاثة أصول مع telex release', 'شهادة منشأ صادرة عن CCPIT', 'شهادة مادة لكل رقم صهر', 'تقرير فحص أبعاد ومظهر وفق المعيار المطلوب'] },
      { h: 'الفحص الخارجي', sub: 'SGS أو BV أو Intertek أو جهة تختارونها', items: ['فحص قبل الشحن داخل المستودع', 'إشعار قبل ثلاثة إلى خمسة أيام عمل من التحميل', 'العينات وفق ISO 2859-1 AQL 2.5 أو خطة أمر الشراء', 'أجر الفحص على المشتري أو مشمول في عرض CIF'] },
      { h: 'مطابقة بلد الوصول', sub: 'PVoC وSONCAP وCOC قبل التحميل', items: ['كينيا: PVoC عبر جهات معتمدة من KEBS', 'تنزانيا وأوغندا: PVoC، مسار قياسي أو موحّد', 'نيجيريا: SONCAP مع شهادة المنتج ونموذج M', 'نجهّز ملف الطلب: الفاتورة والتقارير والصور ورموز HS'] },
      { h: 'المعايير والاعتمادات', sub: 'التصنيع وفق المعيار اليوم، والاعتماد حسب طلبكم', items: ['المنتجات مصنّعة وفق أبعاد SABS 1195 / DIN / ANSI / ISO', 'شهادات ISO 9001 وSABS وCE تُقدَّم وفق متطلبات طلبكم', 'إذا طلبت المناقصة ذلك، نبدأ الإجراء لهذا الطلب', 'الإجراء يضيف أسبوعين إلى أربعة ويُسعّر منفصلًا وكتابيًا'] },
      { h: 'ما يمكنكم التحقق منه', sub: 'حقول شهادة المادة', items: ['رقم الصهر واسم المصنع', 'التركيب الكيميائي: C، Mn، Si، S، P', 'الخصائص الميكانيكية: الشد، الإخضاع، الاستطالة', 'وزن الطلاء g/m2 وسماكة الطلاء µm', 'درجة تفاوت اللولب 6g للمسامير و6H للصواميل'] },
    ],
    ctaH: 'أخبرونا بميناء الوصول والمستندات التي يحتاجها الملف',
    ctaP: 'أرسلوا الميناء وقائمة المنتجات وأي مستند يطلبه المشتري أو البنك. نرد بمجموعة المستندات الدقيقة وخيار الفحص والمهلة.',
    btn: 'اطلب عرض سعر',
    btn2: 'تصفح المنتجات',
    note: 'ملاحظة: تُقدَّم الشهادات والاعتمادات وفق متطلبات طلبكم. وتُرتَّب شهادات ISO 9001 وSABS وCE حسب مواصفات الطلب أو المناقصة، مع إضافة أسبوعين إلى أربعة وتسعير منفصل وكتابي.',
    updated: 'آخر تحديث: 25 نوفمبر 2026',
  },
  hi: {
    title: 'निर्यात दस्तावेज़ और निरीक्षण - मिल सर्टिफिकेट, COC, SGS/BV | TradeGo',
    desc: 'हर TradeGo ऑर्डर के साथ: इनवॉइस, पैकिंग लिस्ट, बिल ऑफ लेडिंग, सर्टिफिकेट ऑफ ओरिजिन और मिल सर्टिफिकेट। SGS/BV निरीक्षण, ISO 9001 और SABS प्रमाणन ऑर्डर के अनुसार आवेदन से।',
    h1: 'दस्तावेज़ और निरीक्षण',
    lead: 'हर शिपमेंट के साथ वह दस्तावेज़ सेट जाता है जो कस्टम और रिसीविंग इंस्पेक्शन पास करे। तीसरे पक्ष का निरीक्षण और टेंडर में मांगे गए प्रमाणन ऑर्डर के अनुसार कराए जाते हैं — जो प्रमाणन हमारे पास नहीं, वह नहीं लिखते।',
    cards: [
      { h: 'मानक दस्तावेज़ सेट', sub: 'हर ऑर्डर के साथ, बिना अतिरिक्त शुल्क', items: ['कमर्शियल इनवॉइस और पैकिंग लिस्ट, हर कार्टन का वज़न व माप', 'बिल ऑफ लेडिंग, तीन ओरिजिनल और telex release', 'CCPIT से जारी सर्टिफिकेट ऑफ ओरिजिन', 'हर हीट नंबर का मिल सर्टिफिकेट', 'ऑर्डर किए मानक के अनुसार आयाम व दिखावट रिपोर्ट'] },
      { h: 'तीसरे पक्ष का निरीक्षण', sub: 'SGS, BV, Intertek या आपकी एजेंसी', items: ['गोदाम में लोडिंग से पहले निरीक्षण', 'लोडिंग से 3–5 कार्यदिन पहले बुकिंग', 'ISO 2859-1 AQL 2.5 या आपके PO का सैंपलिंग प्लान', 'शुल्क खरीदार पर, या CIF कोटेशन में शामिल'] },
      { h: 'गंतव्य अनुपालन', sub: 'PVoC, SONCAP और COC लोडिंग से पहले', items: ['केन्या: KEBS मान्य एजेंसियों से PVoC', 'तंज़ानिया व युगांडा: PVoC, वॉल्यूम के अनुसार स्टैंडर्ड या कंसोलिडेटेड', 'नाइजीरिया: SONCAP, प्रोडक्ट सर्टिफिकेट व Form M सहायता', 'आवेदन पैक हम बनाते हैं: इनवॉइस, टेस्ट रिपोर्ट, फोटो, HS कोड'] },
      { h: 'मानक और प्रमाणन', sub: 'आज मानक पर निर्माण, प्रमाणन आपके ऑर्डर पर', items: ['उत्पाद SABS 1195 / DIN / ANSI / ISO आयाम मानक पर बनते हैं', 'ISO 9001, SABS और CE प्रमाणपत्र आपके ऑर्डर की आवश्यकता के अनुसार दिए जाते हैं', 'टेंडर मांगे तो उसी ऑर्डर के लिए आवेदन शुरू करते हैं', 'आवेदन में 2–4 सप्ताह अतिरिक्त, शुल्क अलग और लिखित में'] },
      { h: 'आप क्या जाँच सकते हैं', sub: 'मिल सर्टिफिकेट के फ़ील्ड', items: ['हीट नंबर और मिल का नाम', 'रासायनिक संरचना: C, Mn, Si, S, P', 'यांत्रिक गुण: तन्य, यील्ड, बढ़ाव', 'कोटिंग भार g/m2 और मोटाई µm', 'थ्रेड टॉलरेंस 6g बोल्ट, 6H नट'] },
    ],
    ctaH: 'गंतव्य बंदरगाह और फ़ाइल के दस्तावेज़ बताइए',
    ctaP: 'बंदरगाह, उत्पाद सूची और खरीदार या बैंक के मांगे दस्तावेज़ भेजें। हम उस ऑर्डर का सटीक दस्तावेज़ सेट, निरीक्षण विकल्प और समय बताएँगे।',
    btn: 'कोटेशन का अनुरोध',
    btn2: 'उत्पाद देखें',
    note: 'नोट: प्रमाणपत्र और अनुमोदन आपके ऑर्डर की आवश्यकता के अनुसार दिए जाते हैं। ISO 9001, SABS और CE ऑर्डर या टेंडर के विनिर्देश के अनुसार तैयार होते हैं, जिसमें 2–4 सप्ताह अतिरिक्त और शुल्क अलग लिखित में।',
    updated: 'अंतिम अद्यतन: 25 नवंबर 2026',
  },
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = ((locale as Locale) in COPY ? (locale as Locale) : 'en') as Locale
  const c = COPY[loc] || COPY.en
  return {
    title: c.title,
    description: c.desc,
    alternates: {
      canonical: `${SITE}/${loc}/documents/`,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}/documents/`])),
    },
    openGraph: {
      title: c.title,
      description: c.desc,
      url: `${SITE}/${loc}/documents/`,
      siteName: 'TradeGo Fasteners',
      type: 'website',
    },
  }
}

export default async function DocumentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = ((locale as Locale) in COPY ? (locale as Locale) : 'en') as Locale
  const c = COPY[loc] || COPY.en

  return (
    <main className="bg-gray-50">
      <BreadcrumbSchema locale={loc} pageName={c.h1} pageUrl={`/${loc}/documents`} />
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wide mb-3">TradeGo Fasteners</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{c.h1}</h1>
          <p className="text-gray-700 leading-relaxed">{c.lead}</p>
          <p className="mt-4 text-xs text-gray-500">{c.updated}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          {c.cards.map((card) => (
            <article key={card.h} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{card.h}</h2>
              <p className="text-sm text-primary-700 mt-1 mb-4">{card.sub}</p>
              <ul className="space-y-2.5 text-sm text-gray-700">
                {card.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="text-primary-600 flex-shrink-0">·</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 bg-primary-700 text-white rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">{c.ctaH}</h2>
          <p className="text-primary-50 leading-relaxed">{c.ctaP}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${loc}/contact/`}
              className="inline-flex items-center px-5 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
            >
              {c.btn}
            </Link>
            <Link
              href={`/${loc}/products/`}
              className="inline-flex items-center px-5 py-3 rounded-lg border border-white/70 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              {c.btn2}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-500 leading-relaxed">{c.note}</p>
      </section>
    </main>
  )
}

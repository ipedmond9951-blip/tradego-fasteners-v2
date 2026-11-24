interface Props {
  specs: Record<string, string | undefined>
  locale: string
}

// 产品页"采购决策"深化段：标准、材质、包装装载、质检、海运单证、报价要素
// 文案只陈述可核实的工艺与流程事实，不对未确认的交期/装载量编造数字
const copy: Record<string, { title: string; sections: { h: string; p: (specs: Record<string, string | undefined>) => string }[] }> = {
  en: {
    title: 'Buying notes for importers',
    sections: [
      {
        h: 'Standards and size range',
        p: s => `Production follows the standard named in the specification table above — ${s.standard || 'the standard stated in the table'}. The size range we quote is ${s.size || 'as listed above'}. If your project calls for a different clause (DIN, ISO, ANSI/ASME, SABS or GB), send us the standard number and we quote against that clause instead of substituting a near-equivalent.`,
      },
      {
        h: 'Material and finish selection',
        p: s => `Base material is ${s.material || 'as listed above'}; finish options are ${s.finish || 'as listed above'}. For parts that stay exposed outdoors, and anywhere within roughly 10 km of the coast (Beira, Durban, Mozambican and Kenyan ports), specify hot-dip galvanized or stainless instead of plain zinc — thin electro-zinc starts red rusting within a season in salt air.`,
      },
      {
        h: 'Packing, container loading and lead time',
        p: () => 'Standard export packing is cartons on pallets; nails and wire goods ship in 25 kg bags. Carton quantity, pallet count and container loading are confirmed per size at quotation, and mixed sizes can be loaded in one 20GP. Normal production runs 15–25 days after deposit, plus 20–30 days sea freight to Beira or Durban.',
      },
      {
        h: 'Quality control and inspection',
        p: () => 'Each lot is checked on dimensional tolerance, thread gauge, coating thickness and visual finish; structural lines additionally get tensile and hardness tests. Mill certificates come with the shipment, and third-party pre-shipment inspection (SGS, BV or your nominated agent) can be arranged — request it when placing the order, not after production finishes.',
      },
      {
        h: 'Shipping terms, documents and clearance',
        p: () => 'We quote FOB Qingdao / Tianjin as standard and CIF Beira or Durban on request. The document set is commercial invoice, packing list, bill of lading, certificate of origin and mill certificates; SABS-related test reports for roofing nails are available on request. If you clear through Beira for Zimbabwe, allow for the transit leg to Harare or Bulawayo when you plan the order.',
      },
      {
        h: 'What to send for a same-day quote',
        p: () => 'Five items are enough: size, standard, material and finish, quantity per size, and destination port. With those we return price, MOQ, packing and lead time the same working day, and can add a loading plan for a mixed container.',
      },
    ],
  },
  zh: {
    title: '采购要点（给进口商）',
    sections: [
      {
        h: '执行标准与尺寸范围',
        p: s => `生产依据即上方规格表所列标准 —— ${s.standard || '见规格表'}；报价尺寸范围为 ${s.size || '见上方'}。若项目要求 DIN、ISO、ANSI/ASME、SABS 或 GB 的其他条款，请提供标准号，我们按该条款报盘，不用近似规格替代。`,
      },
      {
        h: '材质与表面处理怎么选',
        p: s => `基材为 ${s.material || '见规格表'}，可选表面处理 ${s.finish || '见规格表'}。长期暴露户外、以及距海岸约 10 公里内的项目（贝拉、德班、莫桑比克与肯尼亚港口），建议热镀锌或不锈钢，不要用普通电镀锌 —— 海盐环境下薄锌层一个季度就会泛红锈。`,
      },
      {
        h: '包装、柜型装载与交期',
        p: () => '标准出口包装为纸箱托盘，钉类与线材按 25kg 编织袋。每箱数量、托盘数与柜型装载在报盘时按规格确认，不同规格可同柜混装。正常生产为收定金后 15–25 天，加上海运至贝拉或德班 20–30 天。',
      },
      {
        h: '质量控制与验货',
        p: () => '每批按尺寸公差、螺纹规、镀层厚度与外观检验；结构件另做拉伸与硬度测试。材质书随货，出厂前可安排第三方验货（SGS、BV 或客户指定机构）—— 请在订单阶段提出，不要等生产结束再安排。',
      },
      {
        h: '海运条款、单证与清关',
        p: () => '默认 FOB 青岛/天津，可按需报 CIF 贝拉/德班。单证包含发票、装箱单、提单、原产地证与材质书；IBR 屋面钉的 SABS 相关检测报告可按需提供。经贝拉清关进津巴布韦的，排单时要把到哈拉雷/布拉瓦约的内陆段一并算进去。',
      },
      {
        h: '当天出价需要提供什么',
        p: () => '五项即可：规格尺寸、执行标准、材质与镀层、每个规格的数量、目的港。五项齐全当天可回价格、MOQ、包装与交期，并可附一份混柜装载方案。',
      },
    ],
  },
  es: {
    title: 'Notas de compra para importadores',
    sections: [
      {
        h: 'Normas y rango de medidas',
        p: s => `La producción sigue la norma indicada en la tabla de especificaciones — ${s.standard || 'la norma indicada en la tabla'}. El rango de medidas que cotizamos es ${s.size || 'el indicado arriba'}. Si su proyecto exige otra cláusula (DIN, ISO, ANSI/ASME, SABS o GB), envíenos el número de norma y cotizamos contra esa cláusula, sin sustituirla por un equivalente aproximado.`,
      },
      {
        h: 'Elección de material y acabado',
        p: s => `El material base es ${s.material || 'el indicado arriba'}; los acabados disponibles son ${s.finish || 'los indicados arriba'}. Para piezas que quedan expuestas a la intemperie, y en cualquier obra a menos de unos 10 km de la costa (Beira, Durban, puertos de Mozambique y Kenia), especifique galvanizado en caliente o inoxidable en lugar de zinc simple: el electrozinc fino empieza a oxidarse en rojo en una sola temporada de aire salino.`,
      },
      {
        h: 'Embalaje, carga de contenedor y plazo',
        p: () => 'El embalaje de exportación estándar es cajas sobre palés; clavos y alambre se despachan en sacos de 25 kg. Cantidad por caja, número de palés y carga del contenedor se confirman por medida al cotizar, y se pueden mezclar medidas en un 20GP. La producción normal tarda 15–25 días tras el depósito, más 20–30 días de flete marítimo a Beira o Durban.',
      },
      {
        h: 'Control de calidad e inspección',
        p: () => 'Cada lote se controla en tolerancia dimensional, calibre de rosca, espesor de recubrimiento y acabado visual; las líneas estructurales añaden ensayos de tracción y dureza. Los certificados de colada acompañan el embarque, y se puede contratar inspección previa de terceros (SGS, BV o su agente): solicítela al hacer el pedido, no al terminar la producción.',
      },
      {
        h: 'Términos de envío, documentos y despacho',
        p: () => 'Cotizamos FOB Qingdao / Tianjin como estándar y CIF Beira o Durban a petición. El juego de documentos es factura comercial, lista de empaque, conocimiento de embarque, certificado de origen y certificados de colada; los informes SABS de clavos de cubierta están disponibles a petición. Si despacha por Beira hacia Zimbabue, incluya el tramo terrestre a Harare o Bulawayo al planificar el pedido.',
      },
      {
        h: 'Qué enviarnos para cotizar el mismo día',
        p: () => 'Cinco datos bastan: medida, norma, material y acabado, cantidad por medida y puerto de destino. Con ellos devolvemos precio, MOQ, embalaje y plazo el mismo día hábil, y podemos añadir un plan de carga para contenedor mixto.',
      },
    ],
  },
  fr: {
    title: "Notes d'achat pour les importateurs",
    sections: [
      {
        h: 'Normes et plage de dimensions',
        p: s => `La production suit la norme indiquée dans le tableau de spécifications — ${s.standard || 'la norme indiquée dans le tableau'}. La plage de dimensions que nous cotons est ${s.size || 'celle indiquée ci-dessus'}. Si votre projet exige une autre clause (DIN, ISO, ANSI/ASME, SABS ou GB), communiquez-nous le numéro de norme : nous cotons sur cette clause, sans substitution par un équivalent approchant.`,
      },
      {
        h: 'Choix de la matière et de la finition',
        p: s => `La matière de base est ${s.material || 'celle indiquée ci-dessus'} ; les finitions possibles sont ${s.finish || 'celles indiquées ci-dessus'}. Pour les pièces exposées en extérieur, et sur tout chantier à moins de 10 km environ du littoral (Beira, Durban, ports mozambicains et kényans), spécifiez galvanisé à chaud ou inox plutôt que du zinc simple : un électrozinguage fin rouille en une saison en air salin.`,
      },
      {
        h: 'Conditionnement, chargement conteneur et délai',
        p: () => "L'emballage export standard est en cartons sur palettes ; clous et fils partent en sacs de 25 kg. Quantité par carton, nombre de palettes et chargement du conteneur sont confirmés par dimension au devis, et plusieurs dimensions peuvent être chargées dans un 20GP. La production normale demande 15 à 25 jours après acompte, plus 20 à 30 jours de fret maritime vers Beira ou Durban.",
      },
      {
        h: 'Contrôle qualité et inspection',
        p: () => "Chaque lot est contrôlé en tolérance dimensionnelle, jauge de filetage, épaisseur de revêtement et aspect ; les lignes structurelles passent en plus des essais de traction et de dureté. Les certificats de coulée accompagnent l'expédition, et une inspection tierce avant expédition (SGS, BV ou votre mandataire) peut être organisée — demandez-la à la commande, pas en fin de production.",
      },
      {
        h: 'Conditions de vente, documents et dédouanement',
        p: () => "Nous cotons FOB Qingdao / Tianjin en standard et CIF Beira ou Durban sur demande. Le jeu de documents comprend facture commerciale, liste de colisage, connaissement, certificat d'origine et certificats de coulée ; les rapports d'essai SABS pour clous de toiture sont disponibles sur demande. Si vous dédouanez à Beira pour le Zimbabwe, intégrez le tronçon terrestre vers Harare ou Bulawayo dans votre planification.",
      },
      {
        h: "Ce qu'il nous faut pour coter le jour même",
        p: () => "Cinq éléments suffisent : dimension, norme, matière et finition, quantité par dimension et port de destination. Avec eux nous renvoyons prix, MOQ, conditionnement et délai le jour ouvré même, et pouvons ajouter un plan de chargement pour conteneur mixte.",
      },
    ],
  },
  pt: {
    title: 'Notas de compra para importadores',
    sections: [
      {
        h: 'Normas e faixa de medidas',
        p: s => `A produção segue a norma indicada na tabela de especificações — ${s.standard || 'a norma indicada na tabela'}. A faixa de medidas que cotamos é ${s.size || 'a indicada acima'}. Se seu projeto exigir outra cláusula (DIN, ISO, ANSI/ASME, SABS ou GB), envie o número da norma e cotamos por essa cláusula, sem substituir por um equivalente aproximado.`,
      },
      {
        h: 'Escolha de material e acabamento',
        p: s => `O material base é ${s.material || 'o indicado acima'}; os acabamentos disponíveis são ${s.finish || 'os indicados acima'}. Para peças expostas ao tempo, e em qualquer obra a menos de cerca de 10 km da costa (Beira, Durban, portos de Moçambique e do Quênia), especifique galvanizado a quente ou inox em vez de zinco simples: o eletrozincado fino começa a enferrujar em uma estação em ar salino.`,
      },
      {
        h: 'Embalagem, carregamento de contêiner e prazo',
        p: () => 'A embalagem de exportação padrão é caixas sobre paletes; pregos e arame seguem em sacos de 25 kg. Quantidade por caixa, número de paletes e carregamento do contêiner são confirmados por medida na cotação, e medidas diferentes podem ser carregadas em um 20GP. A produção normal leva 15–25 dias após o depósito, mais 20–30 dias de frete marítimo até Beira ou Durban.',
      },
      {
        h: 'Controle de qualidade e inspeção',
        p: () => 'Cada lote é verificado em tolerância dimensional, calibre de rosca, espessura de revestimento e acabamento visual; as linhas estruturais recebem também ensaios de tração e dureza. Os certificados de corrida acompanham o embarque, e a inspeção pré-embarque de terceiros (SGS, BV ou seu agente) pode ser contratada — solicite no pedido, não ao fim da produção.',
      },
      {
        h: 'Termos de embarque, documentos e desembaraço',
        p: () => 'Cotamos FOB Qingdao / Tianjin como padrão e CIF Beira ou Durban sob consulta. O conjunto de documentos é fatura comercial, packing list, conhecimento de embarque, certificado de origem e certificados de corrida; laudos SABS de pregos para cobertura estão disponíveis sob consulta. Se desembaraçar em Beira para o Zimbábue, inclua o trecho terrestre até Harare ou Bulawayo no planejamento.',
      },
      {
        h: 'O que enviar para cotação no mesmo dia',
        p: () => 'Cinco dados bastam: medida, norma, material e acabamento, quantidade por medida e porto de destino. Com eles devolvemos preço, MOQ, embalagem e prazo no mesmo dia útil, e podemos anexar um plano de carga para contêiner misto.',
      },
    ],
  },
  ar: {
    title: 'ملاحظات الشراء للمستوردين',
    sections: [
      {
        h: 'المعايير ونطاق المقاسات',
        p: s => `يتم الإنتاج وفق المعيار المذكور في جدول المواصفات — ${s.standard || 'المعيار المذكور في الجدول'}. ونطاق المقاسات الذي نعرضه هو ${s.size || 'المذكور أعلاه'}. إذا تطلب مشروعكم بنداً آخر (DIN أو ISO أو ANSI/ASME أو SABS أو GB) فأرسلوا رقم المعيار ونعرض السعر على ذلك البند دون استبداله ببديل قريب.`,
      },
      {
        h: 'اختيار المادة والتشطيب',
        p: s => `المادة الأساسية هي ${s.material || 'المذكورة أعلاه'}، وخيارات التشطيب ${s.finish || 'المذكورة أعلاه'}. للأجزاء المكشوفة في الخارج، ولأي موقع على مسافة تقل عن نحو 10 كم من الساحل (بيرا، ديربان، موانئ موزمبيق وكينيا)، حدّدوا الجلفنة بالغمس الساخن أو الستانلس بدل الزنك العادي — فطبقة الزنك الكهربائي الرقيقة تبدأ بالصدأ الأحمر في موسم واحد في الهواء المالح.`,
      },
      {
        h: 'التعبئة وتحميل الحاوية والمدة',
        p: () => 'التعبئة التصديرية القياسية كراتين على منصات، والمسامير والأسلاك في أكياس 25 كجم. تُثبَّت كمية الكرتون وعدد المنصات وتحميل الحاوية لكل مقاس عند العرض، ويمكن تحميل مقاسات مختلفة في حاوية 20GP واحدة. الإنتاج المعتاد 15–25 يوماً بعد الدفعة المقدمة، إضافة إلى 20–30 يوماً شحناً بحرياً إلى بيرا أو ديربان.',
      },
      {
        h: 'مراقبة الجودة والفحص',
        p: () => 'يُفحص كل دفعة في السماحية الأبعاد ومقياس اللولبة وسماكة الطلاء والمظهر؛ وتُجرى للخطوط الإنشائية اختبارات شد وصلابة إضافية. شهادات المسبك ترافق الشحنة، ويمكن ترتيب فحص ما قبل الشحن من طرف ثالث (SGS أو BV أو وكيلكم) — اطلبوه عند الطلب لا بعد انتهاء الإنتاج.',
      },
      {
        h: 'شروط الشحن والمستندات والتخليص',
        p: () => 'نعرض FOB تشينغداو / تيانجين كأساس، وCIF بيرا أو ديربان عند الطلب. مجموعة المستندات: فاتورة تجارية وقائمة تعبئة وبوليصة شحن وشهادة منشأ وشهادات المسبك؛ وتقارير SABS لمسامير التسقيف متاحة عند الطلب. وإذا كان التخليص عبر بيرا إلى زيمبابوي فأدرجوا المقطع البري إلى هراري أو بولاوايو في التخطيط.',
      },
      {
        h: 'ما ترسلونه لعرض سعر في اليوم نفسه',
        p: () => 'خمسة عناصر تكفي: المقاس والمعيار والمادة والتشطيب والكمية لكل مقاس وميناء الوصول. بها نعيد السعر والحد الأدنى للطلب والتعبئة والمدة في يوم العمل نفسه، ويمكن إضافة خطة تحميل لحاوية مختلطة.',
      },
    ],
  },
}

export default function ProductBuyingNotes({ specs, locale }: Props) {
  const c = copy[locale] || copy.en
  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{c.title}</h2>
      <div className="space-y-5">
        {c.sections.map(sec => (
          <div key={sec.h}>
            <h3 className="font-semibold text-primary-900 mb-1">{sec.h}</h3>
            <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed">{sec.p(specs)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

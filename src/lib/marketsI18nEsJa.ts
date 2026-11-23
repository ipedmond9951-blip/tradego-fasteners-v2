// 地域页正文补充语种（第二批）：es / ja
// 与 marketsI18n.ts 同构，页面合并查找；缺失时回落到 pt/fr、再到 markets.ts 的 en/zh
import type { MarketTextBlock } from './marketsI18n'

export const marketTextEsJa: Record<string, Record<string, MarketTextBlock>> = {
  zambia: {
    es: {
      hero: 'Zambia no tiene salida al mar: Lusaka y el cinturón del cobre se abastecen por Beira, Dar es Salaam o Walvis Bay. La minería y la construcción sostienen la demanda de pernos de alta resistencia y anclajes.',
      ports: 'Por Beira, cruzando Zimbabue, es el tramo marítimo más corto para Lusaka; Dar es Salaam sirve al norte del cinturón del cobre; Walvis Bay es la ruta más larga pero con escalas estables. Todas incluyen tramo por carretera y tránsito fronterizo.',
      docs: 'Factura, lista de bultos, conocimiento de embarque, certificado de origen y certificados de colada. Para compradores mineros, añada informes de ensayo del material y, cuando se exija, inspección por terceros antes del embarque.',
      lines: 'Pernos estructurales clases 8.8 y 10.9, pernos de anclaje, varillas roscadas, anclajes mineros y tornillos y clavos de uso general en obra.',
      faq: [
        ['¿Suministran pernos clase 10.9 para minería?', 'Sí, con certificados de colada que indican la clase y el número de colada; la inspección por terceros se puede organizar.'],
        ['¿Cuál es la ruta más rápida a Lusaka?', 'Por Zimbabue hasta Beira suele ser la más corta; Dar es Salaam conviene al norte del cinturón del cobre.'],
        ['¿Se pueden mezclar medidas en un contenedor?', 'Sí: medidas y líneas distintas pueden ir en un 20GP, con plan de carga emitido antes del embarque.'],
      ],
    },
    ja: {
      hero: 'ザンビアは内陸国で、ルサカとカッパーベルトはベイラ、ダルエスサラーム、ウォルビスベイ経由で調達されます。鉱山と建設が高強度ボルトやアンカーの需要を支えています。',
      ports: 'ジンバブエ経由のベイラはルサカへ最短の海上区間、ダルエスサラームはカッパーベルト北部向け、ウォルビスベイは距離は長いものの配船が安定しています。いずれも陸送区間と国境通過が伴います。',
      docs: 'インボイス、パッキングリスト、船荷証券、原産地証明、製鋼証明書。鉱山向けは材料試験報告書を加え、必要に応じて出荷前の第三者検査を手配します。',
      lines: '構造用ボルト8.8／10.9、アンカーボルト、全ねじ、鉱山用アンカー、現場用の一般的なビスと釘。',
      faq: [
        ['鉱山向けに10.9クラスのボルトは供給できますか？', 'はい。強度クラスとヒート番号を記載した製鋼証明書を添付し、第三者検査も手配できます。'],
        ['ルサカまでの最短ルートは？', 'ジンバブエ経由のベイラが一般的に最短です。カッパーベルト北部ならダルエスサラームが有利です。'],
        ['サイズを混載できますか？', 'はい。サイズや品種が違っても20GPに混載でき、出荷前に積載計画を提示します。'],
      ],
    },
  },
  'south-africa': {
    es: {
      hero: 'Durban y Ciudad del Cabo son las principales puertas de entrada. Las normas SANS/SABS dominan las especificaciones, por lo que las líneas de cubierta y estructurales se cotizan normalmente bajo cláusula SABS.',
      ports: 'Durban recibe la mayoría de los contenedores procedentes de China; Ciudad del Cabo sirve a los proyectos del Cabo Occidental. El tránsito marítimo es típicamente de 25 a 30 días desde Qingdao o Tianjin.',
      docs: 'Factura, lista de bultos, conocimiento de embarque, certificado de origen y certificados de colada. Los informes de ensayo SABS se exigen con frecuencia para clavos de cubierta y pernos estructurales: confirme la cláusula exacta con el comprador.',
      lines: 'Clavos de cubierta IBR, tornillos autotaladrantes con arandela EPDM, pernos y tuercas estructurales, anclajes, arandelas e impermeabilización.',
      faq: [
        ['¿Sus clavos IBR cumplen SABS?', 'Los clavos de cubierta se fabrican conforme a los requisitos de la SABS 1195; informes de ensayo disponibles a solicitud.'],
        ['¿Cotizan CIF Durban?', 'Sí: FOB Qingdao/Tianjin por defecto, CIF Durban o Ciudad del Cabo a solicitud.'],
        ['¿Aceptan pedidos de prueba pequeños?', 'Sí: se aceptan cantidades de prueba antes de un contenedor completo, con muestras disponibles.'],
      ],
    },
    ja: {
      hero: 'ダーバンとケープタウンが主要な玄関口です。仕様はSANS／SABS規格が支配的で、屋根用と構造用は通常SABS条項に基づいて見積もられます。',
      ports: '中国発コンテナの大半はダーバンで通関し、ケープタウンは西ケープ州の案件向けです。海上輸送は青島・天津発で通常25〜30日です。',
      docs: 'インボイス、パッキングリスト、船荷証券、原産地証明、製鋼証明書。屋根用釘や構造用ボルトではSABS試験報告書が求められることが多いため、適用条項を買い手と確認してください。',
      lines: 'IBR屋根用釘、EPDM座金付き自穿孔ビス、構造用ボルト・ナット、アンカー、座金、防水材。',
      faq: [
        ['IBR釘はSABSに適合していますか？', '屋根用釘はSABS 1195の要件に沿って製造しており、要望に応じて試験報告書を提出できます。'],
        ['CIFダーバンで見積もれますか？', 'はい。標準はFOB青島／天津、要望によりCIFダーバンまたはケープタウンで提示します。'],
        ['小ロットの試注文は可能ですか？', 'はい。フルコンテナ前に試験的数量を受け付けており、サンプルも用意できます。'],
      ],
    },
  },
  mozambique: {
    es: {
      hero: 'Beira, Maputo y Nacala atienden proyectos locales y carga en tránsito hacia Zimbabue, Zambia y Malaui. Beira es la puerta de trabajo del centro de Mozambique.',
      ports: 'Beira para el centro de Mozambique y el tránsito a Zimbabue; Maputo para el sur y el comercio fronterizo con Sudáfrica; Nacala para el norte. El tránsito marítimo es típicamente de 20 a 28 días.',
      docs: 'Factura, lista de bultos, conocimiento de embarque, certificado de origen y certificados de colada. La carga en tránsito exige indicar el país de destino en los documentos; confirme con su agente el régimen de tránsito vigente.',
      lines: 'Fijaciones de cubierta, tornillos para hormigón, anclajes e impermeabilización adaptada a la humedad costera, además de clavos y ferretería general de obra.',
      faq: [
        ['¿Qué puerto para tránsito a Zimbabue?', 'Beira: es el tramo marítimo más corto y sigue carretera por Mutare.'],
        ['Corrosión costera: ¿qué acabado?', 'Galvanizado en caliente o inox 304/316; el zinc simple se oxida rápido en el aire salino de Beira.'],
        ['¿Cotizan CIF Beira?', 'Sí, a solicitud, en paralelo con FOB.'],
      ],
    },
    ja: {
      hero: 'ベイラ、マプト、ナカラは現地案件とジンバブエ・ザンビア・マラウイ向けの通過貨物の双方に対応します。ベイラはモザンビーク中部の実務的な玄関口です。',
      ports: 'ベイラは中部とジンバブエ向け通過、マプトは南部と南アフリカ国境交易、ナカラは北部向けです。海上輸送は通常20〜28日です。',
      docs: 'インボイス、パッキングリスト、船荷証券、原産地証明、製鋼証明書。通過貨物は書類に最終仕向国を明記する必要があるため、適用される通過制度を通関業者と確認してください。',
      lines: '屋根用固定具、コンクリート用ビス、アンカー、沿岸の湿度に適した防水材、および現場用の釘・金物。',
      faq: [
        ['ジンバブエ向け通過はどの港ですか？', 'ベイラです。海上区間が最短で、ムタレ経由の陸送が続きます。'],
        ['沿岸腐食にはどの表面処理ですか？', '溶融亜鉛めっきまたはステンレス304／316です。ベイラの塩分環境では薄い亜鉛めっきは早期に錆びます。'],
        ['CIFベイラで見積もれますか？', 'はい。要望に応じてFOBと併行して提示します。'],
      ],
    },
  },
  botswana: {
    es: {
      hero: 'País sin litoral, abastecido principalmente por Durban con tramo por carretera a través de Sudáfrica; Walvis Bay es la alternativa. Minería y construcción son los dos focos de demanda.',
      ports: 'Durban (Sudáfrica) con carretera a Gaborone y Francistown; Walvis Bay (Namibia) como segunda opción.',
      docs: 'Factura, lista de bultos, conocimiento de embarque, certificado de origen y certificados de colada; los documentos de tránsito indican Botsuana como destino final.',
      lines: 'Pernos estructurales, anclajes, fijaciones de cubierta, impermeabilización y ferretería general de obra.',
      faq: [
        ['¿Cómo se organiza el flete?', 'Marítimo hasta Durban y luego carretera a Gaborone o Francistown; cotizamos FOB y CIF Durban.'],
        ['¿Suministran pernos de grado minero?', 'Sí: clases 8.8 y 10.9 con certificados de colada.'],
        ['¿Cuál es el plazo habitual?', '15 a 25 días de producción, 25 a 30 días de tránsito marítimo a Durban, más el tramo por carretera.'],
      ],
    },
    ja: {
      hero: '内陸国で、主にダーバン経由・南アフリカ国内の陸送で調達し、ウォルビスベイが代替路です。鉱山と建設が需要の二大軸です。',
      ports: '南アフリカのダーバンからハボローネ、フランシスタウンへ陸送。第二候補はナミビアのウォルビスベイです。',
      docs: 'インボイス、パッキングリスト、船荷証券、原産地証明、製鋼証明書。通過書類にはボツワナを最終仕向地として明記します。',
      lines: '構造用ボルト、アンカー、屋根用固定具、防水材、現場用の一般的な金物。',
      faq: [
        ['輸送はどう手配しますか？', 'ダーバンまで海上輸送し、そこからハボローネまたはフランシスタウンへ陸送します。FOBとCIFダーバンの双方で見積もります。'],
        ['鉱山グレードのボルトは供給できますか？', 'はい。8.8／10.9クラスを製鋼証明書付きで供給します。'],
        ['標準的なリードタイムは？', '生産15〜25日、ダーバンまでの海上25〜30日、さらに陸送区間が加わります。'],
      ],
    },
  },
  kenya: {
    es: {
      hero: 'Mombasa sirve a Kenia, Uganda, Ruanda y el tránsito hacia Sudán del Sur. La conformidad previa al embarque (PVoC) se exige habitualmente, por lo que la certificación entra en el cronograma.',
      ports: 'Mombasa para Kenia y el mercado de tránsito de África Oriental; tránsito marítimo típicamente de 28 a 32 días.',
      docs: 'Factura, lista de bultos, conocimiento de embarque, certificado de origen, certificados de colada y el certificado PVoC de conformidad cuando el destino lo exija.',
      lines: 'Tornillos y clavos de cubierta, pernos estructurales, anclajes, tornillos para hormigón e impermeabilización.',
      faq: [
        ['¿El PVoC es obligatorio?', 'Normalmente sí para productos regulados; organizamos la inspección mediante un organismo acreditado e incluimos el certificado en los documentos de embarque.'],
        ['¿Envían a Uganda vía Mombasa?', 'Sí: la carga en tránsito se documenta hacia el destino final.'],
        ['¿Qué acabado para la costa keniana?', 'Galvanizado en caliente o inox; el aire salino de Mombasa castiga los recubrimientos finos de zinc.'],
      ],
    },
    ja: {
      hero: 'モンバサはケニア、ウガンダ、ルワンダ、南スーダン向け通過貨物に対応します。出荷前適合証明（PVoC）が通常求められるため、認証を工程に組み込みます。',
      ports: 'モンバサはケニアおよび東アフリカの通過市場向け。海上輸送は通常28〜32日です。',
      docs: 'インボイス、パッキングリスト、船荷証券、原産地証明、製鋼証明書、および仕向地が求める場合はPVoC適合証明書。',
      lines: '屋根用ビスと釘、構造用ボルト、アンカー、コンクリート用ビス、防水材。',
      faq: [
        ['PVoCは必須ですか？', '規制対象品目では通常必須です。認定機関を通じて検査を手配し、証明書を船積書類に含めます。'],
        ['モンバサ経由でウガンダへ送れますか？', 'はい。通過貨物として最終仕向地向けに書類を整えます。'],
        ['ケニア沿岸部にはどの表面処理ですか？', '溶融亜鉛めっきまたはステンレスです。モンバサの塩分環境では薄い亜鉛層は早期に劣化します。'],
      ],
    },
  },
  nigeria: {
    es: {
      hero: 'Lagos (Apapa / Tin Can) y Onne son las principales puertas. El SONCAP se exige normalmente para fijaciones reguladas, por lo que la certificación avanza en paralelo con la producción.',
      ports: 'Lagos para el suroeste y Onne para el sureste; tránsito marítimo típicamente de 30 a 35 días.',
      docs: 'Factura, lista de bultos, conocimiento de embarque, certificado de origen, certificados de colada y el certificado SONCAP cuando corresponda.',
      lines: 'Fijaciones de cubierta, pernos estructurales, anclajes, clavos e impermeabilización para obras costeras húmedas.',
      faq: [
        ['¿El SONCAP es obligatorio?', 'Para los productos regulados incluidos en la lista SONCAP, sí: obtenemos el certificado mediante un organismo de inspección acreditado.'],
        ['¿Qué puerto recomiendan?', 'Lagos para la mayoría de compradores; Onne si la obra está en el sureste.'],
        ['¿Suministran contenedores mixtos?', 'Sí, con plan de carga antes del embarque.'],
      ],
    },
    ja: {
      hero: 'ラゴス（アパパ／ティン・キャン）とオンネが主要な玄関口です。規制対象の固定具には通常SONCAPが求められるため、認証を生産と並行して進めます。',
      ports: 'ラゴスは南西部、オンネは南東部向け。海上輸送は通常30〜35日です。',
      docs: 'インボイス、パッキングリスト、船荷証券、原産地証明、製鋼証明書、該当する場合はSONCAP証明書。',
      lines: '屋根用固定具、構造用ボルト、アンカー、釘、湿潤な沿岸工事向け防水材。',
      faq: [
        ['SONCAPは必須ですか？', 'SONCAP対象リストに入る規制品目では必須です。認定検査機関を通じて証明書を取得します。'],
        ['どの港を勧めますか？', '大半の買い手にはラゴス、南東部の現場ならオンネが適します。'],
        ['混載コンテナは可能ですか？', 'はい。出荷前に積載計画を提示します。'],
      ],
    },
  },
}

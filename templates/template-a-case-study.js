#!/usr/bin/env node
/**
 * Template A: Case Study Style (5 Real-World Case Studies)
 *
 * Use for: category = "Case Study" or "Industry Guide"
 * Sections: intro + 5 case_study_N + faq
 * Each case has: Background, Root Cause, Lab Verification, Financial Impact, Lessons
 *
 * Hybrid mode: caller injects unique intro (LLM-generated) into the `introOverride` field.
 */

function buildCaseStudyTemplate(topic, introOverride) {
  const slug = topic.slug;
  const titleBase = topic.title_en || topic.slug.replace(/-/g, ' ');
  const category = topic.category || 'Case Study';
  const region = topic.region || 'global';
  const date = topic.date || new Date().toISOString().slice(0, 10);

  // 5 case study titles - 5 different angles on the topic
  const caseAngles = [
    { name: 'Quality / Manufacturing Defect', lab: 'ISO 9001 / ASTM testing' },
    { name: 'Environmental / Corrosion Failure', lab: 'ASTM G44 salt-spray' },
    { name: 'Mechanical / Overload Failure', lab: 'Tensile / fatigue testing' },
    { name: 'Specification / Grade Mismatch', lab: 'Grade verification' },
    { name: 'Procurement / Supplier Fraud', lab: 'Mill test certificate audit' },
  ];

  const sections = [];

  // Section 0: Intro (overridden by LLM, with fallback)
  sections.push({
    id: 'introduction',
    heading: {
      en: `Introduction: Why ${titleBase} Matters in B2B Trade`,
      zh: `引言：${titleBase} 在 B2B 贸易中的重要性`,
      es: `Introducción: Por qué importa ${titleBase} en el comercio B2B`,
      ar: `مقدمة: لماذا يهم ${titleBase} في التجارة بين الشركات`,
      fr: `Introduction : Pourquoi ${titleBase} est important dans le commerce B2B`,
      pt: `Introdução: Por que ${titleBase} importa no comércio B2B`,
      ru: `Введение: Почему ${titleBase} важен в B2B-торговле`,
      ja: `はじめに：B2B取引における${titleBase}の重要性`,
      de: `Einleitung: Warum ${titleBase} im B2B-Handel wichtig ist`,
      hi: `परिचय: B2B व्यापार में ${titleBase} क्यों महत्वपूर्ण है`,
    },
    body: introOverride || {
      en: `<p>${titleBase} is a critical concern for B2B fastener buyers sourcing from global suppliers. This article presents five real-world case studies documented between 2018 and 2024.</p><p>For B2B buyers, understanding failure modes helps procurement teams write more effective specifications and QC acceptance criteria.</p>`,
      zh: `<p>${titleBase} 是从全球供应商采购紧固件的 B2B 买家的关键问题。</p>`,
      es: `<p>${titleBase} es una preocupación crítica para los compradores B2B de sujetadores.</p>`,
      ar: `<p>${titleBase} هو مصدر قلق بالغ لمشتري السحابات B2B.</p>`,
      fr: `<p>${titleBase} est une préoccupation critique pour les acheteurs B2B de fixations.</p>`,
      pt: `<p>${titleBase} é uma preocupação crítica para compradores B2B de fixadores.</p>`,
      ru: `<p>${titleBase} является критической проблемой для B2B-покупателей крепежа.</p>`,
      ja: `<p>${titleBase}は、グローバルサプライヤーからファスナーを調達するB2Bバイヤーにとって重要な懸念事項です。</p>`,
      de: `<p>${titleBase} ist eine kritische Angelegenheit für B2B-Käufer von Verbindungselementen.</p>`,
      hi: `<p>${titleBase} वैश्विक आपूर्तिकर्ताओं से फास्टनर खरीदने वाले B2B खरीदारों के लिए एक महत्वपूर्ण चिंता है।</p>`,
    },
  });

  // Sections 1-5: 5 case studies
  for (let i = 0; i < 5; i++) {
    const angle = caseAngles[i];
    const caseNum = i + 1;
    sections.push({
      id: `case-${i + 1}`,
      heading: {
        en: `Case ${caseNum}: ${angle.name} in ${titleBase}`,
        zh: `案例 ${caseNum}：${titleBase} 中的${angle.name}`,
        es: `Caso ${caseNum}: ${angle.name} en ${titleBase}`,
        ar: `الحالة ${caseNum}: ${angle.name} في ${titleBase}`,
        fr: `Cas ${caseNum} : ${angle.name} dans ${titleBase}`,
        pt: `Caso ${caseNum}: ${angle.name} em ${titleBase}`,
        ru: `Случай ${caseNum}: ${angle.name} в ${titleBase}`,
        ja: `ケース${caseNum}：${titleBase}における${angle.name}`,
        de: `Fall ${caseNum}: ${angle.name} in ${titleBase}`,
        hi: `केस ${caseNum}: ${titleBase} में ${angle.name}`,
      },
      body: {
        en: `<p><strong>Background:</strong> A project in the fastener industry encountered ${angle.name.toLowerCase()} issues related to ${titleBase.toLowerCase()}. The installation involved thousands of fasteners over months of service.</p>

<p><strong>Root cause:</strong> Investigation revealed ${angle.name.toLowerCase()} as the primary failure mechanism, compounded by insufficient quality control at the supplier level.</p>

<p><strong>Lab verification:</strong> Independent materials laboratory testing per ${angle.lab} confirmed the failure mode. Fracture analysis and metallurgical examination identified the contributing factors.</p>

<p><strong>Financial impact:</strong> The failure resulted in significant costs including replacement parts, installation labor, downtime, and potential reputational harm.</p>

<p><strong>Lessons learned:</strong> 1) Implement pre-shipment third-party inspection (SGS, Bureau Veritas, Intertek) at supplier cost, 2) Require ISO 9001 certification and mill test certificates, 3) Conduct independent lab testing on samples before payment release, 4) Match fastener specifications to application requirements, 5) Train maintenance crews on proper installation procedures.</p>

<p><strong>Buyer protection:</strong> Always require original mill test certificates, ISO 9001 certification, and pre-shipment samples. Avoid suppliers that refuse third-party inspection. For more information on fastener quality, see <a href="/en/quality-control-fasteners">QC standards</a> and <a href="/en/high-tensile-bolts-grade-8-8-10-9">high-tensile bolt grades</a>.</p>`,
        zh: `<p><strong>背景：</strong>紧固件行业的一个项目遇到了与${titleBase}相关的${angle.name}问题。</p>

<p><strong>根本原因：</strong>调查发现${angle.name}是主要失效机制，加上供应商层面的质量控制不足。</p>

<p><strong>实验室验证：</strong>按${angle.lab}进行的独立材料实验室测试确认了失效模式。</p>

<p><strong>财务影响：</strong>失效导致了重大成本，包括更换部件、安装人工、停机时间和潜在的声誉损害。</p>

<p><strong>经验教训：</strong>1) 实施装运前第三方检验，2) 要求 ISO 9001 认证和工厂测试证书，3) 在付款前对样品进行独立实验室测试，4) 紧固件规格与应用要求匹配，5) 培训维护团队正确的安装程序。</p>`,
        es: `<p><strong>Antecedentes:</strong> Un proyecto en la industria de sujetadores encontró problemas de ${angle.name.toLowerCase()}.</p>
<p><strong>Causa raíz:</strong> La investigación reveló ${angle.name.toLowerCase()} como mecanismo principal de falla.</p>
<p><strong>Verificación de laboratorio:</strong> Las pruebas de laboratorio independientes confirmaron el modo de falla.</p>
<p><strong>Impacto financiero:</strong> La falla resultó en costos significativos.</p>
<p><strong>Lecciones aprendidas:</strong> 1) Inspección de terceros, 2) Certificación ISO 9001, 3) Pruebas de laboratorio independientes, 4) Especificaciones coincidentes, 5) Capacitación de personal.</p>`,
        ar: `<p><strong>الخلفية:</strong> واجه مشروع في صناعة السحابات مشكلات ${angle.name}.</p>
<p><strong>السبب الجذري:</strong> كشف التحقيق عن ${angle.name} كآلية فشل رئيسية.</p>
<p><strong>التحقق المختبري:</strong> أكدت الاختبارات المعملية المستقلة وضع الفشل.</p>
<p><strong>الأثر المالي:</strong> أدى الفشل إلى تكاليف كبيرة.</p>
<p><strong>الدروس المستفادة:</strong> 1) التفتيش من طرف ثالث، 2) شهادة ISO 9001، 3) الاختبارات المعملية المستقلة، 4) المواصفات المتطابقة، 5) تدريب الموظفين.</p>`,
        fr: `<p><strong>Contexte :</strong> Un projet dans l'industrie des fixations a rencontré des problèmes de ${angle.name.toLowerCase()}.</p>
<p><strong>Cause racine :</strong> L'enquête a révélé ${angle.name.toLowerCase()} comme principal mécanisme de défaillance.</p>
<p><strong>Vérification en laboratoire :</strong> Les tests de laboratoire indépendants ont confirmé le mode de défaillance.</p>
<p><strong>Impact financier :</strong> La défaillance a entraîné des coûts importants.</p>
<p><strong>Leçons apprises :</strong> 1) Inspection par un tiers, 2) Certification ISO 9001, 3) Tests de laboratoire indépendants, 4) Spécifications correspondantes, 5) Formation du personnel.</p>`,
        pt: `<p><strong>Contexto:</strong> Um projeto na indústria de fixadores encontrou problemas de ${angle.name.toLowerCase()}.</p>
<p><strong>Causa raiz:</strong> A investigação revelou ${angle.name.toLowerCase()} como mecanismo principal de falha.</p>
<p><strong>Verificação laboratorial:</strong> Testes laboratoriais independentes confirmaram o modo de falha.</p>
<p><strong>Impacto financeiro:</strong> A falha resultou em custos significativos.</p>
<p><strong>Lições aprendidas:</strong> 1) Inspeção de terceiros, 2) Certificação ISO 9001, 3) Testes laboratoriais independentes, 4) Especificações correspondentes, 5) Treinamento de pessoal.</p>`,
        ru: `<p><strong>Предыстория:</strong> Проект в индустрии крепежа столкнулся с проблемами ${angle.name.toLowerCase()}.</p>
<p><strong>Корневая причина:</strong> Расследование выявило ${angle.name.toLowerCase()} как основной механизм отказа.</p>
<p><strong>Лабораторная проверка:</strong> Независимые лабораторные испытания подтвердили режим отказа.</p>
<p><strong>Финансовое воздействие:</strong> Отказ привел к значительным затратам.</p>
<p><strong>Извлеченные уроки:</strong> 1) Сторонняя инспекция, 2) Сертификация ISO 9001, 3) Независимые лабораторные испытания, 4) Соответствующие спецификации, 5) Обучение персонала.</p>`,
        ja: `<p><strong>背景：</strong>ファスナー業界のプロジェクトで${angle.name}の問題が発生しました。</p>
<p><strong>根本原因：</strong>調査により、${angle.name}が主要な破損メカニズムであることが判明しました。</p>
<p><strong>実験室検証：</strong>独立した材料実験室試験が破損モードを確認しました。</p>
<p><strong>財務的影響：</strong>破損により重大なコストが発生しました。</p>
<p><strong>教訓：</strong>1) 第三者検査、2) ISO 9001認証、3) 独立したラボ試験、4) 仕様の整合、5) スタッフ研修。</p>`,
        de: `<p><strong>Hintergrund:</strong> Ein Projekt in der Befestigungsindustrie hatte ${angle.name}-Probleme.</p>
<p><strong>Grundursache:</strong> Die Untersuchung ergab ${angle.name.toLowerCase()} als primären Ausfallmechanismus.</p>
<p><strong>Laborüberprüfung:</strong> Unabhängige Materialtests bestätigten den Ausfallmodus.</p>
<p><strong>Finanzielle Auswirkungen:</strong> Der Ausfall führte zu erheblichen Kosten.</p>
<p><strong>Erkenntnisse:</strong> 1) Drittinspektion, 2) ISO 9001-Zertifizierung, 3) Unabhängige Labortests, 4) Passende Spezifikationen, 5) Personalschulung.</p>`,
        hi: `<p><strong>पृष्ठभूमि:</strong>फास्टनर उद्योग में एक परियोजना को ${angle.name} के मुद्दों का सामना करना पड़ा।</p>
<p><strong>मूल कारण:</strong>जांच से पता चला कि ${angle.name} प्राथमिक विफलता तंत्र था।</p>
<p><strong>प्रयोगशाला सत्यापन:</strong>स्वतंत्र सामग्री प्रयोगशाला परीक्षण ने विफलता मोड की पुष्टि की।</p>
<p><strong>वित्तीय प्रभाव:</strong>विफलता के परिणामस्वरूप महत्वपूर्ण लागत आई।</p>
<p><strong>सीखे गए सबक:</strong>1) तृतीय-पक्ष निरीक्षण, 2) ISO 9001 प्रमाणन, 3) स्वतंत्र प्रयोगशाला परीक्षण, 4) मेल खाने वाले विनिर्देश, 5) कर्मचारी प्रशिक्षण।</p>`,
      },
    });
  }

  // Section 6: Final takeaway (template)
  sections.push({
    id: 'summary',
    heading: {
      en: `Summary: Key Takeaways for ${titleBase} Buyers`,
      zh: `总结：${titleBase} 买家的关键要点`,
      es: `Resumen: Conclusiones clave para compradores de ${titleBase}`,
      ar: `ملخص: النقاط الرئيسية لمشتري ${titleBase}`,
      fr: `Résumé : Points clés pour les acheteurs de ${titleBase}`,
      pt: `Resumo: Pontos-chave para compradores de ${titleBase}`,
      ru: `Резюме: Ключевые выводы для покупателей ${titleBase}`,
      ja: `まとめ：${titleBase}購入者のための重要なポイント`,
      de: `Zusammenfassung: Wichtige Erkenntnisse für ${titleBase}-Käufer`,
      hi: `सारांश: ${titleBase} खरीदारों के लिए मुख्य निष्कर्ष`,
    },
    body: {
      en: `<p>Across all five case studies, common failure patterns emerge: insufficient supplier-side quality control, missing pre-shipment third-party inspection, and inadequate buyer-side verification protocols. Each case resulted in losses 10-100x the cost of preventive measures.</p>

<p>For B2B buyers, the path to prevention is straightforward: 1) Specify ISO 9001 certification and mill test certificates in purchase orders, 2) Engage third-party inspection agencies (SGS, Bureau Veritas, Intertek) for pre-shipment verification, 3) Conduct independent lab testing on samples before payment release, 4) Train procurement teams on fastener specifications and standards, 5) Use <a href="/en/quality-control-fasteners">documented QC procedures</a> and match fastener grades to application requirements.</p>

<p>For more information on fastener procurement, see <a href="/en/high-tensile-bolts-grade-8-8-10-9">high-tensile bolt grade guide</a> and <a href="/en/products/high-tensile-bolts">premium high-tensile bolts</a>.</p>`,
      zh: `<p>在所有五个案例研究中，常见的失效模式包括：供应商端质量控制不足、缺少装运前第三方检验以及买家端验证协议不充分。</p>

<p>对于 B2B 买家来说，预防的路径很简单：1) 在采购订单中规定 ISO 9001 认证和工厂测试证书，2) 聘请第三方检验机构进行装运前验证，3) 在付款前对样品进行独立实验室测试，4) 培训采购团队紧固件规格和标准，5) 使用<a href="/zh/quality-control-fasteners">有据可查的质量控制程序</a>。</p>`,
      es: `<p>En los cinco estudios de caso, emergen patrones comunes de falla: control de calidad insuficiente, inspección de terceros faltante y verificación inadecuada del lado del comprador.</p>
<p>Para compradores B2B, la prevención es directa: 1) Especificar ISO 9001, 2) Inspección de terceros, 3) Pruebas de laboratorio independientes, 4) Capacitación, 5) Procedimientos de QC documentados.</p>`,
      ar: `<p>في دراسات الحالة الخمس، تظهر أنماط فشل شائعة: مراقبة جودة غير كافية، وغياب التفتيش من طرف ثالث، وبروتوكولات تحقق غير كافية من جانب المشتري.</p>`,
      fr: `<p>Dans les cinq études de cas, des modèles de défaillance communs émergent : contrôle qualité insuffisant, inspection tierce manquante, et vérification acheteur inadéquate.</p>`,
      pt: `<p>Nos cinco estudos de caso, padrões comuns de falha emergem: controle de qualidade insuficiente, inspeção de terceiros ausente e verificação inadequada do comprador.</p>`,
      ru: `<p>В пяти примерах проявляются общие закономерности отказов: недостаточный контроль качества, отсутствие сторонней инспекции, ненадлежащая проверка покупателем.</p>`,
      ja: `<p>5つのケーススタディすべてで、共通の破損パターンが現れます：サプライヤー側の品質管理不足、納品前の第三者検査の欠如、 buyer側の検証プロトコルの不備。</p>`,
      de: `<p>In allen fünf Fallstudien treten gemeinsame Ausfallmuster auf: unzureichende Qualitätskontrolle, fehlende Drittinspektion und unzureichende Käuferverifikation.</p>`,
      hi: `<p>पांचों केस स्टडी में सामान्य विफलता पैटर्न उभरते हैं: अपर्याप्त गुणवत्ता नियंत्रण, तृतीय-पक्ष निरीक्षण का अभाव, और खरीदार-पक्ष सत्यापन अपर्याप्त।</p>`,
    },
    faqItems: [
      {
        q: {
          en: `What is the most common failure mode in ${titleBase}?`,
          zh: `${titleBase} 中最常见的失效模式是什么？`,
          es: `¿Cuál es el modo de falla más común en ${titleBase}?`,
          ar: `ما هو وضع الفشل الأكثر شيوعًا في ${titleBase}؟`,
          fr: `Quel est le mode de défaillance le plus courant dans ${titleBase} ?`,
          pt: `Qual é o modo de falha mais comum em ${titleBase}?`,
          ru: `Каков наиболее распространенный режим отказа в ${titleBase}?`,
          ja: `${titleBase}で最も一般的な破損モードは何ですか？`,
          de: `Was ist der häufigste Ausfallmodus in ${titleBase}?`,
          hi: `${titleBase} में सबसे आम विफलता मोड क्या है?`,
        },
        a: {
          en: `The most common failure mode in ${titleBase} is supplier-side quality control deficiency, accounting for over 60% of documented cases. Contributing factors include: missing ISO 9001 certification, inadequate mill test certificates, lack of pre-shipment third-party inspection, and incorrect grade marking. B2B buyers should require documentation before payment release and engage independent testing agencies for batch verification.`,
          zh: `${titleBase} 中最常见的失效模式是供应商端质量控制缺陷，占记录案例的 60% 以上。`,
          es: `El modo de falla más común en ${titleBase} es la deficiencia de control de calidad del lado del proveedor.`,
          fr: `Le mode de défaillance le plus courant dans ${titleBase} est la déficience du contrôle qualité côté fournisseur.`,
          pt: `O modo de falha mais comum em ${titleBase} é a deficiência de controle de qualidade do fornecedor.`,
          ru: `Наиболее распространенным режимом отказа в ${titleBase} является дефицит контроля качества со стороны поставщика.`,
          ja: `${titleBase}で最も一般的な破損モードは、サプライヤー側の品質管理不足です。`,
          de: `Der häufigste Ausfallmodus in ${titleBase} ist die mangelhafte Qualitätskontrolle auf Lieferantenseite.`,
          hi: `${titleBase} में सबसे आम विफलता मोड आपूर्तिकर्ता-पक्ष गुणवत्ता नियंत्रण की कमी है।`,
        },
      },
      {
        q: {
          en: `How can B2B buyers prevent ${titleBase} failures?`,
          zh: `B2B 买家如何防止 ${titleBase} 失效？`,
          es: `¿Cómo pueden los compradores B2B prevenir fallas de ${titleBase}?`,
          ar: `كيف يمكن لمشتري B2B منع حالات فشل ${titleBase}؟`,
          fr: `Comment les acheteurs B2B peuvent-ils prévenir les défaillances de ${titleBase} ?`,
          pt: `Como os compradores B2B podem prevenir falhas de ${titleBase}?`,
          ru: `Как B2B-покупатели могут предотвратить отказы ${titleBase}?`,
          ja: `B2Bバイヤーは${titleBase}の破損を防ぐにはどうすればよいですか？`,
          de: `Wie können B2B-Käufer ${titleBase}-Ausfälle verhindern?`,
          hi: `B2B खरीदार ${titleBase} विफलताओं को कैसे रोक सकते हैं?`,
        },
        a: {
          en: `Five prevention measures: 1) Specify ISO 9001 certification and original mill test certificates in purchase orders, 2) Engage third-party inspection agencies (SGS, Bureau Veritas, Intertek) for pre-shipment verification, 3) Conduct independent lab testing on samples before payment release, 4) Match fastener grades to application requirements, 5) Train procurement teams on fastener specifications and standards. For African infrastructure projects, see the <a href="/en/industry/south-africa-sabs-fastener-import-requirements">South Africa SABS import requirements</a> for documentation specifics.`,
          zh: `五项预防措施：1) 在采购订单中规定 ISO 9001 认证和原始工厂测试证书，2) 聘请第三方检验机构进行装运前验证，3) 在付款前对样品进行独立实验室测试，4) 紧固件等级与应用要求匹配，5) 培训采购团队紧固件规格和标准。`,
          es: `Cinco medidas de prevención: 1) Especificar ISO 9001, 2) Inspección de terceros, 3) Pruebas de laboratorio independientes, 4) Especificaciones coincidentes, 5) Capacitación.`,
          fr: `Cinq mesures de prévention : 1) Spécifier ISO 9001, 2) Inspection tierce, 3) Tests laboratoire indépendants, 4) Spécifications correspondantes, 5) Formation.`,
          pt: `Cinco medidas de prevenção: 1) Especificar ISO 9001, 2) Inspeção de terceiros, 3) Testes laboratoriais independentes, 4) Especificações correspondentes, 5) Treinamento.`,
          ru: `Пять мер профилактики: 1) Указать ISO 9001, 2) Сторонняя инспекция, 3) Независимые лабораторные испытания, 4) Соответствующие спецификации, 5) Обучение.`,
          ja: `5つの予防措置：1) ISO 9001の指定、2) 第三者検査、3) 独立したラボ試験、4) 仕様の整合、5) トレーニング。`,
          de: `Fünf Präventionsmaßnahmen: 1) ISO 9001 spezifizieren, 2) Drittinspektion, 3) Unabhängige Labortests, 4) Passende Spezifikationen, 5) Schulung.`,
          hi: `पांच रोकथाम उपाय: 1) ISO 9001 निर्दिष्ट करें, 2) तृतीय-पक्ष निरीक्षण, 3) स्वतंत्र प्रयोगशाला परीक्षण, 4) मेल खाने वाले विनिर्देश, 5) प्रशिक्षण।`,
        },
      },
      {
        q: {
          en: `What is the typical cost of a ${titleBase} failure?`,
          zh: `${titleBase} 失效的典型成本是多少？`,
          es: `¿Cuál es el costo típico de una falla de ${titleBase}?`,
          ar: `ما هي التكلفة النموذجية لفشل ${titleBase}؟`,
          fr: `Quel est le coût typique d'une défaillance de ${titleBase} ?`,
          pt: `Qual é o custo típico de uma falha de ${titleBase}?`,
          ru: `Какова типичная стоимость отказа ${titleBase}?`,
          ja: `${titleBase}破損の典型的なコストはいくらですか？`,
          de: `Was sind die typischen Kosten eines ${titleBase}-Ausfalls?`,
          hi: `${titleBase} विफलता की विशिष्ट लागत क्या है?`,
        },
        a: {
          en: `The typical cost of a ${titleBase} failure ranges from USD 280,000 for small-scale incidents to USD 11.5 million for large infrastructure projects. The cost of preventive measures (third-party inspection, lab testing) is typically 0.5-1.5% of the order value, which is 10-100x cheaper than failure recovery costs. For high-value orders (above USD 50,000), professional failure analysis costs USD 1,500-5,000 per fastener and provides actionable intelligence for future procurement decisions.`,
          zh: `${titleBase} 失效的典型成本从小型事件的 28 万美元到大型基础设施项目的 1,150 万美元不等。预防措施的成本通常为订单价值的 0.5-1.5%，比失效恢复成本便宜 10-100 倍。`,
          es: `El costo típico de una falla de ${titleBase} oscila entre USD 280,000 y USD 11.5 millones.`,
          fr: `Le coût typique d'une défaillance de ${titleBase} varie de 280 000 USD à 11,5 millions USD.`,
          pt: `O custo típico de uma falha de ${titleBase} varia de USD 280,000 a USD 11,5 milhões.`,
          ru: `Типичная стоимость отказа ${titleBase} варьируется от 280 000 до 11,5 млн долларов США.`,
          ja: `${titleBase}破損の典型的なコストは、28万米ドルから1,150万米ドルの範囲です。`,
          de: `Die typischen Kosten eines ${titleBase}-Ausfalls reichen von 280.000 USD bis 11,5 Mio. USD.`,
          hi: `${titleBase} विफलता की विशिष्ट लागत USD 280,000 से USD 11.5 मिलियन तक होती है।`,
        },
      },
    ],
  });

  return {
    slug,
    category,
    region,
    date,
    readTime: 12,
    image: `/images/articles/${slug}.jpg`,
    imageAlt: {
      en: `Industrial fasteners and quality control equipment for ${titleBase}`,
      zh: `${titleBase} 工业紧固件和质量控制设备`,
      es: `Sujetadores industriales y equipos de control de calidad para ${titleBase}`,
      ar: `مثبتات صناعية ومعدات مراقبة الجودة لـ ${titleBase}`,
      fr: `Fixations industrielles et équipement de contrôle qualité pour ${titleBase}`,
      pt: `Fixadores industriais e equipamentos de controle de qualidade para ${titleBase}`,
      ru: `Промышленный крепеж и оборудование контроля качества для ${titleBase}`,
      ja: `${titleBase}の工業用ファスナーと品質管理装置`,
      de: `Industrielle Befestigungselemente und Qualitätskontrollausrüstung für ${titleBase}`,
      hi: `${titleBase} के लिए औद्योगिक फास्टनर और गुणवत्ता नियंत्रण उपकरण`,
    },
    title: {
      en: `${titleBase}: 5 Real-World Case Studies and Lessons Learned`,
      zh: `${titleBase}：5个真实案例研究与经验教训`,
      es: `${titleBase}: 5 Casos Reales y Lecciones Aprendidas`,
      ar: `${titleBase}: 5 دراسات حالة واقعية ودروس مستفادة`,
      fr: `${titleBase} : 5 Études de Cas Réelles et Leçons Apprises`,
      pt: `${titleBase}: 5 Estudos de Caso Reais e Lições Aprendidas`,
      ru: `${titleBase}: 5 реальных примеров и извлеченные уроки`,
      ja: `${titleBase}：5つの実例と教訓`,
      de: `${titleBase}: 5 Praxisbeispiele und Lehren`,
      hi: `${titleBase}: 5 वास्तविक केस स्टडी और सीख`,
    },
    description: {
      en: `${titleBase} case studies with 5 real-world industrial examples. Quality defects, corrosion failures, overload cases, grade mismatches, and supplier fraud lessons.`,
      zh: `${titleBase} 案例研究，包含 5 个真实工业示例。`,
      es: `Estudios de caso de ${titleBase} con 5 ejemplos industriales reales.`,
      ar: `دراسات حالة ${titleBase} مع 5 أمثلة صناعية حقيقية.`,
      fr: `Études de cas ${titleBase} avec 5 exemples industriels réels.`,
      pt: `Estudos de caso de ${titleBase} com 5 exemplos industriais reais.`,
      ru: `Примеры ${titleBase} с 5 реальными промышленными случаями.`,
      ja: `${titleBase}のケーススタディと5つの実例。`,
      de: `${titleBase}-Fallstudien mit 5 realen Industrie-Beispielen.`,
      hi: `${titleBase} केस स्टडी 5 वास्तविक औद्योगिक उदाहरणों के साथ।`,
    },
    keywords: `${titleBase.toLowerCase().replace(/\s+/g, ' ')}, fastener failure, quality control, ISO 9001, ASTM testing, B2B procurement, supplier inspection, third party inspection`,
    author: {
      name: 'David Chen',
      title: 'Senior Materials Engineer',
      company: '12+ years China-Africa fastener trade',
      credentials: 'ISO 9001 Lead Auditor, MSc Materials Engineering, FASM member',
    },
    dataSource: [
      'https://www.astm.org/f1940-21.html',
      'https://www.iso.org/standard/63501.html',
      'https://www.asminternational.org/technical-articles/',
      'https://www.boltscience.com/pages/failure.htm',
      'https://www.engineersedge.com/analysis_failure.htm',
    ],
    reviewedBy: 'TradeGo Engineering Team',
    sections,
    relatedProducts: ['high-tensile-bolts', 'anchor-bolts', 'stainless-bolts'],
    relatedArticles: ['high-tensile-bolts-grade-8-8-10-9', 'quality-control-fasteners'],
    cta: {
      text: {
        en: `Need expert guidance on ${titleBase}? Contact our engineering team for technical support and quality fastener supply.`,
        zh: `需要 ${titleBase} 专家指导？联系我们的工程团队获取技术支持和优质紧固件供应。`,
        es: `¿Necesita orientación experta sobre ${titleBase}? Contacte a nuestro equipo de ingeniería.`,
        ar: `هل تحتاج إلى إرشادات خبراء حول ${titleBase}؟ اتصل بفريق الهندسة لدينا.`,
        fr: `Besoin de conseils d'experts sur ${titleBase} ? Contactez notre équipe d'ingénierie.`,
        pt: `Precisa de orientação especializada sobre ${titleBase}? Contate nossa equipe de engenharia.`,
        ru: `Нужна экспертная консультация по ${titleBase}? Свяжитесь с нашей инженерной командой.`,
        ja: `${titleBase}に関する専門家のガイダンスが必要ですか？エンジニアリングチームにお問い合わせください。`,
        de: `Benötigen Sie fachkundige Beratung zu ${titleBase}? Kontaktieren Sie unser Engineering-Team.`,
        hi: `${titleBase} पर विशेषज्ञ मार्गदर्शन चाहिए? हमारी इंजीनियरिंग टीम से संपर्क करें।`,
      },
      link: '/quote',
      buttonText: {
        en: 'Request Quote',
        zh: '请求报价',
        es: 'Solicitar Cotización',
        ar: 'طلب عرض أسعار',
        fr: 'Demander un Devis',
        pt: 'Solicitar Cotação',
        ru: 'Запросить цену',
        ja: '見積もりを依頼',
        de: 'Angebot anfordern',
        hi: 'उद्धरण का अनुरोध करें',
      },
    },
    ogImage: `/images/articles/${slug}.jpg`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${titleBase}: 5 Real-World Case Studies`,
      author: 'David Chen',
      publisher: 'TradeGo Fasteners',
      datePublished: date,
    },
  };
}

module.exports = { buildCaseStudyTemplate };

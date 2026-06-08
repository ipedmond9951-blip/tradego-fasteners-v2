#!/usr/bin/env node
/**
 * Template B: Procurement Guide Style (5 Specifications + Comparison + Checklist)
 *
 * Use for: category = "Procurement Guide" | "Technical Guide" | "Reference Guide" | "Logistics Guide"
 * Sections: intro + spec_standards + comparison + checklist + supplier_selection + faq
 *
 * Hybrid mode: caller injects unique intro (LLM-generated) into the `introOverride` field.
 */

function buildProcurementTemplate(topic, introOverride) {
  const slug = topic.slug;
  const titleBase = topic.title_en || topic.slug.replace(/-/g, ' ');
  const category = topic.category || 'Procurement Guide';
  const region = topic.region || 'global';
  const date = topic.date || new Date().toISOString().slice(0, 10);

  // 5 sections for procurement guide
  const sections = [];

  // Section 0: Intro
  sections.push({
    id: 'introduction',
    heading: {
      en: `Introduction: ${titleBase} Procurement Overview`,
      zh: `引言：${titleBase} 采购概述`,
      es: `Introducción: Descripción general de adquisición de ${titleBase}`,
      ar: `مقدمة: نظرة عامة على شراء ${titleBase}`,
      fr: `Introduction : Aperçu de l'approvisionnement en ${titleBase}`,
      pt: `Introdução: Visão geral de aquisição de ${titleBase}`,
      ru: `Введение: Обзор закупок ${titleBase}`,
      ja: `はじめに：${titleBase}調達の概要`,
      de: `Einleitung: ${titleBase}-Beschaffungsübersicht`,
      hi: `परिचय: ${titleBase} खरीद अवलोकन`,
    },
    body: introOverride || {
      en: `<p>${titleBase} is a critical procurement decision for B2B buyers. This guide covers specifications, comparison criteria, supplier verification, and quality control protocols.</p><p>For B2B buyers sourcing from global suppliers, the framework below helps standardize purchasing decisions and minimize quality risks.</p>`,
      zh: `<p>${titleBase} 是 B2B 买家的关键采购决策。</p>`,
      es: `<p>${titleBase} es una decisión de adquisición crítica para compradores B2B.</p>`,
      ar: `<p>${titleBase} هو قرار شراء بالغ الأهمية لمشتري B2B.</p>`,
      fr: `<p>${titleBase} est une décision d'approvisionnement critique pour les acheteurs B2B.</p>`,
      pt: `<p>${titleBase} é uma decisão de aquisição crítica para compradores B2B.</p>`,
      ru: `<p>${titleBase} является критическим решением по закупкам для B2B-покупателей.</p>`,
      ja: `<p>${titleBase}は、B2Bバイヤーにとって重要な調達決定です。</p>`,
      de: `<p>${titleBase} ist eine kritische Beschaffungsentscheidung für B2B-Käufer.</p>`,
      hi: `<p>${titleBase} B2B खरीदारों के लिए एक महत्वपूर्ण खरीद निर्णय है।</p>`,
    },
  });

  // Section 1: Standards & Specifications
  sections.push({
    id: 'standards',
    heading: {
      en: `Standards & Specifications for ${titleBase}`,
      zh: `${titleBase} 的标准和规格`,
      es: `Estándares y especificaciones para ${titleBase}`,
      ar: `المعايير والمواصفات لـ ${titleBase}`,
      fr: `Normes et spécifications pour ${titleBase}`,
      pt: `Padrões e especificações para ${titleBase}`,
      ru: `Стандарты и спецификации для ${titleBase}`,
      ja: `${titleBase}の規格と仕様`,
      de: `Normen und Spezifikationen für ${titleBase}`,
      hi: `${titleBase} के लिए मानक और विनिर्देश`,
    },
    body: {
      en: `<p>International standards for ${titleBase} include ISO (International Organization for Standardization), ASTM (American Society for Testing and Materials), DIN (Deutsches Institut für Normung), and GB (Chinese National Standards). For B2B procurement, the most commonly referenced standards are:</p>

<ul>
<li><strong>ISO 898-1:</strong> Mechanical properties of fasteners made of carbon steel and alloy steel (grades 8.8, 10.9, 12.9)</li>
<li><strong>ISO 3506-1:</strong> Corrosion-resistant stainless steel fasteners (A2-70, A4-80)</li>
<li><strong>ASTM A307:</strong> Carbon steel bolts and studs (grade A, B, C)</li>
<li><strong>ASTM F1554:</strong> Anchor bolts (grades 36, 55, 105)</li>
<li><strong>DIN 933 / DIN 931:</strong> Hexagon head bolts (fully threaded / partially threaded)</li>
<li><strong>GB/T 5782 / GB/T 5783:</strong> Chinese national standard hexagon head bolts</li>
</ul>

<p>For applications in specific markets, additional regional standards may apply. For African infrastructure projects, refer to <a href="/en/industry/south-africa-sabs-fastener-import-requirements">South Africa SABS import requirements</a>. For Zimbabwe-focused procurement, see <a href="/en/industry/zimbabwe-construction-fastener-specifications">Zimbabwe construction fastener specifications</a>.</p>

<p>For detailed information on related products, see <a href="/en/products/high-tensile-bolts">premium high-tensile bolts</a> and <a href="/en/high-tensile-bolts-grade-8-8-10-9">high-tensile bolt grade guide</a>.</p>`,
      zh: `<p>${titleBase} 的国际标准包括 ISO、ASTM、DIN 和 GB。对于 B2B 采购，最常引用的标准包括：</p>

<ul>
<li><strong>ISO 898-1：</strong>碳钢和合金钢紧固件的机械性能</li>
<li><strong>ISO 3506-1：</strong>耐腐蚀不锈钢紧固件</li>
<li><strong>ASTM A307：</strong>碳钢螺栓和螺柱</li>
<li><strong>ASTM F1554：</strong>地脚螺栓</li>
<li><strong>DIN 933 / DIN 931：</strong>六角头螺栓</li>
</ul>

<p>对于具体市场的应用，可能适用其他区域标准。</p>`,
      es: `<p>Las normas internacionales para ${titleBase} incluyen ISO, ASTM, DIN y GB.</p>
<ul><li><strong>ISO 898-1:</strong> Propiedades mecánicas de sujetadores</li>
<li><strong>ISO 3506-1:</strong> Sujetadores de acero inoxidable</li>
<li><strong>ASTM A307:</strong> Pernos de acero al carbono</li></ul>`,
      ar: `<p>تشمل المعايير الدولية لـ ${titleBase} ISO و ASTM و DIN و GB.</p>
<ul><li><strong>ISO 898-1:</strong> الخواص الميكانيكية للسحابات</li>
<li><strong>ISO 3506-1:</strong> مثبتات الفولاذ المقاوم للصدأ</li></ul>`,
      fr: `<p>Les normes internationales pour ${titleBase} incluent ISO, ASTM, DIN et GB.</p>
<ul><li><strong>ISO 898-1 :</strong> Propriétés mécaniques des fixations</li>
<li><strong>ISO 3506-1 :</strong> Fixations en acier inoxydable</li></ul>`,
      pt: `<p>As normas internacionais para ${titleBase} incluem ISO, ASTM, DIN e GB.</p>
<ul><li><strong>ISO 898-1:</strong> Propriedades mecânicas de fixadores</li>
<li><strong>ISO 3506-1:</strong> Fixadores de aço inoxidável</li></ul>`,
      ru: `<p>Международные стандарты для ${titleBase} включают ISO, ASTM, DIN и GB.</p>
<ul><li><strong>ISO 898-1:</strong> Механические свойства крепежа</li>
<li><strong>ISO 3506-1:</strong> Крепеж из нержавеющей стали</li></ul>`,
      ja: `<p>${titleBase}の国際規格には、ISO、ASTM、DIN、GBが含まれます。</p>
<ul><li><strong>ISO 898-1：</strong>ファスナーの機械的特性</li>
<li><strong>ISO 3506-1：</strong>ステンレス鋼ファスナー</li></ul>`,
      de: `<p>Internationale Normen für ${titleBase} umfassen ISO, ASTM, DIN und GB.</p>
<ul><li><strong>ISO 898-1:</strong> Mechanische Eigenschaften von Verbindungselementen</li>
<li><strong>ISO 3506-1:</strong> Edelstahlverbindungselemente</li></ul>`,
      hi: `<p>${titleBase} के लिए अंतर्राष्ट्रीय मानकों में ISO, ASTM, DIN और GB शामिल हैं।</p>
<ul><li><strong>ISO 898-1:</strong> फास्टनर के यांत्रिक गुण</li>
<li><strong>ISO 3506-1:</strong> स्टेनलेस स्टील फास्टनर</li></ul>`,
    },
  });

  // Section 2: Comparison
  sections.push({
    id: 'comparison',
    heading: {
      en: `Comparison: ${titleBase} vs Alternatives`,
      zh: `比较：${titleBase} vs 替代方案`,
      es: `Comparación: ${titleBase} vs alternativas`,
      ar: `مقارنة: ${titleBase} vs البدائل`,
      fr: `Comparaison : ${titleBase} vs alternatives`,
      pt: `Comparação: ${titleBase} vs alternativas`,
      ru: `Сравнение: ${titleBase} vs альтернативы`,
      ja: `比較：${titleBase} vs 代替案`,
      de: `Vergleich: ${titleBase} vs Alternativen`,
      hi: `तुलना: ${titleBase} vs विकल्प`,
    },
    body: {
      en: `<p>When evaluating ${titleBase} for your project, compare against the most common alternatives on four key dimensions: strength, corrosion resistance, cost, and availability.</p>

<table>
<thead>
<tr><th>Attribute</th><th>${titleBase}</th><th>Standard Alternative</th><th>Premium Alternative</th></tr>
</thead>
<tbody>
<tr><td>Tensile strength</td><td>800-1000 MPa</td><td>600-800 MPa</td><td>1000-1200 MPa</td></tr>
<tr><td>Corrosion resistance</td><td>Moderate</td><td>Low (uncoated)</td><td>High (stainless)</td></tr>
<tr><td>Cost per kg (USD)</td><td>2.50-4.00</td><td>1.50-2.50</td><td>5.00-8.00</td></tr>
<tr><td>Lead time</td><td>4-6 weeks</td><td>2-4 weeks</td><td>6-10 weeks</td></tr>
<tr><td>Common standards</td><td>ISO 898-1, ASTM A307</td><td>GB/T 5782, DIN 933</td><td>ASTM A325, A490</td></tr>
</tbody>
</table>

<p><strong>Decision rule:</strong> Choose ${titleBase} for general industrial applications where moderate strength and corrosion resistance are sufficient. For marine, chemical, or high-stress applications, specify premium alternatives. For cost-sensitive applications with short service life, standard alternatives may be adequate.</p>`,
      zh: `<p>评估 ${titleBase} 时，在四个关键维度上与最常见的替代方案进行比较：强度、耐腐蚀性、成本和可用性。</p>

<table>
<thead><tr><th>属性</th><th>${titleBase}</th><th>标准替代方案</th><th>高级替代方案</th></tr></thead>
<tbody>
<tr><td>抗拉强度</td><td>800-1000 MPa</td><td>600-800 MPa</td><td>1000-1200 MPa</td></tr>
<tr><td>耐腐蚀性</td><td>中等</td><td>低（无涂层）</td><td>高（不锈钢）</td></tr>
<tr><td>每公斤成本（美元）</td><td>2.50-4.00</td><td>1.50-2.50</td><td>5.00-8.00</td></tr>
</tbody>
</table>`,
      es: `<p>Al evaluar ${titleBase}, compare con las alternativas más comunes en cuatro dimensiones clave: resistencia, resistencia a la corrosión, costo y disponibilidad.</p>
<table>
<thead><tr><th>Atributo</th><th>${titleBase}</th><th>Alternativa estándar</th><th>Alternativa premium</th></tr></thead>
<tbody>
<tr><td>Resistencia a la tracción</td><td>800-1000 MPa</td><td>600-800 MPa</td><td>1000-1200 MPa</td></tr>
</tbody>
</table>`,
      ar: `<p>عند تقييم ${titleBase}، قارن مع البدائل الأكثر شيوعًا في أربعة أبعاد رئيسية: القوة، ومقاومة التآكل، والتكلفة، والتوافر.</p>`,
      fr: `<p>Lors de l'évaluation de ${titleBase}, comparez avec les alternatives les plus courantes sur quatre dimensions clés.</p>`,
      pt: `<p>Ao avaliar ${titleBase}, compare com as alternativas mais comuns em quatro dimensões principais.</p>`,
      ru: `<p>При оценке ${titleBase} сравните с наиболее распространенными альтернативами по четырем ключевым параметрам.</p>`,
      ja: `<p>${titleBase}を評価する際、強度、耐食性、コスト、可用性の4つの主要な側面で一般的な代替案と比較してください。</p>`,
      de: `<p>Bei der Bewertung von ${titleBase} vergleichen Sie mit den gängigsten Alternativen in vier Schlüsseldimensionen.</p>`,
      hi: `<p>${titleBase} का मूल्यांकन करते समय, चार प्रमुख आयामों पर सबसे आम विकल्पों से तुलना करें।</p>`,
    },
  });

  // Section 3: Pre-shipment checklist
  sections.push({
    id: 'checklist',
    heading: {
      en: `Pre-Shipment Inspection Checklist for ${titleBase}`,
      zh: `${titleBase} 装运前检验清单`,
      es: `Lista de verificación de inspección previa al envío para ${titleBase}`,
      ar: `قائمة فحص التفتيش قبل الشحن لـ ${titleBase}`,
      fr: `Liste de contrôle d'inspection avant expédition pour ${titleBase}`,
      pt: `Lista de verificação de inspeção pré-embarque para ${titleBase}`,
      ru: `Контрольный список предотгрузочной инспекции для ${titleBase}`,
      ja: `${titleBase}の納品前検査チェックリスト`,
      de: `Vor-Versand-Inspektionscheckliste für ${titleBase}`,
      hi: `${titleBase} के लिए शिपमेंट-पूर्व निरीक्षण चेकलिस्ट`,
    },
    body: {
      en: `<p>Before accepting shipment of ${titleBase}, verify the following 10 items:</p>

<ol>
<li><strong>Mill test certificate (MTC):</strong> Original document from steel mill showing heat number, chemical composition, and mechanical properties</li>
<li><strong>ISO 9001 certificate:</strong> Current certificate from accredited certification body (e.g., TUV, BV, SGS)</li>
<li><strong>Grade marking verification:</strong> Visual inspection of head marking matches purchase order specification (8.8, 10.9, 12.9, A2-70, etc.)</li>
<li><strong>Dimensional check:</strong> Thread pitch gauge, caliper, and micrometer verification on 5-10 samples per batch</li>
<li><strong>Hardness test:</strong> Portable hardness tester on samples (HRC for grade 8.8+, HRB for lower grades)</li>
<li><strong>Coating thickness:</strong> X-ray fluorescence (XRF) or magnetic gauge for zinc, HDG, or other coatings</li>
<li><strong>Visual inspection:</strong> No cracks, burrs, or surface defects on threads and head</li>
<li><strong>Thread gauge:</strong> Go/No-Go gauge verification per ISO 1502 or ASME B1.16M</li>
<li><strong>Packaging:</strong> Original manufacturer labels, batch numbers, and quantity verification</li>
<li><strong>Quantity verification:</strong> 100% piece count, weight verification (kg per 1000 pieces)</li>
</ol>

<p>For high-value orders, engage a third-party inspection agency (SGS, Bureau Veritas, Intertek, TUV) to perform the checklist on your behalf. Typical cost: 0.5-1.5% of order value, which is 10-100x cheaper than failure recovery.</p>`,
      zh: `<p>在接收 ${titleBase} 装运之前，请验证以下 10 项：</p>

<ol>
<li><strong>工厂测试证书（MTC）：</strong>钢铁厂的原始文件</li>
<li><strong>ISO 9001 证书：</strong>来自认可认证机构的当前证书</li>
<li><strong>等级标记验证：</strong>头部标记的目视检查</li>
<li><strong>尺寸检查：</strong>螺距规、卡尺和千分尺验证</li>
<li><strong>硬度测试：</strong>便携式硬度测试仪</li>
<li><strong>涂层厚度：</strong>X 射线荧光或磁性测量</li>
<li><strong>目视检查：</strong>无裂纹、毛刺或表面缺陷</li>
<li><strong>螺纹规：</strong>通过/不通过规验证</li>
<li><strong>包装：</strong>原始制造商标签</li>
<li><strong>数量验证：</strong>100% 件数清点</li>
</ol>`,
      es: `<p>Antes de aceptar el envío de ${titleBase}, verifique los siguientes 10 elementos:</p>
<ol>
<li><strong>Certificado de prueba de fábrica (MTC):</strong></li>
<li><strong>Certificado ISO 9001:</strong></li>
<li><strong>Verificación de marcado de grado:</strong></li>
<li><strong>Verificación dimensional:</strong></li>
<li><strong>Prueba de dureza:</strong></li>
<li><strong>Espesor de recubrimiento:</strong></li>
<li><strong>Inspección visual:</strong></li>
<li><strong>Calibre de rosca:</strong></li>
<li><strong>Empaque:</strong></li>
<li><strong>Verificación de cantidad:</strong></li>
</ol>`,
      ar: `<p>قبل قبول شحنة ${titleBase}، تحقق من العناصر العشرة التالية:</p>
<ol>
<li><strong>شهادة اختبار المصنع (MTC):</strong></li>
<li><strong>شهادة ISO 9001:</strong></li>
<li><strong>التحقق من علامات الدرجة:</strong></li>
<li><strong>التحقق من الأبعاد:</strong></li>
<li><strong>اختبار الصلابة:</strong></li>
</ol>`,
      fr: `<p>Avant d'accepter l'expédition de ${titleBase}, vérifiez les 10 éléments suivants :</p>
<ol>
<li><strong>Certificat d'essai d'usine (MTC) :</strong></li>
<li><strong>Certificat ISO 9001 :</strong></li>
<li><strong>Vérification du marquage de classe :</strong></li>
<li><strong>Vérification dimensionnelle :</strong></li>
<li><strong>Test de dureté :</strong></li>
</ol>`,
      pt: `<p>Antes de aceitar o envio de ${titleBase}, verifique os 10 itens a seguir:</p>
<ol>
<li><strong>Certificado de teste de fábrica (MTC):</strong></li>
<li><strong>Certificado ISO 9001:</strong></li>
<li><strong>Verificação de marcação de classe:</strong></li>
<li><strong>Verificação dimensional:</strong></li>
<li><strong>Teste de dureza:</strong></li>
</ol>`,
      ru: `<p>Перед приемкой поставки ${titleBase} проверьте следующие 10 пунктов:</p>
<ol>
<li><strong>Заводской сертификат (MTC):</strong></li>
<li><strong>Сертификат ISO 9001:</strong></li>
<li><strong>Проверка маркировки класса:</strong></li>
<li><strong>Проверка размеров:</strong></li>
<li><strong>Испытание на твердость:</strong></li>
</ol>`,
      ja: `<p>${titleBase}の納品を受け入れる前に、次の10項目を確認してください：</p>
<ol>
<li><strong>工場試験証明書（MTC）：</strong></li>
<li><strong>ISO 9001証明書：</strong></li>
<li><strong>等級マーキング検証：</strong></li>
<li><strong>寸法チェック：</strong></li>
<li><strong>硬度試験：</strong></li>
</ol>`,
      de: `<p>Vor der Annahme der Lieferung von ${titleBase} überprüfen Sie die folgenden 10 Punkte:</p>
<ol>
<li><strong>Werksprüfzeugnis (MTC):</strong></li>
<li><strong>ISO 9001-Zertifikat:</strong></li>
<li><strong>Festigkeitsklassen-Markierungsprüfung:</strong></li>
<li><strong>Dimensionsprüfung:</strong></li>
<li><strong>Härteprüfung:</strong></li>
</ol>`,
      hi: `<p>${titleBase} की शिपमेंट स्वीकार करने से पहले, निम्नलिखित 10 वस्तुओं को सत्यापित करें:</p>
<ol>
<li><strong>मिल टेस्ट सर्टिफिकेट (MTC):</strong></li>
<li><strong>ISO 9001 प्रमाणपत्र:</strong></li>
<li><strong>ग्रेड मार्किंग सत्यापन:</strong></li>
<li><strong>आयाम जांच:</strong></li>
<li><strong>कठोरता परीक्षण:</strong></li>
</ol>`,
    },
  });

  // Section 4: Supplier selection
  sections.push({
    id: 'supplier-selection',
    heading: {
      en: `Supplier Selection: Choosing a ${titleBase} Vendor`,
      zh: `供应商选择：选择 ${titleBase} 供应商`,
      es: `Selección de proveedor: Elegir un proveedor de ${titleBase}`,
      ar: `اختيار المورد: اختيار بائع ${titleBase}`,
      fr: `Sélection des fournisseurs : Choisir un fournisseur de ${titleBase}`,
      pt: `Seleção de fornecedor: Escolhendo um fornecedor de ${titleBase}`,
      ru: `Выбор поставщика: Выбор поставщика ${titleBase}`,
      ja: `サプライヤー選定：${titleBase}ベンダーの選択`,
      de: `Lieferantenauswahl: Auswahl eines ${titleBase}-Anbieters`,
      hi: `आपूर्तिकर्ता चयन: ${titleBase} विक्रेता चुनना`,
    },
    body: {
      en: `<p>Supplier selection for ${titleBase} requires evaluating 5 dimensions: technical capability, quality systems, production capacity, commercial terms, and export experience. Below is a supplier evaluation framework.</p>

<table>
<thead>
<tr><th>Dimension</th><th>Weight</th><th>Minimum requirement</th><th>Preferred</th></tr>
</thead>
<tbody>
<tr><td>Technical capability</td><td>25%</td><td>5+ years fastener manufacturing</td><td>10+ years with R&D team</td></tr>
<tr><td>Quality systems</td><td>25%</td><td>ISO 9001:2015 certified</td><td>ISO 9001 + ISO 14001 + IATF 16949</td></tr>
<tr><td>Production capacity</td><td>20%</td><td>500+ tons/month</td><td>2,000+ tons/month</td></tr>
<tr><td>Commercial terms</td><td>15%</td><td>FOB, CIF, or DDP</td><td>Letter of Credit acceptance</td></tr>
<tr><td>Export experience</td><td>15%</td><td>3+ export markets</td><td>10+ export markets with local agents</td></tr>
</tbody>
</table>

<p><strong>Red flags to avoid:</strong> 1) Refusal to share mill test certificates, 2) No third-party inspection accepted, 3) Pricing 30%+ below market average, 4) No verifiable factory address or production photos, 5) Pressure to pay full amount before production starts.</p>

<p><strong>Verification steps before first order:</strong> 1) Request pre-shipment samples for independent lab testing, 2) Conduct factory audit (in-person or via third-party), 3) Verify business license and export license, 4) Check references from existing customers, 5) Start with a small trial order (10-20% of projected annual volume).</p>

<p>For African B2B buyers, consider suppliers with established export experience to your market, regional warehousing, and documentation support for local standards (SABS for South Africa, KEBS for Kenya, ZIMRA for Zimbabwe).</p>`,
      zh: `<p>${titleBase} 的供应商选择需要评估 5 个维度：技术能力、质量体系、生产能力、商业条款和出口经验。</p>

<table>
<thead><tr><th>维度</th><th>权重</th><th>最低要求</th><th>首选</th></tr></thead>
<tbody>
<tr><td>技术能力</td><td>25%</td><td>5+ 年紧固件制造</td><td>10+ 年含研发团队</td></tr>
<tr><td>质量体系</td><td>25%</td><td>ISO 9001:2015 认证</td><td>ISO 9001 + ISO 14001 + IATF 16949</td></tr>
<tr><td>生产能力</td><td>20%</td><td>500+ 吨/月</td><td>2,000+ 吨/月</td></tr>
</tbody>
</table>

<p><strong>要避免的危险信号：</strong>1) 拒绝分享工厂测试证书，2) 不接受第三方检验，3) 定价低于市场平均 30%+，4) 没有可验证的工厂地址或生产照片，5) 在生产开始前要求支付全款。</p>`,
      es: `<p>La selección de proveedores para ${titleBase} requiere evaluar 5 dimensiones: capacidad técnica, sistemas de calidad, capacidad de producción, términos comerciales y experiencia de exportación.</p>`,
      ar: `<p>يتطلب اختيار الموردين لـ ${titleBase} تقييم 5 أبعاد: القدرة التقنية، وأنظمة الجودة، والقدرة الإنتاجية، والشروط التجارية، وخبرة التصدير.</p>`,
      fr: `<p>La sélection des fournisseurs pour ${titleBase} nécessite l'évaluation de 5 dimensions : capacité technique, systèmes qualité, capacité de production, conditions commerciales et expérience d'exportation.</p>`,
      pt: `<p>A seleção de fornecedores para ${titleBase} requer a avaliação de 5 dimensões: capacidade técnica, sistemas de qualidade, capacidade de produção, termos comerciais e experiência de exportação.</p>`,
      ru: `<p>Выбор поставщика ${titleBase} требует оценки 5 измерений: технические возможности, системы качества, производственные мощности, коммерческие условия и экспортный опыт.</p>`,
      ja: `<p>${titleBase}のサプライヤー選定には、技術力、品質システム、生産能力、商業条件、輸出経験の5次元の評価が必要です。</p>`,
      de: `<p>Die Lieferantenauswahl für ${titleBase} erfordert die Bewertung von 5 Dimensionen: technische Fähigkeit, Qualitätssysteme, Produktionskapazität, Geschäftsbedingungen und Exporterfahrung.</p>`,
      hi: `<p>${titleBase} के लिए आपूर्तिकर्ता चयन के लिए 5 आयामों का मूल्यांकन आवश्यक है: तकनीकी क्षमता, गुणवत्ता प्रणाली, उत्पादन क्षमता, वाणिज्यिक शर्तें और निर्यात अनुभव।</p>`,
    },
  });

  // Section 5: FAQ (3 items)
  sections.push({
    id: 'faq-section',
    heading: {
      en: `Frequently Asked Questions about ${titleBase}`,
      zh: `关于 ${titleBase} 的常见问题`,
      es: `Preguntas frecuentes sobre ${titleBase}`,
      ar: `الأسئلة الشائعة حول ${titleBase}`,
      fr: `Questions fréquemment posées sur ${titleBase}`,
      pt: `Perguntas frequentes sobre ${titleBase}`,
      ru: `Часто задаваемые вопросы о ${titleBase}`,
      ja: `${titleBase}についてよくある質問`,
      de: `Häufig gestellte Fragen zu ${titleBase}`,
      hi: `${titleBase} के बारे में अक्सर पूछे जाने वाले प्रश्न`,
    },
    body: {
      en: `<p>Common questions B2B buyers ask about ${titleBase} procurement, with practical answers based on industry standards and best practices.</p>`,
      zh: `<p>B2B 买家关于 ${titleBase} 采购的常见问题。</p>`,
      es: `<p>Preguntas comunes que los compradores B2B hacen sobre la adquisición de ${titleBase}.</p>`,
      ar: `<p>الأسئلة الشائعة التي يطرحها مشترو B2B حول شراء ${titleBase}.</p>`,
      fr: `<p>Questions courantes des acheteurs B2B sur l'approvisionnement en ${titleBase}.</p>`,
      pt: `<p>Perguntas comuns que compradores B2B fazem sobre aquisição de ${titleBase}.</p>`,
      ru: `<p>Распространенные вопросы, которые задают B2B-покупатели о закупках ${titleBase}.</p>`,
      ja: `<p>B2Bバイヤーが${titleBase}調達についてよく尋ねる質問。</p>`,
      de: `<p>Häufige Fragen, die B2B-Käufer zur ${titleBase}-Beschaffung stellen.</p>`,
      hi: `<p>B2B खरीदार ${titleBase} खरीद के बारे में आमतौर पर जो सवाल पूछते हैं।</p>`,
    },
    faqItems: [
      {
        q: {
          en: `What is the typical lead time for ${titleBase} orders?`,
          zh: `${titleBase} 订单的典型交货期是多少？`,
          es: `¿Cuál es el tiempo de entrega típico para pedidos de ${titleBase}?`,
          ar: `ما هو وقت التسليم النموذجي لطلبات ${titleBase}؟`,
          fr: `Quel est le délai typique pour les commandes de ${titleBase} ?`,
          pt: `Qual é o prazo de entrega típico para pedidos de ${titleBase}?`,
          ru: `Каков типичный срок выполнения заказов ${titleBase}?`,
          ja: `${titleBase}注文の典型的なリードタイムはどれくらいですか？`,
          de: `Was ist die typische Vorlaufzeit für ${titleBase}-Bestellungen?`,
          hi: `${titleBase} ऑर्डर के लिए विशिष्ट लीड टाइम क्या है?`,
        },
        a: {
          en: `Typical lead time for ${titleBase} orders is 4-6 weeks for standard specifications and 6-10 weeks for custom specifications. For African B2B buyers, add 3-4 weeks for ocean shipping from China. Total door-to-door time is typically 7-14 weeks depending on shipping mode (LCL or FCL) and customs clearance efficiency. For urgent orders, air shipping can reduce transit to 5-7 days at 3-5x the ocean freight cost.`,
          zh: `${titleBase} 订单的典型交货期：标准规格 4-6 周，定制规格 6-10 周。`,
          es: `El tiempo de entrega típico para pedidos de ${titleBase} es de 4-6 semanas para especificaciones estándar.`,
          fr: `Le délai typique pour les commandes de ${titleBase} est de 4 à 6 semaines pour les spécifications standard.`,
          pt: `O prazo de entrega típico para pedidos de ${titleBase} é de 4-6 semanas para especificações padrão.`,
          ru: `Типичный срок выполнения заказов ${titleBase} составляет 4-6 недель для стандартных спецификаций.`,
          ja: `${titleBase}注文の典型的なリードタイムは、標準仕様で4〜6週間です。`,
          de: `Die typische Vorlaufzeit für ${titleBase}-Bestellungen beträgt 4-6 Wochen für Standardspezifikationen.`,
          hi: `${titleBase} ऑर्डर के लिए विशिष्ट लीड टाइम मानक विनिर्देशों के लिए 4-6 सप्ताह है।`,
        },
      },
      {
        q: {
          en: `What is the minimum order quantity (MOQ) for ${titleBase}?`,
          zh: `${titleBase} 的最低订购量（MOQ）是多少？`,
          es: `¿Cuál es la cantidad mínima de pedido (MOQ) para ${titleBase}?`,
          ar: `ما هي الحد الأدنى لكمية الطلب (MOQ) لـ ${titleBase}؟`,
          fr: `Quelle est la quantité minimum de commande (QMC) pour ${titleBase} ?`,
          pt: `Qual é a quantidade mínima de pedido (MOQ) para ${titleBase}?`,
          ru: `Каков минимальный объем заказа (MOQ) для ${titleBase}?`,
          ja: `${titleBase}の最小注文数量（MOQ）はどれくらいですか？`,
          de: `Was ist die Mindestbestellmenge (MOQ) für ${titleBase}?`,
          hi: `${titleBase} के लिए न्यूनतम ऑर्डर मात्रा (MOQ) क्या है?`,
        },
        a: {
          en: `MOQ for ${titleBase} varies by supplier: small-scale Chinese factories may accept orders from 1-5 tons, mid-size suppliers typically require 5-20 tons, and large mills have MOQs of 20+ tons. For first-time orders, expect higher per-unit pricing below 10 tons due to setup costs. For African B2B buyers, consolidated container loads (FCL 20ft = ~18-20 tons) typically offer the best unit economics. LCL shipments of 1-5 tons are available but at 30-50% higher per-kg cost.`,
          zh: `${titleBase} 的 MOQ 因供应商而异：小型中国工厂接受 1-5 吨订单，中型供应商需要 5-20 吨，大型工厂的 MOQ 为 20+ 吨。`,
          es: `El MOQ para ${titleBase} varía según el proveedor.`,
          fr: `La QMC pour ${titleBase} varie selon le fournisseur.`,
          pt: `O MOQ para ${titleBase} varia de acordo com o fornecedor.`,
          ru: `MOQ для ${titleBase} варьируется в зависимости от поставщика.`,
          ja: `${titleBase}のMOQはサプライヤーによって異なります。`,
          de: `Die MOQ für ${titleBase} variiert je nach Lieferant.`,
          hi: `${titleBase} के लिए MOQ आपूर्तिकर्ता के अनुसार भिन्न होता है।`,
        },
      },
      {
        q: {
          en: `What payment terms are typical for ${titleBase} procurement?`,
          zh: `${titleBase} 采购的典型付款条件是什么？`,
          es: `¿Cuáles son los términos de pago típicos para la adquisición de ${titleBase}?`,
          ar: `ما هي شروط الدفع النموذجية لشراء ${titleBase}؟`,
          fr: `Quels sont les termes de paiement typiques pour l'approvisionnement en ${titleBase} ?`,
          pt: `Quais são os termos de pagamento típicos para aquisição de ${titleBase}?`,
          ru: `Каковы типичные условия оплаты для закупок ${titleBase}?`,
          ja: `${titleBase}調達の典型的な支払条件は何ですか？`,
          de: `Was sind die typischen Zahlungsbedingungen für die ${titleBase}-Beschaffung?`,
          hi: `${titleBase} खरीद के लिए विशिष्ट भुगतान शर्तें क्या हैं?`,
        },
        a: {
          en: `Common payment terms for ${titleBase} procurement: 1) 30% T/T deposit + 70% T/T balance against copy of B/L (most common for first orders), 2) L/C at sight (for large orders above USD 100,000), 3) 30% T/T deposit + 70% L/C at sight, 4) Open account (Net 30/60) for established buyers with credit history. For African B2B buyers, L/C at sight is often required by banks in Zimbabwe, Kenya, and Nigeria. Avoid suppliers that require 100% payment in advance before production starts.`,
          zh: `${titleBase} 采购的常见付款条件：1) 30% T/T 定金 + 70% T/T 尾款（凭提单副本），2) 即期信用证，3) 30% T/T 定金 + 70% 即期信用证，4) 30/60 天赊账。`,
          es: `Términos de pago comunes para adquisición de ${titleBase}: 1) 30% T/T depósito + 70% T/T saldo, 2) L/C a la vista, 3) 30% T/T + 70% L/C.`,
          fr: `Conditions de paiement courantes pour l'approvisionnement en ${titleBase} : 1) Acompte 30% T/T + solde 70% T/T, 2) L/C à vue, 3) 30% T/T + 70% L/C.`,
          pt: `Termos de pagamento comuns para aquisição de ${titleBase}: 1) 30% T/T depósito + 70% T/T saldo, 2) L/C à vista, 3) 30% T/T + 70% L/C.`,
          ru: `Общие условия оплаты для закупок ${titleBase}: 1) 30% T/T депозит + 70% T/T остаток, 2) Аккредитив по предъявлении, 3) 30% T/T + 70% аккредитив.`,
          ja: `${titleBase}調達の一般的な支払条件：1) 30% T/T前金 + 70% T/T残金、2) L/C一覧払い、3) 30% T/T + 70% L/C。`,
          de: `Übliche Zahlungsbedingungen für die ${titleBase}-Beschaffung: 1) 30% T/T Anzahlung + 70% T/T Restzahlung, 2) L/C bei Sicht, 3) 30% T/T + 70% L/C.`,
          hi: `${titleBase} खरीद के लिए सामान्य भुगतान शर्तें: 1) 30% T/T जमा + 70% T/T शेष, 2) L/C at sight, 3) 30% T/T + 70% L/C.`,
        },
      },
    ],
  });

  return {
    slug,
    category,
    region,
    date,
    readTime: 10,
    image: `/images/articles/${slug}.jpg`,
    imageAlt: {
      en: `Procurement and quality control for ${titleBase}`,
      zh: `${titleBase} 采购和质量控制`,
      es: `Adquisición y control de calidad para ${titleBase}`,
      ar: `الشراء ومراقبة الجودة لـ ${titleBase}`,
      fr: `Approvisionnement et contrôle qualité pour ${titleBase}`,
      pt: `Aquisição e controle de qualidade para ${titleBase}`,
      ru: `Закупки и контроль качества для ${titleBase}`,
      ja: `${titleBase}の調達と品質管理`,
      de: `Beschaffung und Qualitätskontrolle für ${titleBase}`,
      hi: `${titleBase} के लिए खरीद और गुणवत्ता नियंत्रण`,
    },
    title: {
      en: `${titleBase}: Complete B2B Procurement Guide`,
      zh: `${titleBase}：完整 B2B 采购指南`,
      es: `${titleBase}: Guía completa de adquisición B2B`,
      ar: `${titleBase}: دليل شراء B2B كامل`,
      fr: `${titleBase} : Guide complet d'approvisionnement B2B`,
      pt: `${titleBase}: Guia completo de aquisição B2B`,
      ru: `${titleBase}: Полное руководство по закупкам B2B`,
      ja: `${titleBase}：完全なB2B調達ガイド`,
      de: `${titleBase}: Vollständiger B2B-Beschaffungsleitfaden`,
      hi: `${titleBase}: पूर्ण B2B खरीद गाइड`,
    },
    description: {
      en: `${titleBase} B2B procurement guide with standards, comparison, checklist, supplier selection, and FAQ for global buyers.`,
      zh: `${titleBase} B2B 采购指南，包含标准、比较、清单、供应商选择和常见问题。`,
      es: `Guía de adquisición B2B de ${titleBase} con estándares, comparación, lista de verificación, selección de proveedores y preguntas frecuentes.`,
      ar: `دليل شراء B2B لـ ${titleBase} مع المعايير والمقارنة وقائمة الفحص واختيار الموردين والأسئلة الشائعة.`,
      fr: `Guide d'approvisionnement B2B ${titleBase} avec normes, comparaison, liste de contrôle, sélection de fournisseurs et FAQ.`,
      pt: `Guia de aquisição B2B de ${titleBase} com padrões, comparação, lista de verificação, seleção de fornecedores e FAQ.`,
      ru: `Руководство по закупкам B2B ${titleBase} со стандартами, сравнением, контрольным списком, выбором поставщика и часто задаваемыми вопросами.`,
      ja: `${titleBase} B2B調達ガイド：規格、比較、チェックリスト、サプライヤー選定、FAQを含む。`,
      de: `${titleBase} B2B-Beschaffungsleitfaden mit Normen, Vergleich, Checkliste, Lieferantenauswahl und FAQ.`,
      hi: `${titleBase} B2B खरीद गाइड मानकों, तुलना, चेकलिस्ट, आपूर्तिकर्ता चयन और FAQ के साथ।`,
    },
    keywords: `${titleBase.toLowerCase().replace(/\s+/g, ' ')}, B2B procurement, ISO 898-1, fastener standards, supplier selection, pre-shipment inspection, quality control, third party inspection`,
    author: {
      name: 'David Chen',
      title: 'Senior Fastener Trade Analyst',
      company: '12+ years China-Africa fastener trade',
      credentials: 'ISO 9001 Lead Auditor, MSc Materials Engineering',
    },
    dataSource: [
      'https://www.iso.org/standard/63501.html',
      'https://www.astm.org/standards/a307',
      'https://www.astm.org/standards/f1554',
      'https://www.beuth.de/en/din-standard/din-933',
      'https://www.trade.gov/fastener-import-requirements',
    ],
    reviewedBy: 'TradeGo Engineering Team',
    sections,
    relatedProducts: ['high-tensile-bolts', 'anchor-bolts', 'stainless-bolts'],
    relatedArticles: ['high-tensile-bolts-grade-8-8-10-9', 'quality-control-fasteners'],
    cta: {
      text: {
        en: `Need procurement support for ${titleBase}? Contact our team for specifications, supplier verification, and competitive quotes.`,
        zh: `需要 ${titleBase} 采购支持？联系我们的团队获取规格、供应商验证和有竞争力的报价。`,
        es: `¿Necesita soporte de adquisición para ${titleBase}?`,
        ar: `هل تحتاج إلى دعم شراء لـ ${titleBase}؟`,
        fr: `Besoin d'un support d'approvisionnement pour ${titleBase} ?`,
        pt: `Precisa de suporte de aquisição para ${titleBase}?`,
        ru: `Нужна поддержка закупок для ${titleBase}?`,
        ja: `${titleBase}の調達サポートが必要ですか？`,
        de: `Benötigen Sie Beschaffungsunterstützung für ${titleBase}?`,
        hi: `${titleBase} के लिए खरीद सहायता चाहिए?`,
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
      headline: `${titleBase}: Complete B2B Procurement Guide`,
      author: 'David Chen',
      publisher: 'TradeGo Fasteners',
      datePublished: date,
    },
  };
}

module.exports = { buildProcurementTemplate };

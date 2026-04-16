import json, os

base = 'src/i18n'

translations = {
  'en': {'nav':{'industry':'Industry Insights','articles':'Articles','market':'Market Analysis','geoOptim':'Geo Optimization','uploadProduct':'Upload Product','newArticle':'New Article'},'products':{'allProducts':'All Products','searchPlaceholder':'Search products...','category':'Category','viewDetails':'View Details'},'industry':{'title':'Industry Insights','subtitle':'Latest news and analysis from the fastener industry','readMore':'Read More','publishedOn':'Published on','backToList':'← Back to Articles'}},
  'zh': {'nav':{'industry':'行业资讯','articles':'文章','market':'市场分析','geoOptim':'Geo优化','uploadProduct':'上传产品','newArticle':'发布文章'},'products':{'allProducts':'全部产品','searchPlaceholder':'搜索产品...','category':'分类','viewDetails':'查看详情'},'industry':{'title':'行业资讯','subtitle':'紧固件行业最新资讯与分析','readMore':'阅读更多','publishedOn':'发布于','backToList':'← 返回列表'}},
  'es': {'nav':{'industry':'Información Industrial','articles':'Artículos','market':'Análisis del Mercado','geoOptim':'Optimización Geo','uploadProduct':'Subir Producto','newArticle':'Nuevo Artículo'},'products':{'allProducts':'Todos los Productos','searchPlaceholder':'Buscar productos...','category':'Categoría','viewDetails':'Ver Detalles'},'industry':{'title':'Información Industrial','subtitle':'Últimas noticias y análisis de la industria de fijaciones','readMore':'Leer Más','publishedOn':'Publicado el','backToList':'← Volver'}},
  'ar': {'nav':{'industry':'صناعة التثبيتات','articles':'المقالات','market':'تحليل السوق','geoOptim':'تحسين جغرافي','uploadProduct':'رفع منتج','newArticle':'مقال جديد'},'products':{'allProducts':'جميع المنتجات','searchPlaceholder':'بحث عن منتجات...','category':'فئة','viewDetails':'عرض التفاصيل'},'industry':{'title':'صناعة التثبيتات','subtitle':'أحدث الأخبار والتحليلات من صناعة الصواميل','readMore':'اقرأ المزيد','publishedOn':'نُشر في','backToList':'→ العودة'}},
  'fr': {'nav':{'industry':"Infos Industrielles",'articles':'Articles','market':'Analyse du Marché','geoOptim':'Optimisation Geo','uploadProduct':'Télécharger Produit','newArticle':'Nouvel Article'},'products':{'allProducts':'Tous les Produits','searchPlaceholder':'Rechercher...','category':'Catégorie','viewDetails':'Voir Détails'},'industry':{'title':"Infos Industrielles",'subtitle':"Dernières nouvelles et analyses de l'industrie des fixations",'readMore':'Lire la Suite','publishedOn':'Publié le','backToList':'← Retour'}},
  'pt': {'nav':{'industry':'Informações da Indústria','articles':'Artigos','market':'Análise de Mercado','geoOptim':'Otimização Geo','uploadProduct':'Enviar Produto','newArticle':'Novo Artigo'},'products':{'allProducts':'Todos os Produtos','searchPlaceholder':'Buscar produtos...','category':'Categoria','viewDetails':'Ver Detalhes'},'industry':{'title':'Informações da Indústria','subtitle':'Últimas notícias e análises da indústria de fixações','readMore':'Leia Mais','publishedOn':'Publicado em','backToList':'← Voltar'}},
  'ru': {'nav':{'industry':'Промышленность','articles':'Статьи','market':'Анализ рынка','geoOptim':'Geo-оптимизация','uploadProduct':'Загрузить товар','newArticle':'Новая статья'},'products':{'allProducts':'Все товары','searchPlaceholder':'Поиск товаров...','category':'Категория','viewDetails':'Подробнее'},'industry':{'title':'Промышленность','subtitle':'Последние новости и анализ индустрии крепежа','readMore':'Читать далее','publishedOn':'Опубликовано','backToList':'← Назад'}},
  'ja': {'nav':{'industry':'業界情報','articles':'記事','market':'市場分析','geoOptim':'Geo最適化','uploadProduct':'製品アップロード','newArticle':'新規記事'},'products':{'allProducts':'全製品','searchPlaceholder':'製品を検索...','category':'カテゴリ','viewDetails':'詳細を見る'},'industry':{'title':'業界情報','subtitle':'ファスナー業界の最新ニュースと分析','readMore':'続きを読む','publishedOn':'公開日','backToList':'← 戻る'}},
  'de': {'nav':{'industry':'Industrie-Info','articles':'Artikel','market':'Marktanalyse','geoOptim':'Geo-Optimierung','uploadProduct':'Produkt hochladen','newArticle':'Neuer Artikel'},'products':{'allProducts':'Alle Produkte','searchPlaceholder':'Produkte suchen...','category':'Kategorie','viewDetails':'Details'},'industry':{'title':'Industrie-Info','subtitle':'Aktuelle Nachrichten und Analysen aus der Befestigungsindustrie','readMore':'Mehr lesen','publishedOn':'Veröffentlicht am','backToList':'← Zurück'}},
  'hi': {'nav':{'industry':'उद्योग जानकारी','articles':'लेख','market':'बाजार विश्लेषण','geoOptim':'Geo अनुकूलन','uploadProduct':'उत्पाद अपलोड करें','newArticle':'नया लेख'},'products':{'allProducts':'सभी उत्पाद','searchPlaceholder':'उत्पाद खोजें...','category':'श्रेणी','viewDetails':'विवरण देखें'},'industry':{'title':'उद्योग जानकारी','subtitle':'फास्टनर उद्योग से नवीनतम समाचार और विश्लेषण','readMore':'और पढ़ें','publishedOn':'प्रकाशित','backToList':'← वापस'}},
}

for locale, updates in translations.items():
  path = os.path.join(base, f'{locale}.json')
  with open(path) as f:
    data = json.load(f)
  for section, keys in updates.items():
    if section not in data:
      data[section] = {}
    data[section].update(keys)
  with open(path, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
  print(f'✅ {locale}.json')

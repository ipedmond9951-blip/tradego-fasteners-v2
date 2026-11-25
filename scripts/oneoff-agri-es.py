#!/usr/bin/env python3
"""agricultural-machinery-fastener-guide：把第 0/2/3 节西语从摘要级扩写成与英文等长的正文（英文本身完整，纯翻译，不新增事实）。
命中即跳，可重复运行。
"""
import json, re

SLUG = 'agricultural-machinery-fastener-guide'
LINK = '<a href="/en/products/hex-bolts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">catálogo de productos</a>'

ES = {}

ES['introduction'] = (
"La maquinaria agrícola opera en algunos de los entornos más duros de cualquier industria. Tractores, cosechadoras, sembradoras y arados están expuestos de forma permanente a suelos abrasivos, fertilizantes corrosivos, pesticidas ácidos, estiércol, humedad y oscilaciones térmicas extremas. Cada fijador de estas máquinas debe resistir el aflojamiento inducido por la vibración, las cargas de choque del trabajo en campo y la corrosión galvánica derivada del contacto entre metales distintos.\n\n"
"A diferencia de los sujetadores automotrices o industriales de uso general, los fijadores agrícolas deben cumplir requisitos específicos dictados por organismos como la American Society of Agricultural and Biological Engineers (ASABE) y las organizaciones internacionales de normalización. Las consecuencias de un fallo en campo son graves: un perno de arado roto durante la siembra de primavera puede costar a un agricultor una jornada completa de productividad y miles de dólares en pérdidas de rendimiento.\n\n"
"Esta guía reúne las especificaciones críticas, los grados de material, los recubrimientos y las normas que todo fabricante de maquinaria agrícola, técnico de reparación y responsable de compras debe conocer. Desde las especificaciones OEM de John Deere y Case IH hasta las clases de propiedades de ISO 898-1, explicamos con precisión qué hace que un fijador agrícola rinda en condiciones extremas. Consulte nuestro " + LINK + " para opciones de grado 8.8/10.9.\n\n"
"Recursos relacionados: <a href=\"/en/products/high-tensile-bolts\">pernos de alta resistencia</a> <a href=\"/en/products/anchor-bolts\">pernos de anclaje</a> <a href=\"/en/products/stainless-bolts\">fijadores de acero inoxidable</a> <a href=\"/en/products/hex-bolts\">pernos hexagonales</a> <a href=\"/en/products/lock-nuts\">tuercas de seguridad</a> <a href=\"/en/products/washers\">arandelas</a> <a href=\"/en/products/self-drilling-screws\">tornillos autotaladrantes</a> <a href=\"/en/products/socket-screws\">tornillos allen</a>."
)

ES['iso-standards'] = (
"Los fijadores para maquinaria agrícola se rigen por un sistema estratificado de normas internacionales, nacionales y OEM. Saber qué norma se aplica a cada tipo de fijador es decisivo para especificar y comprar correctamente.\n\n"
"**ISO 898-1 — Propiedades mecánicas de los fijadores**\nISO 898-1 es la norma fundacional para las propiedades mecánicas de los fijadores de acero al carbono y acero aleado. Define clases de propiedad como 8.8, 10.9 y 12.9, que indican resistencia a la tracción y límite elástico. Por ejemplo, un perno de clase 10.9 tiene una resistencia nominal a la tracción de 1.000 MPa y un límite elástico de 900 MPa. Es la referencia mundial para determinar si un fijador es adecuado en aplicaciones agrícolas de alta solicitación.\n\n"
"**ISO 4014 e ISO 4017 — Pernos hexagonales**\nISO 4014 (pernos hexagonales roscados hasta la cabeza) e ISO 4017 (tornillos hexagonales totalmente roscados) son los fijadores de cabeza hexagonal más habituales en bastidores, enganches y soportes de implementos agrícolas. ISO 4014 abarca pernos de M1,6 a M64 y longitudes de 30 a 300 mm. Ambas normas especifican tolerancias dimensionales, ajuste de rosca y requisitos de propiedades mecánicas.\n\n"
"**DIN 6921 — Pernos hexagonales con brida**\nDIN 6921 define los pernos hexagonales con brida, que incorporan una brida tipo arandela bajo la cabeza. Este diseño reparte la carga de apriete sobre una superficie mayor, lo que los hace idóneos para carcasas de transmisión de tractor, soportes de eje y puntos de anclaje donde la resistencia al aflojamiento por vibración es primordial.\n\n"
"**GB/T 5782 y GB/T 5783 — Pernos hexagonales chinos**\nGB/T 5782 (pernos hexagonales, grado de producto B) y GB/T 5783 (pernos hexagonales totalmente roscados, grado de producto C) son las normas nacionales chinas equivalentes a ISO 4014 e ISO 4017. Los fabricantes chinos que abastecen el mercado mundial de maquinaria agrícola las utilizan de forma extensiva. Los importadores y OEM que compran en China deben verificar que los pernos marcados GB/T cumplan o superen la clase de propiedades ISO equivalente.\n\n"
"**ISO 3506 — Fijadores de acero inoxidable**\nPara aplicaciones que exigen una resistencia superior a la corrosión — fijadores en abonadoras, brazos de pulverizadores y equipos de manejo de estiércol — ISO 3506-1 especifica las propiedades mecánicas de los fijadores de acero inoxidable. Las calidades habituales incluyen A2-70 (inox 304, 700 MPa) y A4-80 (inox 316, 800 MPa). La «A» denota acero inoxidable austenítico y el número indica la clase de resistencia a la tracción.\n\n"
"**ASTM A307 — Pernos estándar de acero al carbono**\nEn Norteamérica, ASTM A307 sigue siendo una norma muy citada para pernos de acero al carbono de uso general. Aunque exige resistencias inferiores a la clase 8.8 de ISO 898-1, los pernos A307 grado A se emplean habitualmente en uniones estructurales no críticas de equipos agrícolas donde el coste es la prioridad. Consulte nuestro " + LINK + " para opciones de grado 8.8/10.9."
)

ES['bolt-grades'] = (
"Elegir el grado de perno correcto para maquinaria agrícola es una de las decisiones de mayor impacto en el diseño y el mantenimiento del equipo. Un grado equivocado provoca fallos prematuros, averías en campo y paradas costosas durante las ventanas críticas de siembra y cosecha.\n\n"
"**Clase 8.8 — Uso agrícola general**\nLos pernos de clase 8.8 (ISO 898-1) son el caballo de batalla de la maquinaria agrícola. Con una resistencia a la tracción de 800 MPa y un límite elástico de 640 MPa, son fijadores de acero al carbono medio bonificado, adecuados para la sujeción general en tractores, implementos y aperos. John Deere y Case IH especifican clase 8.8 en muchos puntos de montaje estándar, paneles de carrocería y uniones estructurales no críticas. La clase 8.8 equivale al grado 5 SAE.\n\n"
"**Clase 10.9 — Aplicaciones de alta solicitación**\nLos pernos de clase 10.9 (1.000 MPa a la tracción, 900 MPa de límite elástico) son fijadores de acero aleado bonificado pensados para cargas pesadas y esfuerzos de choque. En equipos agrícolas, la clase 10.9 es el grado mínimo recomendado para componentes del enganche de tres puntos, conexiones del eje de toma de fuerza, soportes de brazos de cargador y abrazaderas de montaje de dosificadores de semilla. La norma de ingeniería JDM F15 de John Deere fija requisitos de par-tensión y superficie de apoyo que los fijadores de clase 10.9 cumplen de forma habitual.\n\n"
"**Clase 12.9 — Uniones críticas y de seguridad**\nLos pernos de clase 12.9 (1.200 MPa a la tracción, 1.080 MPa de límite elástico) son la clase de mayor resistencia disponible habitualmente para maquinaria agrícola. Se emplean exclusivamente en uniones de seguridad y de alta solicitación, como el montaje del tanque de grano de la cosechadora, los puntos de articulación del brazo del pulverizador y las abrazaderas del desgarrador. Como los pernos de clase 12.9 son más frágiles que los grados inferiores, deben respetarse estrictamente las especificaciones de par y la longitud de rosca en toma.\n\n"
"**Pernos de arado grado 8**\nLos pernos de arado (normas ASABE) son fijadores especializados para aperos que trabajan el suelo. Tienen cabeza avellanada de perfil bajo, que resiste el desgaste por contacto con la tierra, y un cuerpo de gran longitud de apriete que resiste los esfuerzos de cizalla. Los pernos de arado grado 8 son el estándar para arados de vertedera, arados cincel y rejas de cultivadores. El diseño singular de la cabeza evita enganches con residuos y reduce la adherencia del suelo.\n\n"
"**Grado 5 frente a clase 8.8 — Imperial frente a métrico**\nEn equipos norteamericanos, los pernos SAE grado 5 (similares a la clase 8.8 ISO) son el estándar para aplicaciones de solicitación media, mientras que el SAE grado 8 (similar a la clase 10.9 ISO) se usa en aplicaciones de alta solicitación. Al comprar fijadores en el mercado internacional, verifique siempre que el sistema de marcado de clase de propiedades se interprete correctamente: el grado 5 imperial y la clase 8.8 métrica tienen métodos de ensayo y requisitos mínimos distintos. Consulte nuestro " + LINK + " para opciones de grado 8.8/10.9."
)

ES['corrosion-resistance'] = (
"La corrosión es el principal modo de fallo de los fijadores agrícolas. El estiércol, los fertilizantes de urea, el nitrato de amonio y los pesticidas ácidos crean microambientes muy corrosivos que atacan el acero desnudo a un ritmo acelerado. Un fijador que dura 10 años en una aplicación automotriz puede fallar en 18 meses en una nave de ganado o junto a una abonadora.\n\n"
"**Galvanizado por inmersión en caliente (ISO 1461)**\nEl galvanizado por inmersión en caliente es uno de los sistemas de protección contra la corrosión más rentables disponibles. El proceso recubre el fijador con una capa de zinc típicamente de 40 a 85 μm, que protege el acero tanto por barrera como por protección catódica sacrificial. Para aplicaciones agrícolas cerca de almacenes de fertilizante o instalaciones ganaderas, se recomienda firmemente usar pernos galvanizados en caliente conforme a ISO 1461. El espesor del recubrimiento de zinc resiste el daño de la manipulación y ofrece décadas de servicio en ambientes moderados.\n\n"
"**Zinc-níquel electrolítico (ISO 4042)**\nEl zinc-níquel electrolítico conforme a ISO 4042 ofrece una resistencia a la corrosión superior al zincado convencional, con resultados en niebla salina que superan las 1.000 horas hasta la corrosión blanca en muchas configuraciones. La adición de níquel al baño de zinc mejora las propiedades de barrera del recubrimiento y reduce el riesgo de fragilización por hidrógeno en fijadores de alta resistencia. Para pernos de clase 10.9 y 12.9, el zinc-níquel es el recubrimiento preferido cuando se requieren aspecto estético y precisión dimensional junto con protección anticorrosiva.\n\n"
"**Recubrimientos de escamas de zinc (ISO 10683 / DIN 50979)**\nLos sistemas de escamas de zinc (Geomet, Magni y similares) aportan una excelente resistencia a la corrosión sin riesgo de fragilización por hidrógeno. Estos recubrimientos base solvente se aplican en capas finas (8 a 12 μm) y son adecuados para fijadores de clase 10.9 y 12.9 en los que debe evitarse la fragilización por hidrógeno. Rinden de forma excepcional en ensayos de corrosión cíclica que simulan las condiciones de campo agrícolas.\n\n"
"**Acero inoxidable A2 (304) y A4 (316)**\nPara los ambientes más corrosivos — tolvas de fertilizante, depósitos de pulverizadores y sistemas de manejo de estiércol — los fijadores de acero inoxidable austenítico conforme a ISO 3506-1 son la solución definitiva. A4-80 (inox 316, 800 MPa) ofrece una excelente resistencia a la picadura y a la corrosión en rendija inducidas por cloruros, lo que lo hace idóneo para equipos expuestos a estiércol, cultivos regados con agua de mar o explotaciones costeras. El contenido de molibdeno del inox 316 aporta una ventaja decisiva frente al inox 304 (A2-70) en ambientes ricos en cloruros.\n\n"
"**Óxido negro y fosfatado**\nEl óxido negro (ISO 2063) y los recubrimientos de fosfato de manganeso ofrecen una protección anticorrosiva limitada y se emplean sobre todo por aspecto y para evitar el óxido inicial durante el almacenamiento. No son adecuados para servicio agrícola permanente a la intemperie sin protección adicional. No especifique nunca fijadores de óxido negro para aplicaciones con fertilizante, estiércol o exposición regular al agua. Consulte nuestro " + LINK + " para opciones de grado 8.8/10.9."
)


def main():
    path = 'content/articles/%s.json' % SLUG
    a = json.load(open(path))
    changed = 0
    for s in a['sections']:
        sid = s['id']
        if sid not in ES:
            continue
        en = s['body']['en']
        es = ES[sid]
        if s['body'].get('es') and len(s['body']['es']) >= 0.9 * len(en):
            print('skip(已扩写)', sid)
            continue
        assert not re.search('[\u4e00-\u9fff]', es), sid
        assert '<p><p>' not in es
        s['body']['es'] = es
        changed += 1
        print('扩写', sid, len(en), '->', len(es))
    if changed:
        open(path, 'w').write(json.dumps(a, ensure_ascii=False, indent=2) + '\n')
    print('共 %d 节' % changed)


if __name__ == '__main__':
    main()

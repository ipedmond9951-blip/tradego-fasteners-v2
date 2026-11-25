#!/usr/bin/env python3
"""agricultural-machinery-fastener-guide 第 4/5/6 节西语扩写（承接 oneoff-agri-es.py）。
纯翻译，不新增事实；所有数字与英文逐条对齐。
"""
import json, re

SLUG = 'agricultural-machinery-fastener-guide'
LINK = '<a href="/en/products/hex-bolts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">catálogo de productos</a>'
REL = ('Recursos relacionados: <a href="/en/products/high-tensile-bolts">pernos de alta resistencia</a> '
       '<a href="/en/products/anchor-bolts">pernos de anclaje</a> '
       '<a href="/en/products/stainless-bolts">fijadores de acero inoxidable</a> '
       '<a href="/en/products/hex-bolts">pernos hexagonales</a> '
       '<a href="/en/products/lock-nuts">tuercas de seguridad</a> '
       '<a href="/en/products/washers">arandelas</a> '
       '<a href="/en/products/self-drilling-screws">tornillos autotaladrantes</a> '
       '<a href="/en/products/socket-screws">tornillos allen</a>.')

ES = {}

ES['tractor-fasteners'] = (
"Los tractores y las cosechadoras son el segmento de mayor valor de la maquinaria agrícola, y los fijadores que sostienen estas máquinas afrontan la combinación más exigente de esfuerzo, vibración y exposición ambiental de todas las aplicaciones de equipos agrícolas.\n\n"
"**Fijadores de motor y transmisión del tractor**\nLos bloques motor, culatas y carcasas de transmisión de tractor exigen fijadores de alta resistencia capaces de mantener la carga de apriete bajo ciclos térmicos y vibración. La especificación habitual de los pernos de motor y transmisión en tractores modernos va de la clase 10.9 a la clase 12.9, y los fijadores internos críticos del motor suelen especificarse según normas OEM que superan los requisitos mínimos de ISO 898-1. Los pernos de culata y de tapa de bancada en motores diésel requieren normalmente pernos de estiramiento con especificaciones precisas de par y ángulo.\n\n"
"Los catálogos de piezas de tractor John Deere especifican pernos hexagonales métricos y tornillos de cabeza cilíndrica de M6 a M24 para aplicaciones de motor y transmisión, con clase 10.9 como mínimo para uniones estructurales. Un fijador John Deere típico para un soporte de enganche o una carcasa de eje es un perno hexagonal M16 x 2,0 x 70 mm clase 10.9 según ISO 4014, con recubrimiento de zinc-níquel o galvanizado en caliente según la línea de equipos.\n\n"
"**Fijadores de cosechadora**\nLas cosechadoras generan vibraciones extremas en el mecanismo de trilla, el canal de alimentación y el separador. La selección de fijadores para cosechadoras debe priorizar recubrimientos amortiguadores de vibración y elementos de bloqueo. Aplicaciones habituales de fijadores en cosechadoras:\n\n"
"- Montaje del tanque de grano y del canal de alimentación: pernos hexagonales clase 10.9 con tuercas de bloqueo por par residual\n"
"- Montaje de rotor y cilindro: pernos OEM de especificación directa con tratamiento térmico a medida\n"
"- Ajustes de cóncava y parrilla: fijadores con muelle y elementos cautivos para evitar pérdidas en campo\n\n"
"La serie Axial-Flow de Case IH utiliza pernos con brida M10 y M12 clase 10.9 para la sujeción del tanque de grano y pernos M12 x 1,75 clase 12.9 para el frontal del canal de alimentación. Todos los fijadores del sistema de trilla requieren inspección periódica y reapertura de par dentro del plan de mantenimiento estacional de la máquina.\n\n"
"**Fijadores del separador y del sistema de limpieza**\nLa criba de limpieza, el tamiz y la carcasa del ventilador de las cosechadoras modernas giran a altas rpm y generan vibración importante. Estos fijadores son como mínimo de clase 8.8 con arandelas elásticas, o de clase 10.9 con tuercas de bloqueo con inserto de nailon. Los mecanismos de ajuste de tamiz suelen usar pernos de cabeza redonda con retenes de muelle que permiten ajustar rápido y sin herramientas.\n\n"
"**Referencia de precios de fijadores para OEM agrícola**\nA fecha de 2026, el precio de mercado global de los pernos hexagonales de grado agrícola varía de forma significativa según la especificación:\n\n"
"- Pernos hexagonales clase 8.8 (M10–M16): USD 1.000–1.800 por tonelada métrica\n"
"- Pernos hexagonales clase 10.9 (M10–M16): USD 1.500–2.500 por tonelada métrica\n"
"- Tornillos hexagonales clase 12.9 (M10–M16): USD 2.200–3.500 por tonelada métrica\n"
"- Clase 8.8 galvanizado en caliente: USD 200–400 adicionales por tonelada\n"
"- Clase 10.9 zinc-níquel: USD 300–600 adicionales por tonelada\n"
"- Inox 316 A4-80 (M10–M16): USD 8.000–14.000 por tonelada métrica\n\n"
"Consulte nuestro " + LINK + " para opciones de grado 8.8/10.9."
)

ES['implement-fasteners'] = (
"Los implementos agrícolas — arados, sembradoras, pulverizadores, cultivadores y aperos de labranza — afrontan retos de fijación singulares derivados del contacto con el suelo, la exposición química y la necesidad de configuraciones ajustables en campo. A diferencia de tractores y cosechadoras, donde los fijadores forman conjuntos en gran medida permanentes, los fijadores de implementos se desmontan, ajustan y vuelven a montar con frecuencia durante las labores de temporada.\n\n"
"**Pernos de arado — fijadores que trabajan el suelo**\nLos pernos de arado (ASABE S383 o equivalente) son el fijador característico de los aperos de labranza. Su cabeza avellanada queda a ras de la superficie que contacta el suelo en rejas, vertederas y púas de cincel, evitando enganches con residuos de cultivo y reduciendo la adherencia del suelo. Los pernos de arado son normalmente grado 8 (mínimo 827 MPa de resistencia a la tracción) con recubrimientos de fosfato grueso o galvanizado en caliente. Las medidas estándar van de 3/8\" x 1-1/4\" a 5/8\" x 2-1/2\" (imperial) o de M10 x 30 a M16 x 50 (métrico).\n\n"
"**Fijadores de equipos de siembra**\nLos dosificadores de semilla, las protecciones de tubo de semilla y las abrazaderas de montaje de unidades de hilera en sembradoras de precisión requieren fijadores que mantengan la calibración exacta bajo vibración y contacto con semilla y fertilizante. Las sembradoras de vacío en particular usan fijadores especializados que montan los discos dosificadores sin introducir excentricidad que comprometa la precisión de singulación. Fijadores habituales de siembra:\n\n"
"- Brazos oscilantes de unidad de hilera: pernos hexagonales M12 clase 10.9 con tuercas de bloqueo con inserto de nailon\n"
"- Montaje del dosificador de semilla: pernos hexagonales M8 clase 8.8 (par de precisión, 25–30 Nm)\n"
"- Cuchillas abridoras de fertilizante: pernos de arado grado 8 o M12 clase 10.9 con recubrimientos resistentes al desgaste\n\n"
"**Fijadores de brazos y depósitos de pulverizador**\nLa exposición química es el reto dominante en pulverizadores. Las soluciones de fertilizante, las emulsiones herbicidas y los coadyuvantes atacan los recubrimientos de zinc convencionales en semanas. La especificación correcta para depósitos y soportes de brazos es:\n\n"
"- Cinchas y cunas de montaje del depósito: clase 8.8 galvanizado en caliente o inox A2-70/A4-80\n"
"- Pivotes de articulación de brazos: clase 10.9 zinc-níquel o inox A4-80 con arandelas recubiertas de PTFE o de inox\n"
"- Sujeción del cuerpo de boquilla: fijadores poliméricos resistentes a UV o inox con arandelas de estanqueidad EPDM\n\n"
"**Fijadores del enganche de tres puntos y del bastidor de implementos**\nEl enganche de tres puntos es la interfaz universal entre tractor e implemento. Los fijadores de brazos de tiro, cadenas estabilizadoras y soportes de barra superior deben absorber inversiones dinámicas de carga al entrar y salir el apero del suelo. La clase 10.9 es el grado mínimo aceptable; muchas especificaciones OEM exigen clase 10.9 o 12.9 para enganches de categoría 2 y 3. La norma ASABE S217.12 define la geometría del enganche de tres puntos y las medidas de los pasadores, de las que se derivan los requisitos de diámetro y longitud de los fijadores. Consulte nuestro " + LINK + " para opciones de grado 8.8/10.9."
)

ES['procurement'] = (
"China es el productor dominante mundial de fijadores agrícolas y abastece a OEM, distribuidores de posventa y agricultores de todo el mundo. Sin embargo, comprar fijadores en China exige atención cuidadosa al cumplimiento de especificaciones, a la verificación de calidad y a la gestión del riesgo de cadena de suministro.\n\n"
"**Normas nacionales chinas frente a ISO**\nLos fabricantes chinos producen tanto según GB/T (normas nacionales) como según normas internacionales (ISO, DIN, ASME). Al comprar a proveedores chinos, confirme siempre bajo qué norma se fabrica el producto. Un perno marcado «GB/T 5783 clase 10.9» debe cumplir los requisitos mecánicos de la clase 10.9 de ISO 898-1, pero los controles de proceso, la documentación de trazabilidad y los ensayos por lote pueden diferir de los de un producto certificado ISO. Solicite el certificado de ensayo de material (MTR / EN 10204 3.1) de cada lote de producción.\n\n"
"**Pasos clave de inspección y verificación**\n"
"1. Verificación dimensional: compruebe paso de rosca, diámetro de vástago, longitud y medidas de cabeza frente a las tolerancias de ISO 4014 / ISO 4017 / DIN 6921 con calibres pasa-no pasa o equipos de medición por coordenadas.\n"
"2. Ensayo mecánico: los ensayos de tracción y de límite elástico según ISO 898-1 deben realizarse sobre muestras de cada lote, especialmente en fijadores de clase 10.9 y 12.9.\n"
"3. Espesor y adherencia del recubrimiento: verifique el espesor según ISO 2063 o ISO 1461 con medidores magnéticos o de corrientes inducidas. Realice ensayos de adherencia por doblado y cinta en recubrimientos electrolíticos.\n"
"4. Verificación de dureza: los ensayos Rockwell o Vickers confirman la clase de tratamiento térmico. Un perno de clase 10.9 debe dar 33–39 HRC.\n\n"
"**Cadena de suministro y plazos**\nLa compra de fijadores agrícolas es marcadamente estacional. El pico de demanda es el Q4 (octubre–diciembre) para preparar la siembra en el hemisferio sur y el Q1 (enero–marzo) para la siembra de primavera en el hemisferio norte. Pedir en temporada baja (Q2–Q3) suele dar precios 10–20% mejores y plazos más fiables. Los plazos de pernos hexagonales estándar de fabricantes chinos van de 3 a 6 semanas para medidas corrientes, con 1 a 2 semanas adicionales si hay recubrimientos especiales. Los pedidos de volumen OEM deben cursarse 12–16 semanas antes de la fecha de entrega objetivo.\n\n"
"**Cantidades mínimas y escalones de precio**\nPara pernos hexagonales de clase 8.8 y 10.9 en medidas agrícolas estándar (M8–M20), las cantidades mínimas suelen ir de 500 a 5.000 piezas por medida, según el proveedor. Los saltos de precio aparecen normalmente en 5.000, 20.000 y 100.000 piezas. A fecha de 2026, el precio FOB Shanghai para pedidos por contenedor de pernos hexagonales clase 10.9 M10–M16 con acabado zinc-níquel va de USD 1,80 a 3,20 por kilogramo, lo que equivale aproximadamente a USD 1.500–2.600 por tonelada métrica en pedidos agrícolas estándar. Consulte nuestro " + LINK + " para opciones de grado 8.8/10.9. " + REL
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
        if s['body'].get('es') and len(s['body']['es']) >= 0.9 * len(en):
            print('skip(已扩写)', sid)
            continue
        es = ES[sid]
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

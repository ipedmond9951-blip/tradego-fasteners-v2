#!/usr/bin/env python3
"""agricultural-machinery-fastener-guide 德语扩写第一批：第 0/1/2/3 节。
纯翻译英文既有内容，不新增事实；标准号、MPa、μm、HRC 逐条对齐。
"""
import json, re

SLUG = 'agricultural-machinery-fastener-guide'
LINK = '<a href="/en/products/hex-bolts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Produktkatalog</a>'
REL = ('Weitere Ressourcen: <a href="/en/products/high-tensile-bolts">hochfeste Schrauben</a> '
       '<a href="/en/products/anchor-bolts">Ankerschrauben</a> '
       '<a href="/en/products/stainless-bolts">Edelstahlschrauben</a> '
       '<a href="/en/products/hex-bolts">Sechskantschrauben</a> '
       '<a href="/en/products/lock-nuts">Sicherungsmuttern</a> '
       '<a href="/en/products/washers">Scheiben</a> '
       '<a href="/en/products/self-drilling-screws">Selbstbohrschrauben</a> '
       '<a href="/en/products/socket-screws">Innensechskantschrauben</a>.')

DE = {}

DE['introduction'] = (
"""Landmaschinen arbeiten in einigen der härtesten Umgebungen aller Branchen. Traktoren, Mähdrescher, Sämaschinen und Pflüge sind dauerhaft abrasiven Böden, korrosiven Düngemitteln, sauren Pflanzenschutzmitteln, Gülle, Feuchtigkeit und extremen Temperaturschwankungen ausgesetzt. Jede Verbindung an diesen Maschinen muss vibrationsbedingtem Lockern, Stoßlasten aus der Feldarbeit und galvanischer Korrosion durch Kontakt unterschiedlicher Metalle standhalten.

Anders als Automobil- oder allgemeine Industrieverschraubungen müssen Landmaschinen-Verbindungen besondere Anforderungen erfüllen, die von Gremien wie der American Society of Agricultural and Biological Engineers (ASABE) und internationalen Normungsorganisationen vorgegeben werden. Die Folgen eines Versagens auf dem Feld sind gravierend: Ein gebrochener Pflugbolzen während der Frühjahrsbestellung kann einen Landwirt einen ganzen Produktionstag und tausende Dollar Ernteverlust kosten.

Dieser Leitfaden fasst die kritischen Spezifikationen, Werkstoffgüten, Beschichtungen und Normen zusammen, die jeder Hersteller von Landmaschinen, Instandhaltungstechniker und Einkäufer kennen muss. Von den OEM-Spezifikationen von John Deere und Case IH bis zu den Festigkeitsklassen der ISO 898-1 erklären wir genau, was Landmaschinen-Verbindungen unter extremen Bedingungen leisten. Sehen Sie in unserem """ + LINK + """ die Optionen der Klasse 8.8/10.9.

""" + REL
)

DE['iso-standards'] = (
"""Verbindungen für Landmaschinen unterliegen einem geschichteten System aus internationalen, nationalen und OEM-Normen. Zu wissen, welche Norm für welchen Verbindungstyp gilt, ist entscheidend für korrekte Auslegung und Beschaffung.

**ISO 898-1 — Mechanische Eigenschaften von Verbindungen**
Die ISO 898-1 ist die grundlegende Norm für die mechanischen Eigenschaften von Verbindungen aus Kohlenstoff- und legiertem Stahl. Sie definiert Festigkeitsklassen wie 8.8, 10.9 und 12.9, die Zugfestigkeit und Streckgrenze angeben. Eine Schraube der Klasse 10.9 hat beispielsweise eine Nennzugfestigkeit von 1 000 MPa und eine Streckgrenze von 900 MPa. Sie ist die weltweite Referenz dafür, ob eine Verbindung für hochbeanspruchte landwirtschaftliche Anwendungen geeignet ist.

**ISO 4014 und ISO 4017 — Sechskantschrauben**
ISO 4014 (Sechskantschrauben mit teilweise Gewinde) und ISO 4017 (Sechskantschrauben mit Gewinde bis Kopf) sind die häufigsten Sechskantverbindungen an Rahmen, Kupplungen und Anbaugerätehaltern in der Landtechnik. ISO 4014 umfasst Schrauben von M1,6 bis M64 und Längen von 30 bis 300 mm. Diese Normen legen Maßtoleranzen, Gewindepassung und Anforderungen an die mechanischen Eigenschaften fest.

**DIN 6921 — Sechskant-Flanschschrauben**
DIN 6921 definiert Sechskant-Flanschschrauben mit einer integrierten Scheibenauflage unter dem Kopf. Diese Bauform verteilt die Klemmkraft auf eine größere Fläche, was sie für Getriebegehäuse von Traktoren, Achshalterungen und Befestigungspunkte prädestiniert, an denen Widerstand gegen vibrationsbedingtes Lockern entscheidend ist.

**GB/T 5782 und GB/T 5783 — Chinesische Sechskantschrauben**
GB/T 5782 (Sechskantschrauben, Produktklasse B) und GB/T 5783 (Sechskantschrauben mit Gewinde bis Kopf, Produktklasse C) sind die chinesischen Nationalnormen, die ISO 4014 bzw. ISO 4017 entsprechen. Chinesische Hersteller, die den Weltmarkt für Landmaschinen beliefern, verwenden sie breit. Importeure und OEM, die in China einkaufen, sollten prüfen, dass GB/T-gekennzeichnete Schrauben die entsprechende ISO-Festigkeitsklasse erreichen oder übertreffen.

**ISO 3506 — Verbindungen aus Edelstahl**
Für Anwendungen mit überlegener Korrosionsbeständigkeit — Verbindungen in Düngerstreuern, Sprühgestänge und Gülleausbringtechnik — legt ISO 3506-1 die mechanischen Eigenschaften von Edelstahlverbindungen fest. Gängige Güten sind A2-70 (Edelstahl 304, 700 MPa) und A4-80 (Edelstahl 316, 800 MPa). Das „A" steht für austenitischen Edelstahl, die Zahl für die Zugfestigkeitsklasse.

**ASTM A307 — Standard-Schrauben aus Kohlenstoffstahl**
In nordamerikanischen Märkten bleibt ASTM A307 eine vielzitierte Norm für Schrauben aus Kohlenstoffstahl für allgemeine Zwecke. Sie fordert geringere Festigkeiten als die Klasse 8.8 der ISO 898-1, doch A307-Güte-A-Schrauben werden häufig für unkritische strukturelle Verbindungen in Landmaschinen eingesetzt, bei denen die Kosten im Vordergrund stehen. Sehen Sie in unserem """ + LINK + """ die Optionen der Klasse 8.8/10.9."""
)

DE['bolt-grades'] = (
"""Die Wahl der richtigen Schraubengüte für eine Landmaschine gehört zu den folgenreichsten Entscheidungen in Konstruktion und Instandhaltung. Eine falsche Güte führt zu vorzeitigem Versagen, Feldausfällen und teuren Stillstandszeiten in den kritischen Fenstern von Aussaat und Ernte.

**Klasse 8.8 — Allgemeine landtechnische Anwendung**
Schrauben der Klasse 8.8 (ISO 898-1) sind das Arbeitspferd der Landtechnik. Mit 800 MPa Zugfestigkeit und 640 MPa Streckgrenze sind sie vergütete Verbindungen aus mittelkohlenstoffhaltigem Stahl, geeignet für allgemeine Befestigungen an Traktoren, Geräten und Anbauteilen. John Deere und Case IH schreiben Klasse 8.8 für viele Standard-Befestigungspunkte, Karosseriebleche und unkritische strukturelle Verbindungen vor. Klasse 8.8 entspricht SAE Grade 5.

**Klasse 10.9 — Hochbeanspruchte Anwendungen**
Schrauben der Klasse 10.9 (1 000 MPa Zugfestigkeit, 900 MPa Streckgrenze) sind vergütete Verbindungen aus legiertem Stahl für hohe Lasten und Schockbeanspruchung. In Landmaschinen ist Klasse 10.9 die minimal empfohlene Güte für Komponenten des Dreipunkt-Krafthebers, Zapfwellenverbindungen, Halterungen von Ladeschwingen und Befestigungen von Dosieraggregaten. Die John-Deere-Konstruktionsnorm JDM F15 legt Anforderungen an Drehmoment-Vorspannung und Auflagefläche fest, die Verbindungen der Klasse 10.9 regelmäßig erfüllen.

**Klasse 12.9 — Kritische und sicherheitsrelevante Verbindungen**
Schrauben der Klasse 12.9 (1 200 MPa Zugfestigkeit, 1 080 MPa Streckgrenze) sind die höchste üblicherweise verfügbare Festigkeitsklasse für Landmaschinen. Sie werden ausschließlich für sicherheitsrelevante und hochbeanspruchte Verbindungen verwendet, etwa die Befestigung des Korntanks am Mähdrescher, Gelenkpunkte des Sprühgestänges und Klemmhalterungen von Grubberzinken. Da Schrauben der Klasse 12.9 spröder als niedrigere Güten sind, müssen Drehmomentspezifikationen und Gewindeeinschraublängen strikt eingehalten werden.

**Pflugschrauben der Güte 8**
Pflugschrauben (ASABE-Normen) sind spezialisierte Verbindungen für Bodenbearbeitungsgeräte. Sie haben einen niedrig profilierten Senkkopf, der dem Verschleiß durch Bodenkontakt widersteht, und einen Körper mit großer Klemmlänge, der Scherkräfte aufnimmt. Pflugschrauben der Güte 8 sind der Standard für Scharpflüge, Meißelpflüge und Grubberzinken. Die besondere Kopfform verhindert das Hängenbleiben an Erntegutresten und verringert die Bodenhaftung.

**Grade 5 gegen Klasse 8.8 — Zoll gegen metrisch**
Bei nordamerikanischen Maschinen sind SAE-Grade-5-Schrauben (ähnlich ISO-Klasse 8.8) der Standard für mittlere Beanspruchung, während SAE Grade 8 (ähnlich ISO-Klasse 10.9) für hohe Beanspruchung verwendet wird. Prüfen Sie bei internationaler Beschaffung stets, ob das Kennzeichnungssystem der Festigkeitsklassen korrekt gelesen wird: Zoll-Grade 5 und metrische Klasse 8.8 haben unterschiedliche Prüfverfahren und Mindestanforderungen. Sehen Sie in unserem """ + LINK + """ die Optionen der Klasse 8.8/10.9."""
)

DE['corrosion-resistance'] = (
"""Korrosion ist der wichtigste Schadensmechanismus bei landtechnischen Verbindungen. Gülle, Harnstoffdünger, Ammoniumnitrat und saure Pflanzenschutzmittel erzeugen hochkorrosive Mikroumgebungen, die blanken Stahl beschleunigt angreifen. Eine Verbindung, die in einer Automobilanwendung 10 Jahre hält, kann in einem Stall oder neben einem Düngerstreuer innerhalb von 18 Monaten versagen.

**Feuerverzinkung (ISO 1461)**
Die Feuerverzinkung ist eines der kosteneffizientesten Korrosionsschutzsysteme. Das Verfahren überzieht die Verbindung mit einer Zinkschicht von üblicherweise 40 bis 85 μm Dicke, die den Stahl sowohl durch Barrierewirkung als auch durch kathodischen Opferschutz schützt. Für landtechnische Anwendungen in der Nähe von Düngerlagern oder Viehanlagen sind feuerverzinkte Schrauben nach ISO 1461 sehr zu empfehlen. Die dicke Zinkschicht widersteht Handhabungsschäden und bietet Jahrzehnte Standzeit in mäßiger Umgebung.

**Zink-Nickel-Elektroplattierung (ISO 4042)**
Die Zink-Nickel-Elektroplattierung nach ISO 4042 bietet überlegene Korrosionsbeständigkeit gegenüber herkömmlicher Verzinkung, mit Salzsprühtests von über 1 000 Stunden bis zum Weißrost in vielen Ausführungen. Die Nickelzugabe im Zinkbad verbessert die Barriereeigenschaften und verringert das Risiko der Wasserstoffversprödung bei hochfesten Verbindungen. Für Schrauben der Klassen 10.9 und 12.9 ist Zink-Nickel die bevorzugte Beschichtung, wenn neben Korrosionsschutz auch Optik und Maßgenauigkeit gefordert sind.

**Zinklamellensysteme (ISO 10683 / DIN 50979)**
Zinklamellensysteme (Geomet, Magni und vergleichbare) bieten hervorragende Korrosionsbeständigkeit ohne Wasserstoffversprödungsrisiko. Diese lösemittelbasierten Beschichtungen werden in dünnen Schichten (8 bis 12 μm) aufgebracht und eignen sich für Verbindungen der Klassen 10.9 und 12.9, bei denen Wasserstoffversprödung vermieden werden muss. Sie schneiden in zyklischen Korrosionstests, die Feldbedingungen simulieren, außergewöhnlich gut ab.

**Edelstahl A2 (304) und A4 (316)**
Für die korrosivsten Umgebungen — Düngetrichter, Sprühtanks und Gülletechnik — sind Verbindungen aus austenitischem Edelstahl nach ISO 3506-1 die maßgebliche Lösung. A4-80 (Edelstahl 316, 800 MPa) bietet hervorragenden Widerstand gegen chloridinduzierte Lochfraß- und Spaltkorrosion und ist damit ideal für Geräte, die Gülle, meerwasserbewässerten Kulturen oder Küstenbetrieben ausgesetzt sind. Der Molybdänanteil von Edelstahl 316 bringt gegenüber Edelstahl 304 (A2-70) in chloridreichen Umgebungen einen entscheidenden Vorteil.

**Brünierung und Phosphatierung**
Brünierung (ISO 2063) und Manganphosphatierung bieten begrenzten Korrosionsschutz und dienen vor allem der Optik sowie der Verhinderung von Anlaufrost während der Lagerung. Für den dauerhaften landtechnischen Einsatz im Freien ohne zusätzlichen Schutz sind sie nicht geeignet. Spezifizieren Sie brünierte Verbindungen niemals für Anwendungen mit Düngemitteln, Gülle oder regelmäßiger Wassereinwirkung. Sehen Sie in unserem """ + LINK + """ die Optionen der Klasse 8.8/10.9."""
)


def main():
    path = 'content/articles/%s.json' % SLUG
    a = json.load(open(path))
    changed = 0
    for s in a['sections']:
        sid = s['id']
        if sid not in DE:
            continue
        en = s['body']['en']
        if s['body'].get('de') and len(s['body']['de']) >= 0.9 * len(en):
            print('skip(已扩写)', sid)
            continue
        de = DE[sid]
        assert not re.search('[\u4e00-\u9fff]', de), sid
        assert '<p><p>' not in de
        s['body']['de'] = de
        changed += 1
        print('扩写', sid, len(en), '->', len(de))
    if changed:
        open(path, 'w').write(json.dumps(a, ensure_ascii=False, indent=2) + '\n')
    print('共 %d 节' % changed)


if __name__ == '__main__':
    main()

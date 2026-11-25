#!/usr/bin/env python3
"""agricultural-machinery-fastener-guide 德语第二批：第 4/5/6 节。
价格段落按内容契约第 15/24 条改成「报价构成」结构，不写任何金额数字；
其余规格、标准号、交期照英文对齐。
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

DE['tractor-fasteners'] = (
"""Traktoren und Mähdrescher sind das wertvollste Segment der Landtechnik, und die Verbindungen, die diese Maschinen zusammenhalten, tragen die anspruchsvollste Kombination aus Beanspruchung, Vibration und Umgebungseinfluss aller landtechnischen Anwendungen.

**Verbindungen für Motor und Antriebsstrang des Traktors**
Motorblöcke, Zylinderköpfe und Getriebegehäuse von Traktoren verlangen hochfeste Verbindungen, die die Klemmkraft unter thermischen Wechseln und Vibration halten. Die übliche Spezifikation für Motor- und Getriebeschrauben moderner Traktoren reicht von Klasse 10.9 bis Klasse 12.9, wobei kritische innere Motorverbindungen oft nach OEM-Normen ausgelegt werden, die über die Mindestanforderungen der ISO 898-1 hinausgehen. Zylinderkopfschrauben und Hauptlagerschrauben in Dieselmotoren erfordern in der Regel Dehnschrauben mit präzisen Drehmoment-und-Winkel-Angaben.

Die Ersatzteilkataloge von John Deere führen metrische Sechskantschrauben und Zylinderschrauben von M6 bis M24 für Motor und Antriebsstrang, mit Klasse 10.9 als Minimum für strukturelle Verbindungen. Eine typische John-Deere-Verbindung für eine Kupplungsaufnahme oder ein Achsgehäuse ist eine Sechskantschraube M16 x 2,0 x 70 mm der Klasse 10.9 nach ISO 4014, je nach Baureihe zink-nickel-beschichtet oder feuerverzinkt.

**Verbindungen am Mähdrescher**
Mähdrescher erzeugen extreme Schwingungen aus Dreschwerk, Schrägförderer und Trenner. Die Auswahl der Verbindungen muss schwingungsdämpfende Beschichtungen und Sicherungselemente priorisieren. Typische Anwendungen:

- Befestigung von Korntank und Schrägförderer: Sechskantschrauben Klasse 10.9 mit Klemmmuttern
- Befestigung von Rotor und Dreschzylinder: direkt spezifizierte OEM-Schrauben mit eigener Wärmebehandlung
- Einstellung von Dreschkorb und Korbstäben: federbelastete Verbindungen mit unverlierbaren Teilen gegen Feldverlust

Die Axial-Flow-Baureihe von Case IH verwendet Flanschschrauben M10 und M12 der Klasse 10.9 zur Sicherung des Korntanks und Schrauben M12 x 1,75 der Klasse 12.9 für die Stirnseite des Schrägförderers. Alle Verbindungen im Dreschsystem sind im saisonalen Wartungsplan regelmäßig zu prüfen und nachzuziehen.

**Verbindungen an Trenner und Reinigung**
Reinigungssieb, Siebroste und Ventilatorgehäuse moderner Mähdrescher laufen mit hohen Drehzahlen und erzeugen erhebliche Schwingungen. Diese Verbindungen sind mindestens Klasse 8.8 mit Federscheiben oder Klasse 10.9 mit Muttern mit Nylonring. Siebverstellungen nutzen häufig Rändelschrauben mit federbelasteten Rastungen, die ein schnelles Einstellen ohne Werkzeug erlauben.

**Preisbildung bei landtechnischen OEM-Verbindungen**
Preise für landwirtschaftliche Verbindungen entstehen nicht aus einer Liste, sondern aus einer Struktur. Der Angebotspreis einer Charge setzt sich zusammen aus dem Grundpreis für Werkstoff und Umformung, dem Aufpreis für Oberflächenbehandlung und Beschichtungsklasse, der Beistellung von Muttern, Scheiben und Verpackung, Fracht und Ausfuhrdokumenten sowie Zu- und Abschlägen nach Bestellmenge und Zahlungsbedingungen. Die drei Inputs, die den Preis am stärksten bewegen, sind Stahl, Zink und Energie; sie werden je Charge neu bewertet. Vergleiche sind nur bei gleicher Spezifikation, gleichem Incoterm und gleicher Verpackung belastbar. Nennen Sie Abmessung, Klasse, Beschichtungsklasse, Menge, Verpackung und Incoterm, dann lässt sich ein prüfbares Angebot erstellen. Sehen Sie in unserem """ + LINK + """ die Optionen der Klasse 8.8/10.9."""
)

DE['implement-fasteners'] = (
"""Landtechnische Anbaugeräte — Pflüge, Sämaschinen, Spritzgeräte, Grubber und Bodenbearbeitungswerkzeuge — stellen besondere Anforderungen an Verbindungen, die aus dem Bodeneingriff, der Chemikalienbelastung und der Notwendigkeit feldseitig einstellbarer Konfigurationen entstehen. Anders als bei Traktoren und Mähdreschern, wo Verbindungen weitgehend dauerhafte Baugruppen bilden, werden Verbindungen an Geräten während der Saison häufig gelöst, eingestellt und wieder montiert.

**Pflugschrauben — Verbindungen im Bodeneingriff**
Pflugschrauben (ASABE S383 oder gleichwertig) sind die prägende Verbindung von Bodenbearbeitungsgeräten. Ihr Senkkopfprofil liegt bündig mit der bodenberührenden Fläche von Scharen, Streichblechen und Meißelspitzen, was das Hängenbleiben an Ernterückständen verhindert und die Bodenhaftung verringert. Pflugschrauben sind üblicherweise Güte 8 (mindestens 827 MPa Zugfestigkeit) mit starker Phosphatierung oder Feuerverzinkung. Übliche Größen reichen von 3/8" x 1-1/4" bis 5/8" x 2-1/2" (Zoll) oder von M10 x 30 bis M16 x 50 (metrisch).

**Verbindungen an Sätechnik**
Sägeräte, Särohrschützer und Halterungen der Säaggregate an Präzisionssämaschinen benötigen Verbindungen, die unter Vibration und Kontakt mit Saatgut und Dünger eine exakte Kalibrierung halten. Besonders Vakuumsämaschinen verwenden spezielle Verbindungen, die Sä scheiben ohne Rundlauffehler montieren, der die Einzelkornablage beeinträchtigen würde. Typische Verbindungen in der Sätechnik:

- Schwingarme der Säaggregate: Sechskantschrauben M12 Klasse 10.9 mit Muttern mit Nylonring
- Befestigung des Sägeräts: Sechskantschrauben M8 Klasse 8.8 (Präzisionsdrehmoment, 25–30 Nm)
- Düngeröffner-Scharen: Pflugschrauben Güte 8 oder M12 Klasse 10.9 mit verschleißfesten Beschichtungen

**Verbindungen an Spritzgestänge und Tank**
Chemikalienbelastung ist die dominierende Anforderung in der Spritztechnik. Düngerlösungen, Herbizidemulsionen und Adjuvantien greifen übliche Zinkbeschichtungen innerhalb von Wochen an. Die korrekte Spezifikation für Tanks und Gestängehalterungen lautet:

- Tankspannbänder und -wiegen: Klasse 8.8 feuerverzinkt oder Edelstahl A2-70/A4-80
- Gelenkpunkte des Gestänges: Klasse 10.9 zink-nickel oder Edelstahl A4-80 mit PTFE-beschichteten oder Edelstahlscheiben
- Klemmung der Düsenkörper: UV-beständige Polymerverbindungen oder Edelstahl mit EPDM-Dichtscheiben

**Verbindungen an Dreipunkt-Kraftheber und Geräterahmen**
Der Dreipunkt-Kraftheber ist die universelle Schnittstelle zwischen Traktor und Gerät. Verbindungen an Unterlenkern, Stabilisierungsketten und Oberlenkerhaltern müssen dynamische Lastumkehrungen aufnehmen, wenn das Gerät in den Boden ein- und austritt. Klasse 10.9 ist die minimal akzeptable Güte; viele OEM-Spezifikationen fordern Klasse 10.9 oder 12.9 für Kraftheber der Kategorie 2 und 3. Die Norm ASABE S217.12 definiert die Geometrie des Dreipunkt-Krafthebers und die Maße der Ansteckbolzen, aus denen sich Durchmesser und Länge der Verbindungen ergeben. Sehen Sie in unserem """ + LINK + """ die Optionen der Klasse 8.8/10.9."""
)

DE['procurement'] = (
"""China ist der weltweit dominierende Hersteller landtechnischer Verbindungen und beliefert OEM, Ersatzteilhändler und Landwirte weltweit. Die Beschaffung in China erfordert jedoch sorgfältige Beachtung der Spezifikationstreue, der Qualitätsprüfung und des Lieferkettenrisikos.

**Chinesische Nationalnormen und ISO**
Chinesische Hersteller fertigen sowohl nach GB/T (Nationalnormen) als auch nach internationalen Normen (ISO, DIN, ASME). Bestätigen Sie bei chinesischen Lieferanten stets, nach welcher Norm das Produkt gefertigt wird. Eine Schraube mit der Kennzeichnung „GB/T 5783 Klasse 10.9" sollte die mechanischen Anforderungen der Klasse 10.9 nach ISO 898-1 erfüllen, doch Prozesskontrolle, Rückverfolgbarkeitsunterlagen und Losprüfungen können von einem ISO-zertifizierten Produkt abweichen. Fordern Sie für jedes Produktionslos den Werkstoffprüfbericht (MTR / EN 10204 3.1) an.

**Wesentliche Prüf- und Verifikationsschritte**
1. Maßprüfung: Gewindesteigung, Schaftdurchmesser, Länge und Kopfmaße gegen die Toleranzen von ISO 4014 / ISO 4017 / DIN 6921 mit Gut-Nicht-Gut-Lehren oder Koordinatenmessgeräten prüfen.
2. Mechanische Prüfung: Zug- und Streckgrenzenprüfungen nach ISO 898-1 sollten an Musterstücken jedes Loses erfolgen, besonders bei Verbindungen der Klassen 10.9 und 12.9.
3. Schichtdicke und Haftung: Schichtdicke nach ISO 2063 oder ISO 1461 mit magnetischen oder Wirbelstrom-Messgeräten prüfen. Für galvanische Schichten Biege- und Klebeband-Haftungstests durchführen.
4. Härteprüfung: Rockwell- oder Vickers-Härteprüfung bestätigt die Wärmebehandlungsklasse. Eine Schraube der Klasse 10.9 sollte 33–39 HRC erreichen.

**Lieferkette und Vorlaufzeiten**
Die Beschaffung landtechnischer Verbindungen ist stark saisonal. Die Spitze liegt im Q4 (Oktober–Dezember) für die Vorbereitung der Aussaat auf der Südhalbkugel und im Q1 (Januar–März) für die Frühjahrsbestellung auf der Nordhalbkugel. Bestellungen außerhalb der Spitze (Q2–Q3) ergeben üblicherweise günstigere Konditionen und verlässlichere Lieferpläne. Die Vorlaufzeiten für Standard-Sechskantschrauben chinesischer Hersteller liegen bei 3 bis 6 Wochen für gängige Größen, mit 1 bis 2 Wochen Zuschlag bei Sonderbeschichtungen. Bestellungen in OEM-Mengen sollten 12 bis 16 Wochen vor dem Zieltermin aufgegeben werden.

**Mindestmengen und Preisstaffeln**
Mindestmengen für Sechskantschrauben der Klassen 8.8 und 10.9 in gängigen landtechnischen Größen (M8–M20) richten sich nach Werkzeugbelegung und Losgröße je Abmessung und werden je Bestellung mit dem Lieferanten vereinbart; sie liegen typischerweise im Bereich von Hunderten bis einigen Tausend Stück pro Größe. Preisstaffeln folgen der Losgröße und dem Fertigungsaufwand, nicht einer festen Tabelle. Ein FOB-Preis je Charge wird auf Basis der aktuellen Stahl-, Zink- und Energiepreise neu gerechnet; nennen Sie Abmessungen, Menge, Beschichtungsklasse, Verpackung und Incoterm, dann lässt sich ein belastbares Angebot erstellen. Sehen Sie in unserem """ + LINK + """ die Optionen der Klasse 8.8/10.9. """ + REL
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

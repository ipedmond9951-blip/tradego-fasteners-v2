#!/usr/bin/env python3
"""agricultural-machinery-fastener-guide 法语扩写第二批：第 4/5/6 节（拖拉机/联合收割机、农具、采购）。
纯翻译英文既有内容，不新增事实；价格区间、规格、标准号逐条对齐。
"""
import json, re

SLUG = 'agricultural-machinery-fastener-guide'
LINK = '<a href="/en/products/hex-bolts" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">catalogue produits</a>'
REL = ('Ressources associées : <a href="/en/products/high-tensile-bolts">boulons à haute résistance</a> '
       '<a href="/en/products/anchor-bolts">boulons d\'ancrage</a> '
       '<a href="/en/products/stainless-bolts">fixations inox</a> '
       '<a href="/en/products/hex-bolts">boulons hexagonaux</a> '
       '<a href="/en/products/lock-nuts">écrous de blocage</a> '
       '<a href="/en/products/washers">rondelles</a> '
       '<a href="/en/products/self-drilling-screws">vis autoperceuses</a> '
       '<a href="/en/products/socket-screws">vis à douille</a>.')

FR = {}

FR['tractor-fasteners'] = (
"""Tracteurs et moissonneuses constituent le segment le plus coûteux des machines agricoles, et les fixations qui tiennent ces ensembles affrontent la combinaison la plus exigeante de contraintes, de vibrations et d'exposition environnementale de toutes les applications de matériel agricole.

**Fixations de moteur et de transmission de tracteur**
Les blocs moteur, culasses et carters de transmission de tracteur exigent des fixations à haute résistance capables de maintenir la charge de serrage sous cycles thermiques et vibrations. La spécification courante des boulons de moteur et de transmission sur les tracteurs modernes va de la classe 10.9 à la classe 12.9, et les fixations internes critiques du moteur sont souvent spécifiées selon des normes OEM qui dépassent les exigences minimales de l'ISO 898-1. Les boulons de culasse et de palier principal des moteurs diesel demandent généralement des boulons à allongement avec des spécifications précises de couple et d'angle.

Les catalogues de pièces de tracteurs John Deere spécifient des boulons hexagonaux métriques et des vis à tête cylindrique de M6 à M24 pour le moteur et la transmission, avec la classe 10.9 comme minimum pour les assemblages structurels. Une fixation John Deere typique pour un support d'attelage ou un carter d'essieu est un boulon hexagonal M16 x 2,0 x 70 mm de classe 10.9 selon l'ISO 4014, avec un revêtement zinc-nickel ou galvanisé à chaud selon la gamme de matériel.

**Fixations de moissonneuse-batteuse**
Les moissonneuses-batteuses génèrent des vibrations extrêmes au niveau du mécanisme de battage, du canal d'alimentation et du séparateur. Le choix des fixations pour moissonneuses doit privilégier les revêtements amortissant les vibrations et les dispositifs de blocage. Applications courantes :

- Montage de trémie à grain et du canal d'alimentation : boulons hexagonaux classe 10.9 avec écrous à couple résiduel
- Montage du rotor et du cylindre : boulons OEM spécifiés directement, traitement thermique sur mesure
- Réglages de contre-batteur et de grille : fixations à ressort avec éléments captifs pour éviter les pertes au champ

La série Axial-Flow de Case IH utilise des boulons à embase M10 et M12 de classe 10.9 pour le maintien de la trémie à grain et des boulons M12 x 1,75 de classe 12.9 pour la face avant du canal d'alimentation. Toutes les fixations du système de battage demandent une inspection périodique et un resserrage dans le cadre du plan d'entretien saisonnier de la machine.

**Fixations du séparateur et du système de nettoyage**
Le crible de nettoyage, le tamis et le carter de ventilateur des moissonneuses modernes tournent à haut régime et génèrent des vibrations importantes. Ces fixations sont au minimum de classe 8.8 avec rondelles à ressort, ou de classe 10.9 avec écrous à insert nylon. Les mécanismes de réglage de tamis utilisent souvent des boulons à tête molette avec crans à ressort permettant un réglage rapide sans outil.

**Repères de prix pour fixations OEM agricoles**
Fin 2026, le prix de marché mondial des boulons hexagonaux de qualité agricole varie fortement selon la spécification :

- Boulons hexagonaux classe 8.8 (M10–M16) : 1 000–1 800 USD par tonne métrique
- Boulons hexagonaux classe 10.9 (M10–M16) : 1 500–2 500 USD par tonne métrique
- Vis hexagonales classe 12.9 (M10–M16) : 2 200–3 500 USD par tonne métrique
- Classe 8.8 galvanisée à chaud : supplément de 200–400 USD par tonne
- Classe 10.9 zinc-nickel : supplément de 300–600 USD par tonne
- Inox 316 A4-80 (M10–M16) : 8 000–14 000 USD par tonne métrique

Consultez notre """ + LINK + """ pour les nuances 8.8/10.9."""
)

FR['implement-fasteners'] = (
"""Les outils agricoles — charrues, semoirs, pulvérisateurs, cultivateurs et matériels de travail du sol — affrontent des contraintes de fixation particulières liées au contact avec le sol, à l'exposition chimique et au besoin de configurations réglables au champ. Contrairement aux tracteurs et moissonneuses, où les fixations forment des ensembles largement permanents, les fixations d'outils sont fréquemment démontées, réglées et remontées au fil des campagnes.

**Boulons de charrue — fixations travaillant le sol**
Les boulons de charrue (ASABE S383 ou équivalent) sont la fixation emblématique des matériels de travail du sol. Leur tête fraisée affleure la surface en contact avec la terre sur les socs, versoirs et dents, ce qui évite l'accrochage aux résidus de culture et réduit l'adhérence du sol. Les boulons de charrue sont généralement de grade 8 (minimum 827 MPa à la traction) avec des revêtements phosphate épais ou galvanisés à chaud. Les tailles standard vont de 3/8" x 1-1/4" à 5/8" x 2-1/2" (impérial) ou de M10 x 30 à M16 x 50 (métrique).

**Fixations de matériel de semis**
Les doseurs de semences, les protections de tubes de semis et les brides de montage des éléments semeurs sur les semoirs de précision exigent des fixations qui maintiennent une calibration exacte sous vibrations et contact avec semences et engrais. Les semoirs pneumatiques en particulier utilisent des fixations spéciales qui montent les disques doseurs sans introduire de faux rond compromettant la précision de sélection graine à graine. Fixations courantes en semis :

- Bras oscillants d'élément semeur : boulons hexagonaux M12 classe 10.9 avec écrous à insert nylon
- Montage du doseur de semences : boulons hexagonaux M8 classe 8.8 (couple de précision, 25–30 Nm)
- Socs ouvreurs d'engrais : boulons de charrue grade 8 ou M12 classe 10.9 avec revêtements résistant à l'usure

**Fixations de rampes et de cuves de pulvérisateur**
L'exposition chimique est la contrainte dominante en pulvérisation. Les solutions d'engrais, les émulsions d'herbicide et les adjuvants attaquent les revêtements de zinc courants en quelques semaines. La spécification correcte pour cuves et supports de rampes est :

- Sangles et berceaux de montage de cuve : classe 8.8 galvanisée à chaud ou inox A2-70/A4-80
- Pivots d'articulation de rampe : classe 10.9 zinc-nickel ou inox A4-80 avec rondelles revêtues PTFE ou inox
- Serrage des corps de buses : fixations polymères résistantes aux UV ou inox avec rondelles d'étanchéité EPDM

**Fixations de relevage trois points et de châssis d'outil**
Le relevage trois points est l'interface d'attelage universelle entre tracteur et outil. Les fixations des bras de traction, des chaînes stabilisatrices et des supports de barre supérieure doivent absorber les inversions dynamiques de charge lorsque l'outil entre et sort du sol. La classe 10.9 est la nuance minimale acceptable ; de nombreuses spécifications OEM exigent la classe 10.9 ou 12.9 pour les relevages de catégorie 2 et 3. La norme ASABE S217.12 définit la géométrie du relevage trois points et les dimensions des axes d'attelage, dont découlent les exigences de diamètre et de longueur des fixations. Consultez notre """ + LINK + """ pour les nuances 8.8/10.9."""
)

FR['procurement'] = (
"""La Chine est le premier producteur mondial de fixations agricoles et fournit des OEM, des distributeurs de rechange et des agriculteurs du monde entier. S'approvisionner en Chine exige toutefois une vigilance particulière sur la conformité aux spécifications, la vérification de la qualité et la gestion des risques de chaîne d'approvisionnement.

**Normes nationales chinoises et ISO**
Les fabricants chinois produisent à la fois selon les GB/T (normes nationales) et selon les normes internationales (ISO, DIN, ASME). Lors d'un achat auprès de fournisseurs chinois, confirmez toujours la norme de fabrication du produit. Un boulon marqué « GB/T 5783 classe 10.9 » doit satisfaire aux exigences mécaniques de la classe 10.9 de l'ISO 898-1, mais les contrôles de process, la documentation de traçabilité et les essais par lot peuvent différer de ceux d'un produit certifié ISO. Demandez le rapport d'essai matière (MTR / EN 10204 3.1) pour chaque lot de production.

**Étapes clés d'inspection et de vérification**
1. Vérification dimensionnelle : contrôlez le pas de filetage, le diamètre de tige, la longueur et les dimensions de tête au regard des tolérances ISO 4014 / ISO 4017 / DIN 6921, avec calibres passe/non-passe ou machines à mesurer tridimensionnelles.
2. Essais mécaniques : les essais de traction et de limite d'élasticité selon l'ISO 898-1 doivent être réalisés sur des boulons échantillons de chaque lot, en particulier pour les classes 10.9 et 12.9.
3. Épaisseur et adhérence du revêtement : vérifiez l'épaisseur selon l'ISO 2063 ou l'ISO 1461 avec des jauges magnétiques ou à courants de Foucault. Réalisez des essais d'adhérence par pliage et ruban adhésif sur les revêtements électrolytiques.
4. Vérification de dureté : les essais Rockwell ou Vickers confirment la classe de traitement thermique. Un boulon de classe 10.9 doit afficher 33–39 HRC.

**Chaîne d'approvisionnement et délais**
L'achat de fixations agricoles est fortement saisonnier. Le pic de demande se situe au T4 (octobre–décembre) pour la préparation des semis dans l'hémisphère sud et au T1 (janvier–mars) pour les semis de printemps dans l'hémisphère nord. Commander hors pic (T2–T3) donne généralement des prix 10 à 20 % meilleurs et des délais plus fiables. Les délais des boulons hexagonaux standard des fabricants chinois vont de 3 à 6 semaines pour les tailles courantes, avec 1 à 2 semaines supplémentaires en cas de revêtement spécifique. Les commandes de volume OEM doivent être passées 12 à 16 semaines avant la date de livraison cible.

**Quantités minimales et paliers de prix**
Pour les boulons hexagonaux de classe 8.8 et 10.9 en tailles agricoles standard (M8–M20), les quantités minimales vont typiquement de 500 à 5 000 pièces par taille selon le fournisseur. Les paliers de prix apparaissent généralement à 5 000, 20 000 et 100 000 pièces. Fin 2026, le prix FOB Shanghai pour des commandes par conteneur de boulons hexagonaux classe 10.9 M10–M16 finition zinc-nickel va de 1,80 à 3,20 USD par kilogramme, soit environ 1 500–2 600 USD par tonne métrique pour des commandes agricoles standard. Consultez notre """ + LINK + """ pour les nuances 8.8/10.9. """ + REL
)


def main():
    path = 'content/articles/%s.json' % SLUG
    a = json.load(open(path))
    changed = 0
    for s in a['sections']:
        sid = s['id']
        if sid not in FR:
            continue
        en = s['body']['en']
        if s['body'].get('fr') and len(s['body']['fr']) >= 0.9 * len(en):
            print('skip(已扩写)', sid)
            continue
        fr = FR[sid]
        assert not re.search('[\u4e00-\u9fff]', fr), sid
        assert '<p><p>' not in fr
        s['body']['fr'] = fr
        changed += 1
        print('扩写', sid, len(en), '->', len(fr))
    if changed:
        open(path, 'w').write(json.dumps(a, ensure_ascii=False, indent=2) + '\n')
    print('共 %d 节' % changed)


if __name__ == '__main__':
    main()

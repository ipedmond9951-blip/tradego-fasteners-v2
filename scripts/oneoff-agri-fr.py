#!/usr/bin/env python3
"""agricultural-machinery-fastener-guide 法语扩写第一批：第 0/1/2/3 节（简介、标准、强度等级、耐蚀）。
纯翻译英文既有内容，不新增事实；数字、标准号、单位逐条对齐。
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

FR['introduction'] = (
"""Les machines agricoles travaillent dans certains des environnements les plus rudes de toute l'industrie. Tracteurs, moissonneuses, semoirs et charrues sont exposés en permanence aux sols abrasifs, aux engrais corrosifs, aux pesticides acides, au lisier, à l'humidité et à des écarts de température extrêmes. Chaque fixation de ces machines doit résister au desserrage induit par les vibrations, aux charges de choc des travaux au champ et à la corrosion galvanique issue du contact entre métaux différents.

Contrairement aux fixations automobiles ou industrielles courantes, les fixations agricoles doivent répondre à des exigences particulières dictées par des organismes comme l'American Society of Agricultural and Biological Engineers (ASABE) et les organisations internationales de normalisation. Les conséquences d'une défaillance au champ sont lourdes : un boulon de charrue cassé pendant les semis de printemps peut coûter à un agriculteur une journée entière de productivité et des milliers de dollars de perte de rendement.

Ce guide récapitule les spécifications critiques, les nuances de matériaux, les revêtements et les normes que tout fabricant de machines agricoles, technicien de maintenance et acheteur doit connaître. Des spécifications OEM de John Deere et Case IH jusqu'aux classes de propriétés de l'ISO 898-1, nous détaillons exactement ce qui fait la performance d'une fixation agricole en conditions extrêmes. Consultez notre """ + LINK + """ pour les nuances 8.8/10.9.

""" + REL
)

FR['iso-standards'] = (
"""Les fixations pour machines agricoles relèvent d'un système stratifié de normes internationales, nationales et OEM. Savoir quelle norme s'applique à chaque type de fixation est déterminant pour une spécification et un achat corrects.

**ISO 898-1 — Propriétés mécaniques des fixations**
L'ISO 898-1 est la norme fondatrice des propriétés mécaniques des fixations en acier au carbone et en acier allié. Elle définit des classes de propriétés telles que 8.8, 10.9 et 12.9, qui indiquent la résistance à la traction et la limite d'élasticité. Par exemple, un boulon de classe 10.9 présente une résistance nominale à la traction de 1 000 MPa et une limite d'élasticité de 900 MPa. C'est la référence mondiale pour déterminer si une fixation convient aux applications agricoles fortement sollicitées.

**ISO 4014 et ISO 4017 — Boulons hexagonaux**
L'ISO 4014 (boulons hexagonaux à tige partiellement filetée) et l'ISO 4017 (vis hexagonales entièrement filetées) sont les fixations à tête hexagonale les plus courantes sur les châssis, attelages et supports d'outils agricoles. L'ISO 4014 couvre des boulons de M1,6 à M64 et des longueurs de 30 à 300 mm. Ces normes précisent les tolérances dimensionnelles, l'ajustement du filetage et les exigences de propriétés mécaniques.

**DIN 6921 — Boulons hexagonaux à embase**
La DIN 6921 définit les boulons hexagonaux à embase, qui comportent une embase type rondelle sous la tête. Cette conception répartit la charge de serrage sur une surface plus large, ce qui les rend adaptés aux carters de transmission de tracteur, aux supports d'essieu et aux points de fixation où la résistance au desserrage par vibration est primordiale.

**GB/T 5782 et GB/T 5783 — Boulons hexagonaux chinois**
La GB/T 5782 (boulons hexagonaux, grade de produit B) et la GB/T 5783 (boulons hexagonaux entièrement filetés, grade de produit C) sont les normes nationales chinoises équivalentes de l'ISO 4014 et de l'ISO 4017. Les fabricants chinois qui alimentent le marché mondial des machines agricoles les utilisent largement. Les importateurs et les OEM qui s'approvisionnent en Chine doivent vérifier que les boulons marqués GB/T atteignent ou dépassent la classe de propriétés ISO équivalente.

**ISO 3506 — Fixations en acier inoxydable**
Pour les applications exigeant une résistance à la corrosion supérieure — fixations d'épandeurs d'engrais, rampes de pulvérisateurs et matériels de manutention du lisier — l'ISO 3506-1 spécifie les propriétés mécaniques des fixations en acier inoxydable. Les nuances courantes comprennent A2-70 (inox 304, 700 MPa) et A4-80 (inox 316, 800 MPa). Le « A » désigne un acier inoxydable austénitique et le nombre indique la classe de résistance à la traction.

**ASTM A307 — Boulons standard en acier au carbone**
Sur les marchés nord-américains, l'ASTM A307 reste une norme très citée pour les boulons en acier au carbone d'usage général. Bien qu'elle impose des résistances inférieures à la classe 8.8 de l'ISO 898-1, les boulons A307 grade A sont couramment employés pour des assemblages structurels non critiques de matériels agricoles où le coût primer. Consultez notre """ + LINK + """ pour les nuances 8.8/10.9."""
)

FR['bolt-grades'] = (
"""Choisir la bonne nuance de boulon pour une machine agricole est l'une des décisions les plus lourdes de conséquences en conception et en maintenance. Une nuance inadaptée provoque des défaillances prématurées, des pannes au champ et des arrêts coûteux pendant les fenêtres critiques de semis et de récolte.

**Classe 8.8 — Usage agricole général**
Les boulons de classe 8.8 (ISO 898-1) sont la cheville ouvrière des machines agricoles. Avec une résistance à la traction de 800 MPa et une limite d'élasticité de 640 MPa, ce sont des fixations en acier à moyen carbone trempé et revenu, adaptées au serrage général sur tracteurs, outils et accessoires. John Deere et Case IH spécifient la classe 8.8 pour de nombreux points de montage standard, panneaux de carrosserie et assemblages structurels non critiques. La classe 8.8 équivaut au grade 5 SAE.

**Classe 10.9 — Applications fortement sollicitées**
Les boulons de classe 10.9 (1 000 MPa à la traction, 900 MPa de limite d'élasticité) sont des fixations en acier allié trempé et revenu conçues pour les charges lourdes et les contraintes de choc. En matériel agricole, la classe 10.9 est la nuance minimale recommandée pour les composants de relevage trois points, les liaisons d'arbre de prise de force, les supports de bras de chargeur et les brides de montage de doseurs de semences. La norme d'ingénierie JDM F15 de John Deere fixe des exigences de couple-tension et de surface d'appui que les fixations de classe 10.9 satisfont couramment.

**Classe 12.9 — Assemblages critiques et de sécurité**
Les boulons de classe 12.9 (1 200 MPa à la traction, 1 080 MPa de limite d'élasticité) constituent la classe la plus résistante couramment disponible en machines agricoles. Ils sont réservés aux assemblages de sécurité et fortement sollicités : montage de trémie de moissonneuse, points d'articulation de rampe de pulvérisateur, brides de dents de déchaumeur. Comme les boulons de classe 12.9 sont plus fragiles que les nuances inférieures, les spécifications de couple et la longueur d'engagement du filetage doivent être strictement respectées.

**Boulons de charrue grade 8**
Les boulons de charrue (normes ASABE) sont des fixations spécialisées pour les outils travaillant le sol. Ils présentent une tête fraisée à profil bas, qui résiste à l'usure par contact avec la terre, et un corps à grande longueur de serrage qui résiste aux efforts de cisaillement. Les boulons de charrue grade 8 sont la norme pour les charrues à versoirs, les charrues à dents et les socs de cultivateurs. La conception particulière de la tête évite l'accrochage aux résidus et réduit l'adhérence du sol.

**Grade 5 contre classe 8.8 — impérial contre métrique**
Pour les matériels nord-américains, les boulons SAE grade 5 (proches de la classe 8.8 ISO) sont la norme pour les applications moyennement sollicitées, tandis que le SAE grade 8 (proche de la classe 10.9 ISO) sert aux applications fortement sollicitées. Lors d'un approvisionnement international, vérifiez toujours que le système de marquage des classes de propriétés est correctement interprété : le grade 5 impérial et la classe 8.8 métrique ont des méthodes d'essai et des exigences minimales différentes. Consultez notre """ + LINK + """ pour les nuances 8.8/10.9."""
)

FR['corrosion-resistance'] = (
"""La corrosion est le principal mode de défaillance des fixations agricoles. Le lisier, les engrais à base d'urée, le nitrate d'ammonium et les pesticides acides créent des micro-environnements très corrosifs qui attaquent l'acier nu à un rythme accéléré. Une fixation qui tient 10 ans en application automobile peut céder en 18 mois dans une stabulation ou près d'un épandeur d'engrais.

**Galvanisation à chaud (ISO 1461)**
La galvanisation à chaud est l'un des systèmes de protection contre la corrosion les plus rentables disponibles. Le procédé recouvre la fixation d'une couche de zinc généralement épaisse de 40 à 85 μm, qui protège l'acier à la fois par effet barrière et par protection cathodique sacrificielle. Pour les applications agricoles proches de stockages d'engrais ou d'installations d'élevage, les boulons galvanisés à chaud selon l'ISO 1461 sont fortement recommandés. L'épaisseur du revêtement de zinc résiste aux dommages de manutention et assure des décennies de service en environnement modéré.

**Zinc-nickel électrolytique (ISO 4042)**
Le zinc-nickel électrolytique selon l'ISO 4042 offre une résistance à la corrosion supérieure au zingage courant, avec des tenues au brouillard salin dépassant 1 000 heures jusqu'à la rouille blanche dans de nombreuses configurations. L'ajout de nickel au bain de zinc améliore les propriétés barrière du revêtement et réduit le risque de fragilisation par l'hydrogène sur les fixations à haute résistance. Pour les boulons de classe 10.9 et 12.9, le zinc-nickel est le revêtement privilégié lorsque l'aspect esthétique et la précision dimensionnelle sont exigés en plus de la protection anticorrosion.

**Revêtements à lamelles de zinc (ISO 10683 / DIN 50979)**
Les systèmes à lamelles de zinc (Geomet, Magni et équivalents) offrent une excellente résistance à la corrosion sans risque de fragilisation par l'hydrogène. Ces revêtements à base solvant sont appliqués en couches fines (8 à 12 μm) et conviennent aux fixations de classe 10.9 et 12.9 pour lesquelles la fragilisation par l'hydrogène doit être évitée. Ils se comportent exceptionnellement bien dans les essais de corrosion cyclique simulant les conditions de champ.

**Acier inoxydable A2 (304) et A4 (316)**
Pour les environnements les plus corrosifs — trémies d'engrais, cuves de pulvérisateurs et systèmes de manutention du lisier — les fixations en acier inoxydable austénitique selon l'ISO 3506-1 sont la solution de référence. L'A4-80 (inox 316, 800 MPa) offre une excellente résistance à la piqûre et à la corrosion caverneuse induites par les chlorures, ce qui le rend idéal pour les matériels exposés au lisier, aux cultures irriguées à l'eau de mer ou aux exploitations littorales. La teneur en molybdène de l'inox 316 apporte un avantage décisif sur l'inox 304 (A2-70) en milieu riche en chlorures.

**Oxydation noire et phosphatation**
L'oxydation noire (ISO 2063) et les revêtements de phosphate de manganèse n'offrent qu'une protection anticorrosion limitée et servent surtout à l'aspect et à la prévention de la rouille initiale pendant le stockage. Ils ne conviennent pas à un service agricole permanent en extérieur sans protection complémentaire. Ne spécifiez jamais de fixations à oxydation noire pour une application impliquant engrais, lisier ou exposition régulière à l'eau. Consultez notre """ + LINK + """ pour les nuances 8.8/10.9."""
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

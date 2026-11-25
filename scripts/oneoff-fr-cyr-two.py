#!/usr/bin/env python3
"""一次性修复：两篇法语 §0 被俄语词块污染（逐句按英文原文重写为规范法语）。

断言关键事实，缺一条就失败退出（fail-closed）。
"""
import json
import re

CYR = re.compile(r"[а-яА-ЯёЁ]")

TANZANIA = """Les fixations de voie ferrée du SGR tanzanien doivent satisfaire à des normes internationales strictes qui garantissent l'intégrité de la voie sous de lourdes charges de fret et de voyageurs, sur les 1 219 kilomètres du corridor à écartement standard reliant Dar es Salaam à Morogoro, Makutupora puis au lac Victoria [1][2]. La Tanzania Railways Corporation a rendu obligatoire la conformité à la série de normes EN 13481, qui définit les exigences de performance des systèmes de fixation de rail utilisés sur voie ballastée [3]. Contrairement aux projets d'infrastructure informels, la construction du SGR exige une vérification documentée que chaque lot de fixations atteint les propriétés mécaniques spécifiées avant l'approbation de la pose.
<p>La hiérarchie des spécifications matière pour les fixations du SGR tanzanien impose généralement des boulons à haute résistance de classe 8.8 pour les applications de fixation courantes, et de classe 10.9 pour les points de connexion critiques où la résistance à la fatigue est primordiale [4]. Les boulons de classe 8.8 offrent une résistance à la traction minimale de 830 MPa et une limite d'élasticité de 660 MPa, suffisantes pour la retenue standard des attaches de rail. Les variantes de classe 10.9 portent la résistance à la traction à 1 040 MPa minimum, ce qui procure la marge de sécurité supplémentaire exigée par l'exploitation voyageurs à grande vitesse prévue sur le réseau. Pour les responsables achats, spécifier la bonne classe influe directement sur le coût et sur la performance structurelle : la classe 10.9 coûte environ 15 à 20 % de plus que la classe 8.8, mais offre une durée de vie en fatigue supérieure de 25 % sous chargement cyclique.</p>
<p>Les exigences de protection contre la corrosion, dans le climat varié de la Tanzanie, appellent une attention particulière lors de la spécification. Le corridor côtier proche de Dar es Salaam exige une galvanisation à chaud avec une épaisseur minimale de revêtement de zinc de 70 micromètres pour résister à l'exposition au sel, tandis que les sections intérieures peuvent admettre des revêtements de 45 à 55 micromètres [5]. Les projets proches du lac Victoria font face à des contraintes d'humidité qui exigent une protection équivalente. La galvanisation électrolytique, moins chère, ne fournit que 5 à 10 micromètres et se dégrade en 5 à 7 ans dans les conditions tropicales de Tanzanie : c'est inacceptable pour une infrastructure dont la durée de vie nominale est de 25 à 30 ans. La Banque africaine de développement a financé une part importante de ce développement d'infrastructure, en insistant sur des exigences de durabilité qui justifient des investissements appropriés dans la protection contre la corrosion [5].</p>"""

THREADED = """La tige filetée (aussi appelée tige entièrement filetée ou goujon) est une fixation dont le filetage est continu sur toute sa longueur. Ce produit polyvalent répond à d'innombrables applications dans la construction, l'exploitation minière, la fabrication et la maintenance.
<p>La tige filetée est disponible en différents matériaux, diamètres, longueurs et spécifications de filetage pour répondre à des exigences d'application variées.</p>
<p>Spécifications courantes :</p>
<ul><li>Métrique : M6, M8, M10, M12, M16, M20, M24, M30, M36</li><li>Pouces : 1/4" à 2" et au-delà</li><li>Longueurs : généralement de 1 m à 3 m, longueurs sur mesure disponibles</li><li>Classes : 4.6, 8.8, 10.9 pour l'acier au carbone ; A2, A4 pour l'inox</li></ul>
<p>La tige filetée est normalement découpée à longueur à partir de barres plus longues, mais TradeGo propose des longueurs standard prêtes à l'emploi.</p>
<p>TradeGo fournit des tiges filetées en divers matériaux et revêtements pour les applications de construction, d'exploitation minière et industrielles en Afrique. Ressources associées : <a href="/en/products/high-tensile-bolts">boulons à haute résistance</a> <a href="/en/products/anchor-bolts">boulons d'ancrage</a> <a href="/en/products/stainless-bolts">fixations en acier inoxydable</a> <a href="/en/products/hex-bolts">boulons hexagonaux</a> <a href="/en/products/lock-nuts">écrous de blocage</a> <a href="/en/products/washers">rondelles</a> <a href="/en/products/self-drilling-screws">vis autoperceuses</a> <a href="/en/products/socket-screws">vis à douille</a>. Ce cadre d'approvisionnement s'applique à l'achat de fixations pour la construction, l'exploitation minière, l'énergie, l'automobile et les applications industrielles générales. La logique de décision privilégie la régularité de la qualité, la fiabilité du fournisseur et le coût total de possession plutôt que le prix unitaire à court terme. Pour les acheteurs B2B en Afrique, en Amérique latine et en Asie du Sud-Est, des considérations supplémentaires interviennent : exigences douanières régionales, options de groupage de conteneurs et mécanismes de sécurisation des paiements. Des spécifications normalisées, valables d'un projet à l'autre, réduisent le temps de formation, le délai de traitement des demandes de prix et l'effort d'intégration des fournisseurs.</p>"""

TARGETS = [
    ("tanzania-sgr-railway-fastener-specifications", 0, "fr", TANZANIA,
     ["1 219", "EN 13481", "830 MPa", "660 MPa", "1 040 MPa", "70 micromètres", "45 à 55 micromètres", "Banque africaine"]),
    ("threaded-rod-applications-guide", 0, "fr", THREADED,
     ["M36", "A2, A4", "TradeGo", "coût total de possession"]),
]


def main():
    for slug, sec, lang, text, must in TARGETS:
        path = "content/articles/%s.json" % slug
        art = json.load(open(path))
        old = art["sections"][sec]["body"][lang]
        assert CYR.search(old), "%s §%d 本来没有俄语残留，拒绝覆盖" % (slug, sec)
        for m in must:
            assert m in text, "译文缺少关键事实：%s" % m
        assert not CYR.search(text), "%s 译文里还有俄语" % slug
        art["sections"][sec]["body"][lang] = text
        open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
        print("✓ %s §%d %s 重写 %d 字符（原 %d）" % (slug, sec, lang, len(text), len(old)))


if __name__ == "__main__":
    main()

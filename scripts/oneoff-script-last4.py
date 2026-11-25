import json

JOBS = [
    ("solar-panel-mounting-fasteners-africa", 4, "heading", "pt",
     ["अक्सर पूछे जाने वाले प्रश्न", "Perguntas frequentes"]),
    ("solar-panel-mounting-fasteners-africa", 4, "body", "pt",
     ["<p>नीचे अक्सर पूछे जाने वाले प्रश्न देखें।</p> संबंधित संसाधन:",
      "<p>Veja as perguntas frequentes abaixo.</p> Recursos relacionados:"]),
    ("drc-mining-concession-fastener-logistics", 1, "body", "ja",
     ["値をを確認する материальные испытанияレポート", "値を確認する材料試験レポート"]),
    ("kenya-affordable-housing-fasteners-wholesale", 1, "body", "ja",
     ["個別の компонентыではなく、 완전한ファスナーーキットの一括価格",
      "個別の部品ではなく、完成したファスナーキットの一括価格"]),
    ("south-africa-fastener-market-case-study", 2, "body", "ja",
     ["腐食から 제품을 보호했습니다。コンテナ内の湿度管理 また важна для предотвращения конденсации влаги на металлических изделиях во 時間 морской перевозки через тропические регионы.",
      "腐食から製品を守っています。コンテナ内の湿度管理も、熱帯地域を経由する長い海上輸送中に金属製品へ結露が生じるのを防ぐうえで重要です。"]),
]

for slug, sec, fld, lang, pair in JOBS:
    path = "content/articles/%s.json" % slug
    art = json.load(open(path))
    old, new = pair
    text = art["sections"][sec][fld][lang]
    assert old in text, "未命中 %s %r" % (slug, old[:30])
    art["sections"][sec][fld][lang] = text.replace(old, new)
    open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
    print("✓", slug, sec, fld, lang)

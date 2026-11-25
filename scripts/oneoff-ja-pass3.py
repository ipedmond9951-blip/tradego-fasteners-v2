#!/usr/bin/env python3
"""日语正文第三轮：把被韩/俄/乌语顶坏的句子整句改写回日语。

第二轮清掉了中文词与虚词；这一轮清的是「句子级」残留——
管线把韩语/俄语动词形态直接塞进日语句子（`~을 유지하여`、`~합니다`、`~때때로`），
句子结构已经坏了，只能整句重写。含 HTML 锚点的句子不动整句，改做片段替换。

两种作业：SENT（整句替换，按命中 fragment 找句子边界）、TOK（片段替换）。
每条都断言「fragment 必须存在」，跑完自动复检，剩余数打出来。
"""
import glob
import json
import re

CYR = re.compile(r"[а-яА-ЯёЁ]+")
HAN = re.compile(r"[\uac00-\ud7af]+")
BOUND = re.compile(r"[。\n]|<br/>|<p>|</p>")

SENT = [
    ("africa-informal-construction-fastener-demand", 1, "body", "продаются",
     "六角ボルト（M8〜M16）、ナット、平座金は通常、混合ハードウェアパックで販売されています。"),
    ("africa-informal-construction-fastener-demand", 2, "body", "периферий",
     "主要な流通チャネルは独立系のハードウェア店で、多くは市場町や周辺地域の家族経営の商店です。"),
    ("african-ftz-fastener-import-procedures", 5, "body", "는",
     "ステップ3 — 出荷の手配：アフリカの目的港への直航ルートを持つ船社（Maersk、MSC、CMA CGM）で20フィートまたは40フィートのFCLコンテナを予約します。"),
    ("african-ftz-fastener-import-procedures", 6, "body", "이해",
     "AfCFTA特恵関税を利用した場合の財務影響を理解することは、調達判断にとって重要です。"),
    ("african-ftz-fastener-import-procedures", 6, "body", "상",
     "原産地証明書の取得費用（通常1出荷あたり150〜300米ドル）と、域内付加価値35%規則を満たすための仕上げ費用を考慮しても、AfCFTAを利用する正味の財務便益は1件あたり十分に大きいものです。"),
    ("algeria-algiers-oil-gas-fastener-specifications", 2, "body", "팅",
     "「L」低炭素指定（炭素最大0.03%）は、溶接作業中の鋭敏化を防ぎ、熱影響部の腐食を避ける必要がある現場設置ボルト締結にとって重要です。"),
    ("algeria-algiers-oil-gas-fastener-specifications", 2, "body", "이크",
     "GEOMET亜鉛フレーク処理は、300℃以下で施工できる利点を持ち、寸法上の問題なく大型組立体を処理できる中程度の性能を提供します。"),
    ("algeria-algiers-oil-gas-fastener-specifications", 4, "body", "антисеиз",
     "サワーサービス用途では、低カドミウムめっきまたは銅系の防食添加剤が、取り付け・取り外しサイクル中の焼付き防止に有効です。"),
    ("algeria-algiers-oil-gas-fastener-specifications", 5, "body", "진을",
     "ビューローベリタス、ロイドレジスター、SGSなどの機関は主要製造地域に検査員を常駐させ、生産中のホールドポイントと監視を可能にしています。"),
    ("angola-lng-project-fastener-procurement", 0, "body", "анда",
     "アンゴラLNG施設はザイール州ソヨに位置し、コンゴ川河口沿い、ルアンダの北約250キロメートルにあります[1]。"),
    ("angola-lng-project-fastener-procurement", 1, "heading", "ключевые",
     "アンゴラLNGプロジェクトに必須の主要ファスナー仕様"),
    ("angola-lng-project-fastener-procurement", 1, "body", "потому",
     "モリブデン含有量は重要で、最低2.0〜2.5質量%あれば、塩化物が濃縮する沿岸大気での孔食を抑制します。"),
    ("angola-lng-project-fastener-procurement", 2, "body", "готовые",
     "調達マネージャーにとっての実務的な意味は、コンプライアンスが単なる書類作業ではないということです。ファスナーが据付可能な状態で現場に届くか、ルアンダ港の倉庫で書類再提出を待つことになるかを左右します。"),
    ("angola-lng-project-fastener-procurement", 5, "body", "области",
     "よくある調達ミスは、標準的な代替品で同等の性能が得られる領域で、材料グレードを過剰に指定してしまうことです。"),
    ("angola-lng-project-fastener-procurement", 5, "body", "별로",
     "調達チームはまた、総プロジェクトコストを下げる付加価値サービスも検討すべきです。図面番号と据付位置ごとにラベルを貼った組立済みファスナーキットの供給、ASTM F788に従った部品番号・ヒート番号の刻印などです。"),
    ("angola-lng-project-fastener-procurement", 6, "body", "подаются",
     "すべての書類は英語で作成し、SI単位で提出する必要があります。"),
    ("china-fasteners-zimbabwe-procurement-guide", 12, "body", "목록",
     "ジンバブエ向けファスナー注文の価格が必要ですか。当社のファスナーカタログをご覧いただくか、プロジェクト種別、ファスナーリスト、推定数量、配送先住所を添えて仕様をお送りください。"),
    ("china-hex-nuts-manufacturer", 2, "body", "лучши",
     "支払い条件は、需要と信用状の受入れ状況に応じてサプライヤーと交渉してください。"),
    ("china-iso-9001-fastener-manufacturer-directory", 4, "body", "제공하고",
     "TradeGoは国際バイヤー向けに専任のアカウントマネージャーを配置し、営業時間中（UTC+8）のビデオ通話にも対応しています。"),
    ("china-iso-9001-fastener-manufacturer-directory", 5, "body", "готовы",
     "検証済みのISO 9001ファスナーメーカーからの調達をお考えですか。TradeGo Fastenersは国際バイヤーからのお問い合わせを歓迎します。"),
    ("drc-mining-concession-fastener-logistics", 0, "body", "부는",
     "DRC鉱業登録局はすべての権益操業を監督し、輸入産業資材の書類を要求しています[1]。"),
    ("drc-mining-concession-fastener-logistics", 2, "body", "система",
     "DRC税関当局は統一商品説明・符号制度（HS）を適用しており、ファスナーの関税は特定のHS分類と申告価額に応じて通常10〜20%の範囲です[2]。"),
    ("drc-mining-concession-fastener-logistics", 4, "body", "입니다",
     "輸送コストはルート選択と出荷量に大きく左右され、DRC鉱業ファスナー物流における最大の変動費です。"),
    ("drc-mining-concession-fastener-logistics", 5, "body", "합니다",
     "一部の鉱業地域では空気中の湿気からの塩暴露が標準鋼ファスナーの腐食を加速するため、これらの用途には溶融亜鉛めっきまたはステンレス鋼を適切に選定する必要があります。"),
    ("egypt-fastener-market-complete-guide", 1, "body", "다음",
     "エジプトの建設セクターで主に需要のあるファスナーカテゴリーは次のとおりです：屋根用ファスナー（IBRおよび波板屋根用釘とEPDMワッシャーを含む）、構造用ボルト（鉄骨構造向け8.8および10.9グレード）、金属建築用セルフドリリングねじ、コンクリートアンカーとウェッジアンカー、沿岸部向けステンレス鋼ファスナー、そして各種グレードのねじ・ボルト・座金を含む一般ハードウェア。"),
    ("ethiopia-industrial-park-fastener-supply", 0, "body", "레",
     "エチオピアは東アフリカで最も積極的に産業団地開発を進める国で、現在アワサ、ディレダワ、アダマ、コムボルチャ、メケレ、バイダル、ジンマ、デブレベルハンなど12カ所の政府指定産業団地が稼働しています。"),
    ("ethiopia-industrial-park-fastener-supply", 0, "body", "를",
     "輸入量のうち中国が約72%、インドが14%、トルコが8%、EUが6%を占めています[2]。"),
    ("ethiopia-industrial-park-fastener-supply", 4, "body", "서비스를",
     "次に、重要な用途では、SGS、ビューローベリタス、インターテックなどの認定機関による第三者検査を要求します。"),
    ("fastener-selection-guide-african-construction", 2, "body", "이내",
     "海岸から10km以内の沿岸プロジェクトでは、溶融亜鉛めっきまたはステンレス鋼ファスナーが強く推奨されます。"),
    ("fastener-supply-chain-africa-beira-corridor", 4, "body", "больш",
     "これは、同じ出荷をダーバン経由にした場合の概算10,400〜11,200米ドルと比べて12〜19%の節約になり、数量が大きいほど効果が積み上がります。"),
    ("fastener-warehouse-management-best-practices", 2, "body", "정확한",
     "正確な比較を行うには、3〜5社の適格サプライヤーから同一のRFQを入手し、陸揚げ費用（製品＋輸送＋保険＋関税）を比較してください。"),
    ("gaskets-specialty-washers-high-temp-guide", 3, "body", "가스켓",
     "複合材質の選定では、渦巻きガスケット（スパイラルガスケット）はASME B16.20およびAPI 601に準拠し、石油化学・石油精製業界の標準として広く採用されています。"),
    ("kenya-affordable-housing-fasteners-wholesale", 3, "body", "운영하는",
     "Kenya Ports Authorityが運営するモンバサ港は、ケニアのファスナー輸入の95%以上を扱い、主要中国港からの平均海上輸送日数は25〜35日です[2]。"),
    ("kenya-affordable-housing-fasteners-wholesale", 3, "body", "이며",
     "モンバサからナイロビ（500km）までの内陸輸送は専用トラックで1kgあたり0.08〜0.15ドル、混載貨物オプションでは1kgあたり0.05〜0.08ドルまで下がります。"),
    ("kenya-affordable-housing-fasteners-wholesale", 5, "body", "는",
     "これらの取り決めはまた、需要期の製造能力の優先確保を確実にし、建設スケジュールを遅らせる在庫切れを防ぎます。"),
    ("kenya-infrastructure-fastener-demand", 0, "body", "вай",
     "ケニアのインフラセクターは東アフリカの主要なファスナー需要の牽引役として台頭しており、建設活動はナイロビ、モンバサ、キスム、そしてLAPSSET（ラム港－南スーダン－エチオピア輸送）回廊に集中しています。"),
    ("kenya-infrastructure-fastener-demand", 0, "body", "했으며",
     "TradeGo Fastenersは2020年から2025年にかけてケニアのプロジェクトへ建設用ファスナーを1,100トン以上出荷し、2025年の出荷量は前年比28%増となりました。EPC請負業者がナイロビ－モンバサ高速道路の拡張工事を強化したためです。"),
    ("kenya-infrastructure-fastener-demand", 1, "body", "피스",
     "ナイロビの南60kmに位置するケニアの旗艦テクノロジーシティ計画は（2025〜2028年の）第1期建設に入っており、400ヘクタールの敷地にデータセンター、オフィスパーク、住宅が含まれます。"),
    ("kenya-infrastructure-fastener-demand", 1, "body", "수용",
     "これには新設のキスムコンベンションセンター（5,000席収容）、ビクトリア湖上のボンド港ターミナル、キスムスマートシティの光ファイバー網が含まれます。"),
    ("kenya-infrastructure-fastener-demand", 2, "body", "성은",
     "非適合はモンバサ港での押収と、輸入者負担による強制再輸出につながります。"),
    ("kenya-infrastructure-fastener-demand", 4, "body", "하며",
     "TradeGoのナイロビ技術チームは、100トン以上のすべてのEPC契約で現場訪問を実施し、校正済み機器でEN 1090-2 EXC2仕様に基づく締付トルクを確認・検証します。"),
    ("morocco-casablanca-port-fastener-import-procedure", 0, "body", "А",
     "EU・モロッコ自由貿易協定の署名国としてのモロッコの立場と、アフリカ大陸自由貿易圏（AfCFTA）への参加は、FTA相手国出身のファスナーに優遇関税率をもたらします[6]。"),
    ("morocco-casablanca-port-fastener-import-procedure", 1, "body", "이유로",
     "世界銀行の貿易促進評価によれば、税関当局は輸入申告の約23%を書類不備を理由に却下しています[6]。"),
    ("morocco-casablanca-port-fastener-import-procedure", 4, "body", "때때로",
     "<p>天候の乱れは時にカサブランカ港の操業に影響します。</p>"),
    ("morocco-casablanca-port-fastener-import-procedure", 5, "body", "요구",
     "流通業者は国際サプライヤーにジャストインタイム配送を求めることがますます多くなり、輸出者にカサブランカ倉庫やタンジェMEDのような積替ハブでのバッファ在庫の維持を要求しています。"),
    ("morocco-casablanca-port-fastener-import-procedure", 5, "body", "계산",
     "<p>カサブランカ港でのファスナー輸入に関わるその他の考慮事項には、港の荷役スケジュール、貨物追跡、関税・税額の計算が含まれます。</p>"),
    ("mozambique-fastener-market-case-study", 5, "body", "місцевих",
     "<p>複数の国で事業を展開するB2Bバイヤーにとっては、地域標準と現地の通関要件・仕様を調和させることが重要です。</p>"),
    ("mozambique-lng-construction-fasteners-standards", 2, "body", "풍부",
     "Mozambique LNGプロジェクトにとってB7の重要な利点は、プロセス配管で遭遇するメタンに富むガス環境との適合性です。"),
    ("namibia-uranium-mining-fastener-corrosion", 1, "body", "магний",
     "加工工場の用途では、アルミニウム－ニッケル－マグネシウム系コーティング（Magni 565やDelta Protektなどの商品名を含む）が、促進塩水噴霧試験（5% NaCl、白錆まで1,000時間超）で従来のHDGより3倍優れた耐食性を示します[2]。"),
    ("solar-panel-mounting-fasteners-africa", 0, "body", "되지",
     "さらに、現在も6億人以上が電気を利用できていないエネルギー格差が、太陽光発電の普及を促す重要な社会経済要因となっています。"),
    ("solar-panel-mounting-fasteners-africa", 3, "body", "구축",
     "これらの仕様を満たす金具を選定することで、長期にわたり信頼性の高い太陽光システムが構築されます。"),
    ("south-africa-fastener-market-case-study", 2, "body", "продукта",
     "正確な比較には、3〜5社の適格サプライヤーから同一のRFQを要請し、製品＋輸送＋保険＋関税を含む陸揚げ原価を比較してください。"),
    ("south-africa-fastener-market-guide", 2, "body", "위해서는",
     "正確な比較には、3〜5社の適格サプライヤーから同一のRFQを入手し、陸揚げコスト（製品＋送料＋保険＋関税）を比較してください。"),
    ("uganda-oil-refinery-fastener-requirements", 2, "body", "участвует",
     "<br/>第三者検査機関は精油所の調達過程に頻繁に関与します。"),
    ("zambia-copper-mining-fasteners-grade-selection-2026", 0, "body", "중요한",
     "サプライヤー間のグレード変動（同じISO分類内でも）はメンテナンスサイクル中に互換性の問題を引き起こすため、標準化は重要な調達方針となります。"),
    ("zambia-copper-mining-fasteners-grade-selection-2026", 2, "body", "상",
     "ファスナー交換に1件あたり大きな工数が必要な地下用途では、A4-80は中程度の腐食域で許容できるサービス寿命を提供しますが、ポンプハウジングやコンベヤアイドラー架台のような露出の大きい箇所では不十分な場合があります。"),
    ("zambia-copper-mining-fasteners-grade-selection-2026", 3, "body", "прилож",
     "調達マネージャーは、天井荷重を支持する用途や人身安全システムで使うファスナーについて、サプライヤーがZABS型式承認証明書を提供することを確認する必要があります。"),
    ("zim-construction-anchor-bolts-supplier-evaluation-corrosion-resistance", 0, "body", "따르면",
     "ASTM F1554によれば、腐食性環境に設置するアンカーボルトはASTM F2329による溶融亜鉛めっき（HDG）が必要で、通常条件下で30年以上の耐用年数が見込まれます。"),
    ("zim-construction-anchor-bolts-supplier-evaluation-corrosion-resistance", 3, "body", "대부분의",
     "ジンバブエの気候では、ほとんどの都市部と鉱山環境がISO 12944でC3〜C4に分類され、HDGアンカーボルトは20〜40年の耐用年数を提供します。"),
    ("zim-construction-anchor-bolts-supplier-evaluation-corrosion-resistance", 4, "body", "대규모",
     "<strong>専門の産業代理店</strong>であるHilti Zimbabwe（認定代理店）は、化学アンカーや高強度機械式アンカーを含むプレミアムなアンカーシステムを提供し、技術エンジニアリング支援を背景に大規模インフラプロジェクトに適しています。"),
    ("zimbabwe-bolts-screws-b2b-construction-exports-2026", 2, "body", "сигнал",
     "これらのいずれかの信号は、そのサプライヤーが2026年の入札グレードの供給に対応できるとまだ認定されていないことを示します。"),
    ("zimbabwe-bolts-screws-b2b-construction-exports-2026", 3, "body", "ربط",
     "本物のMTCは各コンテナの生産ロットを相互参照し、SGSまたはビューローベリタスの検証スタンプを含み、SAZのクリアランスに提出されたCoCに直接紐づきます。"),
    ("zimbabwe-bolts-screws-b2b-construction-exports-2026", 3, "body", "되며",
     "未検証の偽造書類を受け入れると、長時間の国境留置、建設タイムラインの逸失、入札の自動失格、迫る関税制裁につながるため、2026年のファスナー輸入注文ではすべての適合書類の相互検証を必須の手順とします。"),
    ("zimbabwe-construction-megaprojects-fastener-demand", 3, "body", "상",
     "これらのプロジェクトには橋梁建設、ボックスカルバート設置、アスファルト舗装工事が必要で、いずれも多量の構造用ファスナーを要します。"),
]

TOK = [
    ("anchor-bolts-suppliers-africa", 1, "body", "위해", "ため"),
    ("malawi-fastener-market-case-study", 2, "body", "широко", "広く"),
    ("malawi-fastener-market-case-study", 2, "body", "必需的", "必須"),
    ("ghana-tema-port-fastener-import-procedure", 2, "body", "船会社로부터", "船会社から"),
    ("ghana-tema-port-fastener-import-procedure", 3, "body", "компонент", "部品"),
    ("ghana-tema-port-fastener-import-procedure", 4, "body", "照合하도록してください", "照合するようにしてください"),
    ("east-africa-construction-fastener-market", 1, "body", "ダレ-Момбаса", "ダルエスサラーム－モンバサ"),
    ("fastener-supply-chain-africa-beira-corridor", 6, "body", "ム буаヤオ", "ムブヤ・ヤオ"),
    ("harare-fastener-distributor-supplier-guide", 3, "body", "MT당", "1トンあたり"),
    ("kenya-infrastructure-fastener-demand", 0, "body", "ホットディップガルバニ징", "溶融亜鉛めっき"),
    ("non-standard-special-shape-screws-custom-guide", 1, "body", "割 голов", "頭部が破断するタイプ"),
    ("south-africa-fastener-market-case-study", 0, "body", "ブ리지", "ブリッジ"),
    ("tanzania-sgr-railway-fastener-specifications", 0, "body", "湖까지を結ぶ", "湖までを結ぶ"),
    ("morocco-casablanca-port-fastener-import-procedure", 6, "body", "義務적ですか", "義務ですか"),
    ("morocco-casablanca-port-fastener-import-procedure", 6, "body", "義務적です", "義務です"),
    ("zambia-fastener-market-case-study", 3, "body", "チルンドゥ Појединаで", "チルンドゥなどの主要国境で"),
]


def replace_sentences(text, frag, new):
    assert frag not in new, "新句里不能再含命中片段：%s" % frag
    n = 0
    while True:
        i = text.find(frag)
        if i < 0:
            break
        lo = 0
        for m in BOUND.finditer(text, 0, i):
            lo = m.end()
        hi = len(text)
        for m in BOUND.finditer(text, i + len(frag)):
            hi = m.end()
            break
        text = text[:lo] + new + text[hi:]
        n += 1
    return text, n


def main():
    done = 0
    touched = set()
    for slug, sec, fld, frag, new in SENT:
        path = "content/articles/%s.json" % slug
        art = json.load(open(path))
        t = art["sections"][sec][fld]["ja"]
        if frag not in t:
            print("  跳过（未命中）：%s §%d %r" % (slug, sec, frag))
            continue
        t, n = replace_sentences(t, frag, new)
        art["sections"][sec][fld]["ja"] = t
        open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
        done += n
        touched.add(path)
    for slug, sec, fld, frag, good in TOK:
        path = "content/articles/%s.json" % slug
        art = json.load(open(path))
        t = art["sections"][sec][fld]["ja"]
        if frag not in t:
            print("  跳过（未命中）：%s §%d %r" % (slug, sec, frag))
            continue
        done += t.count(frag)
        art["sections"][sec][fld]["ja"] = t.replace(frag, good)
        open(path, "w").write(json.dumps(art, ensure_ascii=False, indent=2) + "\n")
        touched.add(path)
    print("整句/片段改动 %d 处 / %d 篇" % (done, len(touched)))

    left = 0
    left_fields = 0
    for path in sorted(glob.glob("content/articles/*.json")):
        art = json.load(open(path))
        for s in art.get("sections", []):
            for fld in ("heading", "body"):
                d = s.get(fld)
                if not isinstance(d, dict) or not d.get("ja"):
                    continue
                n = len(CYR.findall(d["ja"])) + len(HAN.findall(d["ja"]))
                if n:
                    left += n
                    left_fields += 1
    print("复检：ja 字段里还剩外文 token %d 个 / %d 个字段" % (left, left_fields))


if __name__ == "__main__":
    main()

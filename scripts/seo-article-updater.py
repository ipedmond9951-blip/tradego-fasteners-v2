#!/usr/bin/env python3
"""SEO Article Updater - Fix placeholder FAQs and update images"""
import json
import os

ARTICLES_DIR = 'content/articles'

# Define proper FAQs for articles that need FAQ fixes
PROPER_FAQS = {
    'hex-nuts-selection-guide': {
        "id": "faq",
        "heading": {
            "en": "Frequently Asked Questions",
            "zh": "常见问题",
            "es": "Preguntas Frecuentes",
            "ar": "الأسئلة الشائعة",
            "fr": "Questions Fréquemment Posées",
            "pt": "Perguntas Frequentes",
            "ru": "Часто Задаваемые Вопросы",
            "ja": "よくある質問",
            "de": "Häufig Gestellte Fragen",
            "hi": "सामान्य प्रश्न"
        },
        "faqItems": [
            {
                "q": {
                    "en": "What is the difference between DIN 934 and ISO 4032 hex nuts?",
                    "zh": "DIN 934和ISO 4032六角螺母有什么区别？",
                    "es": "¿Cuál es la diferencia entre tuercas hexagonal DIN 934 e ISO 4032?",
                    "fr": "Quelle est la différence entre les écrous hexagonaux DIN 934 et ISO 4032?",
                    "pt": "Qual é a diferença entre porcas sextavadas DIN 934 e ISO 4032?",
                    "ru": "В чем разница между гайками DIN 934 и ISO 4032?",
                    "ja": "DIN 934とISO 4032の六角ナットの違いは何ですか？",
                    "de": "Was ist der Unterschied zwischen Sechskantmuttern nach DIN 934 und ISO 4032?",
                    "hi": "DIN 934 और ISO 4032 हेक्स नट में क्या अंतर है?",
                    "ar": "ما الفرق بين الصواميل السداسية DIN 934 و ISO 4032؟"
                },
                "a": {
                    "en": "DIN 934 and ISO 4032 are essentially the same standard for hex nuts. Both specify the same dimensions, thread tolerances, and mechanical properties. The key difference is that DIN 934 is the older German standard, while ISO 4032 is the current international standard. For new projects, ISO 4032 is recommended as it aligns with global procurement standards. Both are fully interchangeable in practice.",
                    "zh": "DIN 934和ISO 4032是基本相同的六角螺母标准。两者都规定了相同的尺寸、螺纹公差和力学性能。主要区别在于DIN 934是较旧的德国标准，而ISO 4032是当前的国际标准。对于新项目，建议使用ISO 4032，因为它符合全球采购标准。两者在实际使用中完全可以互换。",
                    "es": "DIN 934 e ISO 4032 son esencialmente el mismo estándar para tuercas hexagonales. Ambos especifican las mismas dimensiones, tolerancias de rosca y propiedades mecánicas. La diferencia clave es que DIN 934 es la norma alemana más antigua, mientras que ISO 4032 es la norma internacional actual.",
                    "fr": "DIN 934 et ISO 4032 sont essentiellement la même norme pour les écrous hexagonaux. Les deux spécifient les mêmes dimensions, tolérances de filetage et propriétés mécaniques.",
                    "pt": "DIN 934 e ISO 4032 são essencialmente o mesmo padrão para porcas sextavadas. Ambos especificam as mesmas dimensões, tolerâncias de rosca e propriedades mecânicas.",
                    "ru": "DIN 934 и ISO 4032 по сути являются одним и тем же стандартом для шестигранных гаек. Оба стандарта определяют одинаковые размеры, допуски резьбы и механические свойства.",
                    "ja": "DIN 934とISO 4032は本質的に同じ六角ナットの標準です。両者は同じ寸法、ねじ公差、機械的特性を規定しています。",
                    "de": "DIN 934 und ISO 4032 sind im Wesentlichen dieselbe Norm für Sechskantmuttern. Beide specify the same dimensions.",
                    "hi": "DIN 934 और ISO 4032 मूल रूप से हेक्स नट के लिए एक ही मानक हैं। दोनों समान आयामें, थ्रेड टॉलरेंस और यांत्रिक गुणों को निर्दिष्ट करते हैं।",
                    "ar": "DIN 934 و ISO 4032 هما في الأساس نفس المعيار للصواميل السداسية. يحدد كلاهما نفس الأبعاد وتسامح الخيط والخصائص الميكانيكية."
                }
            },
            {
                "q": {
                    "en": "What hex nut grade should I use with 8.8 grade bolts?",
                    "zh": "8.8级螺栓应该配用什么等级的六角螺母？",
                    "es": "¿Qué grado de tuerca hexagonal debo usar con pernos de grado 8.8?",
                    "fr": "Quel grade d'écrou hexagonal dois-je utiliser avec des boulons de grade 8.8?",
                    "pt": "Que grau de porca sextavada devo usar com parafusos grau 8.8?",
                    "ru": "Какой класс шестигранной гайки следует использовать с болтами класса 8.8?",
                    "ja": "8.8グレードのボルトにはどのグレードの六角ナットを使用する必要がありますか？",
                    "de": "Welche Sechskantmutter-Klasse sollte ich mit Bolzen der Klasse 8.8 verwenden?",
                    "hi": "8.8 ग्रेड बोल्ट के साथ मुझे कौन सा हेक्स नट ग्रेड का उपयोग करना चाहिए?",
                    "ar": "ما درجة الصامولة السداسية التي يجب أن أستخدمها مع البراغي درجة 8.8؟"
                },
                "a": {
                    "en": "Use Grade 8 hex nuts with 8.8 grade bolts. The nut proof load should equal or exceed the bolt's proof load to ensure proper joint assembly. Using a lower grade nut risks thread stripping before the bolt reaches its full strength. Grade 8 nuts have a proof load of 680 N/mm², matching 8.8 bolt properties. For 10.9 bolts, use Grade 10 nuts (830 N/mm² proof load). For 12.9 bolts, use Grade 12 nuts (970 N/mm² proof load).",
                    "zh": "8.8级螺栓应配用8级六角螺母。螺母的保证载荷应等于或超过螺栓的保证载荷，以确保正确的连接装配。使用较低等级的螺母可能在螺栓达到其全部强度之前就发生螺纹剥离。8级螺母的保证载荷为680 N/mm²，与8.8级螺栓特性匹配。",
                    "es": "Use tuercas hexagonales Grado 8 con pernos de grado 8.8. La carga de prueba de la tuerca debe ser igual o superior a la carga de prueba del perno.",
                    "fr": "Utilisez des écrous hexagonaux de Grade 8 avec des boulons de Grade 8.8. La charge d'épreuve de l'écrou doit être égale ou supérieure à celle du boulon.",
                    "pt": "Use porcas sextavadas Grau 8 com parafusos grau 8.8. A carga de prova da porca deve ser igual ou superior à carga de prova do parafuso.",
                    "ru": "Используйте гайки класса 8 с болтами класса 8.8. Нагрузка гайки должна быть равна или превышать нагрузку болта.",
                    "ja": "8.8グレードのボルトにはグレード8の六角ナットを使用してください。ナットの保証荷重はボルトの保証荷重と同じかそれ以上である必要があります。",
                    "de": "Verwenden Sie Sechskantmuttern der Klasse 8 mit Bolzen der Klasse 8.8. Die Prüflast der Mutter muss gleich oder größer als die des Bolzens sein.",
                    "hi": "8.8 ग्रेड बोल्ट के साथ ग्रेड 8 हेक्स नट का उपयोग करें। नट का प्रूफ लोड बोल्ट के प्रूफ लोड के बराबर या उससे अधिक होना चाहिए।",
                    "ar": "استخدم الصواميل السداسية درجة 8 مع البراغي درجة 8.8. يجب أن تكون حمولة إثبات الصامولة مساوية لحمولة إثبات البرغي أو أكبر منها."
                }
            },
            {
                "q": {
                    "en": "Can hex nuts be reused after being torqued?",
                    "zh": "六角螺母扭矩后可以重复使用吗？",
                    "es": "¿Se pueden reutilizar las tuercas hexagonales después de haber sido torcidas?",
                    "fr": "Les écrous hexagonaux peuvent-ils être réutilisés après avoir été torsadés?",
                    "pt": "As porcas sextavadas podem ser reutilizadas depois de serem torqueadas?",
                    "ru": "Можно ли использовать шестигранные гайки повторно после затяжки?",
                    "ja": "トルクをかけた後の六角ナットは再使用できますか？",
                    "de": "Können Sechskantmuttern nach dem Anziehen wiederverwendet werden?",
                    "hi": "क्या हेक्स नट को टॉर्क करने के बाद दोबारा उपयोग किया जा सकता है?",
                    "ar": "هل يمكن إعادة استخدام الصواميل السداسية بعد شدها؟"
                },
                "a": {
                    "en": "It depends on the application. For critical structural connections (Grade 8.8 and above), hex nuts should not be reused because the thread surface undergoes plastic deformation during tightening, reducing the nut's grip. For non-critical applications with lower bolt grades, hex nuts may be reused if threads are undamaged and the nut can be freely threaded onto the bolt. Always inspect for thread damage, cracks, or deformation before reuse. For Zimbabwe and South African construction, follow SABS 153 and SANS 2001 structural fastening standards which typically require new nuts for critical connections.",
                    "zh": "这取决于应用场景。对于关键的结构连接（8.8级及以上），六角螺母不应重复使用，因为在拧紧过程中螺纹表面会发生塑性变形，降低了螺母的抓握力。对于较低螺栓等级的非关键应用，如果螺纹未损坏且螺母可以自由拧到螺栓上，则可以重复使用。",
                    "es": "Depende de la aplicación. Para conexiones estructurales críticas (Grado 8.8 y superior), las tuercas hexagonales no deben reutilizarse.",
                    "fr": "Cela dépend de l'application. Pour les connexions structurelles critiques (Grade 8.8 et supérieur), les écrous hexagonaux ne doivent pas être réutilisés.",
                    "pt": "Depende da aplicação. Para conexões estruturais críticas (Grau 8.8 e superior), as porcas sextavadas não devem ser reutilizadas.",
                    "ru": "Это зависит от области применения. Для критических конструктивных соединений (класс 8.8 и выше) гайки не следует использовать повторно.",
                    "ja": "これは用途によって異なります。重要な構造接続（グレード8.8以上）の場合、六角ナットを再使用すべきではありません。",
                    "de": "Das hängt von der Anwendung ab. Für kritische Strukturverbindungen (Klasse 8.8 und höher) sollten Sechskantmuttern nicht wiederverwendet werden.",
                    "hi": "यह एप्लिकेशन पर निर्भर करता है। महत्वपूर्ण संरचनात्मक कनेक्शन (ग्रेड 8.8 और उससे ऊपर) के लिए, हेक्स नट का पुनः उपयोग नहीं किया जाना चाहिए।",
                    "ar": "يعتمد ذلك على التطبيق. للتوصيلات الهيكلية الحرجة (درجة 8.8 وأعلى)، لا يجب إعادة استخدام الصواميل السداسية."
                }
            },
            {
                "q": {
                    "en": "What is the difference between a hex nut and a lock nut?",
                    "zh": "六角螺母和锁紧螺母有什么区别？",
                    "es": "¿Cuál es la diferencia entre una tuerca hexagonal y una contratuerca?",
                    "fr": "Quelle est la différence entre un écrou hexagonal et un contre-écrou?",
                    "pt": "Qual é a diferença entre uma porca sextavada e uma contra-porca?",
                    "ru": "В чем разница между шестигранной гайкой и стопорной гайкой?",
                    "ja": "六角ナットと袋座金の違いは何ですか？",
                    "de": "Was ist der Unterschied zwischen einer Sechskantmutter und einer Sicherungsmutter?",
                    "hi": "हेक्स नट और लॉक नट में क्या अंतर है?",
                    "ar": "ما الفرق بين الصامولة السداسية والصامولة القفل؟"
                },
                "a": {
                    "en": "A standard hex nut (DIN 934/ISO 4032) relies entirely on bolt preload and friction to stay secured. A lock nut (also called prevailing torque nut or nyloc nut) has a built-in locking mechanism—either a nylon insert (Nyloc), deformed thread, or free-spinning collar—that resists loosening from vibration. For African mining conveyor systems and vibrating equipment, lock nuts are recommended to prevent spontaneous loosening. Standard hex nuts are suitable for static joints with consistent preload. Always use grade-matched lock nuts with grade-matched bolts.",
                    "zh": "标准六角螺母（DIN 934/ISO 4032）完全依靠螺栓预紧力和摩擦力来保持固定。锁紧螺母（也称为自锁螺母或尼龙锁紧螺母）具有内置的锁定机构——无论是尼龙插入件、变形螺纹还是自由旋转套环——都能抵抗振动引起的松动。",
                    "es": "Una tuerca hexagonal estándar (DIN 934/ISO 4032) depende enteramente de la precarga del perno y la fricción para mantenerse fija.",
                    "fr": "Un écrou hexagonal standard (DIN 934/ISO 4032) dépend entièrement de la précharge du boulon et de la friction pour rester fixé.",
                    "pt": "Uma porca sextavada padrão (DIN 934/ISO 4032) depende inteiramente da pré-carga do parafuso e do atrito para permanecer fixada.",
                    "ru": "Стандартная шестигранная гайка (DIN 934/ISO 4032) полностью зависит от предварительной нагрузки болта и трения.",
                    "ja": "標準の六角ナット（DIN 934/ISO 4032）は、ボルトのプリロードと摩擦に完全に依存して固定されます。",
                    "de": "Eine Standard-Sechskantmutter (DIN 934/ISO 4032) ist vollständig auf die Vorspannung des Bolzens und Reibung angewiesen.",
                    "hi": "एक मानक हेक्स नट (DIN 934/ISO 4032) पूरी तरह से बोल्ट प्रीलोड और घर्षण पर निर्भर करता है।",
                    "ar": "تعتمد الصامولة السداسية القياسية (DIN 934/ISO 4032) كليًا على التحميل المسبق للبرغي والاحتكاك للبقاء في مكانها."
                }
            }
        ]
    },
    'self-tapping-screws-guide': {
        "id": "faq",
        "heading": {
            "en": "Frequently Asked Questions",
            "zh": "常见问题",
            "es": "Preguntas Frecuentes",
            "ar": "الأسئلة الشائعة",
            "fr": "Questions Fréquemment Posées",
            "pt": "Perguntas Frequentes",
            "ru": "Часто Задаваемые Вопросы",
            "ja": "よくある質問",
            "de": "Häufig Gestellte Fragen",
            "hi": "सामान्य प्रश्न"
        },
        "faqItems": [
            {
                "q": {
                    "en": "What is the difference between self-tapping and self-drilling screws?",
                    "zh": "自攻螺钉和自钻螺钉有什么区别？",
                    "es": "¿Cuál es la diferencia entre tornillos autorroscantes y tornillos autotaladrantes?",
                    "fr": "Quelle est la différence entre les vis taraudeuses et les vis autoforeuses?",
                    "pt": "Qual é a diferença entre parafusos autoatarraxantes e parafusos autoperfurantes?",
                    "ru": "В чем разница между самонарезающими и самосверлящими шурупами?",
                    "ja": "セルフタップねじとドリルねじの違いは何ですか？",
                    "de": "Was ist der Unterschied zwischen selbstschneidenden und selbstbohrenden Schrauben?",
                    "hi": "सेल्फ-टैपिंग और सेल्फ-ड्रिलिंग स्क्रू में क्या अंतर है?",
                    "ar": "ما الفرق بين المسامير ذات اللولب الذاتي والمسامير ذات الحفر الذاتي؟"
                },
                "a": {
                    "en": "Self-tapping screws (Type AB, Type B) have a sharp point that cuts or forms threads in the material as you drive them in, but they require a pilot hole for thicker materials. Self-drilling screws (Type III/TEK) have a drill point with flutes that actually drills its own pilot hole—no pre-drilling needed for thin steel. For African construction: use self-tapping for wood, plastic, and thin metal; use self-drilling (TEK screws) for steel framing, roofing, and thicker metal where you want faster installation without pre-drilling.",
                    "zh": "自攻螺钉（AB型、B型）具有锋利的尖端，在拧入材料时会切割或形成螺纹，但对于较厚的材料需要预钻孔。自钻螺钉（III型/TEK型）具有带凹槽的钻尖，可以自己钻出导孔——无需对薄钢板进行预钻孔。",
                    "es": "Los tornillos autorroscantes (Tipo AB, Tipo B) tienen una punta afilada que corta o forma roscas en el material.",
                    "fr": "Les vis taraudeuses (Type AB, Type B) ont une pointe tranchante qui coupe ou forme des filetages dans le matériau.",
                    "pt": "Os parafusos autoatarraxantes (Tipo AB, Tipo B) têm uma ponta afiada que corta ou forma roscas no material.",
                    "ru": "Самонарезающие шурупы (тип AB, тип B) имеют острие, которое разрезает или формирует резьбу в материале.",
                    "ja": "セルフタップねじ（タイプAB、タイプB）は、材料にねじを切断または形成する鋭いポイントを持っています。",
                    "de": "Selbstschneidende Schrauben (Typ AB, Typ B) haben eine scharfe Spitze, die das Material schneidet oder Gewinde bildet.",
                    "hi": "सेल्फ-टैपिंग स्क्रू (टाइप एबी, टाइप बी) में एक तेज पॉइंट होता है जो सामग्री में थ्रेड काटता है या बनाता है।",
                    "ar": "المسامير ذات اللولب الذاتي (النوع أ ب، النوع ب) لها طرف حاد يقطع أو يكوّن خيوط في المادة."
                }
            },
            {
                "q": {
                    "en": "Can self-tapping screws be used in wood?",
                    "zh": "自攻螺钉可以用于木材吗？",
                    "es": "¿Se pueden usar tornillos autorroscantes en madera?",
                    "fr": "Les vis taraudeuses peuvent-elles être utilisées dans le bois?",
                    "pt": "Podem parafusos autoatarraxantes ser usados em madeira?",
                    "ru": "Можно ли использовать самонарезающие шурупы в дереве?",
                    "ja": "木材にセルフタップねじを使用できますか？",
                    "de": "Können selbstschneidende Schrauben in Holz verwendet werden?",
                    "hi": "क्या सेल्फ-टैपिंग स्क्रू का उपयोग लकड़ी में किया जा सकता है?",
                    "ar": "هل يمكن استخدام المسامير ذات اللولب الذاتي في الخشب؟"
                },
                "a": {
                    "en": "Yes, self-tapping screws can be used in wood, especially hardwoods and engineered wood products like plywood and MDF. However, for softwoods and general wood framing, wood screws (which have coarser threads) are typically preferred as they provide better grip and reduce the risk of splitting. Self-tapping screws with fine threads may strip out in wood under load. For African timber construction, use wood-specific screws or coach screws for structural wood connections, and reserve self-tapping screws for metal-to-wood or thin metal applications.",
                    "zh": "是的，自攻螺钉可以用于木材，特别是硬木和工程木产品如胶合板和中密度纤维板。但是，对于软木和一般木框架，通常更倾向于使用木螺钉（具有较粗的螺纹），因为它们提供更好的抓握力并减少开裂风险。",
                    "es": "Sí, los tornillos autorroscantes se pueden usar en madera, especialmente maderas duras y productos de madera ingeniería.",
                    "fr": "Oui, les vis taraudeuses peuvent être utilisées dans le bois, en particulier les bois durs.",
                    "pt": "Sim, parafusos autoatarraxantes podem ser usados em madeira, especialmente madeiras duras.",
                    "ru": "Да, самонарезающие шурупы можно использовать в дереве, особенно в твердых породах.",
                    "ja": "はい、セルフタップねじは木材、特に針葉樹や合板などのエンジニアリングウッド製品に使用できます。",
                    "de": "Ja, selbstschneidende Schrauben können in Holz verwendet werden, insbesondere in Hartholz.",
                    "hi": "हाँ, सेल्फ-टैपिंग स्क्रू का उपयोग लकड़ी में किया जा सकता है।",
                    "ar": "نعم، يمكن استخدام المسامير ذات اللولب الذاتي في الخشب."
                }
            },
            {
                "q": {
                    "en": "What is the difference between Type AB and Type B point screws?",
                    "zh": "AB型和B型尖端螺钉有什么区别？",
                    "es": "¿Cuál es la diferencia entre tornillos de punta Tipo AB y Tipo B?",
                    "fr": "Quelle est la différence entre les vis à pointe Type AB et Type B?",
                    "pt": "Qual é a diferença entre parafusos de ponta Tipo AB e Tipo B?",
                    "ru": "В чем разница между шурупами с наконечником типа AB и типа B?",
                    "ja": "タイプABとタイプBのポイントねじの違いは何ですか？",
                    "de": "Was ist der Unterschied zwischen Schrauben mit Typ AB- und Typ B-Spitze?",
                    "hi": "टाइप एबी और टाइप बी पॉइंट स्क्रू में क्या अंतर है?",
                    "ar": "ما الفرق بين مسامير النوع أ ب والنوع ب؟"
                },
                "a": {
                    "en": "Type AB point screws have a sharp point with fine threads, suitable for thin sheet metal up to 0.9mm—they start easily but can skid on thicker material. Type B point screws have a 45-degree blunt (flat) point with slightly deeper threads, suitable for thicker materials up to 2.3mm—the blunt start requires slight pressure but provides more thread engagement. For African construction: use Type AB for HVAC ductwork and thin metal enclosures; use Type B for steel brackets, framing members, and general sheet metal work up to 2.3mm.",
                    "zh": "AB型尖端螺钉具有锋利的尖端和细螺纹，适用于厚度达0.9毫米的薄金属板——它们易于启动但在较厚材料上可能会打滑。B型尖端螺钉具有45度钝（平）尖端，螺纹略深，适用于厚度达2.3毫米的较厚材料。",
                    "es": "Los tornillos de punta Tipo AB tienen una punta afilada con roscas finas, adecuados para chapas de hasta 0.9 mm.",
                    "fr": "Les vis à pointe Type AB ont une pointe tranchante avec des filetages fins, adaptées aux tôles jusqu'à 0.9 mm.",
                    "pt": "Os parafusos de ponta Tipo AB têm uma ponta afiada com roscas finas, adequados para chapas de até 0.9 mm.",
                    "ru": "Шурупы с наконечником типа AB имеют острие с мелкой резьбой, подходят для листового металла толщиной до 0.9 мм.",
                    "ja": "タイプABのポイントねじは、0.9mmまでの薄板に適した細いねじを持つ鋭いポイントを持っています。",
                    "de": "Schrauben mit Typ-AB-Spitze haben eine scharfe Spitze mit feinen Gewinden, geeignet für Bleche bis 0.9 mm.",
                    "hi": "टाइप एबी पॉइंट स्क्रू में एक तेज पॉइंट होता है जिसमें बारीक थ्रेड होते हैं।",
                    "ar": "للمسامير ذات الطرف نوع أ ب طرف حاد مع خيوط دقيقة، مناسبة للصفائح المعدنية حتى 0.9 ملم."
                }
            },
            {
                "q": {
                    "en": "Do self-tapping screws need pilot holes?",
                    "zh": "自攻螺钉需要预钻孔吗？",
                    "es": "¿Los tornillos autorroscantes necesitan agujeros de guía?",
                    "fr": "Les vis taraudeuses ont-elles besoin de trous de guidage?",
                    "pt": "Os parafusos autoatarraxantes precisam de furos de guia?",
                    "ru": "Нужны ли самонарезающим шурупам направляющие отверстия?",
                    "ja": "セルフタップねじは下穴が必要ですか？",
                    "de": "Brauchen selbstschneidende Schrauben Führungsbohrungen?",
                    "hi": "क्या सेल्फ-टैपिंग स्क्रू के लिए पायलट होल की जरूरत होती है?",
                    "ar": "هل تحتاج المسامير ذات اللولب الذاتي إلى ثقوب دليل؟"
                },
                "a": {
                    "en": "For self-tapping Type AB and Type B screws: thin materials (under 1.5mm steel) generally do not need pilot holes—the screw will tap its own threads. For thicker materials (1.5-2.3mm), a small pilot hole (typically 70-80% of the screw core diameter) helps prevent thread stripping and makes driving easier. For wood, predrilling is recommended to prevent splitting, especially near edges and end grain. Self-drilling Type III screws never need pilot holes—they drill their own as they go. For Zimbabwe and South African construction, always check local building codes for fastening requirements.",
                    "zh": "对于自攻螺钉AB型和B型：薄材料（钢制1.5毫米以下）通常不需要预钻孔——螺钉会自己攻丝。对于较厚的材料（1.5-2.3毫米），小导孔（通常为核心直径的70-80%）有助于防止螺纹脱扣并使拧入更容易。对于木材，建议预钻孔以防止开裂。",
                    "es": "Para tornillos autorroscantes Tipo AB y Tipo B: materiales delgados (menos de 1.5 mm de acero) generalmente no necesitan agujeros de guía.",
                    "fr": "Pour les vis taraudeuses Type AB et Type B: les matériaux minces (moins de 1.5 mm d'acier) ne nécessitent généralement pas de trous de guidage.",
                    "pt": "Para parafusos autoatarraxantes Tipo AB e Tipo B: materiais finos (abaixo de 1.5mm de aço) geralmente não precisam de furos de guia.",
                    "ru": "Для самонарезающих шурупов типа AB и B: тонкие материалы (менее 1.5 мм стали) обычно не требуют направляющих отверстий.",
                    "ja": "タイプABとタイプBのセルフタップねじの場合、薄い材料（1.5mm以下の鋼材）は通常、下穴が必要ありません。",
                    "de": "Für selbstschneidende Schrauben vom Typ AB und Typ B: dünne Materialien (unter 1.5 mm Stahl) benötigen in der Regel keine Führungsbohrungen.",
                    "hi": "सेल्फ-टैपिंग टाइप एबी और टाइप बी स्क्रू के लिए: पतली सामग्री (1.5mm स्टील से नीचे) को आमतौर पर पायलट होल की जरूरत नहीं होती।",
                    "ar": "لمسامير اللولب الذاتي النوع أ ب والنوع ب: المواد الرقيقة (أقل من 1.5 ملم فولاذ) لا تحتاج عمومًا إلى ثقوب دليل."
                }
            }
        ]
    }
}

# Image updates
IMAGE_UPDATES = {
    'rivets-blind-rivet-nut-guide': '/images/articles/rivets-blind-rivet-nut-guide.jpg',
    'conveyor-belt-fasteners': '/images/articles/conveyor-belt-fasteners.jpg',
    'hex-nuts-selection-guide': '/images/articles/hex-nuts-selection-guide.jpg',
    'self-tapping-screws-guide': '/images/articles/self-tapping-screws-guide.jpg',
    'structural-steel-connection-fasteners': '/images/articles/structural-steel-connection-fasteners.jpg',
}

def update_article(slug):
    fpath = os.path.join(ARTICLES_DIR, slug + '.json')
    if not os.path.exists(fpath):
        print(f'SKIP: {slug} - file not found')
        return
    
    with open(fpath) as f:
        data = json.load(f)
    
    updated = False
    
    # Update image
    if slug in IMAGE_UPDATES:
        new_image = IMAGE_UPDATES[slug]
        data['image'] = new_image
        data['imageAlt'] = f'{data.get("title", {}).get("en", slug)} - fastener solutions'
        updated = True
        print(f'  Image updated: {new_image}')
    
    # Fix FAQ
    if slug in PROPER_FAQS:
        faq_section = PROPER_FAQS[slug]
        sections = data.get('sections', [])
        new_sections = []
        for section in sections:
            if section.get('id') == 'faq':
                # Replace with proper FAQ
                new_sections.append(faq_section)
                print(f'  FAQ replaced with proper questions')
            else:
                new_sections.append(section)
        data['sections'] = new_sections
        updated = True
    
    # Update the updated date
    from datetime import date
    data['updated'] = str(date.today())
    
    if updated:
        with open(fpath, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f'  Updated: {slug}')
    else:
        print(f'  No changes: {slug}')

def main():
    print('SEO Article Updater')
    print('=' * 50)
    
    for slug in IMAGE_UPDATES.keys():
        print(f'\nProcessing: {slug}')
        update_article(slug)
    
    print('\nDone!')

if __name__ == '__main__':
    main()

// 地域页正文补充语种（第五批）：de / hi
// 顺序：pt/fr → es/ja → ru → ar → de/hi → 原文 en/zh 回落
import type { MarketTextBlock } from './marketsI18n'

export const marketTextDeHi: Record<string, Record<string, MarketTextBlock> | undefined> = {
  zambia: {
    de: {
      hero: 'Sambia ist ein Binnenland: Lusaka und der Copperbelt werden über Beira, Daressalam oder Walfischbucht versorgt. Bergbau und Bau tragen die Nachfrage nach hochfesten Schrauben und Verankerungen.',
      ports: 'Über Beira mit Transit durch Simbabwe ist der Seeweg nach Lusaka am kürzesten; Daressalam bedient den Norden des Copperbelt; Walfischbucht ist länger, aber mit stabilen Abfahrten. Alle Routen enthalten einen Straßenabschnitt und einen Grenztransit.',
      docs: 'Rechnung, Packliste, Konossement, Ursprungszeugnis und Walzwerkszeugnisse. Für Bergbaukunden kommen Materialprüfberichte hinzu, auf Wunsch eine Drittinspektion vor Versand.',
      lines: 'Konstruktionsschrauben der Klassen 8.8 und 10.9, Ankerschrauben, Gewindestangen, Bergbauanker sowie Standard-Schrauben und Nägel für die Baustelle.',
      faq: [
        ['Liefern Sie Schrauben der Klasse 10.9 für den Bergbau?', 'Ja, mit Walzwerkszeugnissen, die Klasse und Schmelzennummer ausweisen; eine Drittinspektion ist organisierbar.'],
        ['Welche Route nach Lusaka ist am schnellsten?', 'Über Simbabwe nach Beira ist meist am kürzesten; für den Norden des Copperbelt ist Daressalam besser.'],
        ['Sind Mischcontainer möglich?', 'Ja — verschiedene Größen und Positionen in einem 20GP, mit Ladungsplan vor Versand.'],
      ],
    },
    hi: {
      hero: 'ज़ाम्बिया एक स्थलरुद्ध देश है: लुसाका और कॉपरबेल्ट की आपूर्ति बेइरा, दार एस सलाम या वाल्विस बे से होती है। खनन और निर्माण उच्च-शक्ति बोल्ट और एंकर की मांग को संभालते हैं।',
      ports: 'ज़िम्बाब्वे होकर बेइरा लुसाका तक सबसे छोटा समुद्री हिस्सा है; दार एस सलाम कॉपरबेल्ट के उत्तर के लिए; वाल्विस बे लंबा है पर नियमित है। सभी मार्गों में सड़क खंड और सीमा पार करना शामिल है।',
      docs: 'चालान, पैकिंग सूची, बिल ऑफ लेडिंग, मूल प्रमाणपत्र और स्टील हीट प्रमाणपत्र। खनन खरीदारों के लिए सामग्री परीक्षण रिपोर्ट, और मांग पर शिपमेंट से पहले तीसरे पक्ष का निरीक्षण।',
      lines: 'संरचनात्मक बोल्ट 8.8 और 10.9 श्रेणी, एंकर बोल्ट, थ्रेडेड रॉड, खनन एंकर, तथा साइट के सामान्य स्क्रू और नाखून।',
      faq: [
        ['क्या खनन के लिए 10.9 श्रेणी के बोल्ट मिलते हैं?', 'हाँ, श्रेणी और हीट संख्या वाले स्टील प्रमाणपत्र के साथ; तीसरे पक्ष का निरीक्षण भी कराया जा सकता है।'],
        ['लुसाका के लिए सबसे तेज़ मार्ग कौन सा है?', 'ज़िम्बाब्वे होकर बेइरा आमतौर पर सबसे छोटा है; कॉपरबेल्ट के उत्तर के लिए दार एस सलाम बेहतर है।'],
        ['क्या एक कंटेनर में अलग साइज़ मिला सकते हैं?', 'हाँ — अलग साइज़ और श्रेणियाँ एक 20GP में, शिपमेंट से पहले लोडिंग प्लान के साथ।'],
      ],
    },
  },
  'south-africa': {
    de: {
      hero: 'Durban und Kapstadt sind die wichtigsten Eingangshäfen. SANS/SABS-Normen bestimmen die Spezifikationen, daher werden Dach- und Konstruktionspositionen meist nach SABS-Klausel angeboten.',
      ports: 'Über Durban läuft der größte Teil der Container aus China; Kapstadt bedient Projekte im Westkap. Die Seereise dauert meist 25 bis 30 Tage ab Qingdao oder Tianjin.',
      docs: 'Rechnung, Packliste, Konossement, Ursprungszeugnis und Walzwerkszeugnisse. Für Dachnägel und Konstruktionsschrauben werden häufig SABS-Prüfberichte verlangt — die genaue Klausel mit dem Käufer abstimmen.',
      lines: 'IBR-Dachnägel, selbstbohrende Schrauben mit EPDM-Scheibe, Konstruktionsschrauben und -muttern, Anker, Scheiben und Abdichtung.',
      faq: [
        ['Entsprechen Ihre IBR-Nägel der SABS?', 'Dachnägel werden nach den Anforderungen der SABS 1195 gefertigt; Prüfberichte auf Anfrage.'],
        ['Bieten Sie CIF Durban an?', 'Ja — standardmäßig FOB Qingdao/Tianjin, CIF Durban oder Kapstadt auf Anfrage.'],
        ['Sind kleine Testbestellungen möglich?', 'Ja — Testmengen vor einem Vollcontainer, Muster verfügbar.'],
      ],
    },
    hi: {
      hero: 'डरबन और केप टाउन मुख्य प्रवेश बंदरगाह हैं। SANS/SABS मानक विनिर्देश तय करते हैं, इसलिए छत और संरचना श्रेणियाँ आमतौर पर SABS क्लॉज़ पर कोट होती हैं।',
      ports: 'चीन से आने वाले अधिकांश कंटेनर डरबन से गुजरते हैं; केप टाउन पश्चिमी केप परियोजनाओं के लिए है। समुद्री यात्रा आमतौर पर छिंगदाओ या तियानजिन से 25–30 दिन।',
      docs: 'चालान, पैकिंग सूची, बिल ऑफ लेडिंग, मूल प्रमाणपत्र और स्टील हीट प्रमाणपत्र। छत की कीलों और संरचनात्मक बोल्ट के लिए SABS परीक्षण रिपोर्ट अक्सर मांगी जाती है — सटीक क्लॉज़ खरीदार से पुष्टि करें।',
      lines: 'IBR छत कीलें, EPDM वॉशर वाले सेल्फ-ड्रिलिंग स्क्रू, संरचनात्मक बोल्ट-नट, एंकर, वॉशर और वॉटरप्रूफिंग।',
      faq: [
        ['क्या आपकी IBR कीलें SABS के अनुरूप हैं?', 'छत कीलें SABS 1195 की आवश्यकताओं के अनुसार बनती हैं; परीक्षण रिपोर्ट अनुरोध पर उपलब्ध।'],
        ['क्या CIF डरबन पर कोट करते हैं?', 'हाँ — डिफ़ॉल्ट FOB छिंगदाओ/तियानजिन, अनुरोध पर CIF डरबन या केप टाउन।'],
        ['छोटे टेस्ट ऑर्डर स्वीकार हैं?', 'हाँ — पूरे कंटेनर से पहले परीक्षण मात्रा स्वीकार, नमूने उपलब्ध।'],
      ],
    },
  },
  mozambique: {
    de: {
      hero: 'Beira, Maputo und Nacala bedienen sowohl lokale Projekte als auch Transitfracht nach Simbabwe, Sambia und Malawi. Beira ist das Arbeitsportal der Landesmitte.',
      ports: 'Beira für die Landesmitte und den Transit nach Simbabwe; Maputo für den Süden und den Grenzhandel mit Südafrika; Nacala für den Norden. Die Seereise dauert meist 20 bis 28 Tage.',
      docs: 'Rechnung, Packliste, Konossement, Ursprungszeugnis und Walzwerkszeugnisse. Bei Transitfracht muss das Bestimmungsland in den Dokumenten stehen; das geltende Transitregime mit dem Agenten abstimmen.',
      lines: 'Dachbefestigungen, Betonschrauben, Anker und eine an die Küstenfeuchte angepasste Abdichtung, dazu Nägel und allgemeiner Baubeschlag.',
      faq: [
        ['Welcher Hafen für den Transit nach Simbabwe?', 'Beira — der kürzeste Seeweg, danach Straße über Mutare.'],
        ['Küstenkorrosion — welche Beschichtung?', 'Feuerverzinkung oder Edelstahl 304/316; einfacher Zink rostet in der Salzluft von Beira schnell.'],
        ['Bieten Sie CIF Beira an?', 'Ja, auf Anfrage, parallel zu FOB.'],
      ],
    },
    hi: {
      hero: 'बेइरा, मापुतो और नाकाला स्थानीय परियोजनाओं तथा ज़िम्बाब्वे, ज़ाम्बिया और मलावी के पारगमन माल दोनों की सेवा करते हैं। बेइरा मध्य मोज़ाम्बिक का कार्य-द्वार है।',
      ports: 'बेइरा मध्य क्षेत्र और ज़िम्बाब्वे पारगमन के लिए; मापुतो दक्षिण और दक्षिण अफ्रीका सीमा व्यापार के लिए; नाकाला उत्तर के लिए। समुद्री यात्रा आमतौर पर 20–28 दिन।',
      docs: 'चालान, पैकिंग सूची, बिल ऑफ लेडिंग, मूल प्रमाणपत्र और स्टील हीट प्रमाणपत्र। पारगमन माल में दस्तावेज़ों पर गंतव्य देश लिखना ज़रूरी है; लागू पारगमन नियम एजेंट से पुष्टि करें।',
      lines: 'छत की फिक्सिंग, कंक्रीट स्क्रू, एंकर और तटीय नमी के अनुकूल वॉटरप्रूफिंग, साथ में कीलें और सामान्य बिल्डिंग हार्डवेयर।',
      faq: [
        ['ज़िम्बाब्वे पारगमन के लिए कौन सा बंदरगाह?', 'बेइरा — सबसे छोटा समुद्री हिस्सा, फिर मुतारे होकर सड़क मार्ग।'],
        ['तटीय जंग — कौन सा कोटिंग?', 'हॉट-डिप गैल्वनाइज़िंग या स्टेनलेस 304/316; बेइरा की नमकीन हवा में साधारण ज़िंक जल्दी जंग खाता है।'],
        ['क्या CIF बेइरा कोट करते हैं?', 'हाँ, अनुरोध पर, FOB के समानांतर।'],
      ],
    },
  },
  botswana: {
    de: {
      hero: 'Binnenland, Hauptversorgung über Durban mit Straßenabschnitt durch Südafrika; Walfischbucht ist die Alternative. Bergbau und Bau sind die beiden Nachfragezentren.',
      ports: 'Durban (Südafrika) mit Straßentransport nach Gaborone und Francistown; Walfischbucht (Namibia) als zweite Option.',
      docs: 'Rechnung, Packliste, Konossement, Ursprungszeugnis und Walzwerkszeugnisse; Transitsdokumente nennen Botswana als Endziel.',
      lines: 'Konstruktionsschrauben, Anker, Dachbefestigungen, Abdichtung und allgemeiner Baubeschlag.',
      faq: [
        ['Wie ist der Frachtlauf organisiert?', 'Seewärts bis Durban, dann Straße nach Gaborone oder Francistown; wir bieten FOB und CIF Durban.'],
        ['Liefern Sie Schrauben in Bergbauqualität?', 'Ja — Klassen 8.8 und 10.9 mit Walzwerkszeugnissen.'],
        ['Wie sind die üblichen Lieferzeiten?', '15 bis 25 Tage Produktion, 25 bis 30 Tage Seeweg bis Durban, plus Straßenabschnitt.'],
      ],
    },
    hi: {
      hero: 'स्थलरुद्ध देश, मुख्य आपूर्ति डरबन से और दक्षिण अफ्रीका से होकर सड़क मार्ग; वाल्विस बे विकल्प है। खनन और निर्माण दो मांग केंद्र हैं।',
      ports: 'डरबन (दक्षिण अफ्रीका) से गाबोरोन और फ्रांसिसटाउन तक सड़क; वाल्विस बे (नामीबिया) दूसरा विकल्प।',
      docs: 'चालान, पैकिंग सूची, बिल ऑफ लेडिंग, मूल प्रमाणपत्र और स्टील हीट प्रमाणपत्र; पारगमन दस्तावेज़ों में बोत्सवाना अंतिम गंतव्य है।',
      lines: 'संरचनात्मक बोल्ट, एंकर, छत की फिक्सिंग, वॉटरप्रूफिंग और सामान्य बिल्डिंग हार्डवेयर।',
      faq: [
        ['माल ढुलाई कैसे होती है?', 'समुद्र से डरबन तक, फिर गाबोरोन या फ्रांसिसटाउन तक सड़क; हम FOB और CIF डरबन दोनों पर कोट करते हैं।'],
        ['क्या खनन-ग्रेड बोल्ट मिलते हैं?', 'हाँ — 8.8 और 10.9 श्रेणी, स्टील प्रमाणपत्र के साथ।'],
        ['सामान्य लीड टाइम क्या है?', 'उत्पादन 15–25 दिन, डरबन तक समुद्री 25–30 दिन, फिर सड़क खंड।'],
      ],
    },
  },
  kenya: {
    de: {
      hero: 'Mombasa bedient Kenia, Uganda, Ruanda und den Transit in den Südsudan. Die Vorversandkonformität (PVoC) wird meist verlangt, daher ist die Zertifizierung eingeplant.',
      ports: 'Mombasa für Kenia und den ostafrikanischen Transitmarkt; Seereise meist 28 bis 32 Tage.',
      docs: 'Rechnung, Packliste, Konossement, Ursprungszeugnis, Walzwerkszeugnisse und das PVoC-Konformitätszeugnis, wenn das Bestimmungsland es verlangt.',
      lines: 'Dachschrauben und -nägel, Konstruktionsschrauben, Anker, Betonschrauben und Abdichtung.',
      faq: [
        ['Ist PVoC Pflicht?', 'Für regulierte Produkte meist ja; wir organisieren die Inspektion über eine akkreditierte Stelle und legen das Zeugnis den Versandpapieren bei.'],
        ['Versenden Sie nach Uganda über Mombasa?', 'Ja — Transitfracht wird auf das Endziel dokumentiert.'],
        ['Welche Beschichtung für die kenianische Küste?', 'Feuerverzinkung oder Edelstahl; die Salzluft von Mombasa greift dünne Zinkschichten schnell an.'],
      ],
    },
    hi: {
      hero: 'मोम्बासा केन्या, युगांडा, रवांडा और दक्षिण सूडान पारगमन की सेवा करता है। शिपमेंट-पूर्व अनुरूपता (PVoC) आमतौर पर ज़रूरी है, इसलिए प्रमाणन समय-सारणी में शामिल रहता है।',
      ports: 'मोम्बासा केन्या और पूर्वी अफ्रीका पारगमन बाज़ार के लिए; समुद्री यात्रा आमतौर पर 28–32 दिन।',
      docs: 'चालान, पैकिंग सूची, बिल ऑफ लेडिंग, मूल प्रमाणपत्र, स्टील हीट प्रमाणपत्र और गंतव्य की मांग पर PVoC अनुरूपता प्रमाणपत्र।',
      lines: 'छत के स्क्रू और कीलें, संरचनात्मक बोल्ट, एंकर, कंक्रीट स्क्रू और वॉटरप्रूफिंग।',
      faq: [
        ['क्या PVoC अनिवार्य है?', 'नियंत्रित उत्पादों के लिए आमतौर पर हाँ; हम मान्यता प्राप्त संस्था से निरीक्षण कराते हैं और प्रमाणपत्र शिपिंग दस्तावेज़ों में शामिल करते हैं।'],
        ['मोम्बासा से युगांडा भेजते हैं?', 'हाँ — पारगमन माल अंतिम गंतव्य के लिए दस्तावेज़ित होता है।'],
        ['केन्या तट के लिए कौन सा कोटिंग?', 'हॉट-डिप गैल्वनाइज़िंग या स्टेनलेस; मोम्बासा की नमकीन हवा पतली ज़िंक परत को जल्दी खराब करती है।'],
      ],
    },
  },
  nigeria: {
    de: {
      hero: 'Lagos (Apapa / Tin Can) und Onne sind die wichtigsten Häfen. Für regulierte Befestigungen wird meist SONCAP verlangt, daher läuft die Zertifizierung parallel zur Produktion.',
      ports: 'Lagos für den Südwesten, Onne für den Südosten; Seereise meist 30 bis 35 Tage.',
      docs: 'Rechnung, Packliste, Konossement, Ursprungszeugnis, Walzwerkszeugnisse und, soweit einschlägig, das SONCAP-Zeugnis.',
      lines: 'Dachbefestigungen, Konstruktionsschrauben, Anker, Nägel und Abdichtung für feuchte Küstenbaustellen.',
      faq: [
        ['Ist SONCAP Pflicht?', 'Für regulierte Produkte der SONCAP-Liste ja; das Zeugnis erhalten wir über eine akkreditierte Inspektionsstelle.'],
        ['Welchen Hafen empfehlen Sie?', 'Lagos für die meisten Käufer; Onne, wenn die Baustelle im Südosten liegt.'],
        ['Sind Mischcontainer möglich?', 'Ja, mit Ladungsplan vor Versand.'],
      ],
    },
    hi: {
      hero: 'लागोस (अपापा / टिन कैन) और ओने मुख्य बंदरगाह हैं। नियंत्रित फास्टनरों के लिए आमतौर पर SONCAP ज़रूरी है, इसलिए प्रमाणन उत्पादन के समांतर चलता है।',
      ports: 'लागोस दक्षिण-पश्चिम के लिए, ओने दक्षिण-पूर्व के लिए; समुद्री यात्रा आमतौर पर 30–35 दिन।',
      docs: 'चालान, पैकिंग सूची, बिल ऑफ लेडिंग, मूल प्रमाणपत्र, स्टील हीट प्रमाणपत्र और जहाँ लागू हो वहाँ SONCAP प्रमाणपत्र।',
      lines: 'छत की फिक्सिंग, संरचनात्मक बोल्ट, एंकर, कीलें और नम तटीय साइटों के लिए वॉटरप्रूफिंग।',
      faq: [
        ['क्या SONCAP अनिवार्य है?', 'SONCAP सूची के नियंत्रित उत्पादों के लिए हाँ; प्रमाणपत्र मान्यता प्राप्त निरीक्षण संस्था से प्राप्त करते हैं।'],
        ['कौन सा बंदरगाह सुझाते हैं?', 'अधिकांश खरीदारों के लिए लागोस; साइट दक्षिण-पूर्व में हो तो ओने।'],
        ['मिश्रित कंटेनर उपलब्ध हैं?', 'हाँ, शिपमेंट से पहले लोडिंग प्लान के साथ।'],
      ],
    },
  },
}

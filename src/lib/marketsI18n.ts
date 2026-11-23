// 地域页正文的补充语种：按市场语言价值优先补齐（pt 对应莫桑比克/安哥拉，fr 对应法语非洲）
// 页面读取时优先用这里的文案，缺失则回落 markets.ts 的 en/zh 原文
export type MarketTextBlock = {
  hero: string
  ports: string
  docs: string
  lines: string
  faq: [string, string][]
}

export const marketTextOverrides: Record<string, Record<string, MarketTextBlock>> = {
  zambia: {
    pt: {
      hero: 'A Zâmbia não tem litoral: Lusaca e o cinturão do cobre são abastecidos via Beira, Dar es Salaam ou Walvis Bay. A mineração e a construção sustentam a procura por parafusos de alta resistência e fixações de ancoragem.',
      ports: 'Via Beira, atravessando o Zimbábue, é o trecho marítimo mais curto para Lusaca; Dar es Salaam serve o norte do cinturão do cobre; Walvis Bay é a rota mais longa, mas com escalas estáveis. Todas exigem trecho rodoviário e trânsito fronteiriço.',
      docs: 'Fatura, lista de volumes, conhecimento de embarque, certificado de origem e certificados de aciaria. Para compradores da mineração, acrescente relatórios de ensaio do material e, quando exigido, inspeção por terceiros antes do embarque.',
      lines: 'Parafusos estruturais classes 8.8 e 10.9, chumbadores, barras roscadas, ancoragens para mineração, além de parafusos e pregos de uso geral na obra.',
      faq: [
        ['Fornecem parafusos classe 10.9 para mineração?', 'Sim, com certificados de aciaria indicando classe e número de corrida; a inspeção por terceiros pode ser organizada.'],
        ['Qual a rota mais rápida para Lusaca?', 'Via Zimbábue até Beira costuma ser a mais curta; Dar es Salaam é melhor para o norte do cinturão do cobre.'],
        ['É possível misturar medidas num contentor?', 'Sim — medidas e linhas diferentes podem seguir num 20GP, com plano de carga emitido antes do embarque.'],
      ],
    },
    fr: {
      hero: "La Zambie est enclavée : Lusaka et la Copperbelt sont approvisionnées via Beira, Dar es Salaam ou Walvis Bay. Les mines et la construction soutiennent la demande en boulons à haute résistance et en ancrages.",
      ports: "Via Beira, en traversant le Zimbabwe, c'est le tronçon maritime le plus court pour Lusaka ; Dar es Salaam convient au nord de la Copperbelt ; Walvis Bay est la plus longue mais avec des rotations régulières. Tous les itinéraires comprennent un tronçon routier et un transit frontalier.",
      docs: "Facture, liste de colisage, connaissement, certificat d'origine et certificats de coulée. Pour les acheteurs miniers, ajoutez les rapports d'essai matière et, lorsque c'est exigé, une inspection par un tiers avant expédition.",
      lines: "Boulons structurels classes 8.8 et 10.9, boulons d'ancrage, tiges filetées, ancrages miniers, ainsi que vis et clous standard pour le chantier.",
      faq: [
        ['Fournissez-vous des boulons classe 10.9 pour les mines ?', "Oui, avec certificats de coulée indiquant la classe et le numéro de coulée ; une inspection par un tiers peut être organisée."],
        ['Quel itinéraire est le plus rapide pour Lusaka ?', "Via le Zimbabwe par Beira, généralement le plus court ; Dar es Salaam est mieux pour le nord de la Copperbelt."],
        ['Pouvez-vous charger des conteneurs mixtes ?', "Oui, tailles et gammes différentes dans un 20GP, avec un plan de chargement."],
      ],
    },
  },
  'south-africa': {
    pt: {
      hero: 'Durban e Cidade do Cabo são as principais portas de entrada. As normas SANS/SABS dominam as especificações, por isso as linhas de cobertura e estruturais são geralmente cotadas segundo uma cláusula SABS.',
      ports: 'Durban recebe a maior parte dos contentores vindos da China; Cidade do Cabo serve projetos do Cabo Ocidental. O trânsito marítimo é tipicamente de 25 a 30 dias a partir de Qingdao ou Tianjin.',
      docs: 'Fatura, lista de volumes, conhecimento de embarque, certificado de origem e certificados de aciaria. Relatórios de ensaio SABS são frequentemente exigidos para pregos de cobertura e parafusos estruturais — confirme a cláusula exacta com o comprador.',
      lines: 'Pregos para cobertura IBR, parafusos auto-roscantes com arruelas EPDM, parafusos e porcas estruturais, chumbadores, arruelas e impermeabilização.',
      faq: [
        ['Os vossos pregos IBR cumprem a SABS?', 'Os pregos de cobertura são produzidos segundo os requisitos da SABS 1195; relatórios de ensaio disponíveis a pedido.'],
        ['Cotam CIF Durban?', 'Sim — FOB Qingdao/Tianjin por padrão, CIF Durban ou Cidade do Cabo a pedido.'],
        ['Aceitam pedidos de teste pequenos?', 'Sim — quantidades de teste são aceites antes de um contentor completo, com amostras disponíveis.'],
      ],
    },
    fr: {
      hero: "Durban et Le Cap sont les principales portes d'entrée. Les normes SANS/SABS dominent les spécifications : les lignes de toiture et de structure sont généralement cotées selon une clause SABS.",
      ports: "Durban traite la majorité des conteneurs venus de Chine ; Le Cap convient aux projets du Cap-Occidental. Le transit dure généralement 25 à 30 jours depuis Qingdao ou Tianjin.",
      docs: "Facture, liste de colisage, connaissement, certificat d'origine et certificats de coulée. Les rapports d'essai SABS sont souvent demandés pour les clous de toiture et les boulons structurels — confirmez la clause exacte avec l'acheteur.",
      lines: "Clous de toiture IBR, vis autoperceuses à rondelle EPDM, boulons et écrous structurels, ancrages, rondelles et étanchéité.",
      faq: [
        ['Vos clous IBR sont-ils conformes SABS ?', "Les clous de toiture sont produits selon les exigences de la SABS 1195 ; rapports d'essai disponibles sur demande."],
        ['Cotez-vous CIF Durban ?', 'Oui — FOB Qingdao/Tianjin en standard, CIF Durban ou Le Cap sur demande.'],
        ["Acceptez-vous de petites commandes d'essai ?", 'Oui — des quantités d\'essai sont acceptées avant un conteneur complet, avec échantillons disponibles.'],
      ],
    },
  },
  mozambique: {
    pt: {
      hero: 'Beira, Maputo e Nacala servem projetos locais e carga em trânsito para o Zimbábue, Zâmbia e Maláui. A Beira é a porta de trabalho do centro de Moçambique.',
      ports: 'Beira para o centro de Moçambique e trânsito para o Zimbábue; Maputo para o sul e o comércio fronteiriço com a África do Sul; Nacala para o norte. O trânsito marítimo é tipicamente de 20 a 28 dias.',
      docs: 'Fatura, lista de volumes, conhecimento de embarque, certificado de origem e certificados de aciaria. Carga em trânsito exige o país de destino indicado nos documentos; confirme com o agente o regime de trânsito em vigor.',
      lines: 'Fixações para cobertura, parafusos para betão, chumbadores e impermeabilização adequada à humidade costeira, além de pregos e ferragens gerais de obra.',
      faq: [
        ['Que porto para trânsito ao Zimbábue?', 'Beira — é o trecho marítimo mais curto, seguido de estrada via Mutare.'],
        ['Corrosão costeira — que acabamento?', 'Galvanização por imersão a quente ou inox 304/316; o zinco simples enferruja rapidamente no ar salino da Beira.'],
        ['Cotam CIF Beira?', 'Sim, a pedido, em paralelo com FOB.'],
      ],
    },
    fr: {
      hero: "Beira, Maputo et Nacala servent à la fois les projets locaux et le fret en transit vers le Zimbabwe, la Zambie et le Malawi. Beira est la porte de travail du centre du Mozambique.",
      ports: "Beira pour le centre du Mozambique et le transit vers le Zimbabwe ; Maputo pour le sud et le commerce frontalier sud-africain ; Nacala pour le nord. Le transit maritime dure généralement 20 à 28 jours.",
      docs: "Facture, liste de colisage, connaissement, certificat d'origine et certificats de coulée. Le fret en transit exige que le pays de destination figure sur les documents ; vérifiez le régime de transit en vigueur avec votre agent.",
      lines: "Fixations de toiture, vis à béton, ancrages et étanchéité adaptée à l'humidité côtière, plus clous et quincaillerie générale de chantier.",
      faq: [
        ['Quel port pour le transit vers le Zimbabwe ?', 'Beira — le tronçon maritime le plus court, puis la route via Mutare.'],
        ['Corrosion côtière — quel revêtement ?', "Galvanisation à chaud ou inox 304/316 ; le zinc simple rouille vite dans l'air salin de Beira."],
        ['Cotez-vous CIF Beira ?', 'Oui, sur demande, en parallèle du FOB.'],
      ],
    },
  },
  botswana: {
    pt: {
      hero: 'País sem litoral, abastecido principalmente via Durban com trecho rodoviário pela África do Sul; Walvis Bay é a alternativa. Mineração e construção são os dois centros de procura.',
      ports: 'Durban (África do Sul) com trecho rodoviário para Gaborone e Francistown; Walvis Bay (Namíbia) como segunda opção.',
      docs: 'Fatura, lista de volumes, conhecimento de embarque, certificado de origem e certificados de aciaria; os documentos de trânsito indicam Botsuana como destino final.',
      lines: 'Parafusos estruturais, chumbadores, fixações para cobertura, impermeabilização e ferragens gerais de obra.',
      faq: [
        ['Como é organizado o frete?', 'Marítimo até Durban, depois estrada para Gaborone ou Francistown; cotamos FOB e CIF Durban.'],
        ['Fornecem parafusos de classe mineira?', 'Sim — classes 8.8 e 10.9 com certificados de aciaria.'],
        ['Qual o prazo típico?', '15 a 25 dias de produção, 25 a 30 dias de mar até Durban, mais o trecho rodoviário.'],
      ],
    },
    fr: {
      hero: "Pays enclavé, approvisionné principalement via Durban avec un tronçon routier par l'Afrique du Sud ; Walvis Bay est l'alternative. Les mines et la construction sont les deux pôles de demande.",
      ports: "Durban (Afrique du Sud) avec route vers Gaborone et Francistown ; Walvis Bay (Namibie) comme deuxième option.",
      docs: "Facture, liste de colisage, connaissement, certificat d'origine et certificats de coulée ; les documents de transit indiquent le Botswana comme destination finale.",
      lines: "Boulons structurels, ancrages, fixations de toiture, étanchéité et quincaillerie générale de chantier.",
      faq: [
        ['Comment le fret est-il organisé ?', "Maritime jusqu'à Durban, puis route vers Gaborone ou Francistown ; nous cotons FOB et CIF Durban."],
        ['Fournissez-vous des boulons de qualité minière ?', 'Oui — classes 8.8 et 10.9 avec certificats de coulée.'],
        ['Quel est le délai habituel ?', "15 à 25 jours de production, 25 à 30 jours de mer jusqu'à Durban, plus le tronçon routier."],
      ],
    },
  },
  kenya: {
    pt: {
      hero: 'Mombasa serve o Quénia, o Uganda, o Ruanda e o trânsito para o Sudão do Sul. A conformidade pré-embarque (PVoC) é normalmente exigida, pelo que a certificação entra no cronograma.',
      ports: 'Mombasa para o Quénia e o mercado de trânsito da África Oriental; trânsito marítimo tipicamente de 28 a 32 dias.',
      docs: 'Fatura, lista de volumes, conhecimento de embarque, certificado de origem, certificados de aciaria e o certificado PVoC de conformidade quando o destino o exigir.',
      lines: 'Parafusos e pregos para cobertura, parafusos estruturais, chumbadores, parafusos para betão e impermeabilização.',
      faq: [
        ['O PVoC é obrigatório?', 'Normalmente sim para produtos regulados; organizamos a inspeção através de um organismo acreditado e incluímos o certificado nos documentos de embarque.'],
        ['Enviam para o Uganda via Mombasa?', 'Sim — a carga em trânsito é documentada para o destino final.'],
        ['Que acabamento para o litoral do Quénia?', 'Galvanização a quente ou inox; o ar salino de Mombasa é duro para camadas finas de zinco.'],
      ],
    },
    fr: {
      hero: "Mombasa dessert le Kenya, l'Ouganda, le Rwanda et le transit vers le Soudan du Sud. La conformité avant expédition (PVoC) est normalement exigée : la certification est intégrée au planning.",
      ports: "Mombasa pour le Kenya et le marché de transit est-africain ; transit maritime généralement 28 à 32 jours.",
      docs: "Facture, liste de colisage, connaissement, certificat d'origine, certificats de coulée et le certificat de conformité PVoC lorsque la destination l'exige.",
      lines: "Vis et clous de toiture, boulons structurels, ancrages, vis à béton et étanchéité.",
      faq: [
        ['Le PVoC est-il obligatoire ?', "Normalement oui pour les produits réglementés ; nous organisons l'inspection via un organisme accrédité et joignons le certificat aux documents d'expédition."],
        ['Expédiez-vous en Ouganda via Mombasa ?', 'Oui — le fret en transit est documenté vers la destination finale.'],
        ['Quel revêtement pour la côte kényane ?', "Galvanisation à chaud ou inox ; l'air salin de Mombasa est dur pour les couches de zinc minces."],
      ],
    },
  },
  nigeria: {
    pt: {
      hero: 'Lagos (Apapa / Tin Can) e Onne são as principais portas. O SONCAP é normalmente exigido para fixações reguladas, pelo que a certificação corre em paralelo com a produção.',
      ports: 'Lagos para o sudoeste e Onne para o sudeste; trânsito marítimo tipicamente de 30 a 35 dias.',
      docs: 'Fatura, lista de volumes, conhecimento de embarque, certificado de origem, certificados de aciaria e o certificado SONCAP quando aplicável.',
      lines: 'Fixações para cobertura, parafusos estruturais, chumbadores, pregos e impermeabilização para obras costeiras húmidas.',
      faq: [
        ['O SONCAP é obrigatório?', 'Para produtos regulados abrangidos pela lista SONCAP, sim — obtemos o certificado através de um organismo de inspeção acreditado.'],
        ['Que porto recomendam?', 'Lagos para a maioria dos compradores; Onne se a obra estiver no sudeste.'],
        ['Fornecem contentores mistos?', 'Sim, com plano de carga antes do embarque.'],
      ],
    },
    fr: {
      hero: "Lagos (Apapa / Tin Can) et Onne sont les principales portes. Le SONCAP est normalement exigé pour les fixations réglementées : la certification avance en parallèle de la production.",
      ports: "Lagos pour le sud-ouest et Onne pour le sud-est ; transit maritime généralement 30 à 35 jours.",
      docs: "Facture, liste de colisage, connaissement, certificat d'origine, certificats de coulée et le certificat SONCAP le cas échéant.",
      lines: "Fixations de toiture, boulons structurels, ancrages, clous et étanchéité pour sites côtiers humides.",
      faq: [
        ['Le SONCAP est-il obligatoire ?', 'Pour les produits réglementés de la liste SONCAP, oui — nous obtenons le certificat via un organisme d\'inspection accrédité.'],
        ['Quel port recommandez-vous ?', 'Lagos pour la plupart des acheteurs ; Onne si votre site est au sud-est.'],
        ['Pouvez-vous fournir des conteneurs mixtes ?', 'Oui, avec un plan de chargement avant expédition.'],
      ],
    },
  },
}

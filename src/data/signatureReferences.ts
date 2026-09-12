export interface OfficialSignatureReference {
  id: string;
  signatoryName: string;
  title: string;
  institution: string;
  registryCode: string;
  activePeriod: string;
  signatureSvgPath: string;
  viewBox: string;
  baselineSlantAngle: number;
  expectedDownstrokeRatio: number;
  biometricFeatures: {
    loopOpenness: string;
    terminalFlourish: string;
    strokeVelocity: string;
    pressurePattern: string;
  };
  notes: string;
}

export const OFFICIAL_SIGNATURE_REFERENCES: OfficialSignatureReference[] = [
  {
    id: 'REF-SORB-MARTINEZ',
    signatoryName: 'Pr. Jean-Luc Martinez',
    title: 'Président de Sorbonne Université',
    institution: 'Sorbonne Université',
    registryCode: 'ARCH-SIG-SORB-001',
    activePeriod: '2021 - Présent',
    viewBox: '0 0 160 60',
    signatureSvgPath: 'M 10 30 Q 35 5 70 25 T 120 15 Q 140 35 110 40 Q 95 43 80 35 T 60 48 Q 110 52 145 28',
    baselineSlantAngle: 14,
    expectedDownstrokeRatio: 2.1,
    biometricFeatures: {
      loopOpenness: 'Boucle initiale ouverte avec attaque ascendante douce',
      terminalFlourish: 'Retour horizontal prolongé sous le paraphe',
      strokeVelocity: 'Vitesse rapide et continue (absence de temps d\'arrêt)',
      pressurePattern: 'Forte pression sur la hampe initiale, délié effilé sur la boucle de sortie',
    },
    notes: 'Modèle officiel déposé au Grand Registre des Sceaux Académiques de l\'Académie de Paris.',
  },
  {
    id: 'REF-SORB-BERNARD',
    signatoryName: 'Mme Hélène Bernard',
    title: 'Recteur de l\'Académie, Chancelier des Universités',
    institution: 'Académie de Paris (Sorbonne)',
    registryCode: 'ARCH-SIG-RECT-002',
    activePeriod: '2020 - Présent',
    viewBox: '0 0 170 60',
    signatureSvgPath: 'M 10 25 Q 40 40 80 15 T 130 30 Q 150 10 160 25 Q 145 42 120 38 T 85 45 Q 115 50 155 35',
    baselineSlantAngle: 18,
    expectedDownstrokeRatio: 1.9,
    biometricFeatures: {
      loopOpenness: 'Double arabesque en forme de huit couché',
      terminalFlourish: 'Décharge d\'encre franche en fin de trait ascendant',
      strokeVelocity: 'Dynamique d\'impulsion modérée avec inflexions précises',
      pressurePattern: 'Modulation sinusoïdale des pressions (pleins descendants)',
    },
    notes: 'Empreinte de signature chancelière certifiée conforme pour la délivrance des diplômes d\'État.',
  },
  {
    id: 'REF-X-LABAYE',
    signatoryName: 'Pr. Éric Labaye',
    title: 'Président du Conseil d\'Administration',
    institution: 'École Polytechnique',
    registryCode: 'ARCH-SIG-X-001',
    activePeriod: '2018 - 2023',
    viewBox: '0 0 160 60',
    signatureSvgPath: 'M 5 25 Q 35 10 65 30 T 115 20 Q 135 35 150 15 Q 130 40 100 35 T 70 42 Q 105 48 140 32',
    baselineSlantAngle: 12,
    expectedDownstrokeRatio: 2.3,
    biometricFeatures: {
      loopOpenness: 'Attaque verticale anguleuse à 78°',
      terminalFlourish: 'Coup de plume final droit et net',
      strokeVelocity: 'Geste d\'écriture vif, tracé sec et autoritaire',
      pressurePattern: 'Gradient de pression marqué sur chaque inflexion verticale',
    },
    notes: 'Signature de commandement de l\'École Polytechnique validée par le Ministère des Armées.',
  },
  {
    id: 'REF-X-LASZLO',
    signatoryName: 'Dr. Yves Laszlo',
    title: 'Directeur de l\'Enseignement et de la Recherche',
    institution: 'École Polytechnique',
    registryCode: 'ARCH-SIG-X-002',
    activePeriod: '2019 - Présent',
    viewBox: '0 0 160 60',
    signatureSvgPath: 'M 5 30 Q 35 45 75 15 T 125 35 Q 145 15 155 30 Q 135 42 110 38 T 80 44 Q 120 48 150 25',
    baselineSlantAngle: 16,
    expectedDownstrokeRatio: 2.0,
    biometricFeatures: {
      loopOpenness: 'Boucle inférieure proéminente en forme de fuseau',
      terminalFlourish: 'Apex supérieur effilé',
      strokeVelocity: 'Tracé fluide et régulier, sans levée de plume intempestive',
      pressurePattern: 'Transition progressive et continue entre traits pleins et déliés',
    },
    notes: 'Référentiel certifié pour l\'attribution des titres d\'ingénieur diplômé.',
  },
  {
    id: 'REF-UPS-FISCHER',
    signatoryName: 'Pr. Alain Fischer',
    title: 'Doyen & Directeur de Faculté',
    institution: 'Université Paris-Saclay',
    registryCode: 'ARCH-SIG-UPS-001',
    activePeriod: '2021 - Présent',
    viewBox: '0 0 160 60',
    signatureSvgPath: 'M 10 35 Q 40 15 80 30 T 130 18 Q 145 32 125 42 Q 100 45 75 36 T 50 48 Q 95 52 140 30',
    baselineSlantAngle: 15,
    expectedDownstrokeRatio: 2.1,
    biometricFeatures: {
      loopOpenness: 'Graphisme académique traditionnel avec initiales intriquées',
      terminalFlourish: 'Trait de soulignement d\'authenticité',
      strokeVelocity: 'Vitesse soutenue avec décélération contrôlée aux tournants',
      pressurePattern: 'Pression moyenne élevée avec accents rythmiques distincts',
    },
    notes: 'Modèle déposé au secrétariat des examens universitaires de Paris-Saclay.',
  },
  {
    id: 'REF-FORGED-SAMPLE',
    signatoryName: 'Modèle de Contrefaçon (Calque Numérique)',
    title: 'Signature numérique altérée / Imitation',
    institution: 'Échantillon de Fraude Documentaire',
    registryCode: 'FRAUD-SIG-ALERT-999',
    activePeriod: 'Fraude Détectée',
    viewBox: '0 0 160 60',
    signatureSvgPath: 'M 10 30 L 35 20 L 70 25 L 120 18 L 140 32 L 110 38 L 80 36 L 145 29',
    baselineSlantAngle: 4,
    expectedDownstrokeRatio: 1.05, // Uniform pressure typical of vector tracing / stamp
    biometricFeatures: {
      loopOpenness: 'Formes écrasées ou polygonales issues d\'une vectorisation automatique',
      terminalFlourish: 'Arrêt net sans délié ni effilement naturel',
      strokeVelocity: 'Irrégulier ou figé (absence de dynamique corporelle)',
      pressurePattern: 'Pression 100% constante (épaisseur de pixel uniforme de tampon/tamponnage)',
    },
    notes: 'Spécimen de comparaison criminalistique : reproduction artificielle sans variation de pression de stylo.',
  },
];

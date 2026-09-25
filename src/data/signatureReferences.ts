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
    id: 'REF-UY1-BOUELET',
    signatoryName: 'Pr. Remy Sylvestre BOUELET',
    title: 'Recteur de l\'Université de Yaoundé I',
    institution: 'Université de Yaoundé I (UY1)',
    registryCode: 'ARCH-SIG-UY1-001',
    activePeriod: '2020 - Présent',
    viewBox: '0 0 160 60',
    signatureSvgPath: 'M 10 30 Q 35 5 70 25 T 120 15 Q 140 35 110 40 Q 95 43 80 35 T 60 48 Q 110 52 145 28',
    baselineSlantAngle: 14,
    expectedDownstrokeRatio: 2.1,
    biometricFeatures: {
      loopOpenness: 'Boucle initiale ouverte avec attaque ascendante souple',
      terminalFlourish: 'Retour horizontal prolongé sous le paraphe rectrice',
      strokeVelocity: 'Vitesse rapide et continue (absence d\'hésitation)',
      pressurePattern: 'Forte pression sur la hampe initiale, délié effilé sur la boucle de sortie',
    },
    notes: 'Modèle officiel déposé au Grand Registre des Sceaux et Titres Universitaires (MINESUP Cameroun).',
  },
  {
    id: 'REF-IAI-ABANDA',
    signatoryName: 'Armand Claude ABANDA',
    title: 'Représentant Résident IAI-Cameroun',
    institution: 'IAI-Cameroun (Institut Africain d\'Informatique)',
    registryCode: 'ARCH-SIG-IAI-002',
    activePeriod: '2019 - Présent',
    viewBox: '0 0 170 60',
    signatureSvgPath: 'M 10 25 Q 40 40 80 15 T 130 30 Q 150 10 160 25 Q 145 42 120 38 T 85 45 Q 115 50 155 35',
    baselineSlantAngle: 18,
    expectedDownstrokeRatio: 1.9,
    biometricFeatures: {
      loopOpenness: 'Double arabesque continue avec paraphe diplomatique',
      terminalFlourish: 'Décharge d\'encre franche en fin de trait ascendant',
      strokeVelocity: 'Dynamique d\'impulsion modérée avec inflexions précises',
      pressurePattern: 'Modulation sinusoïdale des pressions (pleins descendants certifiés)',
    },
    notes: 'Empreinte de signature diplomatique et académique certifiée conforme pour la délivrance des diplômes d\'ingénieur.',
  },
  {
    id: 'REF-ENSPY-NOUBISSI',
    signatoryName: 'Pr. Guy Edgar NOUBISSI',
    title: 'Directeur de l\'École Polytechnique de Yaoundé',
    institution: 'École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)',
    registryCode: 'ARCH-SIG-ENSPY-001',
    activePeriod: '2018 - Présent',
    viewBox: '0 0 160 60',
    signatureSvgPath: 'M 5 25 Q 35 10 65 30 T 115 20 Q 135 35 150 15 Q 130 40 100 35 T 70 42 Q 105 48 140 32',
    baselineSlantAngle: 12,
    expectedDownstrokeRatio: 2.3,
    biometricFeatures: {
      loopOpenness: 'Attaque verticale anguleuse à 78°',
      terminalFlourish: 'Coup de plume final droit et net',
      strokeVelocity: 'Geste d\'écriture vif, tracé géométrique et ferme',
      pressurePattern: 'Gradient de pression marqué sur chaque inflexion verticale',
    },
    notes: 'Signature de commandement académique de l\'ENSPY validée par le Ministère de l\'Enseignement Supérieur.',
  },
  {
    id: 'REF-OBC-MINKOULOU',
    signatoryName: 'Etienne Roger MINKOULOU',
    title: 'Directeur de l\'Office du Baccalauréat du Cameroun',
    institution: 'Office du Baccalauréat du Cameroun (OBC)',
    registryCode: 'ARCH-SIG-OBC-002',
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
    notes: 'Référentiel certifié pour l\'attribution des diplômes du Baccalauréat de l\'enseignement secondaire camerounais.',
  },
  {
    id: 'REF-UD-ONDOA',
    signatoryName: 'Pr. Magloire ONDOA',
    title: 'Recteur de l\'Université de Douala',
    institution: 'Université de Douala',
    registryCode: 'ARCH-SIG-UD-001',
    activePeriod: '2021 - Présent',
    viewBox: '0 0 160 60',
    signatureSvgPath: 'M 10 35 Q 40 15 80 30 T 130 18 Q 145 32 125 42 Q 100 45 75 36 T 50 48 Q 95 52 140 30',
    baselineSlantAngle: 15,
    expectedDownstrokeRatio: 2.1,
    biometricFeatures: {
      loopOpenness: 'Graphisme académique traditionnel avec paraphe rectrice intriqué',
      terminalFlourish: 'Trait de soulignement d\'authenticité',
      strokeVelocity: 'Vitesse soutenue avec décélération contrôlée aux tournants',
      pressurePattern: 'Pression moyenne élevée avec accents rythmiques distincts',
    },
    notes: 'Modèle déposé à la direction des affaires académiques de l\'Université de Douala.',
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

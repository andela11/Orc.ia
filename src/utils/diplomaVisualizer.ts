import { RegisteredDiploma } from '../types';
import { SAMPLE_DIPLOMAS } from '../data/sampleDiplomas';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates an SVG facsimile representation for any registered diploma.
 * Matches known templates if available, or renders a customized vector diploma.
 */
export function getDiplomaSvgContent(diploma: RegisteredDiploma): string {
  // Check if there is an exact match in sample diplomas
  const sampleMatch = SAMPLE_DIPLOMAS.find(
    (s) =>
      s.studentName.toLowerCase() === diploma.studentName.toLowerCase() ||
      s.institution.toLowerCase() === diploma.institution.toLowerCase() &&
      s.degreeTitle.toLowerCase().includes(diploma.degreeTitle.toLowerCase().substring(0, 10))
  );

  if (sampleMatch && diploma.documentId === 'SORB-2023-M8921') {
    return sampleMatch.rawSvg;
  }

  if (sampleMatch && diploma.documentId === 'X-2022-ING-0412') {
    return sampleMatch.rawSvg;
  }

  // Generate an authentic academic SVG diploma
  const safeName = escapeXml(diploma.studentName);
  const safeInst = escapeXml(diploma.institution.toUpperCase());
  const safeDegree = escapeXml(diploma.degreeTitle.toUpperCase());
  const safeField = escapeXml(diploma.fieldOfStudy);
  const safeDocId = escapeXml(diploma.documentId);
  const safeDate = escapeXml(diploma.issueDate);
  const safeHonors = diploma.honors ? escapeXml(diploma.honors) : 'Mention Bien';

  // Palette variation based on institution
  let primaryColor = '#0F2C59';
  let accentColor = '#8A7338';
  let sealColor = '#991B1B';

  if (diploma.institution.toLowerCase().includes('polytechnique')) {
    primaryColor = '#0B1325';
    accentColor = '#B45309';
    sealColor = '#1E3A8A';
  } else if (diploma.institution.toLowerCase().includes('saclay')) {
    primaryColor = '#1E1B4B';
    accentColor = '#6366F1';
    sealColor = '#4338CA';
  } else if (diploma.institution.toLowerCase().includes('hec')) {
    primaryColor = '#172554';
    accentColor = '#CA8A04';
    sealColor = '#1E40AF';
  } else if (diploma.institution.toLowerCase().includes('genève')) {
    primaryColor = '#450A0A';
    accentColor = '#B91C1C';
    sealColor = '#991B1B';
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
  <defs>
    <linearGradient id="bgGrad_${diploma.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFCFA" />
      <stop offset="100%" stop-color="#F5F2EB" />
    </linearGradient>
    <pattern id="guilloche_${diploma.id}" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M0 25 Q12.5 0 25 25 T50 25" fill="none" stroke="#E5E1D3" stroke-width="0.75" opacity="0.5"/>
      <path d="M0 25 Q12.5 50 25 25 T50 25" fill="none" stroke="#E5E1D3" stroke-width="0.75" opacity="0.5"/>
    </pattern>
  </defs>

  <!-- Parchment & Guilloche Background -->
  <rect width="1000" height="700" fill="url(#bgGrad_${diploma.id})" />
  <rect x="25" y="25" width="950" height="650" fill="url(#guilloche_${diploma.id})" />

  <!-- Frame & Outer Borders -->
  <rect x="20" y="20" width="960" height="660" fill="none" stroke="${accentColor}" stroke-width="3.5" />
  <rect x="27" y="27" width="946" height="646" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
  <rect x="33" y="33" width="934" height="634" fill="none" stroke="${accentColor}" stroke-width="0.75" stroke-dasharray="5,3" />

  <!-- Corner details -->
  <circle cx="27" cy="27" r="5" fill="${accentColor}" />
  <circle cx="973" cy="27" r="5" fill="${accentColor}" />
  <circle cx="27" cy="673" r="5" fill="${accentColor}" />
  <circle cx="973" cy="673" r="5" fill="${accentColor}" />

  <!-- National Heading -->
  <text x="500" y="76" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" letter-spacing="4" fill="#4B5563" font-weight="bold">RÉPUBLIQUE FRANÇAISE</text>
  <text x="500" y="98" text-anchor="middle" font-family="'Times New Roman', serif" font-size="12" letter-spacing="2" fill="#6B7280">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE</text>

  <!-- University / Institution -->
  <text x="500" y="152" text-anchor="middle" font-family="'Times New Roman', serif" font-size="32" font-weight="bold" fill="${primaryColor}" letter-spacing="2">${safeInst}</text>
  <line x1="320" y1="168" x2="680" y2="168" stroke="${accentColor}" stroke-width="2" />

  <text x="500" y="215" text-anchor="middle" font-family="'Times New Roman', serif" font-size="16" fill="#374151" font-style="italic">Le Conseil d'Administration et le Jury d'Examen</text>
  <text x="500" y="238" text-anchor="middle" font-family="'Times New Roman', serif" font-size="13" fill="#4B5563">Vu les procès-verbaux de délibérations officiellement arrêtés,</text>

  <!-- Degree Title -->
  <text x="500" y="295" text-anchor="middle" font-family="'Times New Roman', serif" font-size="26" font-weight="bold" fill="${primaryColor}" letter-spacing="1.5">${safeDegree}</text>
  <text x="500" y="325" text-anchor="middle" font-family="'Times New Roman', serif" font-size="15" fill="#374151">Spécialité : ${safeField}</text>

  <!-- Student Name -->
  <text x="500" y="380" text-anchor="middle" font-family="'Times New Roman', serif" font-size="15" fill="#4B5563">Est décerné à :</text>
  <text x="500" y="424" text-anchor="middle" font-family="'Times New Roman', serif" font-size="30" font-weight="bold" fill="#111827" letter-spacing="1">${safeName}</text>
  <text x="500" y="455" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" fill="#4B5563">${safeHonors}</text>

  <!-- Serial & Date -->
  <text x="120" y="525" font-family="Courier, monospace" font-size="13" font-weight="bold" fill="#334155">N° ENREGISTREMENT : ${safeDocId}</text>
  <text x="120" y="545" font-family="'Times New Roman', serif" font-size="13" fill="#64748B">Délivré le ${safeDate}</text>

  <!-- Official Seal -->
  <g transform="translate(500, 565)">
    <circle cx="0" cy="0" r="48" fill="${sealColor}" opacity="0.9" />
    <circle cx="0" cy="0" r="42" fill="none" stroke="#FDE68A" stroke-width="1.8" stroke-dasharray="3,2" />
    <circle cx="0" cy="0" r="36" fill="none" stroke="#FDE68A" stroke-width="1" />
    <text x="0" y="-14" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8" fill="#FDE68A" font-weight="bold" letter-spacing="1">ACADÉMIE OFFICIELLE</text>
    <text x="0" y="0" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" fill="#FDE68A">★ RÉPUBLIQUE ★</text>
    <text x="0" y="14" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8" fill="#FDE68A" font-weight="bold">SCEAU DE L'ÉTAT</text>
  </g>

  <!-- Signatures -->
  <g transform="translate(180, 595)">
    <text x="0" y="0" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#1E293B">Le Président de l'Établissement</text>
    <path d="M 5 25 Q 35 5 70 25 T 120 15 Q 140 35 110 40" fill="none" stroke="#1E3A8A" stroke-width="2.5" />
    <text x="5" y="42" font-family="'Times New Roman', serif" font-size="11" fill="#64748B" font-style="italic">Signature officielle</text>
  </g>

  <g transform="translate(710, 595)">
    <text x="0" y="0" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#1E293B">Le Recteur d'Académie</text>
    <path d="M 5 20 Q 35 40 75 15 T 125 30 Q 145 15 155 25" fill="none" stroke="#1E3A8A" stroke-width="2.5" />
    <text x="5" y="42" font-family="'Times New Roman', serif" font-size="11" fill="#64748B" font-style="italic">Chancellerie</text>
  </g>
</svg>`;
}

export function getDiplomaDataUrl(diploma: RegisteredDiploma): string {
  const svg = getDiplomaSvgContent(diploma);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

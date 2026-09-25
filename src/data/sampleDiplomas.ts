import { VerificationStatus } from '../types';

// Helper to convert SVG to data URL
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function rasterizeSvgToPng(svgString: string, width = 1200, height = 840): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
      return;
    }

    try {
      const img = new Image();
      let cleanSvg = svgString;
      if (!cleanSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
        cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
      const urlHelper = window.URL || (window as any).webkitURL;
      const blobUrl = urlHelper.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            urlHelper.revokeObjectURL(blobUrl);
            const pngDataUrl = canvas.toDataURL('image/png', 0.95);
            resolve(pngDataUrl);
            return;
          }
        } catch (e) {
          console.warn('Canvas rasterization error:', e);
        }
        urlHelper.revokeObjectURL(blobUrl);
        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`);
      };

      img.onerror = (e) => {
        console.warn('Image failed to load SVG:', e);
        urlHelper.revokeObjectURL(blobUrl);
        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`);
      };

      img.src = blobUrl;
    } catch (err) {
      console.warn('Failed to rasterize SVG:', err);
      resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
    }
  });
}

export interface SampleDiploma {
  id: string;
  name: string;
  institution: string;
  degreeTitle: string;
  studentName: string;
  expectedStatus: VerificationStatus;
  scenarioDescription: string;
  badgeLabel: string;
  svgDataUrl: string;
  rawSvg: string;
}

// 1. Diplôme Authentique Conforme (Université de Yaoundé I)
const authenticUy1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFCFA" />
      <stop offset="100%" stop-color="#F5F3EB" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37" />
      <stop offset="50%" stop-color="#FFDF73" />
      <stop offset="100%" stop-color="#AA771C" />
    </linearGradient>
    <pattern id="guilloche" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M0 30 Q15 0 30 30 T60 30" fill="none" stroke="#E2DEC8" stroke-width="0.8" opacity="0.4"/>
      <path d="M0 30 Q15 60 30 30 T60 30" fill="none" stroke="#E2DEC8" stroke-width="0.8" opacity="0.4"/>
    </pattern>
  </defs>

  <!-- Parchemin Background -->
  <rect width="1000" height="700" fill="url(#bgGrad)" />
  <rect x="25" y="25" width="950" height="650" fill="url(#guilloche)" />

  <!-- Bordure Décorative Officielle aux Couleurs Nationales -->
  <rect x="20" y="20" width="960" height="660" fill="none" stroke="#047857" stroke-width="4" />
  <rect x="28" y="28" width="944" height="644" fill="none" stroke="#B45309" stroke-width="1.5" />
  <rect x="34" y="34" width="932" height="632" fill="none" stroke="#047857" stroke-width="0.8" stroke-dasharray="6,3" />

  <!-- Coins décoratifs -->
  <circle cx="28" cy="28" r="6" fill="#B45309" />
  <circle cx="972" cy="28" r="6" fill="#B45309" />
  <circle cx="28" cy="672" r="6" fill="#B45309" />
  <circle cx="972" cy="672" r="6" fill="#B45309" />

  <!-- En-tête Officiel Bilingue République du Cameroun -->
  <text x="230" y="65" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="11" font-weight="bold" fill="#1E293B">RÉPUBLIQUE DU CAMEROUN</text>
  <text x="230" y="80" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="9" fill="#64748B">Paix - Travail - Patrie</text>

  <text x="770" y="65" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="11" font-weight="bold" fill="#1E293B">REPUBLIC OF CAMEROON</text>
  <text x="770" y="80" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="9" fill="#64748B">Peace - Work - Fatherland</text>

  <text x="500" y="102" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="12" letter-spacing="1.5" fill="#475569" font-weight="bold">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR (MINESUP)</text>

  <!-- Université Émettrice -->
  <text x="500" y="148" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="32" font-weight="bold" fill="#047857" letter-spacing="2">UNIVERSITÉ DE YAOUNDÉ I</text>
  <text x="500" y="170" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="14" fill="#334155" font-style="italic">Faculté des Sciences • Département d'Informatique</text>
  <line x1="320" y1="182" x2="680" y2="182" stroke="#B45309" stroke-width="2" />

  <text x="500" y="215" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="15" fill="#333" font-style="italic">Le Recteur de l'Université et le Doyen de la Faculté des Sciences</text>
  <text x="500" y="238" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="13" fill="#444">Vu le procès-verbal des délibérations du jury académique réuni le 28 juin 2023,</text>

  <!-- Titre du Diplôme -->
  <text x="500" y="290" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="28" font-weight="bold" fill="#B91C1C" letter-spacing="2">DIPLÔME DE MASTER</text>
  <text x="500" y="320" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="16" fill="#222">Domaine : Sciences et Technologies</text>
  <text x="500" y="345" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="17" font-weight="bold" fill="#047857">Mention : Informatique et Systèmes Décisionnels</text>

  <!-- Titulaire du Diplôme -->
  <text x="500" y="400" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="15" fill="#333">Est décerné à :</text>
  <text x="500" y="440" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="30" font-weight="bold" fill="#111827" letter-spacing="1">Monsieur Boris TCHOUA</text>
  <text x="500" y="470" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="14" fill="#444">Né le 14 mai 1999 à Yaoundé • Matricule : 18U0421 • Mention : Très Bien</text>

  <!-- Références et Numéro d'enregistrement -->
  <text x="120" y="535" font-family="Courier, monospace" font-size="13" font-weight="bold" fill="#334155">N° ENREGISTREMENT : UY1-2023-M8921</text>
  <text x="120" y="555" font-family="'Times New Roman', Georgia, serif" font-size="13" fill="#64748B">Délivré à Yaoundé, le 28 juin 2023</text>

  <!-- Sceau Officiel Rouge Doré -->
  <g transform="translate(500, 565)">
    <circle cx="0" cy="0" r="50" fill="#047857" opacity="0.95" />
    <circle cx="0" cy="0" r="44" fill="none" stroke="#FDE68A" stroke-width="2" stroke-dasharray="3,2" />
    <circle cx="0" cy="0" r="38" fill="none" stroke="#FDE68A" stroke-width="1" />
    <text x="0" y="-18" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7.5" fill="#FDE68A" font-weight="bold" letter-spacing="1">UNIVERSITÉ DE YAOUNDÉ I</text>
    <text x="0" y="-4" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" fill="#FDE68A">★ RECTORAT ★</text>
    <text x="0" y="10" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7.5" fill="#FDE68A" font-weight="bold">SCEAU OFFICIEL</text>
    <text x="0" y="24" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" fill="#FDE68A">1962 - 2023</text>
  </g>

  <!-- Signatures -->
  <g transform="translate(180, 595)">
    <text x="0" y="0" font-family="'Times New Roman', Georgia, serif" font-size="12" font-weight="bold" fill="#1E293B">Le Recteur de l'Université</text>
    <path d="M 10 30 Q 35 5 70 25 T 120 15 Q 140 35 110 40" fill="none" stroke="#047857" stroke-width="2.5" />
    <text x="10" y="45" font-family="'Times New Roman', serif" font-size="11" fill="#64748B" font-style="italic">Pr. Remy Sylvestre BOUELET</text>
  </g>

  <g transform="translate(720, 595)">
    <text x="0" y="0" font-family="'Times New Roman', Georgia, serif" font-size="12" font-weight="bold" fill="#1E293B">Le Doyen de la Faculté</text>
    <path d="M 10 25 Q 40 40 80 15 T 130 30 Q 150 10 160 25" fill="none" stroke="#047857" stroke-width="2.5" />
    <text x="10" y="45" font-family="'Times New Roman', serif" font-size="11" fill="#64748B" font-style="italic">Pr. Jean-Bosco TALLA</text>
  </g>
</svg>`;

// 2. Diplôme Falsifié (Nom altéré avec police discordante "Alain BIKOI" + Usurpation Matricule UY1)
const falsifiedDiplomaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFCFA" />
      <stop offset="100%" stop-color="#F5F3EB" />
    </linearGradient>
  </defs>

  <rect width="1000" height="700" fill="url(#bgGrad2)" />

  <!-- Bordure -->
  <rect x="20" y="20" width="960" height="660" fill="none" stroke="#047857" stroke-width="4" />
  <rect x="28" y="28" width="944" height="644" fill="none" stroke="#B45309" stroke-width="1.5" />

  <!-- En-tête Bilingue Cameroun -->
  <text x="230" y="65" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="11" font-weight="bold" fill="#1E293B">RÉPUBLIQUE DU CAMEROUN</text>
  <text x="230" y="80" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="9" fill="#64748B">Paix - Travail - Patrie</text>

  <text x="770" y="65" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="11" font-weight="bold" fill="#1E293B">REPUBLIC OF CAMEROON</text>
  <text x="770" y="80" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="9" fill="#64748B">Peace - Work - Fatherland</text>

  <text x="500" y="102" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="12" letter-spacing="1.5" fill="#475569" font-weight="bold">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR (MINESUP)</text>

  <text x="500" y="148" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="32" font-weight="bold" fill="#047857" letter-spacing="2">UNIVERSITÉ DE YAOUNDÉ I</text>
  <text x="500" y="170" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="14" fill="#334155" font-style="italic">Faculté des Sciences • Département d'Informatique</text>
  <line x1="320" y1="182" x2="680" y2="182" stroke="#B45309" stroke-width="2" />

  <text x="500" y="215" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="15" fill="#333" font-style="italic">Le Recteur de l'Université et le Doyen de la Faculté des Sciences</text>
  <text x="500" y="238" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="13" fill="#444">Vu le procès-verbal des délibérations du jury académique réuni le 28 juin 2023,</text>

  <text x="500" y="290" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="28" font-weight="bold" fill="#B91C1C" letter-spacing="2">DIPLÔME DE MASTER</text>
  <text x="500" y="320" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="16" fill="#222">Domaine : Sciences et Technologies</text>
  <text x="500" y="345" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="17" font-weight="bold" fill="#047857">Mention : Informatique et Systèmes Décisionnels</text>

  <text x="500" y="400" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="15" fill="#333">Est conféré à :</text>

  <!-- Zone Altérée avec Artefact Flou & Police Discordante (Arial au lieu de Times) -->
  <rect x="260" y="415" width="480" height="42" fill="#EAE5D5" rx="3" opacity="0.75" />
  <rect x="256" y="412" width="488" height="48" fill="none" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />
  <text x="500" y="445" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="bold" fill="#000000" letter-spacing="0">Monsieur Alain BIKOI</text>

  <text x="500" y="475" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="14" fill="#444">Né le 12 août 1997 à Douala • Mention : Félicitations du Jury</text>

  <!-- Numéro d'enregistrement volé à Boris TCHOUA -->
  <text x="120" y="535" font-family="Courier, monospace" font-size="13" font-weight="bold" fill="#334155">N° ENREGISTREMENT : UY1-2023-M8921</text>
  <text x="120" y="555" font-family="'Times New Roman', Georgia, serif" font-size="13" fill="#64748B">Délivré à Yaoundé, le 28 juin 2023</text>

  <!-- Sceau -->
  <g transform="translate(500, 565)">
    <circle cx="0" cy="0" r="50" fill="#047857" opacity="0.95" />
    <circle cx="0" cy="0" r="44" fill="none" stroke="#FDE68A" stroke-width="2" stroke-dasharray="3,2" />
    <text x="0" y="5" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8" fill="#FDE68A" font-weight="bold">SCEAU OFFICIEL</text>
  </g>

  <!-- Signatures -->
  <g transform="translate(180, 595)">
    <text x="0" y="0" font-family="'Times New Roman', Georgia, serif" font-size="12" font-weight="bold" fill="#1E293B">Le Recteur de l'Université</text>
    <path d="M 10 30 Q 35 5 70 25 T 120 15 Q 140 35 110 40" fill="none" stroke="#047857" stroke-width="2.5" />
  </g>

  <g transform="translate(720, 595)">
    <text x="0" y="0" font-family="'Times New Roman', Georgia, serif" font-size="12" font-weight="bold" fill="#1E293B">Le Doyen de la Faculté</text>
    <path d="M 10 25 Q 40 40 80 15 T 130 30 Q 150 10 160 25" fill="none" stroke="#047857" stroke-width="2.5" />
  </g>
</svg>`;

// 3. Diplôme Polytechnique (Authentique Ingénieur ENSPY Yaoundé - Danielle MBALLA ESSOMBA)
const authenticPolytechniqueSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
  <rect width="1000" height="700" fill="#FAF9F6" />
  <rect x="25" y="25" width="950" height="650" fill="none" stroke="#B45309" stroke-width="3" />
  <rect x="32" y="32" width="936" height="636" fill="none" stroke="#1E3A8A" stroke-width="1.5" />

  <!-- En-tête Bilingue Cameroun -->
  <text x="230" y="65" text-anchor="middle" font-family="'Times New Roman', serif" font-size="11" font-weight="bold" fill="#1E293B">RÉPUBLIQUE DU CAMEROUN</text>
  <text x="230" y="80" text-anchor="middle" font-family="'Times New Roman', serif" font-size="9" fill="#64748B">Paix - Travail - Patrie</text>

  <text x="770" y="65" text-anchor="middle" font-family="'Times New Roman', serif" font-size="11" font-weight="bold" fill="#1E293B">REPUBLIC OF CAMEROON</text>
  <text x="770" y="80" text-anchor="middle" font-family="'Times New Roman', serif" font-size="9" fill="#64748B">Peace - Work - Fatherland</text>

  <text x="500" y="100" text-anchor="middle" font-family="'Times New Roman', serif" font-size="12" letter-spacing="2" fill="#4B5563">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR • UNIVERSITÉ DE YAOUNDÉ I</text>

  <text x="500" y="150" text-anchor="middle" font-family="'Times New Roman', serif" font-size="26" font-weight="bold" fill="#0B1325" letter-spacing="1.5">ÉCOLE NATIONALE SUPÉRIEURE POLYTECHNIQUE DE YAOUNDÉ</text>
  <text x="500" y="175" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" fill="#B45309" letter-spacing="1">ENSPY — INGENIO ET LABORE</text>
  <line x1="320" y1="190" x2="680" y2="190" stroke="#B45309" stroke-width="2" />

  <text x="500" y="245" text-anchor="middle" font-family="'Times New Roman', serif" font-size="26" font-weight="bold" fill="#1E3A8A">DIPLÔME D'INGÉNIEUR DE CONCEPTION</text>
  <text x="500" y="275" text-anchor="middle" font-family="'Times New Roman', serif" font-size="15" fill="#374151">Grade conféré : Master en Sciences de l'Ingénieur</text>
  <text x="500" y="305" text-anchor="middle" font-family="'Times New Roman', serif" font-size="16" font-weight="bold" fill="#0B1325">Spécialité : Génie Informatique &amp; Télécommunications</text>

  <text x="500" y="365" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" fill="#4B5563">Délivré à :</text>
  <text x="500" y="405" text-anchor="middle" font-family="'Times New Roman', serif" font-size="28" font-weight="bold" fill="#111827">Madame Danielle MBALLA ESSOMBA</text>
  <text x="500" y="435" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" fill="#4B5563">Née le 21 novembre 1999 à Douala • Promotion ENSPY 2022 • Félicitations du Jury</text>

  <text x="120" y="515" font-family="Courier, monospace" font-size="13" font-weight="bold" fill="#334155">NUMÉRO D'ENREGISTREMENT : ENSPY-2022-ING-0412</text>
  <text x="120" y="535" font-family="'Times New Roman', serif" font-size="13" fill="#64748B">Fait à Yaoundé, le 15 juillet 2022</text>

  <!-- Sceau Polytechnique ENSPY -->
  <g transform="translate(500, 560)">
    <circle cx="0" cy="0" r="48" fill="#1E3A8A" />
    <circle cx="0" cy="0" r="42" fill="none" stroke="#FDE68A" stroke-width="2" />
    <text x="0" y="-8" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8.5" fill="#FFF" font-weight="bold">ENSPY YAOUNDÉ</text>
    <text x="0" y="6" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7.5" fill="#FDE68A">INGENIO ET LABORE</text>
    <text x="0" y="20" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7.5" fill="#FFF">SCEAU OFFICIEL</text>
  </g>

  <!-- Signatures -->
  <g transform="translate(180, 595)">
    <text x="0" y="0" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#1E293B">Le Directeur de l'ENSPY</text>
    <path d="M 5 25 Q 35 10 65 30 T 115 20 Q 135 35 150 15" fill="none" stroke="#047857" stroke-width="2.5" />
    <text x="5" y="40" font-family="'Times New Roman', serif" font-size="10.5" fill="#64748B">Pr. Guy Edgar NOUBISSI</text>
  </g>

  <g transform="translate(700, 595)">
    <text x="0" y="0" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#1E293B">Le Directeur des Études</text>
    <path d="M 5 30 Q 35 45 75 15 T 125 35 Q 145 15 155 30" fill="none" stroke="#047857" stroke-width="2.5" />
    <text x="5" y="40" font-family="'Times New Roman', serif" font-size="10.5" fill="#64748B">Dr. Thomas TCHAMO</text>
  </g>
</svg>`;

const carVehicleSvg = `<svg width="1000" height="700" viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg">
  <!-- Photographie d'un véhicule automobile / voiture de sport (Test d'exclusion de document) -->
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="60%" stop-color="#BAE6FD" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#DC2626" />
      <stop offset="40%" stop-color="#EF4444" />
      <stop offset="80%" stop-color="#B91C1C" />
      <stop offset="100%" stop-color="#7F1D1D" />
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#0284C7" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.95" />
    </linearGradient>
  </defs>

  <!-- Sky & Landscape Background -->
  <rect width="1000" height="420" fill="url(#skyGrad)" />
  <path d="M 0 360 Q 250 310 500 350 T 1000 320 L 1000 420 L 0 420 Z" fill="#94A3B8" opacity="0.6" />
  
  <!-- Asphalt Road & Track -->
  <rect y="420" width="1000" height="280" fill="url(#roadGrad)" />
  <line x1="0" y1="560" x2="1000" y2="560" stroke="#FDE047" stroke-width="8" stroke-dasharray="40 30" />

  <!-- Car Silhouette & Chassis -->
  <g id="sports-car" transform="translate(140, 240)">
    <!-- Shadow under vehicle -->
    <ellipse cx="360" cy="270" rx="350" ry="25" fill="#000000" opacity="0.45" />

    <!-- Main Aerodynamic Body -->
    <path d="M 60 210 Q 110 140 220 120 L 320 60 Q 420 50 510 90 L 640 150 Q 700 170 710 210 Q 710 240 680 250 L 70 250 Q 40 240 60 210 Z" fill="url(#carBodyGrad)" />
    
    <!-- Cabin & Windshield Windows -->
    <path d="M 235 120 L 320 70 Q 410 60 495 95 L 530 140 L 235 140 Z" fill="url(#glassGrad)" stroke="#1E293B" stroke-width="3" />
    <line x1="390" y1="65" x2="400" y2="140" stroke="#0F172A" stroke-width="4" />

    <!-- Headlight & Front Grille -->
    <polygon points="650,175 700,195 670,215 640,195" fill="#FEF08A" opacity="0.9" />
    <polygon points="665,182 690,195 675,205" fill="#FFFFFF" />

    <!-- Wheels (Front & Rear) -->
    <!-- Rear Wheel -->
    <g transform="translate(180, 245)">
      <circle cx="0" cy="0" r="55" fill="#1E293B" stroke="#0F172A" stroke-width="6" />
      <circle cx="0" cy="0" r="34" fill="#64748B" stroke="#CBD5E1" stroke-width="3" />
      <!-- Rim Spokes -->
      <line x1="-28" y1="0" x2="28" y2="0" stroke="#E2E8F0" stroke-width="4" />
      <line x1="0" y1="-28" x2="0" y2="28" stroke="#E2E8F0" stroke-width="4" />
      <circle cx="0" cy="0" r="10" fill="#0F172A" />
    </g>

    <!-- Front Wheel -->
    <g transform="translate(560, 245)">
      <circle cx="0" cy="0" r="55" fill="#1E293B" stroke="#0F172A" stroke-width="6" />
      <circle cx="0" cy="0" r="34" fill="#64748B" stroke="#CBD5E1" stroke-width="3" />
      <!-- Rim Spokes -->
      <line x1="-28" y1="0" x2="28" y2="0" stroke="#E2E8F0" stroke-width="4" />
      <line x1="0" y1="-28" x2="0" y2="28" stroke="#E2E8F0" stroke-width="4" />
      <circle cx="0" cy="0" r="10" fill="#0F172A" />
    </g>

    <!-- Aerodynamic spoiler -->
    <path d="M 60 160 L 40 130 L 100 130 L 90 160 Z" fill="#991B1B" />
    <path d="M 30 130 L 110 130" stroke="#1E293B" stroke-width="5" />
    
    <!-- Exhaust pipe -->
    <rect x="45" y="240" width="20" height="8" rx="2" fill="#94A3B8" />
  </g>

  <!-- Photo camera watermark / non-academic metadata overlay -->
  <g transform="translate(40, 640)">
    <text x="0" y="0" font-family="sans-serif" font-size="14" font-weight="bold" fill="#F8FAFC">PHOTO EXTÉRIEURE - VÉHICULE DE SPORT SUR ROUTE</text>
    <text x="0" y="20" font-family="sans-serif" font-size="11" fill="#94A3B8">Appareil : Canon EOS R5 | Vitesse : 1/2000s | Focale : 70mm | Sujet : Véhicule automobile (Non académique)</text>
  </g>
</svg>`;

// 5. Diplôme d'Ingénieur des Travaux Informatiques (IAI-Cameroun)
const authenticIaiCameroonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
  <defs>
    <linearGradient id="iaiBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFCF5" />
      <stop offset="100%" stop-color="#F5EFE1" />
    </linearGradient>
  </defs>

  <rect width="1000" height="700" fill="url(#iaiBg)" />

  <!-- Double Bordure Officielle aux Couleurs de l'IAI -->
  <rect x="20" y="20" width="960" height="660" fill="none" stroke="#1E3A8A" stroke-width="4" />
  <rect x="28" y="28" width="944" height="644" fill="none" stroke="#D97706" stroke-width="2" />
  <rect x="34" y="34" width="932" height="632" fill="none" stroke="#1E3A8A" stroke-width="0.8" stroke-dasharray="8,4" />

  <!-- En-tête Bilingue Cameroun -->
  <text x="220" y="65" text-anchor="middle" font-family="'Times New Roman', serif" font-size="11" font-weight="bold" fill="#1E293B">RÉPUBLIQUE DU CAMEROUN</text>
  <text x="220" y="80" text-anchor="middle" font-family="'Times New Roman', serif" font-size="9" fill="#64748B">Paix - Travail - Patrie</text>

  <text x="780" y="65" text-anchor="middle" font-family="'Times New Roman', serif" font-size="11" font-weight="bold" fill="#1E293B">REPUBLIC OF CAMEROON</text>
  <text x="780" y="80" text-anchor="middle" font-family="'Times New Roman', serif" font-size="9" fill="#64748B">Peace - Work - Fatherland</text>

  <!-- Institution -->
  <text x="500" y="125" text-anchor="middle" font-family="'Times New Roman', serif" font-size="22" font-weight="bold" fill="#1E3A8A" letter-spacing="2">INSTITUT AFRICAIN D'INFORMATIQUE</text>
  <text x="500" y="148" text-anchor="middle" font-family="'Times New Roman', serif" font-size="15" font-weight="bold" fill="#B45309" letter-spacing="1">REPRÉSENTATION DU CAMEROUN</text>
  <text x="500" y="168" text-anchor="middle" font-family="'Times New Roman', serif" font-size="12" fill="#475569" font-style="italic">Centre d'Excellence Technologique Paul BIYA — Yaoundé</text>
  <line x1="280" y1="180" x2="720" y2="180" stroke="#D97706" stroke-width="1.5" />

  <!-- Délibération -->
  <text x="500" y="215" text-anchor="middle" font-family="'Times New Roman', serif" font-size="13" fill="#334155">Vu le procès-verbal des délibérations du jury de fin de cycle réuni le 22 juillet 2023,</text>
  <text x="500" y="235" text-anchor="middle" font-family="'Times New Roman', serif" font-size="13" fill="#334155">Le Représentant Résident et le Président du Jury confèrent le :</text>

  <!-- Intitulé du Titre -->
  <text x="500" y="285" text-anchor="middle" font-family="'Times New Roman', serif" font-size="26" font-weight="bold" fill="#1E3A8A" letter-spacing="1">DIPLÔME D'INGÉNIEUR DES TRAVAUX INFORMATIQUES</text>
  <text x="500" y="315" text-anchor="middle" font-family="'Times New Roman', serif" font-size="16" font-weight="bold" fill="#B45309">Option : Génie Logiciel &amp; Systèmes d'Information</text>

  <!-- Bénéficiaire -->
  <text x="500" y="365" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" fill="#475569">À Monsieur :</text>
  <text x="500" y="405" text-anchor="middle" font-family="'Times New Roman', serif" font-size="28" font-weight="bold" fill="#0F172A">Jean Paul ETOUNDI</text>
  <text x="500" y="435" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" fill="#334155">Né le 14 mai 2000 à Yaoundé • Matricule : 20-IAI-1082</text>
  <text x="500" y="460" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" font-weight="bold" fill="#1E3A8A">Mention : Très Bien (Félicitations du Jury)</text>

  <!-- Identifiants officiels -->
  <text x="100" y="525" font-family="monospace" font-size="12" font-weight="bold" fill="#1E293B">ENREGISTREMENT N° : IAI-CMR-2023-ING-0842</text>
  <text x="100" y="545" font-family="'Times New Roman', serif" font-size="12" fill="#64748B">Fait à Yaoundé, le 22 juillet 2023</text>

  <!-- Sceau Officiel IAI -->
  <g transform="translate(500, 565)">
    <circle cx="0" cy="0" r="48" fill="#1E3A8A" opacity="0.95" />
    <circle cx="0" cy="0" r="42" fill="none" stroke="#FDE68A" stroke-width="1.8" stroke-dasharray="3,2" />
    <text x="0" y="-16" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8" fill="#FDE68A" font-weight="bold" letter-spacing="1">IAI-CAMEROUN</text>
    <text x="0" y="-3" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" fill="#FDE68A">★ YAOUNDÉ ★</text>
    <text x="0" y="10" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7.5" fill="#FDE68A" font-weight="bold">SCEAU OFFICIEL</text>
  </g>

  <!-- Signatures -->
  <g transform="translate(180, 580)">
    <text x="0" y="0" text-anchor="middle" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#1E293B">Le Président du Jury</text>
    <path d="M-50,25 Q-20,5 0,22 T40,15 T60,35" fill="none" stroke="#0F172A" stroke-width="2.2" />
    <text x="0" y="45" text-anchor="middle" font-family="'Times New Roman', serif" font-size="10" fill="#64748B">Pr. Emmanuel KAMGNIA</text>
  </g>

  <g transform="translate(820, 580)">
    <text x="0" y="0" text-anchor="middle" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#1E293B">Le Représentant Résident</text>
    <path d="M-45,30 Q-15,10 10,25 T55,18 T75,40" fill="none" stroke="#0F172A" stroke-width="2.4" />
    <text x="0" y="45" text-anchor="middle" font-family="'Times New Roman', serif" font-size="10" fill="#64748B">Armand Claude ABANDA</text>
  </g>
</svg>`;

// 6. Certificat Médical (Rejet Strict pour Non-Conformité Académique)
const medicalCertificateSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
  <defs>
    <linearGradient id="medBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F8FAFC" />
    </linearGradient>
  </defs>

  <rect width="1000" height="700" fill="url(#medBg)" />
  <rect x="25" y="25" width="950" height="650" fill="none" stroke="#0284C7" stroke-width="2" />
  <rect x="32" y="32" width="936" height="636" fill="none" stroke="#E2E8F0" stroke-width="1" />

  <!-- En-tête Cabinet Médical Yaoundé Bastos -->
  <g transform="translate(80, 70)">
    <rect x="0" y="8" width="30" height="10" fill="#0284C7" rx="2" />
    <rect x="10" y="-2" width="10" height="30" fill="#0284C7" rx="2" />
    <text x="45" y="16" font-family="'Times New Roman', serif" font-size="18" font-weight="bold" fill="#0F172A">CABINET MÉDICAL DE BASTOS — YAOUNDÉ</text>
    <text x="45" y="34" font-family="sans-serif" font-size="12" fill="#475569">Dr. Jean-Baptiste FOTSO — Docteur en Médecine • Ordre National des Médecins N° ONMC/3891</text>
    <text x="45" y="50" font-family="sans-serif" font-size="11" fill="#64748B">Avenue Rosa Parks, Bastos • Yaoundé • Tél : (+237) 222 20 18 45</text>
  </g>

  <line x1="80" y1="140" x2="920" y2="140" stroke="#0284C7" stroke-width="2" />

  <!-- Titre Document -->
  <text x="500" y="200" text-anchor="middle" font-family="'Times New Roman', serif" font-size="28" font-weight="bold" fill="#0369A1" letter-spacing="2">CERTIFICAT MÉDICAL</text>
  <text x="500" y="225" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#64748B">Délivré en application des dispositions déontologiques en vigueur</text>

  <!-- Corps de texte médical -->
  <g transform="translate(100, 280)">
    <text x="0" y="0" font-family="'Times New Roman', serif" font-size="16" fill="#1E293B">Je soussigné, Docteur Jean-Baptiste FOTSO, certifie avoir examiné ce jour :</text>
    <text x="0" y="45" font-family="'Times New Roman', serif" font-size="18" font-weight="bold" fill="#0F172A">Monsieur Marc ETONG</text>
    <text x="0" y="70" font-family="sans-serif" font-size="14" fill="#334155">Né le 12 mai 1994, résidant à Yaoundé.</text>
    <text x="0" y="120" font-family="'Times New Roman', serif" font-size="16" fill="#1E293B">Et constate que son état de santé nécessite un :</text>
    <text x="0" y="155" font-family="'Times New Roman', serif" font-size="20" font-weight="bold" fill="#DC2626">REPOS MÉDICAL STRICT DE QUINZE (15) JOURS</text>
    <text x="0" y="190" font-family="'Times New Roman', serif" font-size="15" fill="#334155">avec arrêt de travail et contre-indication absolue à toute activité sportive ou professionnelle.</text>
    <text x="0" y="230" font-family="'Times New Roman', serif" font-size="14" font-style="italic" fill="#64748B">Certificat délivré à la demande de l'intéressé pour faire valoir ce que de droit.</text>
  </g>

  <!-- Tampon et signature du médecin -->
  <g transform="translate(680, 520)">
    <text x="0" y="0" font-family="'Times New Roman', serif" font-size="14" fill="#1E293B">Fait à Yaoundé, le 18 octobre 2024</text>
    <circle cx="80" cy="65" r="50" fill="none" stroke="#0369A1" stroke-width="2" stroke-dasharray="4,2" />
    <text x="80" y="55" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#0369A1">DR. J-B. FOTSO</text>
    <text x="80" y="70" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#0369A1">MÉDECINE GÉNÉRALE</text>
    <text x="80" y="83" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#0369A1">ONMC : 3891/CMR</text>
    <path d="M40,75 Q80,25 110,65 T140,55" fill="none" stroke="#0F172A" stroke-width="2.2" />
  </g>
</svg>`;

export const SAMPLE_DIPLOMAS: SampleDiploma[] = [
  {
    id: 'sample-iai-cameroun',
    name: 'Diplôme Ingénieur IAI-Cameroun',
    institution: 'IAI-Cameroun (Institut Africain d\'Informatique)',
    degreeTitle: 'Diplôme d\'Ingénieur des Travaux Informatiques (Génie Logiciel)',
    studentName: 'Jean Paul ETOUNDI',
    expectedStatus: 'AUTHENTIQUE',
    scenarioDescription: 'Dossier de candidature IAI-Cameroun : Titre d\'ingénieur certifié au registre officiel (IAI-CMR-2023-ING-0842) avec sceau de l\'institut et signatures régulières.',
    badgeLabel: 'Cas Réel IAI-Cameroun (Valide)',
    svgDataUrl: svgToDataUrl(authenticIaiCameroonSvg),
    rawSvg: authenticIaiCameroonSvg,
  },
  {
    id: 'sample-1-authentic',
    name: 'Diplôme Authentique Certifié (Université de Yaoundé I)',
    institution: 'Université de Yaoundé I (UY1)',
    degreeTitle: 'Master Informatique & Systèmes Décisionnels',
    studentName: 'Boris TCHOUA',
    expectedStatus: 'AUTHENTIQUE',
    scenarioDescription: 'Document original complet avec sceau officiel du Rectorat, signatures régulières et correspondance 100% dans le registre officiel (UY1-2023-M8921).',
    badgeLabel: 'Test Réussite (100% Valide)',
    svgDataUrl: svgToDataUrl(authenticUy1Svg),
    rawSvg: authenticUy1Svg,
  },
  {
    id: 'sample-2-falsified',
    name: 'Diplôme Falsifié (Fraude Détectée - Nom Altéré)',
    institution: 'Université de Yaoundé I (UY1)',
    degreeTitle: 'Master Informatique',
    studentName: 'Alain BIKOI (Altéré)',
    expectedStatus: 'FALSIFIE',
    scenarioDescription: 'Altération frauduleuse du nom avec police Arial discordante, flou de calque numérique (#EAE5D5) et usurpation du numéro de série UY1-2023-M8921 appartenant à Boris TCHOUA.',
    badgeLabel: 'Test Fraude (Détection Immédiate)',
    svgDataUrl: svgToDataUrl(falsifiedDiplomaSvg),
    rawSvg: falsifiedDiplomaSvg,
  },
  {
    id: 'sample-3-polytechnique',
    name: 'Diplôme d\'Ingénieur Polytechnique (ENSPY Yaoundé)',
    institution: 'École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)',
    degreeTitle: 'Diplôme d\'Ingénieur de Conception (Génie Informatique)',
    studentName: 'Danielle MBALLA ESSOMBA',
    expectedStatus: 'AUTHENTIQUE',
    scenarioDescription: 'Titre d\'ingénieur certifié au registre central (ENSPY-2022-ING-0412) avec armoiries officielles et sceau académique.',
    badgeLabel: 'Test ENSPY Yaoundé',
    svgDataUrl: svgToDataUrl(authenticPolytechniqueSvg),
    rawSvg: authenticPolytechniqueSvg,
  },
  {
    id: 'sample-5-medical',
    name: 'Document Médical (Certificat Médical)',
    institution: 'Non applicable (Cabinet Médical Bastos)',
    degreeTitle: 'Aucun diplôme (Santé)',
    studentName: 'Marc ETONG (Patient)',
    expectedStatus: 'NON_CONFORME',
    scenarioDescription: 'Certificat médical de repos. Permet de vérifier que la plateforme rejette formellement tout document non académique conformément à son périmètre exclusif.',
    badgeLabel: 'Test Exclusion (Certificat Médical)',
    svgDataUrl: svgToDataUrl(medicalCertificateSvg),
    rawSvg: medicalCertificateSvg,
  },
  {
    id: 'sample-4-car-vehicle',
    name: 'Image Non-Académique (Véhicule Automobile)',
    institution: 'Non applicable (Automobile)',
    degreeTitle: 'Aucun diplôme',
    studentName: 'Photographie de Véhicule',
    expectedStatus: 'NON_CONFORME',
    scenarioDescription: 'Photographie d\'une voiture de sport sur circuit routier. Teste le filtre d\'exclusion stricte pour vérifier que le système rejette toute image non académique.',
    badgeLabel: 'Test Exclusion (Voiture)',
    svgDataUrl: svgToDataUrl(carVehicleSvg),
    rawSvg: carVehicleSvg,
  },
];

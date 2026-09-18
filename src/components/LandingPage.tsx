import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Eye,
  Award,
  Zap,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { Login } from './Login';
import coverHeroImg from '../assets/images/academic_cover_hero_1789563230986.jpg';

interface LandingPageProps {
  onEnterApp: (role?: UserRole) => void;
  onOpenLoginModal?: () => void;
}

type SimulatorScenario = 'authentic' | 'falsified' | 'rejected';

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenLoginModal }) => {
  const { user, quickLogin } = useAuth();

  // Simulator State
  const [selectedScenario, setSelectedScenario] = useState<SimulatorScenario>('authentic');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [scannerStep, setScannerStep] = useState<string>('Scellement validé');

  // Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Trigger simulated scan with dynamic phases
  const handleTriggerScan = (scenario: SimulatorScenario) => {
    setSelectedScenario(scenario);
    setIsScanning(true);
    setScanProgress(0);
    setScannerStep('Calibration du capteur optique (300 DPI)...');

    const steps = [
      { p: 25, label: 'Extraction vectorielle & géométrie...' },
      { p: 55, label: 'Segmentation du matricule & sceaux...' },
      { p: 85, label: 'Interrogation de la partition d’archives...' },
      { p: 100, label: scenario === 'authentic' ? 'Scellement conforme vérifié' : scenario === 'falsified' ? 'Alerte contrefaçon détectée' : 'Rejet d’office : document non académique' },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setScanProgress(steps[currentStepIdx].p);
        setScannerStep(steps[currentStepIdx].label);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 280);
  };

  // Fast direct demo access
  const handleDirectDemo = async (roleName: string, roleType: UserRole) => {
    const res = await quickLogin(roleName);
    if (res.success) {
      onEnterApp(roleType);
    }
  };

  const partnerUniversities = [
    { name: 'IAI-Cameroun', jurisdiction: 'CEMAC / MINESUP', archives: '1 420 titres', hash: 'a8f9...31c0' },
    { name: 'Sorbonne Université', jurisdiction: 'Académie de Paris', archives: '3 890 titres', hash: 'c39a...38e0' },
    { name: 'École Polytechnique', jurisdiction: 'CTI / IP Paris', archives: '2 150 titres', hash: 'e51b...44a1' },
    { name: 'Office du Baccalauréat', jurisdiction: 'MINESEC Cameroun', archives: '8 400 titres', hash: 'b22d...91ff' },
    { name: 'Université Paris-Saclay', jurisdiction: 'MESR France', archives: '2 900 titres', hash: 'f709...2810' },
    { name: 'HEC Paris', jurisdiction: 'CCI Paris Île-de-France', archives: '1 650 titres', hash: 'd64e...55bc' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Acquisition Haute Résolution (300 DPI)',
      desc: 'Numérisation du parchemin original ou capture vidéo avec redressement géométrique et compensation d’éclairage.',
    },
    {
      num: '02',
      title: 'Expertise Forensique Multimodale',
      desc: 'Extraction du matricule, reconnaissance des sceaux gaufrés, détection des micro-lignes de guillochis et analyse d’encres.',
    },
    {
      num: '03',
      title: 'Confrontation Hermétique aux Registres',
      desc: 'Interrogation instantanée de la partition SQLite souveraine de l’établissement sans exposition des autres universités.',
    },
    {
      num: '04',
      title: 'Scellement SHA-256 & Valeur Probante',
      desc: 'Délivrance d’un certificat d’authenticité inaltérable ou d’un procès-verbal judiciaire pour réquisition pénale (Art. 441-1).',
    },
  ];

  const faqs = [
    {
      q: 'En quoi chaque auditeur dispose-t-il d’une interface adaptée à son rôle ?',
      a: 'Le système applique un cloisonnement fonctionnel strict dès l’accréditation : les agents de Scolarité sont directement orientés vers le Scanner Optique pour l’analyse OCR des parchemins ; les Analystes Sécurité accèdent au centre de traitement des alertes et à la liste noire des empreintes SHA-256 ; enfin, les Administrateurs Centraux pilotent les autorisations d’accès et les registres d’archives des universités.',
    },
    {
      q: 'Comment le système élimine-t-il les documents tiers ou falsifiés ?',
      a: 'Un premier niveau de filtrage par vision IA évalue immédiatement la présence des marqueurs réglementaires de collation des grades d’État. Si un document tiers (facture, reçu, contrat) est soumis, il est rejeté d’office avec un score de 0%. Pour les parchemins falsifiés, la moindre anomalie typographique ou discordance de matricule déclenche une alerte de contrefaçon.',
    },
    {
      q: 'Quelle est la valeur juridique des constats édités par la plateforme ?',
      a: 'Chaque analyse produit une empreinte cryptographique SHA-256 certifiée, un jeton d’audit d’État et un procès-verbal d’investigation conforme aux exigences de l’Article 441-1 du Code Pénal, directement recevable auprès des directions juridiques et du Parquet.',
    },
    {
      q: 'Comment est garantie l’étanchéité des données entre universités ?',
      a: 'Chaque établissement partenaire opère sur une partition SQLite hermétique chiffrée. Une requête sur un diplôme délivré par l’IAI n’a techniquement aucun accès aux données de la Sorbonne ou de Polytechnique, garantissant une souveraineté absolue.',
    },
  ];

  return (
    <div className="bg-[#fafaf8] text-slate-950 min-h-screen font-sans selection:bg-slate-900 selection:text-white">
      {/* ------------------------------------------------------------------- */}
      {/* 1. GRAND COVER HERO SECTION (PLEIN ÉCRAN ~85vh, BACKGROUND BLUR 18px & SCALE 1.12) */}
      {/* ------------------------------------------------------------------- */}
      <section className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden border-b border-slate-900/60 bg-slate-950 text-white">
        {/* Parchemin en fond : fortement flouté (blur(18px), scale(1.12)) et assombri */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          <img
            src={coverHeroImg}
            alt="Parchemin officiel d'État sous numérisation haute résolution"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-60 filter blur-[18px] scale-[1.12]"
          />
        </div>

        {/* Dégradé sombre par-dessus (haut vers bas, plus foncé en bas) pour garantir la lisibilité du texte blanc */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950/98 pointer-events-none" />

        {/* Contenu centré */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center flex-1 flex flex-col items-center justify-center">
          {/* Badge de statut */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-wider uppercase mb-6 backdrop-blur-md shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Authentification médico-légale d'État</span>
          </motion.div>

          {/* Titre principal en serif (police Newsreader) avec un mot-clé en italique vert clair */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.12] max-w-4xl"
          >
            VD — Vérification & <em className="italic font-normal text-emerald-400 font-serif">Intégrité</em> de Diplômes
          </motion.h1>

          {/* Sous-titre descriptif */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-200/95 max-w-3xl leading-relaxed font-normal"
          >
            Pour les directions de scolarité, les recruteurs et les brigades d’enquête : inspectez les micro-structures des parchemins à 300 DPI, validez les matricules officiels et scellez les preuves sous empreinte SHA-256 inaltérable.
          </motion.p>

          {/* Deux boutons d'action (un plein émeraude, un outline clair) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {/* Bouton plein émeraude */}
            <button
              type="button"
              id="hero-cta-verifier-btn"
              onClick={() => {
                if (user) {
                  onEnterApp(user.role);
                } else if (onOpenLoginModal) {
                  onOpenLoginModal();
                } else {
                  handleDirectDemo('agent', 'VERIFICATEUR');
                }
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm sm:text-base px-6 py-3.5 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-100" />
              <span>Accéder au Scanner d'État</span>
            </button>

            {/* Bouton outline clair */}
            <a
              href="#simulateur"
              id="hero-cta-simulator-btn"
              className="flex items-center gap-2 rounded-xl border border-white/30 hover:border-white/70 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base px-6 py-3.5 backdrop-blur-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Eye className="w-5 h-5 text-emerald-300" />
              <span>Tester le simulateur optique</span>
            </a>
          </motion.div>

          {/* Profils d'accès direct démo certifiés */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs"
          >
            <span className="text-slate-400 font-medium">Profils certifiés démo :</span>
            <button
              type="button"
              onClick={() => handleDirectDemo('agent', 'VERIFICATEUR')}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <span>Poste Scolarité (Vérificateur)</span>
              <span className="text-emerald-400">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleDirectDemo('enqueteur', 'ANALYSTE')}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <span>Cellule Fraudes (Analyste)</span>
              <span className="text-emerald-400">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleDirectDemo('admin', 'ADMIN')}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <span>Console Centrale (Admin)</span>
              <span className="text-emerald-400">→</span>
            </button>
          </motion.div>
        </div>

        {/* Bande de statistiques en bas (ex. "20K+ titres archivés", "SHA-256", "300 DPI") */}
        <div className="relative z-10 w-full border-t border-white/10 bg-slate-950/70 backdrop-blur-md py-4 sm:py-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-400">20K+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Titres archivés</div>
              </div>
              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-serif font-bold text-white">SHA-256</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Scellement inaltérable</div>
              </div>
              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-400">300 DPI</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Étalonnage optique</div>
              </div>
              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-serif font-bold text-white">&lt; 1.2s</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Temps de confrontation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 2. SECTION FONCTIONNALITÉS (CLEAN COLUMNS, NO HEAVY BOX FRAMES) */}
      {/* ------------------------------------------------------------------- */}
      <section id="fonctionnalites" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-3xl mb-12 text-left space-y-2">
          <div className="text-[11px] font-mono text-emerald-700 font-semibold tracking-wider uppercase">
            ARCHITECTURE & FONCTIONNALITÉS SOUVERAINES
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight">
            Une technologie conçue pour la certitude probante
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Conforme aux décrets ministériels de sécurisation des diplômes universitaires et titres d’État.
          </p>
        </div>

        {/* Clean Open Grid (No heavy card boxes, no nested frames) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1 */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-200">
            <div className="text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-widest">
                VISION FORENSIQUE IA
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Analyse Médico-Légale des Parchemins
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Détection micrométrique des falsifications : micro-lignes guillochées altérées, encres discordantes, sceaux gaufrés déplacés et incohérences typographiques.
            </p>
            <div className="pt-4 flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Précision de Détection</span>
              <span className="text-2xl font-bold font-serif text-emerald-600">
                99.8%
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-200">
            <div className="text-emerald-700">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-widest">
                EXTRACTION OCR INSTANTANÉE
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Reconnaissance & Détection 300 DPI
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Numérisation à haute résolution avec compensation spectrale de l'éclairage et redressement géométrique automatique du parchemin sans distorsion.
            </p>
            <div className="pt-4 flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Vitesse d'Exécution</span>
              <span className="text-2xl font-bold font-serif text-emerald-600">
                &lt; 1.5s
              </span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-200">
            <div className="text-emerald-700">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-widest">
                REGISTRE SOUVERAIN SCELLÉ
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Empreinte Cryptographique SHA-256
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confrontation en direct avec les partitions chiffrées des universités partenaires. Chaque titre validé est certifié inaltérable et opposable en justice.
            </p>
            <div className="pt-4 flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Garantie d'Intégrité</span>
              <span className="text-2xl font-bold font-serif text-emerald-600">
                100%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 3. INTERACTIVE FORENSIC SIMULATOR */}
      {/* ------------------------------------------------------------------- */}
      <section id="simulateur" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-3xl mb-10 text-left space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            DÉMONSTRATION INTERACTIVE FORENSIQUE
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight">
            Simulateur d’expertise médico-légale en direct
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Sélectionnez l’un des trois cas d’évaluation pour observer la détection en temps réel de l’intégrité documentaire par notre moteur optique.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200">
          {/* Scenario Selector Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-slate-950 rounded-xs" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                CAPTEUR OPTIQUE 300 DPI // ÉVALUATION MULTIMODALE
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleTriggerScan('authentic')}
                className={`px-3 py-1.5 border transition-all rounded-xs cursor-pointer ${
                  selectedScenario === 'authentic'
                    ? 'bg-slate-950 text-white border-slate-950 font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
                }`}
              >
                [ CAS 1 : DIPLÔME AUTHENTIQUE IAI ]
              </button>
              <button
                type="button"
                onClick={() => handleTriggerScan('falsified')}
                className={`px-3 py-1.5 border transition-all rounded-xs cursor-pointer ${
                  selectedScenario === 'falsified'
                    ? 'bg-red-950 text-white border-red-950 font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
                }`}
              >
                [ CAS 2 : CONTREFAÇON SORBONNE ]
              </button>
              <button
                type="button"
                onClick={() => handleTriggerScan('rejected')}
                className={`px-3 py-1.5 border transition-all rounded-xs cursor-pointer ${
                  selectedScenario === 'rejected'
                    ? 'bg-amber-950 text-white border-amber-950 font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
                }`}
              >
                [ CAS 3 : DOCUMENT TIERS REJETÉ ]
              </button>
            </div>
          </div>

          {/* Simulator Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
            {/* Left Screen: Parchment View */}
            <div className="lg:col-span-7 relative aspect-[4/3] bg-slate-950 rounded-md overflow-hidden flex items-center justify-center p-6 border border-slate-800">
              <AnimatePresence mode="wait">
                {selectedScenario === 'authentic' && (
                  <motion.div
                    key="scenario-auth"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 w-full max-w-sm bg-[#faf8f2] text-slate-900 p-6 border border-[#d9ccb8] text-center font-serif shadow-lg"
                  >
                    <div className="text-[9px] uppercase tracking-widest font-bold text-slate-600">
                      RÉPUBLIQUE DU CAMEROUN • SOUS-RÉGION CEMAC
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-950 mt-1">
                      IAI-CAMEROUN (INSTITUT AFRICAIN D'INFORMATIQUE)
                    </div>
                    <div className="my-2 h-px bg-slate-300 w-20 mx-auto" />
                    <div className="text-xs font-bold text-slate-950 uppercase">
                      Diplôme d’Ingénieur de Conception en Informatique
                    </div>
                    <div className="text-[11px] text-slate-800 mt-1.5">
                      Décerné à : <span className="font-bold underline">Armel Paul BAPES</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-600 mt-1">
                      Matricule : IAI-2023-ING-0412
                    </div>
                  </motion.div>
                )}

                {selectedScenario === 'falsified' && (
                  <motion.div
                    key="scenario-fake"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 w-full max-w-sm bg-[#faf8f2] text-slate-900 p-6 border border-red-400 text-center font-serif shadow-lg"
                  >
                    <div className="text-[9px] uppercase tracking-widest font-bold text-red-700">
                      ACADÉMIE DE PARIS • SORBONNE UNIVERSITÉ
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-950 mt-1">
                      MASTER EN SCIENCES INFORMATIQUES
                    </div>
                    <div className="my-2 h-px bg-slate-300 w-20 mx-auto" />
                    <div className="text-[11px] text-slate-800">
                      Faux matricule : <span className="font-mono text-red-700 font-bold">SORB-9999-FAKE</span>
                    </div>
                    <div className="mt-2 text-[10px] text-red-800 font-sans font-bold bg-red-100/80 p-1 border border-red-300">
                      ANOMALIE : DÉCALAGE TYPOGRAPHIQUE & RETOUCHE FORENSIQUE
                    </div>
                  </motion.div>
                )}

                {selectedScenario === 'rejected' && (
                  <motion.div
                    key="scenario-rej"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 w-full max-w-sm bg-white text-slate-900 p-6 border border-amber-400 text-center font-sans shadow-lg"
                  >
                    <div className="text-[10px] uppercase tracking-widest font-bold text-amber-800">
                      DOCUMENT TIERS NON ACADÉMIQUE
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-950 mt-1">
                      FACTURE COMMERCIALE N° FA-2024-098
                    </div>
                    <div className="my-2 h-px bg-slate-200 w-20 mx-auto" />
                    <p className="text-[10px] text-slate-600">
                      Bordereau commercial de fret routier. Aucune formule réglementaire de collation des grades d'État.
                    </p>
                    <div className="mt-3 text-[10px] font-mono bg-amber-50 text-amber-900 p-2 border border-amber-200">
                      REJET D'OFFICE PAR LE FILTRE DE CLASSIFICATION IA
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scanning Laser */}
              <motion.div
                animate={{
                  y: isScanning ? [-120, 120, -120] : [-80, 80, -80],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isScanning ? 1.4 : 3.5,
                  ease: 'easeInOut',
                }}
                className={`absolute inset-x-0 h-0.5 pointer-events-none z-20 ${
                  selectedScenario === 'authentic'
                    ? 'bg-emerald-400 shadow-emerald-400/80'
                    : selectedScenario === 'falsified'
                    ? 'bg-red-500 shadow-red-500/80'
                    : 'bg-amber-400 shadow-amber-400/80'
                }`}
              />

              {/* HUD Elements (Non-blinking dot) */}
              <div className="absolute top-3 left-3 font-mono text-[9px] text-slate-400 z-20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span>CAPTEUR : 300 DPI // WAL ACTIF</span>
              </div>
              <div className="absolute top-3 right-3 font-mono text-[9px] text-slate-400 z-20">
                PROGRÈS : {scanProgress}%
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[9px] text-slate-400 z-20">
                PHASE : {scannerStep}
              </div>
            </div>

            {/* Right: Technical Telemetry & Verdict */}
            <div className="lg:col-span-5 text-left space-y-4">
              <AnimatePresence mode="wait">
                {selectedScenario === 'authentic' && (
                  <motion.div
                    key="verdict-auth"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-4 bg-emerald-50 border border-emerald-300"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-900 font-bold">
                      VERDICT FORENSIQUE : CONFORME (100%)
                    </div>
                    <div className="text-lg font-serif font-bold text-slate-950 mt-1">
                      Diplôme Authentique Scellé
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      Le parchemin correspond trait pour trait aux archives de l'IAI-Cameroun scellées dans le registre souverain.
                    </p>
                  </motion.div>
                )}

                {selectedScenario === 'falsified' && (
                  <motion.div
                    key="verdict-fake"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-4 bg-red-50 border border-red-300"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-widest text-red-900 font-bold">
                      VERDICT FORENSIQUE : FRAUDE DÉTECTÉE (0%)
                    </div>
                    <div className="text-lg font-serif font-bold text-red-950 mt-1">
                      Tentative de Falsification Identifiée
                    </div>
                    <p className="text-xs text-red-900 mt-1 leading-relaxed">
                      Altération vectorielle de la mention d'excellence et absence d'enregistrement dans le registre de la Sorbonne.
                    </p>
                  </motion.div>
                )}

                {selectedScenario === 'rejected' && (
                  <motion.div
                    key="verdict-reject"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-4 bg-amber-50 border border-amber-300"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-widest text-amber-900 font-bold">
                      VERDICT FORENSIQUE : REJET D'OFFICE
                    </div>
                    <div className="text-lg font-serif font-bold text-amber-950 mt-1">
                      Pièce Non Académique Rejetée
                    </div>
                    <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                      Le document ne présente aucun attribut d'un parchemin universitaire officiel.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Data Table */}
              <div className="border border-slate-200 text-xs font-mono divide-y divide-slate-200">
                <div className="p-2.5 flex justify-between bg-slate-50">
                  <span className="text-slate-500">Établissement émetteur</span>
                  <span className="font-bold text-slate-900">
                    {selectedScenario === 'authentic' ? 'IAI-Cameroun' : selectedScenario === 'falsified' ? 'Sorbonne Université (Usurpée)' : 'N/A'}
                  </span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-slate-500">Matricule détecté</span>
                  <span className="font-bold text-slate-900">
                    {selectedScenario === 'authentic' ? 'IAI-2023-ING-0412' : selectedScenario === 'falsified' ? 'SORB-9999-FAKE' : 'NON DISPONIBLE'}
                  </span>
                </div>
                <div className="p-2.5 flex justify-between bg-slate-50">
                  <span className="text-slate-500">Empreinte SHA-256</span>
                  <span className="text-slate-700">
                    {selectedScenario === 'authentic' ? 'a8f93...1094' : selectedScenario === 'falsified' ? 'e3b0c...855 (Blacklisté)' : 'REJETÉ'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEnterApp('VERIFICATEUR')}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase py-2.5 rounded-md transition-colors cursor-pointer"
              >
                Tester avec vos propres parchemins dans l’application →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 4. OPERATIONAL PROTOCOL (CLEAN MINIMAL PHASES) */}
      {/* ------------------------------------------------------------------- */}
      <section id="protocole" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-3xl mb-12 text-left space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            PROTOCOLE EN 4 PHASES
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight">
            Comment fonctionne l’authentification souveraine
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Une chaîne de traitement infalsifiable garantissant l'intégrité probante du titre sans ambiguïté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((st, i) => (
            <div
              key={i}
              className="border-t-2 border-slate-950 pt-4 text-left space-y-2"
            >
              <div className="font-mono text-2xl font-light text-slate-400">
                {st.num}.
              </div>
              <h3 className="font-serif text-base font-bold text-slate-950">
                {st.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 5. PARTNER UNIVERSITIES NETWORK (MINIMALIST TYPOGRAPHIC TILES) */}
      {/* ------------------------------------------------------------------- */}
      <section id="universites" className="py-16 sm:py-20 bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-left">
          <div className="max-w-3xl mb-10 space-y-2">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
              REGISTRE NATIONAL D'UNIVERSITÉS
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950">
              Cloisonnement hermétique par établissement
            </h2>
            <p className="text-xs text-slate-600">
              Chaque établissement partenaire administre sa partition de registre sans partage de données avec les tiers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-2">
            {partnerUniversities.map((univ, idx) => (
              <div
                key={idx}
                className="text-left space-y-1.5 border-t border-slate-200 pt-3"
              >
                <div className="text-xs font-bold text-slate-950">{univ.name}</div>
                <div className="text-[11px] text-slate-500">{univ.jurisdiction}</div>
                <div className="font-mono text-[10px] text-slate-400">
                  {univ.archives}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 6. JURIDICAL FAQ (ACCORDION) */}
      {/* ------------------------------------------------------------------- */}
      <section id="juridique" className="py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-left mb-10 space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            CADRE JURIDIQUE & QUESTIONS FRÉQUENTES
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-950">
            Garanties légales et fonctionnement
          </h2>
        </div>

        <div className="border-t border-slate-200 divide-y divide-slate-200 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-slate-700 transition-colors py-1 cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="font-mono text-base text-slate-500 ml-4 shrink-0">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>

              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-slate-600 leading-relaxed pt-2 pb-2">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

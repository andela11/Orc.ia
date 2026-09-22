import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Eye,
  Zap,
  Lock,
  ArrowRight,
  Fingerprint,
  ScanLine,
  BadgeCheck,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import headerBgImg from '../assets/images/academic_header_bg_1789939166623.jpg';

interface LandingPageProps {
  onEnterApp: (role?: UserRole) => void;
  onOpenLoginModal?: (mode?: 'login' | 'register') => void;
}

type SimulatorScenario = 'authentic' | 'falsified' | 'rejected';

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenLoginModal }) => {
  const { user } = useAuth();

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
      <section className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden border-b border-slate-900/80 bg-slate-950 text-white">
        {/* Parchemin officiel et archives régaliennes floutés en fond du header */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          <img
            src={headerBgImg}
            alt="Archives universitaires d'État et parchemin sous expertise optique"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-90 opacity-80 filter blur-[8px] md:blur-[10px] scale-105 transition-all duration-700"
          />
        </div>

        {/* Dégradé sombre et halo émeraude par-dessus pour sublimer le fond flouté tout en assurant une lisibilité maximale */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/55 via-slate-950/78 to-slate-950/97 pointer-events-none" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_18%,rgba(16,185,129,0.22),transparent)] pointer-events-none" />
        {/* Trame technique discrète (relevé forensique) */}
        <div className="absolute inset-0 -z-10 hero-grid-overlay pointer-events-none" />

        {/* Contenu centré */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-20 sm:pt-28 pb-14 text-center flex-1 flex flex-col items-center justify-center">
          {/* Badge de statut */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/35 text-emerald-300 text-[11px] sm:text-xs font-mono tracking-wider uppercase mb-7 backdrop-blur-md shadow-[0_0_28px_-8px_rgba(16,185,129,0.55)] ring-1 ring-inset ring-white/5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>Authentification médico-légale d'État</span>
          </motion.div>

          {/* Titre principal en serif (police Newsreader) avec un mot-clé en italique vert clair */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-serif font-bold text-white tracking-tight leading-[1.08] sm:leading-[1.05] max-w-4xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]"
          >
            VD — Vérification & <em className="italic font-normal text-emerald-400 font-serif">Intégrité</em> de Diplômes
          </motion.h1>

          {/* Filet doré de séparation (touche institutionnelle) */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-7 h-px w-40 sm:w-56 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent"
          />

          {/* Sous-titre descriptif */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-pretty mt-6 text-sm sm:text-lg md:text-xl text-slate-200/90 max-w-3xl leading-relaxed font-normal px-1 sm:px-0"
          >
            Pour les directions de scolarité, les recruteurs et les brigades d’enquête : inspectez les micro-structures des parchemins à 300 DPI, validez les matricules officiels et scellez les preuves sous empreinte SHA-256 inaltérable.
          </motion.p>

          {/* Deux boutons d'action (un plein émeraude, un outline clair) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            {/* Bouton plein émeraude */}
            <button
              type="button"
              id="hero-cta-verifier-btn"
              onClick={() => {
                if (user) {
                  onEnterApp(user.role);
                } else if (onOpenLoginModal) {
                  onOpenLoginModal('login');
                }
              }}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-3.5 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all cursor-pointer transform hover:-translate-y-0.5 ring-1 ring-inset ring-white/15"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-100 shrink-0" />
              <span>Accéder au Scanner d'État</span>
              <ArrowRight className="w-4 h-4 text-emerald-100/80 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Bouton outline clair */}
            <a
              href="#simulateur"
              id="hero-cta-simulator-btn"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/25 hover:border-white/60 bg-white/5 hover:bg-white/12 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-3.5 backdrop-blur-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Eye className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>Tester le simulateur optique</span>
            </a>
          </motion.div>

          {/* Indicateurs de confiance compacts */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[11px] sm:text-xs text-slate-300/80 font-medium"
          >
            <li className="inline-flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400/90" />
              Scellement SHA-256
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ScanLine className="w-3.5 h-3.5 text-emerald-400/90" />
              Capteur 300 DPI
            </li>
            <li className="inline-flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400/90" />
              Registres cloisonnés par établissement
            </li>
          </motion.ul>
        </div>

        {/* Bande de statistiques en bas (ex. "20K+ titres archivés", "SHA-256", "300 DPI") */}
        <div className="relative z-10 w-full border-t border-white/10 bg-slate-950/60 backdrop-blur-md py-5 sm:py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6 text-center md:divide-x divide-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400 tabular-nums">20K+</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 tracking-wide">Titres archivés</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white">SHA-256</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 tracking-wide">Scellement inaltérable</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400 tabular-nums">300 DPI</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 tracking-wide">Étalonnage optique</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">&lt; 1.2s</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 tracking-wide">Temps de confrontation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 2. SECTION FONCTIONNALITÉS (CLEAN COLUMNS, NO HEAVY BOX FRAMES) */}
      {/* ------------------------------------------------------------------- */}
      <section id="fonctionnalites" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-3xl mb-14 text-left space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-700 font-semibold tracking-wider uppercase">
            <span className="h-px w-6 bg-emerald-600/60" />
            Architecture & fonctionnalités souveraines
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold text-slate-950 tracking-tight leading-[1.15]">
            Une technologie conçue pour la certitude probante
          </h2>
          <p className="text-pretty text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Conforme aux décrets ministériels de sécurisation des diplômes universitaires et titres d’État.
          </p>
        </div>

        {/* Clean Open Grid (No heavy card boxes, no nested frames) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Column 1 */}
          <div className="card-lift group text-left space-y-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300/70">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-[0.18em]">
                Vision forensique IA
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1.5 leading-snug">
                Analyse Médico-Légale des Parchemins
              </h3>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Détection micrométrique des falsifications : micro-lignes guillochées altérées, encres discordantes, sceaux gaufrés déplacés et incohérences typographiques.
            </p>
            <div className="pt-4 mt-auto flex items-baseline justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">Précision de Détection</span>
              <span className="text-2xl font-bold font-serif text-emerald-600 tabular-nums">
                99.8%
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="card-lift group text-left space-y-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300/70">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-[0.18em]">
                Extraction OCR instantanée
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1.5 leading-snug">
                Reconnaissance & Détection 300 DPI
              </h3>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Numérisation à haute résolution avec compensation spectrale de l'éclairage et redressement géométrique automatique du parchemin sans distorsion.
            </p>
            <div className="pt-4 mt-auto flex items-baseline justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">Vitesse d'Exécution</span>
              <span className="text-2xl font-bold font-serif text-emerald-600 tabular-nums">
                &lt; 1.5s
              </span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="card-lift group text-left space-y-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300/70">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-[0.18em]">
                Registre souverain scellé
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1.5 leading-snug">
                Empreinte Cryptographique SHA-256
              </h3>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Confrontation en direct avec les partitions chiffrées des universités partenaires. Chaque titre validé est certifié inaltérable et opposable en justice.
            </p>
            <div className="pt-4 mt-auto flex items-baseline justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">Garantie d'Intégrité</span>
              <span className="text-2xl font-bold font-serif text-emerald-600 tabular-nums">
                100%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 3. INTERACTIVE FORENSIC SIMULATOR */}
      {/* ------------------------------------------------------------------- */}
      <section id="simulateur" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-3xl mb-12 text-left space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="h-px w-6 bg-slate-400/60" />
            Démonstration interactive forensique
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold text-slate-950 tracking-tight leading-[1.15]">
            Simulateur d’expertise médico-légale en direct
          </h2>
          <p className="text-pretty text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Sélectionnez l’un des trois cas d’évaluation pour observer la détection en temps réel de l’intégrité documentaire par notre moteur optique.
          </p>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm ring-1 ring-slate-950/[0.03]">
          {/* Scenario Selector Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900">
                CAPTEUR OPTIQUE 300 DPI // ÉVALUATION MULTIMODALE
              </span>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 text-xs font-mono w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleTriggerScan('authentic')}
                className={`w-full sm:w-auto text-center px-3 py-1.5 border transition-all rounded-xs cursor-pointer ${
                  selectedScenario === 'authentic'
                    ? 'bg-slate-950 text-white border-slate-950 font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
                }`}
              >
                [ CAS 1 : AUTHENTIQUE IAI ]
              </button>
              <button
                type="button"
                onClick={() => handleTriggerScan('falsified')}
                className={`w-full sm:w-auto text-center px-3 py-1.5 border transition-all rounded-xs cursor-pointer ${
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
                className={`w-full sm:w-auto text-center px-3 py-1.5 border transition-all rounded-xs cursor-pointer ${
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-6">
            {/* Left Screen: Parchment View */}
            <div className="lg:col-span-7 relative min-h-[280px] sm:aspect-[4/3] bg-slate-950 rounded-md overflow-hidden flex items-center justify-center p-4 sm:p-6 border border-slate-800">
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
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs font-mono divide-y divide-slate-200">
                <div className="p-2.5 flex flex-col xs:flex-row xs:items-center justify-between gap-1 bg-slate-50">
                  <span className="text-slate-500">Établissement émetteur</span>
                  <span className="font-bold text-slate-900 truncate">
                    {selectedScenario === 'authentic' ? 'IAI-Cameroun' : selectedScenario === 'falsified' ? 'Sorbonne Université (Usurpée)' : 'N/A'}
                  </span>
                </div>
                <div className="p-2.5 flex flex-col xs:flex-row xs:items-center justify-between gap-1">
                  <span className="text-slate-500">Matricule détecté</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {selectedScenario === 'authentic' ? 'IAI-2023-ING-0412' : selectedScenario === 'falsified' ? 'SORB-9999-FAKE' : 'NON DISPONIBLE'}
                  </span>
                </div>
                <div className="p-2.5 flex flex-col xs:flex-row xs:items-center justify-between gap-1 bg-slate-50">
                  <span className="text-slate-500">Empreinte SHA-256</span>
                  <span className="text-slate-700 font-mono text-[11px] truncate">
                    {selectedScenario === 'authentic' ? 'a8f93...1094' : selectedScenario === 'falsified' ? 'e3b0c...855 (Blacklisté)' : 'REJETÉ'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (user) {
                    onEnterApp(user.role);
                  } else if (onOpenLoginModal) {
                    onOpenLoginModal('login');
                  }
                }}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase py-2.5 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Tester avec vos propres parchemins dans l’application →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 4. OPERATIONAL PROTOCOL (CLEAN MINIMAL PHASES) */}
      {/* ------------------------------------------------------------------- */}
      <section id="protocole" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-3xl mb-14 text-left space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="h-px w-6 bg-slate-400/60" />
            Protocole en 4 phases
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold text-slate-950 tracking-tight leading-[1.15]">
            Comment fonctionne l’authentification souveraine
          </h2>
          <p className="text-pretty text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Une chaîne de traitement infalsifiable garantissant l'intégrité probante du titre sans ambiguïté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="relative text-left space-y-3 pt-5 border-t-2 border-slate-950/90 group"
            >
              <span className="absolute -top-[3px] left-0 h-[2px] w-8 bg-emerald-500" />
              <div className="font-mono text-3xl font-light text-slate-300 group-hover:text-emerald-500 transition-colors tabular-nums">
                {st.num}
              </div>
              <h3 className="font-serif text-base font-bold text-slate-950 leading-snug">
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
      <section id="universites" className="py-20 sm:py-24 bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-left">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="h-px w-6 bg-slate-400/60" />
              Registre national d'universités
            </div>
            <h2 className="text-balance text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-950 tracking-tight leading-[1.15]">
              Cloisonnement hermétique par établissement
            </h2>
            <p className="text-pretty text-sm text-slate-600 leading-relaxed">
              Chaque établissement partenaire administre sa partition de registre sans partage de données avec les tiers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
            {partnerUniversities.map((univ, idx) => (
              <div
                key={idx}
                className="card-lift group text-left space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 hover:border-emerald-300/70 hover:bg-white hover:shadow-md"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-950 leading-snug">{univ.name}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{univ.jurisdiction}</div>
                <div className="font-mono text-[10px] text-emerald-700/90 pt-1 border-t border-slate-200/70">
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
      <section id="juridique" className="py-20 sm:py-28 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-left mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="h-px w-6 bg-slate-400/60" />
            Cadre juridique & questions fréquentes
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight leading-[1.15]">
            Garanties légales et fonctionnement
          </h2>
        </div>

        <div className="border-t border-slate-200 divide-y divide-slate-200 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="group w-full flex items-center justify-between gap-4 text-left text-sm sm:text-[15px] font-bold text-slate-900 hover:text-emerald-800 transition-colors py-1.5 cursor-pointer"
              >
                <span className="leading-snug">{faq.q}</span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm transition-all ${
                    activeFaq === idx
                      ? 'border-emerald-600 bg-emerald-600 text-white rotate-180'
                      : 'border-slate-300 text-slate-500 group-hover:border-emerald-400 group-hover:text-emerald-600'
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
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
                    <p className="text-[13px] text-slate-600 leading-relaxed pt-1 pb-2 pr-10">
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

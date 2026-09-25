import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Calendar,
  Tag,
  ChevronRight,
  X,
  Send,
  CheckCircle2,
  Lock,
  Scale,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { ActiveTab } from './Navbar';

export interface Billet {
  id: string;
  reference: string;
  category: 'alerte' | 'reglementaire' | 'technique' | 'academique';
  categoryLabel: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
  authority: string;
  status: 'Prioritaire' | 'En vigueur' | 'Standard' | 'Mise à jour';
  legalRef?: string;
}

const OFFICIAL_BILLETS: Billet[] = [
  {
    id: 'billet-1',
    reference: 'BILLET-2026-F14',
    category: 'alerte',
    categoryLabel: 'Alerte Fraude',
    title: 'Recrudescence des faux parchemins de Master en Ingénierie & Sciences Financières',
    date: '15 Septembre 2026',
    excerpt: 'Démantèlement d’une filière de fabrication de diplômes contrefaits arborant des trames de sécurité numérisées sans gaufrage.',
    content: [
      'La Cellule de Répression des Fraudes Documentaires de VD a identifié plusieurs tentatives d’accréditation utilisant des parchemins falsifiés de niveau Master 2.',
      'Les documents incriminés reproduisent fidèlement la typographie officielle, mais présentent une absence de micro-lignes de guillochis sous grossissement 300 DPI et un décalage angulaire de 2,4° sur le sceau académique.',
      'Mesures obligatoires pour les vérificateurs : tout parchemin mentionnant une promotion 2024-2025 de cette filière doit impérativement faire l’objet d’un scellement SHA-256 et d’une confrontation directe avec la partition du registre d’archives.'
    ],
    authority: 'Cellule Répression des Fraudes & Contrefaçons VD',
    status: 'Prioritaire',
    legalRef: 'Code Pénal Art. 441-1 & 441-7',
  },
  {
    id: 'billet-2',
    reference: 'BILLET-2026-J08',
    category: 'reglementaire',
    categoryLabel: 'Réglementation',
    title: 'Décret n° 2026-442 : Obligation de contrôle optique pour les recrutements publics',
    date: '28 Août 2026',
    excerpt: 'Entrée en vigueur de la directive ministérielle imposant l’audit par registre tiers certifié pour les corps de catégorie A.',
    content: [
      'Le Journal Officiel a publié le décret d’application n° 2026-442 relatif à la certification des compétences académiques des candidats aux concours de la fonction publique.',
      'Désormais, les commissions de recrutement sont légalement tenues de produire un Certificat d’Authenticité numérique issu de la plateforme VD ou d’un registre accrédité avant toute titularisation.',
      'Les attestations manuelles sur l’honneur ne constituent plus une preuve suffisante en l’absence de scellement cryptographique vérifiable en temps réel.'
    ],
    authority: 'Ministère de l’Enseignement Supérieur & Secrétariat d’État',
    status: 'En vigueur',
    legalRef: 'JO Décret n° 2026-442 du 28/08/2026',
  },
  {
    id: 'billet-3',
    reference: 'BILLET-2026-T19',
    category: 'technique',
    categoryLabel: 'Standard Technique',
    title: 'Spécification de l’étalonnage spectral 300 DPI et partitionnement hermétique',
    date: '19 Août 2026',
    excerpt: 'Mise à niveau du moteur de vision par IA pour l’analyse des fibres de papier et des reliefs d’encres à séchage UV.',
    content: [
      'La version 2.6 du moteur d’acquisition VD introduit le profil de calibration optique haute fidélité.',
      'Ce standard permet d’isoler le calque de guillochage de fond, de détecter les micro-perforations de reliure et d’extraire les signatures manuscrites sans altération du bruit de fond.',
      'Chaque université conserve ses registres au format SQLite hermétique chiffré AES-256, assurant qu’aucune fuite croisée n’est possible entre établissements partenaires.'
    ],
    authority: 'Direction des Systèmes d’Information & Cryptographie VD',
    status: 'Standard',
    legalRef: 'Norme AFNOR Z42-013 / ISO 27001',
  },
  {
    id: 'billet-4',
    reference: 'BILLET-2026-A06',
    category: 'academique',
    categoryLabel: 'Vie Académique',
    title: 'Interconnexion des registres universitaires nationaux (MINESUP Cameroun)',
    date: '10 Juillet 2026',
    excerpt: 'Protocole d’interconnexion sécurisé entre l’IAI-Cameroun, l’Université de Yaoundé I, l’ENSPY et les universités d’État.',
    content: [
      'Les protocoles d’échange automatisé relatifs à l’indexation certifiée des diplômes d’ingénierie et des grades universitaires ont été déployés.',
      'Le nœud VD de Yaoundé est directement interconnecté aux rectorats et directions d’écoles supérieures, permettant la vérification d’authenticité en moins de 1,2 seconde.',
      'Plus de 14 000 parchemins d’archives nationales ont été indexés sous empreinte cryptographique pérenne.'
    ],
    authority: 'Conférence des Recteurs & Directeurs d’Établissements Supérieurs du Cameroun',
    status: 'Mise à jour',
    legalRef: 'Arrêté ministériel MINESUP / Réglementation CEMAC',
  },
  {
    id: 'billet-5',
    reference: 'BILLET-2026-F11',
    category: 'alerte',
    categoryLabel: 'Alerte Fraude',
    title: 'Détection de faux sceaux numériques générés par intelligence artificielle',
    date: '02 Juillet 2026',
    excerpt: 'Analyse d’un nouveau vecteur de fraude exploitant des modèles de diffusion d’images pour émuler les timbres humides.',
    content: [
      'Le laboratoire d’analyse médico-légale de VD alerte sur l’utilisation croissante d’outils d’IA générative pour fabriquer des cachets d’établissements fictifs.',
      'Si ces images trompent l’œil humain sur écran standard, l’analyse spectrale révèle un lissage des gradients et une incohérence des micro-trames d’impression jet d’encre ou laser.',
      'Les inspecteurs sont invités à toujours exiger la capture haute définition via le banc scanner de VD.'
    ],
    authority: 'Laboratoire d’Analyse Médico-Légale VD',
    status: 'Prioritaire',
    legalRef: 'Circulaire Justice / Dépêche DACG-2026-03',
  },
  {
    id: 'billet-6',
    reference: 'BILLET-2026-J03',
    category: 'reglementaire',
    categoryLabel: 'Réglementation',
    title: 'Modalités de réquisition judiciaire pour les brigades d’enquête (Art. 77-1-1 CPP)',
    date: '18 Juin 2026',
    excerpt: 'Guide pratique pour l’extraction des journaux d’audit probants et scellés SHA-256 dans le cadre de procédures judiciaires.',
    content: [
      'Les officiers de police judiciaire (OPJ) et magistrats instructeurs peuvent obtenir sur réquisition un accès direct au journal d’audit inaltérable de VD.',
      'Chaque consultation génère un jeton de réquisition horodaté à la milliseconde, assurant la traçabilité intégrale de la chaîne de conservation des preuves documentaires.',
      'Le rapport de conformité généré est directement utilisable lors des audiences correctionnelles.'
    ],
    authority: 'Chambre de l’Instruction & Cellule Juridique VD',
    status: 'En vigueur',
    legalRef: 'Code de Procédure Pénale Art. 77-1-1 & 60-1',
  },
];

interface FooterProps {
  onNavigate?: (tab: ActiveTab) => void;
  onOpenLoginModal?: (mode?: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLoginModal }) => {
  const [selectedBillet, setSelectedBillet] = useState<Billet | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'alerte' | 'reglementaire' | 'technique' | 'academique'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const filteredBillets = filterCategory === 'all'
    ? OFFICIAL_BILLETS
    : OFFICIAL_BILLETS.filter((b) => b.category === filterCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const getCategoryBadgeClass = (cat: Billet['category']) => {
    switch (cat) {
      case 'alerte':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'reglementaire':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'technique':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'academique':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <footer className="relative border-t border-emerald-900/60 bg-gradient-to-br from-slate-950 via-[#071918] to-emerald-950 text-slate-300 print-hidden overflow-hidden">
      {/* Halo radial de dégradé d'ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_90%,rgba(5,150,105,0.08),transparent)] pointer-events-none" />

      {/* ------------------------------------------------------------------- */}
      {/* SECTION BILLETS OFFICIELS BIEN ORGANISÉE */}
      {/* ------------------------------------------------------------------- */}
      <div id="juridique" className="relative z-10 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-xs py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header de la section des Billets */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-2 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Publications & Veille Documentaire</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Billets & Bulletins Officiels de Contrôle
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Consultez les derniers billets d'alerte aux falsifications, arrêtés ministériels, décrets de conformité et standards techniques d'authentification.
              </p>
            </div>

            {/* Filtres des Billets */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Tous les billets ({OFFICIAL_BILLETS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('alerte')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterCategory === 'alerte'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Alertes Fraude
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('reglementaire')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterCategory === 'reglementaire'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Décrets & Lois
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('technique')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterCategory === 'technique'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Standards 300 DPI
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('academique')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterCategory === 'academique'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Académique
              </button>
            </div>
          </div>

          {/* Grille organisée des Billets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBillets.map((billet) => (
              <motion.article
                key={billet.id}
                layout
                whileHover={{ y: -2 }}
                onClick={() => setSelectedBillet(billet)}
                className="bg-slate-900/70 rounded-xl border border-slate-800/90 p-4 sm:p-5 shadow-sm hover:border-emerald-500/50 hover:bg-slate-850/90 transition-all flex flex-col justify-between cursor-pointer group backdrop-blur-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getCategoryBadgeClass(billet.category)}`}>
                      <Tag className="w-3 h-3" />
                      <span>{billet.categoryLabel}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {billet.reference}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-white text-sm sm:text-base leading-snug group-hover:text-emerald-300 transition-colors">
                    {billet.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {billet.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{billet.date}</span>
                  </div>
                  <span className="font-semibold text-emerald-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                    <span>Consulter le billet</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Inscription aux nouveaux billets */}
          <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-xs p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-semibold text-emerald-200 text-sm flex items-center justify-center sm:justify-start gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Veille réglementaire et diffusion des billets d'alerte</span>
              </div>
              <p className="text-xs text-emerald-300/80">
                Recevez directement les alertes de falsification et les nouvelles circulaires par courriel sécurisé.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex items-center gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="agent@academie.fr"
                className="bg-slate-900/90 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-400 w-full sm:w-64"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Recevoir</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
          {newsletterSuccess && (
            <p className="text-xs text-emerald-400 mt-2 text-right">
              ✓ Votre adresse a été inscrite au registre de diffusion des billets officiels.
            </p>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION COLONNES DU FOOTER (ORGANISATION DES LIENS ET SERVICES) */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Colonne 1 : Identité VD */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                VD
              </div>
              <div>
                <span className="font-serif font-bold text-white text-base">
                  VD
                </span>
                <span className="ml-1 text-[10px] uppercase font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded-sm">
                  d'État
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              <strong className="text-white">VD</strong> est la plateforme de souveraineté documentaire dédiée au contrôle optique, à la détection médico-légale des falsifications et à la certification d’authenticité des diplômes d’État par registres inaltérables.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 font-mono">
                <Lock className="w-3 h-3 text-emerald-400" />
                SHA-256
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 font-mono">
                <Scale className="w-3 h-3 text-emerald-400" />
                Art. 441-1 CP
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Conforme RGPD
              </span>
            </div>
          </div>

          {/* Colonne 2 : Espaces de travail */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              Espaces & Fonctions
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('verifier')}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Scanner de Parchemin (Scolarité)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('alertes')}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Cellule Répression des Fraudes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('registry')}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Registre National d'Archives
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('stats')}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Observatoire des Menaces
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('admin')}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Console Centrale de Gouvernance
                </button>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Établissements Partenaires */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              Réseau Partenaire
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <span>IAI-Cameroun (Système CEMAC)</span>
              </li>
              <li>
                <span>Université de Yaoundé I (UY1)</span>
              </li>
              <li>
                <span>École Polytechnique de Yaoundé (ENSPY)</span>
              </li>
              <li>
                <span>Office du Baccalauréat (OBC)</span>
              </li>
              <li>
                <span>Université de Douala (UDLA)</span>
              </li>
              <li>
                <span>Université de Dschang (UDs)</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Billets & Documents Légaux */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              Billets & Légalité
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedBillet(OFFICIAL_BILLETS[0])}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Dernier Billet d'Alerte Fraude
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedBillet(OFFICIAL_BILLETS[1])}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Billet Décret n° 2026-442
                </button>
              </li>
              <li>
                <a
                  href="#protocole"
                  className="hover:text-emerald-300 transition-colors text-left block"
                >
                  Protocole d'Audit 300 DPI
                </a>
              </li>
              <li>
                <span className="text-slate-500">Réquisitions : parquet@vd.interieur.gouv</span>
              </li>
              <li className="pt-1 flex flex-col gap-1.5">
                {onOpenLoginModal && (
                  <button
                    type="button"
                    onClick={() => onOpenLoginModal('login')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold text-left"
                  >
                    Connexion Opérateur →
                  </button>
                )}
                {onOpenLoginModal && (
                  <button
                    type="button"
                    onClick={() => onOpenLoginModal('register')}
                    className="text-teal-400 hover:text-teal-300 font-semibold text-left"
                  >
                    Créer un compte Opérateur →
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* BAS DE PAGE (CRÉDITS & CODES) */}
        {/* ------------------------------------------------------------------- */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-white">VD v2.6.4</span>
            <span>— Plateforme Nationale d'Intégrité Documentaire & Vérification de Diplômes</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Conforme RGPD • SHA-256 • Décret 2026-MINESUP • Tous droits réservés
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MODALE DE LECTURE INTÉGRALE D'UN BILLET */}
      {/* ------------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedBillet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBillet(null)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl z-10 overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col"
            >
              {/* Entête du Billet */}
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getCategoryBadgeClass(selectedBillet.category)}`}>
                      <Tag className="w-3 h-3" />
                      <span>{selectedBillet.categoryLabel}</span>
                    </span>
                    <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded-sm border border-slate-200">
                      {selectedBillet.reference}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      Statut : <span className="text-emerald-700">{selectedBillet.status}</span>
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-950 leading-snug">
                    {selectedBillet.title}
                  </h3>
                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedBillet.date}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{selectedBillet.authority}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBillet(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors shrink-0"
                  aria-label="Fermer le billet"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Corps du Billet */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-emerald-950 font-medium">
                  {selectedBillet.excerpt}
                </div>

                <div className="space-y-3 pt-2">
                  {selectedBillet.content.map((paragraph, idx) => (
                    <p key={idx} className="text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {selectedBillet.legalRef && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-slate-500 shrink-0" />
                    <span><strong>Base légale :</strong> {selectedBillet.legalRef}</span>
                  </div>
                )}
              </div>

              {/* Pied de la modale */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Archivage certifié VD • Inaltérable
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedBillet(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;

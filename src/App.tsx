import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Database,
  History,
  BarChart3,
  Bell,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Navbar, ActiveTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { UploadZone } from './components/UploadZone';
import { DocumentViewer } from './components/DocumentViewer';
import { AnalysisProgress } from './components/AnalysisProgress';
import { VerificationReport } from './components/VerificationReport';
import { OfficialAttestationModal } from './components/OfficialAttestationModal';
import { LoginModal } from './components/LoginModal';
import { RegistryView } from './components/RegistryView';
import { AuditLogView, AuditEntry } from './components/AuditLogView';
import { SecurityStatsView } from './components/SecurityStatsView';
import { RealtimeAlertsDashboard } from './components/RealtimeAlertsDashboard';
import { RealtimeAlertBanner } from './components/RealtimeAlertBanner';
import { ProjectDocumentationView } from './components/ProjectDocumentationView';
import { AdminConsole } from './components/AdminConsole';
import { PerimeterBarrierScreen } from './components/PerimeterBarrierScreen';
import { useRealtimeAlerts } from './hooks/useRealtimeAlerts';
import { useAuth } from './contexts/AuthContext';
import { VerificationResult, RegisteredDiploma, VerificationStats, UserRole } from './types';

export const ROLE_PERMISSIONS: Record<UserRole, ActiveTab[]> = {
  ANALYSTE: ['alertes', 'stats', 'audit', 'documentation', 'landing'],
  VERIFICATEUR: ['verifier', 'registry', 'audit', 'documentation', 'landing'],
  ADMIN: ['admin', 'registry', 'audit', 'stats', 'alertes', 'verifier', 'documentation', 'landing'],
};

export const ROLE_DEFAULT_TAB: Record<UserRole, ActiveTab> = {
  ANALYSTE: 'alertes',
  VERIFICATEUR: 'verifier',
  ADMIN: 'admin',
};

const INITIAL_REGISTRY: RegisteredDiploma[] = [
  {
    id: 'REG-001',
    documentId: 'SORB-2023-M8921',
    studentName: 'Thomas Laurent',
    institution: 'Sorbonne Université',
    degreeTitle: 'Master en Informatique et Systèmes Décisionnels',
    fieldOfStudy: 'Sciences & Ingénierie Logicielle',
    issueDate: '2023-06-28',
    honors: 'Mention Très Bien',
    accredited: true,
  },
  {
    id: 'REG-002',
    documentId: 'X-2022-ING-0412',
    studentName: 'Camille Dupont',
    institution: 'École Polytechnique (Institut Polytechnique de Paris)',
    degreeTitle: "Diplôme d'Ingénieur de l'École Polytechnique",
    fieldOfStudy: 'Mathématiques Appliquées et Science des Données',
    issueDate: '2022-07-15',
    honors: 'Félicitations du Jury',
    accredited: true,
  },
  {
    id: 'REG-003',
    documentId: 'UPS-2024-L3-1094',
    studentName: 'Alexandre Bernard',
    institution: 'Université Paris-Saclay',
    degreeTitle: 'Licence en Mathématiques et Applications',
    fieldOfStudy: 'Mathématiques Générales',
    issueDate: '2024-06-20',
    honors: 'Mention Bien',
    accredited: true,
  },
  {
    id: 'REG-004',
    documentId: 'UDM-2023-BACC-7741',
    studentName: 'Sarah Tremblay',
    institution: 'Université de Montréal',
    degreeTitle: 'Baccalauréat en Informatique',
    fieldOfStudy: 'Génie Logiciel & Intelligence Artificielle',
    issueDate: '2023-05-30',
    honors: "Mention d'Excellence",
    accredited: true,
  },
  {
    id: 'REG-005',
    documentId: 'HEC-2023-MIM-5521',
    studentName: 'Julien Moreau',
    institution: 'HEC Paris',
    degreeTitle: 'Master in Management (Grande École)',
    fieldOfStudy: 'Finance Stratégique',
    issueDate: '2023-09-12',
    honors: 'Summa Cum Laude',
    accredited: true,
  },
  {
    id: 'REG-006',
    documentId: 'UNIGE-2024-DR-3312',
    studentName: 'Élodie Martin',
    institution: 'Université de Genève',
    degreeTitle: 'Maîtrise Universitaire en Droit International',
    fieldOfStudy: 'Droit Humanitaire et Gouvernance',
    issueDate: '2024-02-14',
    honors: 'Magna Cum Laude',
    accredited: true,
  },
  {
    id: 'REG-007',
    documentId: 'ULB-2023-BA-8819',
    studentName: 'Lucas Dubois',
    institution: 'Université Libre de Bruxelles',
    degreeTitle: 'Bachelier en Sciences Économiques',
    fieldOfStudy: 'Économie Appliquée',
    issueDate: '2023-06-25',
    honors: 'Avec Distinction',
    accredited: true,
  },
  {
    id: 'REG-008',
    documentId: 'OXF-2022-MENG-1102',
    studentName: 'Arthur Pendelton',
    institution: 'University of Oxford',
    degreeTitle: 'Master of Engineering in Computer Science',
    fieldOfStudy: 'Computing & Cyber-Physical Systems',
    issueDate: '2022-07-22',
    honors: 'First Class Honours',
    accredited: true,
  },
  {
    id: 'REG-009',
    documentId: 'IAI-2023-ING-0812',
    studentName: 'Kenfack Rodrigue',
    institution: 'IAI-Cameroun (Institut Africain d\'Informatique)',
    degreeTitle: "Diplôme d'Ingénieur des Travaux Informatiques",
    fieldOfStudy: 'Génie Logiciel & Systèmes d\'Information',
    issueDate: '2023-07-18',
    honors: 'Mention Très Bien',
    accredited: true,
  },
  {
    id: 'REG-010',
    documentId: 'UY1-2024-MAS-4491',
    studentName: 'Mvondo Jeanne',
    institution: 'Université de Yaoundé I',
    degreeTitle: 'Master en Sciences et Technologies',
    fieldOfStudy: 'Biochimie Médicale & Pharmacologie',
    issueDate: '2024-01-20',
    honors: 'Mention Bien',
    accredited: true,
  },
];

const INITIAL_AUDITS: AuditEntry[] = [
  {
    verificationId: 'VERIF-2026-9901',
    timestamp: '2026-03-29T14:23:10.000Z',
    studentName: 'Thomas Laurent',
    institution: 'Sorbonne Université',
    degreeTitle: 'Master en Informatique et Systèmes Décisionnels',
    status: 'AUTHENTIQUE',
    confidenceScore: 99,
    sha256: '9f83c12a819b5e324a9b73f2e10c548a623f98217349ab6e140d39e24095a123',
  },
  {
    verificationId: 'VERIF-2026-9898',
    timestamp: '2026-03-29T12:05:44.000Z',
    studentName: 'Maxime Bertrand (Altéré)',
    institution: 'Sorbonne Université',
    degreeTitle: 'Master en Informatique',
    status: 'FALSIFIE',
    confidenceScore: 98,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    verificationId: 'VERIF-2026-9884',
    timestamp: '2026-03-29T09:41:19.000Z',
    studentName: 'Camille Dupont',
    institution: 'École Polytechnique',
    degreeTitle: "Diplôme d'Ingénieur",
    status: 'AUTHENTIQUE',
    confidenceScore: 97,
    sha256: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
  },
  {
    verificationId: 'VERIF-2026-9871',
    timestamp: '2026-03-28T17:15:02.000Z',
    studentName: 'Kenfack Rodrigue',
    institution: 'IAI-Cameroun',
    degreeTitle: "Diplôme d'Ingénieur des Travaux Informatiques",
    status: 'AUTHENTIQUE',
    confidenceScore: 99,
    sha256: '72c388273618de428e3b1239920199e4fba61201920381029482103948192039',
  },
];

export default function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [showLoginFlow, setShowLoginFlow] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [selectedFileSize, setSelectedFileSize] = useState<string>('1.4 Mo');

  // STRICT RBAC CONFINEMENT GUARD:
  // Ensures every agent is strictly confined to their dedicated workspace.
  useEffect(() => {
    if (user) {
      setShowLoginFlow(false);
      const allowed = ROLE_PERMISSIONS[user.role] || [];
      // If the current tab is not allowed for this role, immediately redirect to default role tab
      if (!allowed.includes(activeTab)) {
        setActiveTab(ROLE_DEFAULT_TAB[user.role] || 'landing');
      }
    }
  }, [user, activeTab]);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [registry, setRegistry] = useState<RegisteredDiploma[]>(INITIAL_REGISTRY);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDITS);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Real-time Falsified Hash Alerts Engine & WebSocket Manager
  const {
    alerts,
    blacklistedHashes,
    isConnected: isWsConnected,
    activeCount: activeAlertsCount,
    latestAlert,
    audioEnabled,
    setAudioEnabled,
    dismissToast,
    updateAlertStatus,
    acknowledgeAlert,
    addBlacklistedHash,
    removeBlacklistedHash,
    simulateAlert,
  } = useRealtimeAlerts();

  // Fetch registry from backend on mount
  const fetchRegistry = () => {
    fetch('/api/registry')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setRegistry(data.data);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback registry:', err);
      });
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  // Handle File or Preset Selection & Trigger Automated Verification
  const handleFileSelected = async (
    base64: string,
    fileName: string,
    mimeType: string,
    fileSize: string
  ) => {
    setSelectedImage(base64);
    setSelectedFileName(fileName);
    setSelectedMimeType(mimeType);
    setSelectedFileSize(fileSize);
    setVerificationResult(null);
    setError(null);
    setIsAnalyzing(true);
    setActiveTab('verifier');

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          fileName,
          fileSize,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur serveur HTTP ${response.status}`);
      }

      const result: VerificationResult = await response.json();
      setVerificationResult(result);

      // Append to audit trail
      setAuditLogs((prev) => [
        {
          verificationId: result.verificationId,
          timestamp: result.timestamp,
          studentName: result.diplomaData.studentName,
          institution: result.diplomaData.institution,
          degreeTitle: result.diplomaData.degreeTitle,
          status: result.status,
          confidenceScore: result.confidenceScore,
          sha256: result.sha256,
        },
        ...prev,
      ]);
    } catch (err: any) {
      console.error('Verification failure:', err);
      setError(err?.message || "Une erreur inattendue est survenue lors de l'analyse du diplôme.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setVerificationResult(null);
    setError(null);
  };

  const handleAddDiploma = async (newEntry: Omit<RegisteredDiploma, 'id' | 'accredited'>) => {
    try {
      const response = await fetch('/api/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      const data = await response.json();
      if (data.success && data.entry) {
        setRegistry((prev) => [data.entry, ...prev]);
        alert(`Le diplôme "${newEntry.documentId}" a été enregistré avec succès dans le registre officiel.`);
      }
    } catch {
      // Local fallback
      const localNew: RegisteredDiploma = {
        ...newEntry,
        id: `REG-${String(registry.length + 1).padStart(3, '0')}`,
        accredited: true,
      };
      setRegistry((prev) => [localNew, ...prev]);
      alert(`Le diplôme "${newEntry.documentId}" a été ajouté au registre local.`);
    }
  };

  // Derive stats
  const totalVerifications = auditLogs.length;
  const authenticCount = auditLogs.filter((l) => l.status === 'AUTHENTIQUE').length;
  const suspiciousCount = auditLogs.filter((l) => l.status === 'SUSPECT').length;
  const falsifiedCount = auditLogs.filter((l) => l.status === 'FALSIFIE').length;
  const avgConfidence =
    totalVerifications > 0
      ? Math.round(auditLogs.reduce((acc, curr) => acc + curr.confidenceScore, 0) / totalVerifications)
      : 96;

  const currentStats: VerificationStats = {
    totalVerifications,
    authenticCount,
    suspiciousCount,
    falsifiedCount,
    averageConfidenceScore: avgConfidence,
    averageProcessingTimeMs: 1350,
  };

  // 1. If not logged in and showLoginFlow is active -> show LoginScreen
  if (!user && showLoginFlow) {
    return (
      <LoginScreen
        onBackToLanding={() => setShowLoginFlow(false)}
        onSuccess={(role) => {
          setShowLoginFlow(false);
          if (role === 'ADMIN') setActiveTab('admin');
          else if (role === 'ANALYSTE') setActiveTab('alertes');
          else setActiveTab('verifier');
        }}
      />
    );
  }

  // Permitted tabs configuration for the workspace segmented switcher
  const getWorkspaceTabs = () => {
    if (!user) {
      return [
        { id: 'landing' as ActiveTab, label: 'Accueil', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
        { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-3.5 w-3.5" /> },
      ];
    }
    if (user.role === 'ANALYSTE') {
      return [
        { id: 'alertes' as ActiveTab, label: 'Cellule Alertes & Fraudes', icon: <Bell className="h-3.5 w-3.5" />, count: activeAlertsCount },
        { id: 'stats' as ActiveTab, label: 'Statistiques Menaces', icon: <BarChart3 className="h-3.5 w-3.5" /> },
        { id: 'audit' as ActiveTab, label: 'Audit Judiciaire', icon: <History className="h-3.5 w-3.5" /> },
        { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-3.5 w-3.5" /> },
      ];
    }
    if (user.role === 'VERIFICATEUR') {
      return [
        { id: 'verifier' as ActiveTab, label: 'Scanner Parchemin', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
        { id: 'registry' as ActiveTab, label: 'Registre Scolarité', icon: <Database className="h-3.5 w-3.5" />, count: registry.length },
        { id: 'audit' as ActiveTab, label: 'Audits Scolarité', icon: <History className="h-3.5 w-3.5" /> },
        { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-3.5 w-3.5" /> },
      ];
    }
    // ADMIN
    return [
      { id: 'admin' as ActiveTab, label: 'Console Centrale', icon: <Shield className="h-3.5 w-3.5" /> },
      { id: 'registry' as ActiveTab, label: 'Registre National', icon: <Database className="h-3.5 w-3.5" />, count: registry.length },
      { id: 'alertes' as ActiveTab, label: 'Supervision Fraudes', icon: <Bell className="h-3.5 w-3.5" />, count: activeAlertsCount },
      { id: 'verifier' as ActiveTab, label: 'Banc Scanner', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
      { id: 'stats' as ActiveTab, label: 'Statistiques', icon: <BarChart3 className="h-3.5 w-3.5" /> },
      { id: 'audit' as ActiveTab, label: 'Journal d’État', icon: <History className="h-3.5 w-3.5" /> },
      { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-3.5 w-3.5" /> },
    ];
  };

  const workspaceTabs = getWorkspaceTabs();

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Global Sticky Translucent Navbar with backdrop-blur */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (!user && tab !== 'landing' && tab !== 'documentation') {
            setShowLoginFlow(true);
          } else {
            setActiveTab(tab);
          }
        }}
        registryCount={registry.length}
        alertsCount={activeAlertsCount}
        onOpenAuthModal={(mode) => {
          if (mode === 'login') {
            setShowLoginFlow(true);
          } else {
            setAuthModalTab(mode || 'login');
            setIsAuthModalOpen(true);
          }
        }}
      />

      {/* React Workspace Perimeter Banner (Only for authenticated operators when not on landing) */}
      {user && activeTab !== 'landing' && (
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* Left Identity & Role Boundary Indicator */}
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-sm ${
                  user.role === 'ANALYSTE'
                    ? 'bg-rose-600'
                    : user.role === 'VERIFICATEUR'
                    ? 'bg-emerald-600'
                    : 'bg-purple-700'
                }`}>
                  {user.role === 'ANALYSTE' ? <ShieldAlert className="h-5 w-5" /> : user.role === 'VERIFICATEUR' ? <ShieldCheck className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif font-bold text-slate-900 text-sm">
                      {user.role === 'ANALYSTE'
                        ? 'Cellule Répression des Fraudes'
                        : user.role === 'VERIFICATEUR'
                        ? 'Direction de la Scolarité & Contrôle'
                        : 'Console Centrale de Gouvernance'}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      user.role === 'ANALYSTE'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : user.role === 'VERIFICATEUR'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-purple-50 text-purple-800 border-purple-200'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        user.role === 'ANALYSTE' ? 'bg-rose-500' : user.role === 'VERIFICATEUR' ? 'bg-emerald-500' : 'bg-purple-500'
                      }`} />
                      <span>{user.role === 'ANALYSTE' ? 'Analyste' : user.role === 'VERIFICATEUR' ? 'Scolarité' : 'Admin'}</span>
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800">{user.fullName}</span>
                    <span className="text-slate-300">•</span>
                    <span>{user.department}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-slate-400">#{user.badgeNumber || 'ACCR-2026'}</span>
                  </div>
                </div>
              </div>

              {/* Right: Segmented Switcher Controls with logout button */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                {workspaceTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="workspace-active-pill"
                          className="absolute inset-0 rounded-md bg-emerald-600"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-none ${
                            isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </span>
                    </motion.button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActiveTab('landing')}
                  className="px-2.5 py-1.5 text-[11px] text-slate-500 hover:text-slate-900 hover:bg-white/70 rounded-md transition-colors font-medium flex items-center gap-1 cursor-pointer"
                  title="Voir la page d'accueil"
                >
                  <span>Accueil</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setActiveTab('landing');
                  }}
                  className="px-2.5 py-1.5 text-[11px] text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors font-medium flex items-center gap-1 cursor-pointer"
                  title="Se déconnecter"
                >
                  <LogOut className="h-3 w-3" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Real-time Notification Banner for Incoming Falsified Hash Alerts */}
      <RealtimeAlertBanner
        alert={latestAlert}
        onDismiss={dismissToast}
        onViewDashboard={() => setActiveTab('alertes')}
        onAcknowledge={acknowledgeAlert}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
      />

      {/* Content Area: Landing Page (Hero cover, Simulator, Features) OR Operator Workspace View */}
      {activeTab === 'landing' ? (
        <LandingPage
          onEnterApp={(targetRole?: UserRole) => {
            const effectiveRole = targetRole || user?.role;
            if (effectiveRole === 'ADMIN') setActiveTab('admin');
            else if (effectiveRole === 'ANALYSTE') setActiveTab('alertes');
            else if (effectiveRole === 'VERIFICATEUR') setActiveTab('verifier');
            else if (user) {
              setActiveTab(ROLE_DEFAULT_TAB[user.role]);
            } else {
              setShowLoginFlow(true);
            }
          }}
          onOpenLoginModal={() => setShowLoginFlow(true)}
        />
      ) : (
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Error notification banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-red-50 border border-red-200 p-4 text-xs text-red-900">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-950 font-semibold ml-3"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Tab 1: Core Verifier View (Only for VERIFICATEUR or ADMIN) */}
        {activeTab === 'verifier' && (
          user.role === 'VERIFICATEUR' || user.role === 'ADMIN' ? (
            <div className="space-y-6">
              {!selectedImage ? (
                <UploadZone
                  onFileSelected={handleFileSelected}
                  isAnalyzing={isAnalyzing}
                />
              ) : (
                <div className="space-y-6">
                  {/* Dual View: Document Viewer on Left, Progress or Report on Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Visual Document Viewer */}
                    <div className="lg:col-span-5 space-y-3">
                      <DocumentViewer
                        imageSrc={selectedImage}
                        fileName={selectedFileName}
                        fileSize={selectedFileSize}
                        verificationResult={verificationResult}
                      />

                      <div className="flex justify-center">
                        <button
                          onClick={handleReset}
                          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                        >
                          Changer de document
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Active Analysis or Final Report */}
                    <div className="lg:col-span-7 space-y-5">
                      {isAnalyzing ? (
                        <AnalysisProgress />
                      ) : verificationResult ? (
                        <VerificationReport
                          result={verificationResult}
                          onOpenAttestationModal={() => setIsAttestationModalOpen(true)}
                          onReset={handleReset}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <PerimeterBarrierScreen
              user={user}
              requiredRole="Agent de Scolarité"
              onRedirectToPost={() => setActiveTab(ROLE_DEFAULT_TAB[user.role])}
            />
          )
        )}

        {/* Tab 2: Institutional Registry View (Only for VERIFICATEUR or ADMIN) */}
        {activeTab === 'registry' && (
          user.role === 'VERIFICATEUR' || user.role === 'ADMIN' ? (
            <RegistryView
              registry={registry}
              onAddDiploma={handleAddDiploma}
              onLoadIntoVerifier={(base64, fileName, mimeType, fileSize) => {
                setActiveTab('verifier');
                handleFileSelected(base64, fileName, mimeType, fileSize);
              }}
            />
          ) : (
            <PerimeterBarrierScreen
              user={user}
              requiredRole="Agent de Scolarité ou Administrateur"
              onRedirectToPost={() => setActiveTab(ROLE_DEFAULT_TAB[user.role])}
            />
          )
        )}

        {/* Tab 3: Audit Log View (Authorized for all authenticated roles) */}
        {activeTab === 'audit' && (
          <AuditLogView auditLogs={auditLogs} />
        )}

        {/* Tab 4: Security Statistics View (Only for ANALYSTE or ADMIN) */}
        {activeTab === 'stats' && (
          user.role === 'ANALYSTE' || user.role === 'ADMIN' ? (
            <SecurityStatsView stats={currentStats} />
          ) : (
            <PerimeterBarrierScreen
              user={user}
              requiredRole="Analyste Fraudes ou Administrateur"
              onRedirectToPost={() => setActiveTab(ROLE_DEFAULT_TAB[user.role])}
            />
          )
        )}

        {/* Tab 5: Real-time Incident & Falsified Hash Alerts Dashboard (Only for ANALYSTE or ADMIN) */}
        {activeTab === 'alertes' && (
          user.role === 'ANALYSTE' || user.role === 'ADMIN' ? (
            <RealtimeAlertsDashboard
              alerts={alerts}
              blacklistedHashes={blacklistedHashes}
              isConnected={isWsConnected}
              audioEnabled={audioEnabled}
              onToggleAudio={() => setAudioEnabled(!audioEnabled)}
              onUpdateStatus={updateAlertStatus}
              onAcknowledge={acknowledgeAlert}
              onAddBlacklistHash={addBlacklistedHash}
              onRemoveBlacklistHash={removeBlacklistedHash}
              onSimulateAlert={simulateAlert}
            />
          ) : (
            <PerimeterBarrierScreen
              user={user}
              requiredRole="Analyste Fraudes & Sécurité"
              onRedirectToPost={() => setActiveTab(ROLE_DEFAULT_TAB[user.role])}
            />
          )
        )}

        {/* Tab 6: Central Administration & Institution Console (STRICTLY for ADMIN) */}
        {activeTab === 'admin' && (
          user.role === 'ADMIN' ? (
            <AdminConsole
              registry={registry}
              onAddDiplomaToRegistry={handleAddDiploma}
              onRefreshRegistry={fetchRegistry}
            />
          ) : (
            <PerimeterBarrierScreen
              user={user}
              requiredRole="Administrateur Central"
              onRedirectToPost={() => setActiveTab(ROLE_DEFAULT_TAB[user.role])}
            />
          )
        )}

        {/* Tab 7: Complete Project Specifications & Analysis */}
        {activeTab === 'documentation' && (
          <ProjectDocumentationView />
        )}
      </main>
      )}

      {/* Official Attestation Certificate Modal */}
      {isAttestationModalOpen && verificationResult && (
        <OfficialAttestationModal
          result={verificationResult}
          onClose={() => setIsAttestationModalOpen(false)}
        />
      )}

      {/* Operator Authentication & Registration Modal */}
      <LoginModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Global Official Footer with Bulletins, Partner network and Legal references */}
      <Footer
        onNavigate={(tab) => {
          if (!user && tab !== 'landing' && tab !== 'documentation') {
            setShowLoginFlow(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenLoginModal={() => setShowLoginFlow(true)}
      />
    </div>
  );
}

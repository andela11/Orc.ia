import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
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
import { useRealtimeAlerts } from './hooks/useRealtimeAlerts';
import { VerificationResult, RegisteredDiploma, VerificationStats } from './types';

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
    documentId: 'IAI-CMR-2023-ING-0842',
    studentName: 'Jean Paul ETOUNDI',
    institution: 'IAI-Cameroun (Institut Africain d\'Informatique)',
    degreeTitle: 'Diplôme d\'Ingénieur des Travaux Informatiques',
    fieldOfStudy: 'Génie Logiciel & Systèmes d\'Information',
    issueDate: '2023-07-22',
    honors: 'Mention Très Bien',
    accredited: true,
  },
  {
    id: 'REG-008',
    documentId: 'OBC-2022-BAC-TI-4190',
    studentName: 'Mireille NGO BAYIHA',
    institution: 'Office du Baccalauréat du Cameroun (MINESEC)',
    degreeTitle: 'Baccalauréat de l\'Enseignement Secondaire (Série TI)',
    fieldOfStudy: 'Sciences & Technologies de l\'Information',
    issueDate: '2022-07-28',
    honors: 'Mention Bien',
    accredited: true,
  },
];

const INITIAL_AUDITS: AuditEntry[] = [
  {
    verificationId: 'VDF-2026-A94E21',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    studentName: 'Thomas Laurent',
    institution: 'Sorbonne Université',
    degreeTitle: 'Master en Informatique',
    status: 'AUTHENTIQUE',
    confidenceScore: 98,
    sha256: '9f83c6d12b05a41c1f4e72390a84e27fbc1d9e29a8c7b41e98d1a3c5e7b29a14',
  },
  {
    verificationId: 'VDF-2026-F18B90',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    studentName: 'Marc Lefebvre (Altéré)',
    institution: 'Sorbonne Université',
    degreeTitle: 'Master Informatique',
    status: 'FALSIFIE',
    confidenceScore: 22,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    verificationId: 'VDF-2026-C77D14',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    studentName: 'Camille Dupont',
    institution: 'École Polytechnique',
    degreeTitle: "Diplôme d'Ingénieur",
    status: 'AUTHENTIQUE',
    confidenceScore: 100,
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('verifier');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [selectedFileSize, setSelectedFileSize] = useState<string>('1.4 Mo');

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
  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        registryCount={registry.length}
        alertsCount={activeAlertsCount}
        onOpenAuthModal={(mode = 'login') => {
          setAuthModalTab(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Floating Real-time Notification Banner for Incoming Falsified Hash Alerts */}
      <RealtimeAlertBanner
        alert={latestAlert}
        onDismiss={dismissToast}
        onViewDashboard={() => setActiveTab('alertes')}
        onAcknowledge={acknowledgeAlert}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Error notification banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-red-50 border border-red-200 p-3.5 text-xs text-red-900">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-950 font-medium ml-3"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Tab 1: Core Verifier View */}
        {activeTab === 'verifier' && (
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
                        className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
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
        )}

        {/* Tab 2: Institutional Registry View */}
        {activeTab === 'registry' && (
          <RegistryView
            registry={registry}
            onAddDiploma={handleAddDiploma}
            onLoadIntoVerifier={(base64, fileName, mimeType, fileSize) => {
              setActiveTab('verifier');
              handleFileSelected(base64, fileName, mimeType, fileSize);
            }}
          />
        )}

        {/* Tab 3: Audit Log View */}
        {activeTab === 'audit' && (
          <AuditLogView auditLogs={auditLogs} />
        )}

        {/* Tab 4: Security Statistics View */}
        {activeTab === 'stats' && (
          <SecurityStatsView stats={currentStats} />
        )}

        {/* Tab 5: Real-time Incident & Falsified Hash Alerts Dashboard */}
        {activeTab === 'alertes' && (
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
        )}

        {/* Tab 6: Complete Project Specifications & Analysis */}
        {activeTab === 'documentation' && (
          <ProjectDocumentationView />
        )}
      </main>

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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 print-hidden">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">VerifDiplôme</span>
            <span>— Plateforme de certification et d'audit académique</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Conforme RGPD • SHA-256 • Vision multimodale
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Building2,
  Users,
  Database,
  FileSpreadsheet,
  AlertTriangle,
  Settings,
  History,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Lock,
  Unlock,
  FileText,
  Activity,
  Server,
  ArrowUpRight,
  UserCheck,
  AlertOctagon,
  ExternalLink,
  Info,
  Check,
  Crown,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  RegisteredDiploma,
  AccreditedInstitution,
  AdminSystemConfig,
  AdminAuditEntry,
  UserProfile,
  UserRole,
} from '../types';

type AdminSubTab = 'overview' | 'institutions' | 'operators' | 'registry' | 'blacklist' | 'config' | 'logs';

interface AdminConsoleProps {
  registry: RegisteredDiploma[];
  onAddDiplomaToRegistry: (diploma: Omit<RegisteredDiploma, 'id' | 'accredited'>) => void;
  onRefreshRegistry?: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  registry,
  onAddDiplomaToRegistry,
  onRefreshRegistry,
}) => {
  const { user, token } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('overview');

  // Overview stats & loading state
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Institutions State
  const [institutions, setInstitutions] = useState<AccreditedInstitution[]>([]);
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [isAddInstitutionModalOpen, setIsAddInstitutionModalOpen] = useState(false);
  const [newInstitution, setNewInstitution] = useState({
    code: '',
    name: '',
    country: 'Cameroun',
    accreditationNumber: '',
    contactEmail: '',
    officialRectoratUrl: '',
    signatoryName: '',
    signatoryTitle: '',
    officialSealDescription: '',
  });

  // Operators (Users) State
  const [operators, setOperators] = useState<any[]>([]);
  const [operatorSearch, setOperatorSearch] = useState('');
  const [operatorStatusFilter, setOperatorStatusFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [isAddOperatorModalOpen, setIsAddOperatorModalOpen] = useState(false);
  const [newOperator, setNewOperator] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'VERIFICATEUR' as UserRole,
    department: 'Scolarité Centrale & Registres',
    organization: 'Université Partenaire',
    badgeNumber: '',
  });

  // Registry Management & Batch Import State
  const [registrySearch, setRegistrySearch] = useState('');
  const [selectedInstitutionFilter, setSelectedInstitutionFilter] = useState<string>('ALL');
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchInstitution, setBatchInstitution] = useState('IAI-Cameroun (Institut Africain d\'Informatique)');
  const [batchRawData, setBatchRawData] = useState('');
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [diplomaToRevoke, setDiplomaToRevoke] = useState<RegisteredDiploma | null>(null);
  const [revocationReason, setRevocationReason] = useState('');

  // Blacklist Hashes State
  const [blacklistedHashes, setBlacklistedHashes] = useState<any[]>([]);
  const [isAddBlacklistModalOpen, setIsAddBlacklistModalOpen] = useState(false);
  const [newBlacklistEntry, setNewBlacklistEntry] = useState({
    sha256: '',
    reason: '',
    studentName: '',
    institution: '',
    degreeTitle: '',
    threatLevel: 'ELEVE',
  });
  const [pvTransmissionData, setPvTransmissionData] = useState<any | null>(null);

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState<AdminSystemConfig>({
    minConfidenceThreshold: 85,
    strictAcademicFilter: true,
    autoBlacklistFalsified: true,
    autoNotifyRectorat: true,
    forensicFontSensitivity: 'NORMALE',
    maintenanceMode: false,
  });

  // System Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>([]);
  const [logFilterSeverity, setLogFilterSeverity] = useState<string>('ALL');

  // Auto clear alerts after 5s
  useEffect(() => {
    if (actionSuccessMessage) {
      const timer = setTimeout(() => setActionSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccessMessage]);

  useEffect(() => {
    if (actionErrorMessage) {
      const timer = setTimeout(() => setActionErrorMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [actionErrorMessage]);

  // Initial Load of all Admin Data
  const loadAdminData = async () => {
    if (user && user.role !== 'ADMIN') {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // 1. Overview
      const ovRes = await fetch('/api/admin/overview');
      if (ovRes.ok) {
        const ovData = await ovRes.json();
        setOverviewStats(ovData.stats);
      }

      // 2. Institutions
      const instRes = await fetch('/api/admin/institutions');
      if (instRes.ok) {
        const instData = await instRes.json();
        setInstitutions(instData.institutions || []);
      }

      // 3. Operators
      const usersRes = await fetch('/api/admin/users', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setOperators(usersData.users || []);
      }

      // 4. Blacklist
      const alertsRes = await fetch('/api/alerts');
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setBlacklistedHashes(alertsData.blacklistedHashes || []);
      }

      // 5. Config
      const confRes = await fetch('/api/admin/config');
      if (confRes.ok) {
        const confData = await confRes.json();
        setSystemConfig(confData.config);
      }

      // 6. Audit Logs
      const logsRes = await fetch('/api/admin/logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAuditLogs(logsData.logs || []);
      }
    } catch (err) {
      console.warn('Erreur chargement données administration:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // ----------------------------------------------------
  // HANDLERS FOR INSTITUTIONS
  // ----------------------------------------------------
  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstitution.code || !newInstitution.name || !newInstitution.accreditationNumber) {
      setActionErrorMessage('Veuillez renseigner le code, le nom et le numéro d\'accréditation.');
      return;
    }

    try {
      const signatories = newInstitution.signatoryName
        ? [{ name: newInstitution.signatoryName, title: newInstitution.signatoryTitle || 'Représentant Légal' }]
        : [{ name: 'Direction Générale', title: 'Responsable des Titres' }];

      const res = await fetch('/api/admin/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newInstitution,
          authorizedSignatories: signatories,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création de l\'établissement');

      setInstitutions([data.institution, ...institutions]);
      setIsAddInstitutionModalOpen(false);
      setNewInstitution({
        code: '',
        name: '',
        country: 'Cameroun',
        accreditationNumber: '',
        contactEmail: '',
        officialRectoratUrl: '',
        signatoryName: '',
        signatoryTitle: '',
        officialSealDescription: '',
      });
      setActionSuccessMessage(`Établissement "${data.institution.name}" accrédité avec succès.`);
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  const handleToggleInstitutionStatus = async (inst: AccreditedInstitution) => {
    const nextStatus = inst.accreditationStatus === 'ACTIVE' ? 'SUSPENDUE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/institutions/${inst.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accreditationStatus: nextStatus }),
      });
      if (res.ok) {
        setInstitutions(
          institutions.map((i) => (i.id === inst.id ? { ...i, accreditationStatus: nextStatus } : i))
        );
        setActionSuccessMessage(`Statut de "${inst.name}" mis à jour : ${nextStatus}`);
      }
    } catch (err) {
      setActionErrorMessage('Erreur lors du changement de statut de l\'établissement.');
    }
  };

  // ----------------------------------------------------
  // HANDLERS FOR OPERATORS / USERS
  // ----------------------------------------------------
  const handleCreateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOperator.fullName || !newOperator.email || !newOperator.password) {
      setActionErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newOperator),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur création opérateur');

      setOperators([data.user, ...operators]);
      setIsAddOperatorModalOpen(false);
      setNewOperator({
        fullName: '',
        email: '',
        password: '',
        role: 'VERIFICATEUR',
        department: 'Scolarité Centrale & Registres',
        organization: 'Université Partenaire',
        badgeNumber: '',
      });
      setActionSuccessMessage(`Compte opérateur créé pour ${data.user.fullName} (${data.user.role}).`);
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  const handleApproveOperator = async (userId: string, name: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur validation compte opérateur');

      setOperators((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: 'ACTIVE' } : u))
      );
      setActionSuccessMessage(`Le compte de ${name} a été validé et activé avec succès.`);
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  const handleToggleOperatorStatus = async (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED', name: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur mise à jour statut');

      setOperators((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      setActionSuccessMessage(`Statut de ${name} mis à jour : ${newStatus === 'ACTIVE' ? 'Actif' : 'Suspendu'}.`);
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  const handleChangeOperatorRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la modification du rôle.');

      setOperators(operators.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setActionSuccessMessage('Rôle opérateur mis à jour avec succès.');
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  const handleDeleteOperator = async (userId: string, name: string) => {
    if (!window.confirm(`Confirmez-vous la révocation définitive du compte de ${name} ?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur suppression');

      setOperators(operators.filter((u) => u.id !== userId));
      setActionSuccessMessage(`Compte de ${name} révoqué.`);
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  // ----------------------------------------------------
  // HANDLERS FOR BATCH IMPORT & REGISTRY
  // ----------------------------------------------------
  const handleLoadSampleBatchJson = () => {
    const sample = [
      {
        documentId: 'IAI-CMR-2024-ING-0911',
        studentName: 'Boris Armel TCHINDA',
        institution: 'IAI-Cameroun (Institut Africain d\'Informatique)',
        degreeTitle: 'Diplôme d\'Ingénieur de Conception en Informatique',
        fieldOfStudy: 'Génie Logiciel & Intelligence Artificielle',
        issueDate: '2024-07-20',
        honors: 'Mention Très Bien',
      },
      {
        documentId: 'IAI-CMR-2024-ING-0912',
        studentName: 'Carine Vanessa MBALLA',
        institution: 'IAI-Cameroun (Institut Africain d\'Informatique)',
        degreeTitle: 'Diplôme d\'Ingénieur des Travaux Informatiques',
        fieldOfStudy: 'Réseaux & Cybersécurité',
        issueDate: '2024-07-20',
        honors: 'Mention Très Bien (Félicitations du Jury)',
      },
      {
        documentId: 'IAI-CMR-2024-ING-0913',
        studentName: 'Patrick Kevin NOUBI',
        institution: 'IAI-Cameroun (Institut Africain d\'Informatique)',
        degreeTitle: 'Diplôme d\'Ingénieur de Conception en Informatique',
        fieldOfStudy: 'Systèmes Décisionnels & Data Engineering',
        issueDate: '2024-07-20',
        honors: 'Mention Bien',
      },
    ];
    setBatchRawData(JSON.stringify(sample, null, 2));
  };

  const handleExecuteBatchImport = async () => {
    if (!batchRawData.trim()) {
      setActionErrorMessage('Veuillez insérer des données au format JSON.');
      return;
    }

    try {
      const parsed = JSON.parse(batchRawData);
      if (!Array.isArray(parsed)) throw new Error('Le format doit être un tableau JSON d\'objets diplômes.');

      const res = await fetch('/api/admin/registry/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diplomas: parsed,
          institutionName: batchInstitution,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'import par lot');

      setIsBatchModalOpen(false);
      setBatchRawData('');
      setActionSuccessMessage(`${data.count} diplômes officiels importés et indexés dans le registre avec succès.`);
      if (onRefreshRegistry) onRefreshRegistry();
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(`Erreur import : ${err.message}`);
    }
  };

  const handleConfirmRevocation = async () => {
    if (!diplomaToRevoke) return;
    try {
      const res = await fetch(`/api/admin/registry/${diplomaToRevoke.id}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: revocationReason || 'Révocation administrative pour fraude académique.',
          revokedBy: user?.fullName || 'Administrateur Central',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la révocation');

      setIsRevokeModalOpen(false);
      setDiplomaToRevoke(null);
      setRevocationReason('');
      setActionSuccessMessage(`Diplôme ${diplomaToRevoke.documentId} révoqué formellement.`);
      if (onRefreshRegistry) onRefreshRegistry();
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  // ----------------------------------------------------
  // HANDLERS FOR BLACKLIST & JUDICIAL REQUISITIONS
  // ----------------------------------------------------
  const handleAddBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlacklistEntry.sha256 || !newBlacklistEntry.reason) {
      setActionErrorMessage('L\'empreinte SHA-256 et le motif sont requis.');
      return;
    }

    try {
      const res = await fetch('/api/alerts/blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlacklistEntry),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur ajout liste noire');

      setBlacklistedHashes([data.record, ...blacklistedHashes]);
      setIsAddBlacklistModalOpen(false);
      setNewBlacklistEntry({
        sha256: '',
        reason: '',
        studentName: '',
        institution: '',
        degreeTitle: '',
        threatLevel: 'ELEVE',
      });
      setActionSuccessMessage('Empreinte de document falsifié inscrite au Registre National des Fraudes.');
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  const handleGenerateJudicialPV = (hashRecord: any) => {
    const pv = {
      numeroPV: `PV-REQ-${Date.now().toString(36).toUpperCase()}`,
      dateEmission: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      instructeur: user?.fullName || 'Dr. Paulin EKANGA',
      qualiteInstructeur: user?.role === 'ADMIN' ? 'Administrateur National du Registre Académique' : 'Analyste Médico-Légal',
      destinataire: 'Monsieur le Procureur de la République près le Tribunal de Première Instance de Yaoundé - Centre Administratif',
      sha256: hashRecord.sha256,
      motifFraude: hashRecord.reason,
      tentativesDetectees: hashRecord.totalSubmissionAttempts,
      nomSuspect: hashRecord.originalStudentName || 'Inconnu',
      etablissementVise: hashRecord.originalInstitution || 'Non renseigné',
      titreDocument: hashRecord.originalDocumentTitle || 'Diplôme Falsifié',
      niveauGravite: hashRecord.threatLevel || 'ELEVE',
      articlesCodePenal: 'Art. 441-1 à 441-7 du Code Pénal (Faux et usage de faux en écriture publique)',
    };
    setPvTransmissionData(pv);
  };

  // ----------------------------------------------------
  // HANDLERS FOR SYSTEM CONFIG
  // ----------------------------------------------------
  const handleSaveSystemConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(systemConfig),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur sauvegarde configuration');

      setActionSuccessMessage('Paramètres système et seuils IA enregistrés avec succès.');
      loadAdminData();
    } catch (err: any) {
      setActionErrorMessage(err.message);
    }
  };

  // Filtered lists
  const filteredInstitutions = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(institutionSearch.toLowerCase()) ||
      i.code.toLowerCase().includes(institutionSearch.toLowerCase()) ||
      i.country.toLowerCase().includes(institutionSearch.toLowerCase())
  );

  const filteredOperators = operators.filter((u) => {
    const matchesSearch =
      (u.fullName || '').toLowerCase().includes(operatorSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(operatorSearch.toLowerCase()) ||
      (u.department || '').toLowerCase().includes(operatorSearch.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(operatorSearch.toLowerCase()) ||
      (u.createdByName || '').toLowerCase().includes(operatorSearch.toLowerCase());

    const matchesStatus =
      operatorStatusFilter === 'ALL' ||
      (u.status || 'ACTIVE') === operatorStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingOperatorsCount = operators.filter((u) => u.status === 'PENDING').length;
  const activeOperatorsCount = operators.filter((u) => (u.status || 'ACTIVE') === 'ACTIVE').length;
  const suspendedOperatorsCount = operators.filter((u) => u.status === 'SUSPENDED').length;

  const filteredRegistry = registry.filter((d) => {
    const matchesSearch =
      d.studentName.toLowerCase().includes(registrySearch.toLowerCase()) ||
      d.documentId.toLowerCase().includes(registrySearch.toLowerCase()) ||
      d.degreeTitle.toLowerCase().includes(registrySearch.toLowerCase());
    const matchesInst =
      selectedInstitutionFilter === 'ALL' ||
      d.institution.toLowerCase().includes(selectedInstitutionFilter.toLowerCase());
    return matchesSearch && matchesInst;
  });

  const filteredLogs = auditLogs.filter((l) => {
    if (logFilterSeverity === 'ALL') return true;
    return l.severity === logFilterSeverity;
  });

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white border border-rose-200 rounded-xl shadow-md text-center space-y-4">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-lg border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Accès Réservé à l'Administration Centrale</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-950">
          Console d'Administration Verrouillée
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Votre compte est accrédité en tant que <strong>{user.fullName}</strong> ({user.roleLabel || user.role}).
          Cette console est strictement réservée aux Administrateurs Centraux de la plateforme d'État.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-900 border border-amber-500/20">
                <Shield className="h-3.5 w-3.5 text-amber-700" />
                CONSOLE D'ADMINISTRATION CENTRALE
              </span>
              <span className="text-xs text-slate-500 font-mono">
                v2.6.0-PROD • MINISTÈRE & RECTORATS
              </span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Supervision Nationale & Gestion des Établissements Partenaires
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Contrôle d'accès des universités (IAI-Cameroun, Université de Yaoundé I, ENSPY, OBC), registres certifiés, gestion RBAC et réquisitions judiciaires.
            </p>
          </div>

          {/* User Session Info */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-lg shrink-0">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-900 flex items-center gap-1 justify-end">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {user?.fullName || 'Dr. Paulin EKANGA'}
              </div>
              <div className="text-[10px] text-slate-500">
                Rôle : <span className="font-bold text-slate-700">{user?.role || 'ADMIN'}</span>
              </div>
            </div>
            <div className="border-l border-slate-200 pl-2">
              <button
                type="button"
                onClick={() => loadAdminData()}
                className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        {actionSuccessMessage && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
            >
              Fermer
            </button>
          </div>
        )}

        {actionErrorMessage && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{actionErrorMessage}</span>
            </div>
            <button
              onClick={() => setActionErrorMessage(null)}
              className="text-rose-700 hover:text-rose-900 font-semibold text-xs"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Navigation Sub-Tabs */}
        <div className="mt-5 flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-1 text-xs">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'overview'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Vue d'Ensemble</span>
          </button>

          <button
            onClick={() => setActiveSubTab('institutions')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'institutions'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Établissements & Universités</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-800">
              {institutions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('operators')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'operators'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Opérateurs & Rôles (RBAC)</span>
            {pendingOperatorsCount > 0 ? (
              <span className="rounded-full bg-amber-500 text-white font-bold px-1.5 py-0.2 text-[10px] animate-pulse">
                {pendingOperatorsCount} à valider
              </span>
            ) : (
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-800">
                {operators.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('registry')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'registry'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Registre & Promotions (Lots)</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-800">
              {registry.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('blacklist')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'blacklist'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertOctagon className="h-4 w-4" />
            <span>Liste Noire & Parquet</span>
            <span className="rounded-full bg-rose-100 px-1.5 py-0.2 text-[10px] text-rose-800 font-bold">
              {blacklistedHashes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('config')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'config'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Paramètres Moteur IA</span>
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === 'logs'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Journal d'Audit</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-800">
              {auditLogs.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: OVERVIEW DASHBOARD */}
      {/* ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Établissements Accrédités</span>
                <Building2 className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {overviewStats?.totalInstitutions || institutions.length}
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                100% universités sous tutelle vérifiée
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Parchemins au Registre</span>
                <Database className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {overviewStats?.totalDiplomas || registry.length}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {overviewStats?.revokedDiplomas || 0} diplômes révoqués / sanctions
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Hashes Falsifiés Fichés</span>
                <AlertOctagon className="h-4 w-4 text-rose-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-rose-600">
                {overviewStats?.falsifiedHashesCount || blacklistedHashes.length}
              </div>
              <div className="mt-1 text-[11px] text-rose-600 font-medium">
                Liste noire nationale active
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Opérateurs Habilités</span>
                <Users className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {overviewStats?.totalUsers || operators.length}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Rôles RBAC : Admin, Scolarité, Police
              </div>
            </div>
          </div>

          {/* Systems Health & Engine Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Server className="h-4 w-4 text-slate-600" />
                Disponibilité & Santé des Moteurs d'Analyse
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Moteur Vision Multimodale Gemini</div>
                      <div className="text-[11px] text-slate-500">Analyse médico-légale des pixels et détection d'altération</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {overviewStats?.geminiVisionStatus || 'ONLINE'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Moteur OCR Haute Précision (Tesseract v5)</div>
                      <div className="text-[11px] text-slate-500">Extraction textuelle bilingue Français & Anglais</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {overviewStats?.ocrEngineStatus || 'ONLINE (Tesseract v5)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Serveur d'Alertes Temps Réel (WebSocket)</div>
                      <div className="text-[11px] text-slate-500">Propagation instantanée des tentatives de récidive aux postes d'audit</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    ACTIF ({overviewStats?.websocketConnections || 1} client)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Cloisonnement Partenaire Multi-Universités</div>
                      <div className="text-[11px] text-slate-500">Partitionnement strict : IAI-Cameroun, Université de Yaoundé I, ENSPY, OBC</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">
                    ISOLATION STRICTE
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-600" />
                  Opérations Administratives Rapides
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setActiveSubTab('institutions');
                      setIsAddInstitutionModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 hover:bg-slate-50 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      Accréditer un établissement
                    </span>
                    <Plus className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab('registry');
                      setIsBatchModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 hover:bg-slate-50 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-slate-500" />
                      Importer promotion diplômés (Lot)
                    </span>
                    <Upload className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab('operators');
                      setIsAddOperatorModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 hover:bg-slate-50 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      Créer un compte opérateur
                    </span>
                    <Plus className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab('blacklist');
                      setIsAddBlacklistModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 text-xs font-medium text-rose-800 hover:bg-rose-100/50 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <AlertOctagon className="h-4 w-4 text-rose-600" />
                      Blacklister un hash contrefait
                    </span>
                    <Plus className="h-3.5 w-3.5 text-rose-500" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Seuil de certification actuel : <span className="font-bold text-slate-800">{systemConfig.minConfidenceThreshold}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: INSTITUTIONS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'institutions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Répertoire des Établissements & Universités Accrédités
              </h3>
              <p className="text-xs text-slate-500">
                Chaque établissement dispose d'un compartiment de registre dédié, de modèles de sceaux et de signataires autorisés.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher école, code, pays..."
                  value={institutionSearch}
                  onChange={(e) => setInstitutionSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 w-52 sm:w-64"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAddInstitutionModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Accréditer Établissement</span>
              </button>
            </div>
          </div>

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstitutions.map((inst) => (
              <div
                key={inst.id}
                className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:border-slate-300 transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                        {inst.code}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">{inst.country}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inst.accreditationStatus === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inst.accreditationStatus}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {inst.name}
                  </h4>

                  <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400">N° Agrément :</span>{' '}
                      <span className="font-mono text-slate-700">{inst.accreditationNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Contact :</span>{' '}
                      <span className="text-slate-700">{inst.contactEmail}</span>
                    </div>
                    {inst.officialSealDescription && (
                      <div>
                        <span className="text-slate-400">Sceau officiel :</span>{' '}
                        <span className="text-slate-700">{inst.officialSealDescription}</span>
                      </div>
                    )}
                  </div>

                  {/* Signatories */}
                  {inst.authorizedSignatories && inst.authorizedSignatories.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Signataires Habilités :
                      </div>
                      <div className="space-y-1">
                        {inst.authorizedSignatories.map((sig, sIdx) => (
                          <div key={sIdx} className="text-[11px] text-slate-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            <span className="font-semibold">{sig.name}</span>
                            <span className="text-slate-500 text-[10px]">({sig.title})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <span className="font-bold text-slate-800">{inst.registeredDiplomasCount || 1}</span> diplômes indexés
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleInstitutionStatus(inst)}
                    className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                      inst.accreditationStatus === 'ACTIVE'
                        ? 'text-rose-700 hover:bg-rose-50'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {inst.accreditationStatus === 'ACTIVE' ? 'Suspendre' : 'Réactiver'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: OPERATORS & ROLES (RBAC) */}
      {/* ========================================================================= */}
      {activeSubTab === 'operators' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Gestion des Opérateurs & Validation des Comptes (RBAC)
                </h3>
                {pendingOperatorsCount > 0 && (
                  <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-2 py-0.5 text-[10px]">
                    {pendingOperatorsCount} en attente
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Validation obligatoire des comptes par l'administrateur et gouvernance hiérarchique : un administrateur ne peut ni modifier ni révoquer son créateur.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher opérateur..."
                  value={operatorSearch}
                  onChange={(e) => setOperatorSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 w-48 sm:w-60"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAddOperatorModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nouvel Opérateur</span>
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
            <button
              type="button"
              onClick={() => setOperatorStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                operatorStatusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tous ({operators.length})
            </button>
            <button
              type="button"
              onClick={() => setOperatorStatusFilter('PENDING')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                operatorStatusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>En attente de validation ({pendingOperatorsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setOperatorStatusFilter('ACTIVE')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                operatorStatusFilter === 'ACTIVE'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Actifs ({activeOperatorsCount})
            </button>
            <button
              type="button"
              onClick={() => setOperatorStatusFilter('SUSPENDED')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                operatorStatusFilter === 'SUSPENDED'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Suspendus ({suspendedOperatorsCount})
            </button>
          </div>

          {pendingOperatorsCount > 0 && operatorStatusFilter !== 'PENDING' && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  <strong>{pendingOperatorsCount} compte(s) en attente de validation.</strong> Conformément aux règles d'accès, un administrateur doit approuver ces profils avant qu'ils ne puissent se connecter.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOperatorStatusFilter('PENDING')}
                className="font-bold underline text-amber-800 hover:text-amber-950 shrink-0 ml-3"
              >
                Afficher les comptes en attente →
              </button>
            </div>
          )}

          {/* Operators Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Opérateur & Badge</th>
                    <th className="p-3">Email & Filiation (Créateur)</th>
                    <th className="p-3">Organisation / Département</th>
                    <th className="p-3">Statut & Habilitation</th>
                    <th className="p-3 text-right">Actions & Gouvernance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredOperators.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        Aucun opérateur ne correspond aux critères de filtre.
                      </td>
                    </tr>
                  ) : (
                    filteredOperators.map((opr) => {
                      const isAdmin = opr.role === 'ADMIN';
                      const isAnalyste = opr.role === 'ANALYSTE';
                      const isMe = user?.id === opr.id;
                      const isMyCreator = user?.createdById === opr.id;
                      const isRootProtected = opr.isRootAdmin && !user?.isRootAdmin;
                      const isProtectedFromMe = !isMe && (isMyCreator || isRootProtected);
                      const isPending = opr.status === 'PENDING';
                      const isSuspended = opr.status === 'SUSPENDED';

                      return (
                        <tr key={opr.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900">{opr.fullName}</span>
                              {opr.isRootAdmin && (
                                <span title="Administrateur Racine (Fondateur)">
                                  <Crown className="h-3.5 w-3.5 text-amber-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">{opr.badgeNumber || 'OPR-SCOL-01'}</div>
                          </td>

                          <td className="p-3">
                            <div className="font-mono text-slate-600 text-[11px]">{opr.email}</div>
                            <div className="mt-1">
                              {opr.isRootAdmin ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200">
                                  <Crown className="h-2.5 w-2.5 text-amber-600" />
                                  Fondateur Racine
                                </span>
                              ) : opr.createdByName ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                  <Shield className="h-2.5 w-2.5 text-slate-500" />
                                  Créé par : {opr.createdByName}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  <Clock className="h-2.5 w-2.5 text-blue-600" />
                                  Auto-inscription
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="font-medium text-slate-800">{opr.organization || 'Ministère'}</div>
                            <div className="text-[10px] text-slate-500">{opr.department}</div>
                          </td>

                          <td className="p-3">
                            <div className="flex flex-col gap-1 items-start">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isAdmin
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : isAnalyste
                                      ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                                  }`}
                                >
                                  {opr.role}
                                </span>

                                {isPending ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                    <Clock className="h-2.5 w-2.5" />
                                    EN ATTENTE
                                  </span>
                                ) : isSuspended ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    <XCircle className="h-2.5 w-2.5" />
                                    SUSPENDU
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                    ACTIF
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="p-3 text-right">
                            {isProtectedFromMe ? (
                              <div className="flex items-center justify-end">
                                <span
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200 cursor-help"
                                  title="Règle hiérarchique stricte : Un administrateur ne peut ni modifier ni révoquer l'administrateur qui a créé son compte."
                                >
                                  <Lock className="h-3 w-3 text-amber-600" />
                                  <span>Protégé (Votre Créateur)</span>
                                </span>
                              </div>
                            ) : isMe ? (
                              <div className="flex items-center justify-end">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                                  <UserCheck className="h-3 w-3 text-blue-600" />
                                  <span>Votre Session</span>
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                {isPending && (
                                  <button
                                    type="button"
                                    onClick={() => handleApproveOperator(opr.id, opr.fullName)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors shadow-xs"
                                    title="Valider l'habilitation et activer ce compte"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Valider le compte</span>
                                  </button>
                                )}

                                <select
                                  value={opr.role}
                                  onChange={(e) => handleChangeOperatorRole(opr.id, e.target.value as UserRole)}
                                  className="text-[11px] rounded border border-slate-200 bg-white px-2 py-1 focus:outline-none"
                                  title="Changer le rôle"
                                >
                                  <option value="ADMIN">ADMIN</option>
                                  <option value="VERIFICATEUR">VERIFICATEUR</option>
                                  <option value="ANALYSTE">ANALYSTE</option>
                                </select>

                                {!isPending && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleOperatorStatus(
                                        opr.id,
                                        opr.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
                                        opr.fullName
                                      )
                                    }
                                    title={opr.status === 'ACTIVE' ? 'Suspendre ce compte' : 'Réactiver ce compte'}
                                    className={`p-1 transition-colors ${
                                      opr.status === 'ACTIVE'
                                        ? 'text-slate-400 hover:text-amber-600'
                                        : 'text-amber-600 hover:text-emerald-600'
                                    }`}
                                  >
                                    {opr.status === 'ACTIVE' ? (
                                      <Lock className="h-3.5 w-3.5" />
                                    ) : (
                                      <Unlock className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteOperator(opr.id, opr.fullName)}
                                  title="Révoquer définitivement le compte"
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: ADVANCED REGISTRY & BATCH IMPORT */}
      {/* ========================================================================= */}
      {activeSubTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Gestion Avancée du Registre Central & Import de Promotions
              </h3>
              <p className="text-xs text-slate-500">
                Permet d'injecter des promotions entières par lot (CSV / JSON) ou d'ordonner la révocation administrative d'un titre frauduleux.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedInstitutionFilter}
                onChange={(e) => setSelectedInstitutionFilter(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">Tous les établissements</option>
                {institutions.map((i) => (
                  <option key={i.id} value={i.name}>
                    {i.code} - {i.name.slice(0, 24)}...
                  </option>
                ))}
              </select>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Matricule, lauréat..."
                  value={registrySearch}
                  onChange={(e) => setRegistrySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 w-36 sm:w-48"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsBatchModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Import par Lot (Promotion)</span>
              </button>
            </div>
          </div>

          {/* Registry Table with Revocation Controls */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Matricule & Référence</th>
                    <th className="p-3">Titulaire / Lauréat</th>
                    <th className="p-3">Établissement Émetteur</th>
                    <th className="p-3">Grade & Mention</th>
                    <th className="p-3">Statut Légal</th>
                    <th className="p-3 text-right">Sanction / Révocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredRegistry.map((dip) => {
                    const isRevoked = dip.isRevoked;
                    return (
                      <tr key={dip.id} className={`hover:bg-slate-50/70 transition-colors ${isRevoked ? 'bg-rose-50/30' : ''}`}>
                        <td className="p-3">
                          <div className="font-mono font-bold text-slate-900">{dip.documentId}</div>
                          <div className="text-[10px] text-slate-400">Collation : {dip.issueDate}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">{dip.studentName}</div>
                          <div className="text-[10px] text-slate-500">{dip.fieldOfStudy}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-800 font-medium">{dip.institution}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-800">{dip.degreeTitle}</div>
                          {dip.honors && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-slate-100 text-[10px] text-slate-700">
                              {dip.honors}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {isRevoked ? (
                            <div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                RÉVOQUÉ / ANNULÉ
                              </span>
                              <div className="text-[10px] text-rose-600 mt-1 max-w-xs truncate" title={dip.revocationReason}>
                                {dip.revocationReason}
                              </div>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              VALIDE & ACCRÉDITÉ
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {!isRevoked ? (
                            <button
                              type="button"
                              onClick={() => {
                                setDiplomaToRevoke(dip);
                                setIsRevokeModalOpen(true);
                              }}
                              className="text-xs font-semibold px-2 py-1 rounded border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                            >
                              Révoquer le titre
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Révocation irrévocable
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: BLACKLIST & JUDICIAL TRANSMISSION */}
      {/* ========================================================================= */}
      {activeSubTab === 'blacklist' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Fichier National des Faux Diplômes & Signalement Parquet
              </h3>
              <p className="text-xs text-slate-500">
                Base nationale des empreintes SHA-256 compromises. Tout téléversement récidiviste déclenche une alerte judiciaire immédiate.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddBlacklistModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Inscrire Empreinte Compromise</span>
            </button>
          </div>

          {/* Blacklisted Hashes Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Empreinte SHA-256</th>
                    <th className="p-3">Motif d'Inscription</th>
                    <th className="p-3">Document / Titulaire Suspect</th>
                    <th className="p-3">Niveau & Tentatives</th>
                    <th className="p-3 text-right">Réquisition / Parquet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {blacklistedHashes.map((rec) => (
                    <tr key={rec.sha256} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <div className="font-mono text-[11px] font-bold text-slate-900">
                          {rec.sha256.slice(0, 16)}...{rec.sha256.slice(-8)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Fiché le {new Date(rec.flaggedDate).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-800 font-medium max-w-sm">{rec.reason}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Source : {rec.detectionSource}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{rec.originalStudentName || 'Non identifié'}</div>
                        <div className="text-[10px] text-slate-500">{rec.originalInstitution}</div>
                        <div className="text-[10px] text-slate-500 italic">{rec.originalDocumentTitle}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.threatLevel === 'MAXIMAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.threatLevel}
                        </span>
                        <div className="text-[11px] text-slate-600 font-bold mt-1">
                          {rec.totalSubmissionAttempts} tentatives
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleGenerateJudicialPV(rec)}
                          className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors ml-auto"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-600" />
                          <span>Générer PV Parquet</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 6: SYSTEM ENGINE CONFIGURATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'config' && (
        <div className="max-w-3xl mx-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Settings className="h-5 w-5 text-slate-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Paramétrage Moteur d'Analyse & Règles de Certification
              </h3>
              <p className="text-xs text-slate-500">
                Ajustez les seuils mathématiques de conformité, l'activation des filtres stricts et la politique de notification.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSystemConfig} className="space-y-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Seuil Minimal de Confiance pour Verdict "AUTHENTIQUE" ({systemConfig.minConfidenceThreshold}%)
              </label>
              <input
                type="range"
                min="70"
                max="98"
                step="1"
                value={systemConfig.minConfidenceThreshold}
                onChange={(e) =>
                  setSystemConfig({ ...systemConfig, minConfidenceThreshold: parseInt(e.target.value) })
                }
                className="w-full accent-slate-900"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>70% (Souple)</span>
                <span className="font-bold text-slate-900">Actuel : {systemConfig.minConfidenceThreshold}%</span>
                <span>98% (Exigence Maximale)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemConfig.strictAcademicFilter}
                  onChange={(e) =>
                    setSystemConfig({ ...systemConfig, strictAcademicFilter: e.target.checked })
                  }
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    Filtre Strict d'Exclusion des Documents Non-Académiques
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Rejette automatiquement avec verdict NON_CONFORME immédiat les certificats médicaux, cartes grises, factures et photos de véhicules.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemConfig.autoBlacklistFalsified}
                  onChange={(e) =>
                    setSystemConfig({ ...systemConfig, autoBlacklistFalsified: e.target.checked })
                  }
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    Blacklistage Automatique des Empreintes Falsifiées
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Inscrit immédiatement le SHA-256 dans le fichier national des faux diplômes dès qu'une altération flagrante est constatée.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemConfig.autoNotifyRectorat}
                  onChange={(e) =>
                    setSystemConfig({ ...systemConfig, autoNotifyRectorat: e.target.checked })
                  }
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    Notification Immédiate des Rectorats & Universités Voisines
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Émet une alerte automatique par webhook vers le service scolarité de l'établissement dès qu'un faux titre à son nom est intercepté.
                  </div>
                </div>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block font-semibold text-slate-800 mb-1">
                Sensibilité de l'Analyse Médico-Légale des Polices Typographiques
              </label>
              <select
                value={systemConfig.forensicFontSensitivity}
                onChange={(e) =>
                  setSystemConfig({
                    ...systemConfig,
                    forensicFontSensitivity: e.target.value as any,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="BASSE">Basse (Tolérance aux numérisations basse résolution)</option>
                <option value="NORMALE">Normale (Standard recommandé pour parchemins d'État)</option>
                <option value="ELEVEE">Élevée (Détection microscopique des ruptures de crénage)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Sauvegarder les Paramètres Système
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 7: IMMUTABLE AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Journal d'Audit Système & Traçabilité Immuable
              </h3>
              <p className="text-xs text-slate-500">
                Registre chronologique complet de toutes les actions administratives, révocations et accès certifiés.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logFilterSeverity}
                onChange={(e) => setLogFilterSeverity(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">Toutes les gravités</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">AVERTISSEMENT</option>
                <option value="CRITICAL">CRITIQUE</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 text-xs">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-3.5 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                          log.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.severity}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
                      <span className="font-semibold text-slate-900">{log.action}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">{log.target}</span>
                    </div>
                    <div className="text-slate-700 text-[11px] leading-relaxed">
                      {log.details}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Par <span className="font-semibold text-slate-600">{log.actor}</span> ({log.actorRole}) • IP : {log.ipAddress}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 whitespace-nowrap font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD ACCREDITED INSTITUTION */}
      {/* ========================================================================= */}
      {isAddInstitutionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-700" />
                Accréditer un Nouvel Établissement Partenaire
              </h3>
              <button
                type="button"
                onClick={() => setIsAddInstitutionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInstitution} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code / Sigle *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: IAI-CMR, UY1, EPFL..."
                    value={newInstitution.code}
                    onChange={(e) => setNewInstitution({ ...newInstitution, code: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pays / Région *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cameroun, France, Suisse..."
                    value={newInstitution.country}
                    onChange={(e) => setNewInstitution({ ...newInstitution, country: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom Officiel Complet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Institut Africain d'Informatique (IAI-Cameroun)"
                  value={newInstitution.name}
                  onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Numéro d'Agrément / Décret MINESUP *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: MINESUP/DAUQ/SDR/2001/08"
                  value={newInstitution.accreditationNumber}
                  onChange={(e) => setNewInstitution({ ...newInstitution, accreditationNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Scolarité Centrale</label>
                  <input
                    type="email"
                    placeholder="scolarite@etablissement.org"
                    value={newInstitution.contactEmail}
                    onChange={(e) => setNewInstitution({ ...newInstitution, contactEmail: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site Web Officiel</label>
                  <input
                    type="url"
                    placeholder="https://www.iai-cameroun.org"
                    value={newInstitution.officialRectoratUrl}
                    onChange={(e) => setNewInstitution({ ...newInstitution, officialRectoratUrl: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom Signataire Habilité</label>
                  <input
                    type="text"
                    placeholder="Ex: Armand Claude ABANDA"
                    value={newInstitution.signatoryName}
                    onChange={(e) => setNewInstitution({ ...newInstitution, signatoryName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Titre du Signataire</label>
                  <input
                    type="text"
                    placeholder="Représentant Résident..."
                    value={newInstitution.signatoryTitle}
                    onChange={(e) => setNewInstitution({ ...newInstitution, signatoryTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description du Sceau Officiel de l'École</label>
                <input
                  type="text"
                  placeholder="Sceau gaufré bicolore avec armoiries..."
                  value={newInstitution.officialSealDescription}
                  onChange={(e) => setNewInstitution({ ...newInstitution, officialSealDescription: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddInstitutionModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-1.5 font-semibold text-white hover:bg-slate-800"
                >
                  Confirmer l'Accréditation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD OPERATOR (RBAC) */}
      {/* ========================================================================= */}
      {isAddOperatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-700" />
                Créer un Compte Opérateur Habilité
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOperatorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOperator} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom & Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pr. Daniel Ondoa"
                  value={newOperator.fullName}
                  onChange={(e) => setNewOperator({ ...newOperator, fullName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Professionnel *</label>
                <input
                  type="email"
                  required
                  placeholder="d.ondoa@minesup.gov.cm"
                  value={newOperator.email}
                  onChange={(e) => setNewOperator({ ...newOperator, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mot de Passe Sécurisé *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newOperator.password}
                  onChange={(e) => setNewOperator({ ...newOperator, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rôle Dévolu *</label>
                  <select
                    value={newOperator.role}
                    onChange={(e) => setNewOperator({ ...newOperator, role: e.target.value as UserRole })}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:ring-1 focus:ring-slate-900 font-semibold"
                  >
                    <option value="VERIFICATEUR">Vérificateur (Scolarité)</option>
                    <option value="ANALYSTE">Analyste (Enquête / Police)</option>
                    <option value="ADMIN">Administrateur Central</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">N° de Matricule / Badge</label>
                  <input
                    type="text"
                    placeholder="OPR-IAI-410"
                    value={newOperator.badgeNumber}
                    onChange={(e) => setNewOperator({ ...newOperator, badgeNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organisation / Université</label>
                <input
                  type="text"
                  placeholder="IAI-Cameroun / MINESUP"
                  value={newOperator.organization}
                  onChange={(e) => setNewOperator({ ...newOperator, organization: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-800" />
                  <span>Règle de gouvernance & protection hiérarchique</span>
                </div>
                <p className="text-slate-600 leading-normal">
                  Ce compte sera enregistré avec mention de son créateur ({user?.fullName || 'Administrateur'}). S'il s'agit d'un administrateur, celui-ci ne pourra ni modifier ni supprimer votre compte.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOperatorModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-1.5 font-semibold text-white hover:bg-slate-800"
                >
                  Créer l'Opérateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BATCH IMPORT PROMOTIONS (LOT) */}
      {/* ========================================================================= */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-slate-700" />
                Import Massif d'une Promotion de Diplômés
              </h3>
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Établissement Émetteur de la Promotion
                </label>
                <select
                  value={batchInstitution}
                  onChange={(e) => setBatchInstitution(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:ring-1 focus:ring-slate-900"
                >
                  {institutions.map((i) => (
                    <option key={i.id} value={i.name}>
                      {i.name} ({i.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    Données de la Promotion (Tableau JSON d'étudiants)
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSampleBatchJson}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    + Charger Exemple Promotion IAI-Cameroun (3 étudiants)
                  </button>
                </div>
                <textarea
                  rows={9}
                  placeholder={`[\n  {\n    "documentId": "IAI-CMR-2024-ING-0911",\n    "studentName": "Boris Armel TCHINDA",\n    "degreeTitle": "Diplôme d'Ingénieur de Conception en Informatique",\n    "fieldOfStudy": "Génie Logiciel",\n    "issueDate": "2024-07-20",\n    "honors": "Mention Très Bien"\n  }\n]`}
                  value={batchRawData}
                  onChange={(e) => setBatchRawData(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 font-mono text-xs focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                <span className="font-bold">Remarque :</span> Les matricules importés seront automatiquement indexés dans le compartiment exclusif de l'établissement sélectionné pour les futures comparaisons croisées.
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleExecuteBatchImport}
                  className="rounded-lg bg-slate-900 px-4 py-1.5 font-semibold text-white hover:bg-slate-800"
                >
                  Injecter la Promotion au Registre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: REVOKE DIPLOMA */}
      {/* ========================================================================= */}
      {isRevokeModalOpen && diplomaToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertOctagon className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Ordre de Révocation Administrative de Titre
              </h3>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Vous êtes sur le point de déclarer <span className="font-bold text-rose-700">NUL ET NON AVENU</span> le titre suivant :
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-3 space-y-1">
              <div>
                <span className="text-slate-400">Matricule :</span>{' '}
                <span className="font-mono font-bold text-slate-800">{diplomaToRevoke.documentId}</span>
              </div>
              <div>
                <span className="text-slate-400">Titulaire :</span>{' '}
                <span className="font-bold text-slate-900">{diplomaToRevoke.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400">Établissement :</span> {diplomaToRevoke.institution}
              </div>
              <div>
                <span className="text-slate-400">Titre :</span> {diplomaToRevoke.degreeTitle}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-slate-700 text-xs mb-1">
                Motif Légal & Décision Disciplinaire *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ex: Décision de la Commission Disciplinaire du 12 Septembre 2026 pour fraude aux examens finaux."
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsRevokeModalOpen(false);
                  setDiplomaToRevoke(null);
                }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRevocation}
                className="rounded-lg bg-rose-600 px-4 py-1.5 font-semibold text-white hover:bg-rose-700"
              >
                Signer la Révocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADD BLACKLIST SHA-256 */}
      {/* ========================================================================= */}
      {isAddBlacklistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-rose-600" />
                Inscrire un Faux Diplôme au Fichier National des Fraudes
              </h3>
              <button
                type="button"
                onClick={() => setIsAddBlacklistModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBlacklist} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Empreinte Cryptographique SHA-256 du Fichier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="64 caractères hexadécimaux (ex: e3b0c44298fc1c149afbf4c8...)"
                  value={newBlacklistEntry.sha256}
                  onChange={(e) => setNewBlacklistEntry({ ...newBlacklistEntry, sha256: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 font-mono text-xs focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Motif de la Contrefaçon / Fraude Détectée *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Rupture typographique flagrante, nom de l'étudiant altéré sur calque numérique..."
                  value={newBlacklistEntry.reason}
                  onChange={(e) => setNewBlacklistEntry({ ...newBlacklistEntry, reason: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom du Titulaire Usurpé</label>
                  <input
                    type="text"
                    placeholder="Ex: Alain BIKOI"
                    value={newBlacklistEntry.studentName}
                    onChange={(e) => setNewBlacklistEntry({ ...newBlacklistEntry, studentName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Établissement Visé</label>
                  <input
                    type="text"
                    placeholder="Ex: Université de Yaoundé I"
                    value={newBlacklistEntry.institution}
                    onChange={(e) => setNewBlacklistEntry({ ...newBlacklistEntry, institution: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBlacklistModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-1.5 font-semibold text-white hover:bg-rose-700"
                >
                  Inscrire à la Liste Noire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: JUDICIAL TRANSMISSION PV (PROCES-VERBAL PARQUET) */}
      {/* ========================================================================= */}
      {pvTransmissionData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-900" />
                <h3 className="text-sm font-bold text-slate-900">
                  Procès-Verbal Officiel de Constat de Fraude & Transmission Judiciaire
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPvTransmissionData(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs font-serif leading-relaxed text-slate-800">
              <div className="text-center pb-3 border-b border-slate-200 font-sans">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  RÉPUBLIQUE • MINISTÈRE DE LA JUSTICE & ENSEIGNEMENT SUPÉRIEUR
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Plateforme Nationale d'Authentification Documentaire (VD)
                </div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-2">
                  Dossier Référence : {pvTransmissionData.numeroPV}
                </div>
              </div>

              <div>
                <span className="font-bold font-sans text-slate-900">DATE ET HEURE DU CONSTAT :</span>{' '}
                {pvTransmissionData.dateEmission}
              </div>

              <div>
                <span className="font-bold font-sans text-slate-900">AGENT INSTRUCTEUR :</span>{' '}
                {pvTransmissionData.instructeur}, {pvTransmissionData.qualiteInstructeur}.
              </div>

              <div>
                <span className="font-bold font-sans text-slate-900">DESTINATAIRE LÉGAL :</span>{' '}
                {pvTransmissionData.destinataire}.
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded font-sans text-xs space-y-1">
                <div className="font-bold text-slate-900">ÉLÉMENTS MATÉRIELS DU DÉLIT CONSTATÉ :</div>
                <div><span className="text-slate-500">Document incriminé :</span> {pvTransmissionData.titreDocument}</div>
                <div><span className="text-slate-500">Nom apposé sur le faux :</span> {pvTransmissionData.nomSuspect}</div>
                <div><span className="text-slate-500">Établissement usurpé :</span> {pvTransmissionData.etablissementVise}</div>
                <div className="break-all font-mono text-[10px] text-slate-700">
                  <span className="text-slate-500 font-sans">Empreinte SHA-256 :</span> {pvTransmissionData.sha256}
                </div>
                <div><span className="text-slate-500">Tentatives de récidive :</span> {pvTransmissionData.tentativesDetectees}</div>
                <div><span className="text-slate-500">Constat médico-légal :</span> {pvTransmissionData.motifFraude}</div>
              </div>

              <div>
                <span className="font-bold font-sans text-slate-900">QUALIFICATION PÉNALE :</span>{' '}
                {pvTransmissionData.articlesCodePenal}.
              </div>

              <div className="text-[11px] text-slate-600 italic">
                « Le présent procès-verbal a été dressé pour servir et valoir ce que de droit, et transmis aux autorités judiciaires compétentes conformément aux obligations de signalement des crimes et délits constatés. »
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5 text-slate-600" />
                <span>Imprimer / Exporter PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setPvTransmissionData(null)}
                className="rounded-lg bg-slate-900 px-4 py-1.5 font-semibold text-white hover:bg-slate-800"
              >
                Fermer le Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

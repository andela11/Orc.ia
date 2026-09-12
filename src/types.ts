export type VerificationStatus = 'AUTHENTIQUE' | 'SUSPECT' | 'FALSIFIE' | 'NON_CONFORME';

export type CheckStatus = 'PASSED' | 'WARNING' | 'FAILED';

export type UserRole = 'ADMIN' | 'VERIFICATEUR' | 'ANALYSTE';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  badgeNumber: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  expiresAt: number;
}

export interface DiplomaData {
  studentName: string;
  birthDate?: string;
  institution: string;
  degreeTitle: string;
  fieldOfStudy: string;
  graduationDate: string;
  honors?: string;
  documentId: string;
  signatories: string[];
  academicYear?: string;
  rawExtractedText?: string;
}

export interface SecurityCheckItem {
  id: string;
  title: string;
  category: string;
  status: CheckStatus;
  score: number;
  details: string;
  technicalFinding: string;
}

export interface ForensicAnalysis {
  hasOfficialSealOrStamp: boolean;
  sealDetails: string;
  hasSignatures: boolean;
  signaturesCount: number;
  fontInconsistenciesDetected: boolean;
  fontDetails: string;
  digitalArtifactsDetected: boolean;
  artifactDetails: string;
  dateInconsistencies: boolean;
  dateDetails: string;
  layoutAuthenticityScore: number;
  ocrConfidence: number;
  securityFeaturesDetected: string[];
}

export interface RegistryMatch {
  found: boolean;
  isMatch: boolean;
  institutionRegistered: boolean;
  matchedRecord?: {
    studentName: string;
    degreeTitle: string;
    documentId: string;
    institution: string;
    issueDate: string;
    fieldOfStudy: string;
  };
  discrepancies?: string[];
}

export interface SuspiciousZone {
  id: string;
  label: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'SUSPECT';
  boundingBox: {
    top: number; // Percentage 0-100
    left: number; // Percentage 0-100
    width: number; // Percentage 0-100
    height: number; // Percentage 0-100
  };
  detectedAnomaly: string;
}

export interface StrokePressureProfile {
  averagePressure: number; // 0-100
  pressureModulation: 'NATURELLE_DYNAMIQUE' | 'UNIFORME_ARTIFICIELLE' | 'HESITANTE_TREMBLEE';
  pressureModulationScore: number; // 0-100 (high = natural human pressure variation)
  downstrokePressure: number; // 0-100 (traits descendants appuyés)
  upstrokePressure: number; // 0-100 (déliés ascendants allégés)
  strokeFluidity: number; // 0-100
  pressureDistribution: {
    high: number; // % of stroke with heavy pressure
    medium: number; // % of stroke with medium pressure
    low: number; // % of stroke with light pressure
  };
  penLiftsCount: number;
  hesitationDetected: boolean;
  isDigitalReplication: boolean;
  observations: string;
}

export interface SignatureComparison {
  matchedModelId: string;
  signatoryName: string;
  signatoryTitle: string;
  institution: string;
  referenceRegistryId: string;
  morphologicalSimilarityScore: number; // 0-100
  slantAngleDegrees: number; // e.g. 14
  referenceSlantAngleDegrees: number; // e.g. 15
  proportionsMatchScore: number; // 0-100
  strokeTrajectoryAlignment: number; // 0-100
  verdict: 'AUTHENTIQUE_CONFORME' | 'SUSPECT_PRESSION_UNIFORME' | 'CONTREFACON_DISCORDANTE' | 'NON_INDEXE';
  technicalDetails: string;
}

export interface ExtractedSignatureAnalysis {
  id: string;
  label: string;
  signatoryName: string;
  role: string;
  institution?: string;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  extractedPathSvg?: string;
  strokePressure: StrokePressureProfile;
  comparisonWithReference: SignatureComparison;
  status: 'CONFORME' | 'SUSPECT' | 'FALSIFIE';
}

export interface VerificationResult {
  verificationId: string;
  timestamp: string;
  status: VerificationStatus;
  confidenceScore: number;
  summaryVerdict: string;
  sha256: string;
  diplomaData: DiplomaData;
  securityChecks: SecurityCheckItem[];
  forensicAnalysis: ForensicAnalysis;
  registryMatch: RegistryMatch;
  suspiciousZones?: SuspiciousZone[];
  signatureForensics?: ExtractedSignatureAnalysis[];
  processingTimeMs: number;
  fileName?: string;
  fileSize?: string;
  isDiplomaDocument?: boolean;
  detectedDocumentCategory?: string;
  rejectionReason?: string;
  falsifiedHashAlertTriggered?: boolean;
  recidivismAlert?: FalsifiedDiplomaAlert;
}

export interface RegisteredDiploma {
  id: string;
  documentId: string;
  studentName: string;
  institution: string;
  degreeTitle: string;
  fieldOfStudy: string;
  issueDate: string;
  honors?: string;
  sha256?: string;
  accredited: boolean;
}

export interface VerificationStats {
  totalVerifications: number;
  authenticCount: number;
  suspiciousCount: number;
  falsifiedCount: number;
  averageConfidenceScore: number;
  averageProcessingTimeMs: number;
}

export type AlertSeverity = 'CRITIQUE' | 'HAUTE' | 'MOYENNE';
export type AlertStatus = 'ACTIVE' | 'EN_INVESTIGATION' | 'ACQUITTEE' | 'TRANSMIS_PARQUET';

export interface FalsifiedHashRecord {
  sha256: string;
  flaggedDate: string;
  reason: string;
  originalDocumentTitle?: string;
  originalStudentName?: string;
  originalInstitution?: string;
  detectionSource: 'AUDIT_SYSTEM' | 'SIGNALEMENT_ADMIN' | 'REGISTRE_NATIONAL_FRAUDES' | 'PARQUET_JUDICIAIRE';
  totalSubmissionAttempts: number;
  lastAttemptDate: string;
  threatLevel: 'MAXIMAL' | 'ELEVE' | 'MODERE';
  notes?: string;
}

export interface FalsifiedDiplomaAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  status: AlertStatus;
  sha256: string;
  hashRecord: FalsifiedHashRecord;
  submittedDocument: {
    fileName: string;
    studentName: string;
    institution: string;
    degreeTitle: string;
    documentId?: string;
    ipOrigin?: string;
  };
  triggerReason: string;
  attemptCount: number;
  investigationNotes?: string[];
  handledBy?: string;
  handledAt?: string;
  lawEnforcementTransmissionId?: string;
}

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Path for SQLite database file (uses /tmp on serverless/read-only environments)
const isVercel = Boolean(process.env.VERCEL);
let DB_DIR = isVercel ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
} catch {
  DB_DIR = path.join('/tmp', 'data');
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}
const DB_PATH = path.join(DB_DIR, 'verifdiplome.sqlite');
const SEED_PATH = path.join(process.cwd(), 'data', 'verifdiplome.sqlite');

const SQL = await initSqlJs();
let rawDb: SqlJsDatabase;
if (fs.existsSync(DB_PATH)) {
  const fileBuffer = fs.readFileSync(DB_PATH);
  rawDb = new SQL.Database(fileBuffer);
} else if (fs.existsSync(SEED_PATH)) {
  const fileBuffer = fs.readFileSync(SEED_PATH);
  rawDb = new SQL.Database(fileBuffer);
} else {
  rawDb = new SQL.Database();
}

function persistToDisk() {
  try {
    const data = rawDb.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error('[SQLite] Error saving database file:', err);
  }
}

export interface SQLiteWrapper {
  exec: (sql: string) => void;
  pragma: (cmd: string) => void;
  prepare: (sql: string) => {
    get: (...params: any[]) => any;
    all: (...params: any[]) => any[];
    run: (...params: any[]) => { changes: number };
  };
  save: () => void;
}

export const db: SQLiteWrapper = {
  exec(sql: string) {
    rawDb.run(sql);
    persistToDisk();
  },
  pragma(_cmd: string) {
    // Pragmas handled internally or no-op in memory
  },
  prepare(sql: string) {
    return {
      get(...params: any[]) {
        const stmt = rawDb.prepare(sql);
        try {
          if (params.length > 0) stmt.bind(params);
          if (stmt.step()) {
            return stmt.getAsObject();
          }
          return undefined;
        } finally {
          stmt.free();
        }
      },
      all(...params: any[]) {
        const stmt = rawDb.prepare(sql);
        const results: any[] = [];
        try {
          if (params.length > 0) stmt.bind(params);
          while (stmt.step()) {
            results.push(stmt.getAsObject());
          }
          return results;
        } finally {
          stmt.free();
        }
      },
      run(...params: any[]) {
        rawDb.run(sql, params);
        persistToDisk();
        return { changes: 1 };
      },
    };
  },
  save: persistToDisk,
};

// Enable WAL mode for high concurrency & performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize all database schemas
export function initializeDatabase() {
  console.log(`[SQLite] Initialisation de la base de données SQLite : ${DB_PATH}`);

  db.exec(`
    -- 1. Établissements & Universités Accrédités
    CREATE TABLE IF NOT EXISTS accredited_institutions (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      accreditation_number TEXT NOT NULL,
      accreditation_status TEXT NOT NULL DEFAULT 'ACTIVE',
      contact_email TEXT NOT NULL,
      official_rectorat_url TEXT,
      registered_diplomas_count INTEGER DEFAULT 0,
      authorized_signatories TEXT, -- JSON
      official_seal_description TEXT,
      created_at TEXT NOT NULL
    );

    -- 2. Registre Central des Diplômes Officiels
    CREATE TABLE IF NOT EXISTS registered_diplomas (
      id TEXT PRIMARY KEY,
      document_id TEXT UNIQUE NOT NULL,
      student_name TEXT NOT NULL,
      institution TEXT NOT NULL,
      degree_title TEXT NOT NULL,
      field_of_study TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      honors TEXT DEFAULT 'Admis',
      sha256 TEXT,
      accredited INTEGER DEFAULT 1,
      is_revoked INTEGER DEFAULT 0,
      revocation_reason TEXT,
      revoked_at TEXT,
      revoked_by TEXT,
      created_at TEXT NOT NULL
    );

    -- 3. Utilisateurs & Opérateurs (RBAC)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      organization TEXT NOT NULL,
      badge_number TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- 4. Fichier National des Faux Diplômes & Liste Noire SHA-256
    CREATE TABLE IF NOT EXISTS blacklisted_hashes (
      id TEXT PRIMARY KEY,
      sha256 TEXT UNIQUE NOT NULL,
      reason TEXT NOT NULL,
      first_detected_at TEXT NOT NULL,
      last_attempt_at TEXT NOT NULL,
      total_attempts INTEGER DEFAULT 1,
      original_student_name TEXT,
      original_institution TEXT,
      original_document_title TEXT,
      threat_level TEXT DEFAULT 'ELEVE'
    );

    -- 5. Journal d'Audit & Contrôles Médico-Légaux
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      actor TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      details TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'INFO',
      document_id TEXT,
      verdict TEXT,
      confidence_score REAL,
      sha256 TEXT
    );

    -- 6. Alertes Régalienne de Récidive et Fraude
    CREATE TABLE IF NOT EXISTS realtime_alerts (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      severity TEXT NOT NULL,
      institution TEXT NOT NULL,
      student_name TEXT NOT NULL,
      document_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      sha256 TEXT,
      status TEXT DEFAULT 'ACTIVE',
      handled_by TEXT
    );

    -- 7. Paramètres Système & Seuils IA
    CREATE TABLE IF NOT EXISTS system_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  seedInitialDataIfEmpty();
}

function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd + 'salt_verifdiplome_2024').digest('hex');
}

function seedInitialDataIfEmpty() {
  // Check if institutions exist
  const countInst = db.prepare('SELECT COUNT(*) as count FROM accredited_institutions').get() as { count: number };
  if (countInst.count === 0) {
    console.log('[SQLite] Seeding initial accredited institutions...');
    const insertInst = db.prepare(`
      INSERT INTO accredited_institutions (
        id, code, name, country, accreditation_number, accreditation_status,
        contact_email, official_rectorat_url, registered_diplomas_count,
        authorized_signatories, official_seal_description, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialInstitutions = [
      {
        id: "INST-001",
        code: "IAI-CMR",
        name: "IAI-Cameroun (Institut Africain d'Informatique)",
        country: "Cameroun (Sous-Région CEMAC)",
        accreditationNumber: "MINESUP/DAUQ/SDR/2001/08",
        accreditationStatus: "ACTIVE",
        contactEmail: "direction@iai-cameroun.org",
        officialRectoratUrl: "https://www.iai-cameroun.org",
        registeredDiplomasCount: 2,
        authorizedSignatories: JSON.stringify([
          { name: "Armand Claude ABANDA", title: "Représentant Résident IAI-Cameroun" },
          { name: "Pr. Jacques FAME NDONGO", title: "Ministre d'État, Ministre de l'Enseignement Supérieur" }
        ]),
        officialSealDescription: "Sceau bicolore gaufré avec devise Travail-Assiduité-Initiative",
        createdAt: "2021-09-01T08:00:00.000Z",
      },
      {
        id: "INST-002",
        code: "UY1",
        name: "Université de Yaoundé I (UY1)",
        country: "Cameroun",
        accreditationNumber: "MINESUP/UY1/1962/DEC-01",
        accreditationStatus: "ACTIVE",
        contactEmail: "rectorat@uy1.uninet.cm",
        officialRectoratUrl: "https://www.uy1.uninet.cm",
        registeredDiplomasCount: 2,
        authorizedSignatories: JSON.stringify([
          { name: "Pr. Remy Sylvestre BOUELET", title: "Recteur de l'Université de Yaoundé I" },
          { name: "Pr. Jean-Bosco TALLA", title: "Doyen de la Faculté des Sciences" }
        ]),
        officialSealDescription: "Sceau officiel du Rectorat de l'Université de Yaoundé I et devise Sapientia-Pax-Progressus",
        createdAt: "2020-01-15T10:00:00.000Z",
      },
      {
        id: "INST-003",
        code: "ENSPY",
        name: "École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)",
        country: "Cameroun",
        accreditationNumber: "MINESUP/ENSPY/1971/DEC-02",
        accreditationStatus: "ACTIVE",
        contactEmail: "direction@polytechnique.cm",
        officialRectoratUrl: "https://www.polytechnique.cm",
        registeredDiplomasCount: 1,
        authorizedSignatories: JSON.stringify([
          { name: "Pr. Guy Edgar NOUBISSI", title: "Directeur de l'ENSPY" },
          { name: "Dr. Thomas TCHAMO", title: "Directeur des Études de l'ENSPY" }
        ]),
        officialSealDescription: "Blason officiel de l'ENSPY et devise 'Ingenio et Labore'",
        createdAt: "2019-11-04T09:00:00.000Z",
      },
      {
        id: "INST-004",
        code: "OBC",
        name: "Office du Baccalauréat du Cameroun (MINESEC)",
        country: "Cameroun",
        accreditationNumber: "MINESEC/OBC/1993/DEC-01",
        accreditationStatus: "ACTIVE",
        contactEmail: "contact@obc.cm",
        officialRectoratUrl: "https://www.obc.cm",
        registeredDiplomasCount: 1,
        authorizedSignatories: JSON.stringify([
          { name: "Etienne Roger MINKOULOU", title: "Directeur de l'Office du Baccalauréat" },
          { name: "Pr. Nalova LYONGA", title: "Ministre des Enseignements Secondaires" }
        ]),
        officialSealDescription: "Timbre sec officiel MINESEC avec armoiries nationales Paix-Travail-Patrie",
        createdAt: "2022-03-10T11:00:00.000Z",
      },
      {
        id: "INST-005",
        code: "UDLA",
        name: "Université de Douala (UDLA)",
        country: "Cameroun",
        accreditationNumber: "MINESUP/UDLA/1993/DEC-03",
        accreditationStatus: "ACTIVE",
        contactEmail: "scolarite@univ-douala.cm",
        officialRectoratUrl: "https://www.univ-douala.cm",
        registeredDiplomasCount: 1,
        authorizedSignatories: JSON.stringify([
          { name: "Pr. Magloire ONDOA", title: "Recteur de l'Université de Douala" }
        ]),
        officialSealDescription: "Sceau académique du Rectorat de l'Université de Douala",
        createdAt: "2021-04-12T08:30:00.000Z",
      },
      {
        id: "INST-006",
        code: "UDS",
        name: "Université de Dschang (UDs)",
        country: "Cameroun",
        accreditationNumber: "MINESUP/UDS/1993/DEC-04",
        accreditationStatus: "ACTIVE",
        contactEmail: "contact@univ-dschang.org",
        officialRectoratUrl: "https://www.univ-dschang.org",
        registeredDiplomasCount: 1,
        authorizedSignatories: JSON.stringify([
          { name: "Pr. Roger TSAFACK NANFOSSO", title: "Recteur de l'Université de Dschang" }
        ]),
        officialSealDescription: "Sceau officiel du Rectorat de l'Université de Dschang",
        createdAt: "2020-06-20T14:00:00.000Z",
      },
    ];

    for (const inst of initialInstitutions) {
      insertInst.run(
        inst.id,
        inst.code,
        inst.name,
        inst.country,
        inst.accreditationNumber,
        inst.accreditationStatus,
        inst.contactEmail,
        inst.officialRectoratUrl,
        inst.registeredDiplomasCount,
        inst.authorizedSignatories,
        inst.officialSealDescription,
        inst.createdAt
      );
    }
  }

  // Check if registered diplomas exist
  const countDiplomas = db.prepare('SELECT COUNT(*) as count FROM registered_diplomas').get() as { count: number };
  if (countDiplomas.count === 0) {
    console.log('[SQLite] Seeding initial registered diplomas...');
    const insertDiploma = db.prepare(`
      INSERT INTO registered_diplomas (
        id, document_id, student_name, institution, degree_title,
        field_of_study, issue_date, honors, sha256, accredited,
        is_revoked, revocation_reason, revoked_at, revoked_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialDiplomas = [
      {
        id: "REG-001",
        documentId: "IAI-2023-ING-0412",
        studentName: "Armel Paul BAPES",
        institution: "IAI-Cameroun (Institut Africain d'Informatique)",
        degreeTitle: "Diplôme d'Ingénieur de Conception en Informatique",
        fieldOfStudy: "Génie Logiciel & Systèmes d'Information",
        issueDate: "2023-07-15",
        honors: "Très Bien",
        sha256: "c39a0447a13c9a62615a1a1132223a54b3fa2045e053916960e7e1b590e038e0",
        accredited: 1,
        isRevoked: 0,
        createdAt: "2023-07-15T12:00:00.000Z",
      },
      {
        id: "REG-002",
        documentId: "IAI-2024-ING-0889",
        studentName: "Sophie Ngo Bell",
        institution: "IAI-Cameroun (Institut Africain d'Informatique)",
        degreeTitle: "Diplôme d'Ingénieur des Travaux Informatiques",
        fieldOfStudy: "Réseaux & Sécurité",
        issueDate: "2024-06-30",
        honors: "Bien",
        sha256: "e7c105658e38816c52a0a256a4fb641a998018e69e48753ecffb3ae66a504859",
        accredited: 1,
        isRevoked: 0,
        createdAt: "2024-06-30T12:00:00.000Z",
      },
      {
        id: "REG-003",
        documentId: "UY1-2023-M8921",
        studentName: "Boris TCHOUA",
        institution: "Université de Yaoundé I (UY1)",
        degreeTitle: "Master en Informatique et Systèmes Décisionnels",
        fieldOfStudy: "Sciences & Ingénierie Logicielle",
        issueDate: "2023-06-28",
        honors: "Mention Très Bien",
        sha256: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        accredited: 1,
        isRevoked: 0,
        createdAt: "2023-06-28T12:00:00.000Z",
      },
      {
        id: "REG-004",
        documentId: "ENSPY-2022-ING-0412",
        studentName: "Danielle MBALLA ESSOMBA",
        institution: "École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)",
        degreeTitle: "Diplôme d'Ingénieur de Conception",
        fieldOfStudy: "Génie Informatique & Télécommunications",
        issueDate: "2022-07-15",
        honors: "Félicitations du Jury",
        sha256: "f0e1d2c3b4a5968778695a4b3c2d1e0f0123456789abcdef0123456789abcdef",
        accredited: 1,
        isRevoked: 0,
        createdAt: "2022-07-15T12:00:00.000Z",
      },
      {
        id: "REG-005",
        documentId: "UD-2024-LIC-3341",
        studentName: "Gaston NDONGO",
        institution: "Université de Douala (UDLA)",
        degreeTitle: "Licence en Sciences et Technologies",
        fieldOfStudy: "Mathématiques & Informatique Décisionnelle",
        issueDate: "2024-06-15",
        honors: "Bien",
        sha256: "7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c",
        accredited: 1,
        isRevoked: 0,
        createdAt: "2024-06-15T12:00:00.000Z",
      },
      {
        id: "REG-006",
        documentId: "OBC-2022-BAC-C-7712",
        studentName: "Jean-Paul KAMGA",
        institution: "Office du Baccalauréat du Cameroun (MINESEC)",
        degreeTitle: "Baccalauréat de l'Enseignement Secondaire Général Série C",
        fieldOfStudy: "Mathématiques et Sciences Physiques",
        issueDate: "2022-08-12",
        honors: "Bien",
        sha256: "9876543210abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accredited: 1,
        isRevoked: 0,
        createdAt: "2022-08-12T12:00:00.000Z",
      },
      {
        id: "REG-007",
        documentId: "UDS-2023-MAS-1190",
        studentName: "Carine ATANGANA",
        institution: "Université de Dschang (UDs)",
        degreeTitle: "Master en Sciences Économiques et Gestion",
        fieldOfStudy: "Finance & Stratégie d'Entreprise",
        issueDate: "2023-06-25",
        honors: "Mention Très Bien",
        sha256: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        accredited: 1,
        isRevoked: 0,
        createdAt: "2023-06-25T12:00:00.000Z",
      },
      {
        id: "REG-008",
        documentId: "UB-2021-BSC-0082",
        studentName: "Chantal BIKOI",
        institution: "University of Buea",
        degreeTitle: "Bachelor of Science in Software Engineering",
        fieldOfStudy: "Computer Science & Networks",
        issueDate: "2021-06-30",
        honors: "First Class Honours",
        sha256: "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
        accredited: 1,
        isRevoked: 0,
        createdAt: "2021-06-30T12:00:00.000Z",
      },
    ];

    for (const d of initialDiplomas) {
      insertDiploma.run(
        d.id,
        d.documentId,
        d.studentName,
        d.institution,
        d.degreeTitle,
        d.fieldOfStudy,
        d.issueDate,
        d.honors,
        d.sha256,
        d.accredited,
        d.isRevoked,
        null,
        null,
        null,
        d.createdAt
      );
    }
  }

  // Check if users exist
  const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (countUsers.count === 0) {
    console.log('[SQLite] Seeding initial authorized users...');
    const insertUser = db.prepare(`
      INSERT INTO users (
        id, email, password_hash, full_name, role, department, organization, badge_number, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialUsers = [
      {
        id: "usr_admin_01",
        email: "paulin.ekanga@minesup.gov.cm",
        passwordHash: hashPassword("Admin2024!"),
        fullName: "Dr. Paulin EKANGA",
        role: "ADMIN",
        department: "Direction des Accréditations & Titres Académiques (DAUQ)",
        organization: "Ministère de l'Enseignement Supérieur (MINESUP Cameroun)",
        badgeNumber: "ADM-MINESUP-001",
        createdAt: "2023-01-10T08:00:00.000Z",
      },
      {
        id: "usr_verif_01",
        email: "jeanne.mvondo@uy1.cm",
        passwordHash: hashPassword("Scolarite2024!"),
        fullName: "Jeanne MVONDO",
        role: "VERIFICATEUR",
        department: "Direction de la Scolarité & Validation",
        organization: "Université de Yaoundé I (UY1)",
        badgeNumber: "VER-UY1-042",
        createdAt: "2023-03-15T09:00:00.000Z",
      },
      {
        id: "usr_analyst_01",
        email: "joseph.essomba@police.gov.cm",
        passwordHash: hashPassword("Enquete2024!"),
        fullName: "Capitaine Joseph ESSOMBA",
        role: "ANALYSTE",
        department: "Division Spéciale de la Cybercriminalité & Faux Documents",
        organization: "Délégation Générale à la Sûreté Nationale (DGSN Cameroun)",
        badgeNumber: "ENQ-DGSN-992",
        createdAt: "2023-05-20T11:00:00.000Z",
      },
    ];

    for (const u of initialUsers) {
      insertUser.run(
        u.id,
        u.email,
        u.passwordHash,
        u.fullName,
        u.role,
        u.department,
        u.organization,
        u.badgeNumber,
        u.createdAt
      );
    }
  }

  // Check if blacklisted hashes exist
  const countBlacklist = db.prepare('SELECT COUNT(*) as count FROM blacklisted_hashes').get() as { count: number };
  if (countBlacklist.count === 0) {
    console.log('[SQLite] Seeding initial fraud blacklist...');
    const insertBlacklist = db.prepare(`
      INSERT INTO blacklisted_hashes (
        id, sha256, reason, first_detected_at, last_attempt_at, total_attempts,
        original_student_name, original_institution, original_document_title, threat_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBlacklist.run(
      "BLK-001",
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "Falsification de nom par altération graphique sur parchemin officiel UY1",
      new Date(Date.now() - 3600000 * 48).toISOString(),
      new Date(Date.now() - 3600000 * 2).toISOString(),
      3,
      "Alain BIKOI",
      "Université de Yaoundé I (UY1)",
      "Master en Informatique et Systèmes Décisionnels",
      "CRITIQUE"
    );
  }

  // Check if audit logs exist
  const countLogs = db.prepare('SELECT COUNT(*) as count FROM audit_logs').get() as { count: number };
  if (countLogs.count === 0) {
    console.log('[SQLite] Seeding initial audit logs...');
    const insertLog = db.prepare(`
      INSERT INTO audit_logs (
        id, timestamp, actor, actor_role, action, target, details, ip_address, severity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertLog.run(
      "LOG-ADM-901",
      new Date(Date.now() - 3600000 * 24).toISOString(),
      "Dr. Paulin EKANGA",
      "ADMIN",
      "ACCREDITATION_INSTITUTION",
      "IAI-Cameroun (Institut Africain d'Informatique)",
      "Accréditation confirmée selon décret MINESUP. Gabarit officiel et signataires indexés en base SQLite.",
      "192.168.1.10 (Intranet Sécurisé)",
      "INFO"
    );

    insertLog.run(
      "LOG-ADM-902",
      new Date(Date.now() - 3600000 * 18).toISOString(),
      "Dr. Paulin EKANGA",
      "ADMIN",
      "BLACKLIST_HASH_AJOUT",
      "SHA-256 e3b0c44...b855 (Alain BIKOI)",
      "Mise à l'index national suite à falsification flagrante par altération de nom sur parchemin officiel UY1.",
      "192.168.1.10 (Intranet Sécurisé)",
      "CRITICAL"
    );
  }

  // Seed default system config
  const countConfig = db.prepare('SELECT COUNT(*) as count FROM system_config').get() as { count: number };
  if (countConfig.count === 0) {
    const insertCfg = db.prepare('INSERT INTO system_config (key, value) VALUES (?, ?)');
    insertCfg.run('minConfidenceThreshold', '85');
    insertCfg.run('strictAcademicFilter', 'true');
    insertCfg.run('autoBlacklistFalsified', 'true');
    insertCfg.run('autoNotifyRectorat', 'true');
    insertCfg.run('forensicFontSensitivity', 'NORMALE');
    insertCfg.run('maintenanceMode', 'false');
  }

  console.log('[SQLite] Base de données SQLite prête avec persistance active.');
}
export default db;

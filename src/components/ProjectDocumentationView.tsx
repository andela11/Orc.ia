import React, { useState } from 'react';
import { Download, Check, BookOpen, Layers, Users, Activity, FileText } from 'lucide-react';

export const ProjectDocumentationView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'tables' | 'actors' | 'diagrams' | 'tech'>('overview');

  const handleDownloadMarkdown = () => {
    fetch('/PROJET_ANALYSE_ET_CONCEPTION.md')
      .then((res) => res.text())
      .then((text) => {
        const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PROJET_ANALYSE_ET_CONCEPTION.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((err) => console.error('Download error:', err));
  };

  const handleCopySummary = () => {
    const text = `Projet : Système d'Authentification des Diplômes Académiques (IAI-Cameroun)
Ce système vérifie instantanément l'authenticité des diplômes académiques déposés lors des admissions (ex: campus IAI-Cameroun) pour contrer la fraude documentaire et l'usurpation d'identité.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-slate-900" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Spécifications & Conception Logicielle
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Analyse Complète du Projet — Vérification des Diplômes Académiques
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Cadre d'application : Dépôt et contrôle des dossiers d'admission (ex: Campus IAI-Cameroun).
            Authentification exclusive des diplômes d'enseignement supérieur et secondaire.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopySummary}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{copied ? 'Copié' : 'Copier résumé'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger le fichier .md</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSection('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSection === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Présentation & Contexte</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('tables')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSection === 'tables' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Schéma & Tables (Base de données)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('actors')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSection === 'actors' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>3. Acteurs & Rôles</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('diagrams')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSection === 'diagrams' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>4. Scénarios & Diagrammes (Cas, Activité, Séquence, Classes)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('tech')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeSection === 'tech' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>5. Technologies Utilisées</span>
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-base font-semibold text-slate-900">
            1. Présentation brève et claire du projet
          </h3>
          <p>
            Dans le cadre du processus d'admission des étudiants au sein d'établissements d'enseignement supérieur (notamment le campus <strong>IAI-Cameroun</strong>), chaque candidat dépose un dossier composé de ses diplômes académiques antérieurs (Baccalauréat, BTS, Licence, Master, Ingénieur).
          </p>
          <p>
            L'objectif de la plateforme est de <strong>vérifier sans délai et avec une précision forensique</strong> si le diplôme soumis est <strong>authentique</strong> ou <strong>falsifié</strong> :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-1">
              <div className="font-semibold text-slate-900">1. Vérification d'Authenticité</div>
              <p className="text-xs text-slate-600">
                Confrontation du numéro matricule du diplôme avec le registre officiel de l'établissement d'origine pour valider l'identité légitime du titulaire.
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-1">
              <div className="font-semibold text-slate-900">2. Détection des Falsifications</div>
              <p className="text-xs text-slate-600">
                Repérage des altérations typographiques (nom ou mention modifiés), tampons contrefaits, signatures incohérentes ou matricules usurpés.
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-1">
              <div className="font-semibold text-slate-900">3. Blocage Anti-Récidive</div>
              <p className="text-xs text-slate-600">
                Indexation cryptographique par empreinte SHA-256 : tout faux diplôme déjà identifié est immédiatement intercepté dès la moindre tentative de réutilisation.
              </p>
            </div>
          </div>
          <p className="pt-2 text-slate-600">
            <strong>Périmètre strict :</strong> Le système s'applique exclusivement aux <em>diplômes et attestations académiques</em>, excluant tout document médical.
          </p>
        </div>
      )}

      {activeSection === 'tables' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              2. Ressortie de toutes les tables de la base de données
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Modèle relationnel normalisé répondant aux exigences d'un campus universitaire (ex: IAI-Cameroun).
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Table 1 */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-semibold text-slate-900 text-sm">Table : candidats</span>
                <span className="text-slate-500">Personnes physiques déposant un dossier</span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700">
                <div><code className="font-mono font-medium text-slate-900">id</code> (VARCHAR(36), PK)</div>
                <div><code className="font-mono font-medium text-slate-900">nom</code> (VARCHAR(100), NOT NULL)</div>
                <div><code className="font-mono font-medium text-slate-900">prenom</code> (VARCHAR(100), NOT NULL)</div>
                <div><code className="font-mono font-medium text-slate-900">date_naissance</code> (DATE, NOT NULL)</div>
                <div><code className="font-mono font-medium text-slate-900">lieu_naissance</code> (VARCHAR(100))</div>
                <div><code className="font-mono font-medium text-slate-900">nationalite</code> (VARCHAR(50))</div>
                <div><code className="font-mono font-medium text-slate-900">cni_numero</code> (VARCHAR(50), UNIQUE)</div>
                <div><code className="font-mono font-medium text-slate-900">email</code> (VARCHAR(150), UNIQUE)</div>
                <div><code className="font-mono font-medium text-slate-900">telephone</code> (VARCHAR(30))</div>
              </div>
            </div>

            {/* Table 2 */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-semibold text-slate-900 text-sm">Table : dossiers_candidature</span>
                <span className="text-slate-500">Dossiers d'admission déposés au campus</span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700">
                <div><code className="font-mono font-medium text-slate-900">id</code> (VARCHAR(36), PK)</div>
                <div><code className="font-mono font-medium text-slate-900">candidat_id</code> (VARCHAR(36), FK)</div>
                <div><code className="font-mono font-medium text-slate-900">campus</code> (VARCHAR(100), 'IAI-Cameroun')</div>
                <div><code className="font-mono font-medium text-slate-900">cycle_sollicite</code> (VARCHAR(100))</div>
                <div><code className="font-mono font-medium text-slate-900">annee_academique</code> (VARCHAR(9))</div>
                <div><code className="font-mono font-medium text-slate-900">statut_dossier</code> (ENUM)</div>
                <div><code className="font-mono font-medium text-slate-900">depose_le</code> (TIMESTAMP)</div>
              </div>
            </div>

            {/* Table 3 */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-semibold text-slate-900 text-sm">Table : diplomes_soumis</span>
                <span className="text-slate-500">Copies numérisées des diplômes à contrôler</span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700">
                <div><code className="font-mono font-medium text-slate-900">id</code> (VARCHAR(36), PK)</div>
                <div><code className="font-mono font-medium text-slate-900">dossier_id</code> (VARCHAR(36), FK)</div>
                <div><code className="font-mono font-medium text-slate-900">chemin_fichier</code> (VARCHAR(255))</div>
                <div><code className="font-mono font-medium text-slate-900">sha256_hash</code> (CHAR(64), NOT NULL)</div>
                <div><code className="font-mono font-medium text-slate-900">nom_titulaire_extrait</code> (VARCHAR(150))</div>
                <div><code className="font-mono font-medium text-slate-900">matricule_extrait</code> (VARCHAR(100))</div>
                <div><code className="font-mono font-medium text-slate-900">etablissement_extrait</code> (VARCHAR(150))</div>
                <div><code className="font-mono font-medium text-slate-900">intitule_grade_extrait</code> (VARCHAR(150))</div>
                <div><code className="font-mono font-medium text-slate-900">date_obtention_extraite</code> (DATE)</div>
              </div>
            </div>

            {/* Table 4 */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-semibold text-slate-900 text-sm">Table : registre_diplomes_officiels</span>
                <span className="text-slate-500">Référentiel certifié des universités partenaires</span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700">
                <div><code className="font-mono font-medium text-slate-900">id</code> (VARCHAR(36), PK)</div>
                <div><code className="font-mono font-medium text-slate-900">numero_enregistrement</code> (VARCHAR(100), UNIQUE)</div>
                <div><code className="font-mono font-medium text-slate-900">nom_titulaire</code> (VARCHAR(150), NOT NULL)</div>
                <div><code className="font-mono font-medium text-slate-900">date_naissance</code> (DATE)</div>
                <div><code className="font-mono font-medium text-slate-900">etablissement_emetteur</code> (VARCHAR(150))</div>
                <div><code className="font-mono font-medium text-slate-900">grade_consigne</code> (VARCHAR(150))</div>
                <div><code className="font-mono font-medium text-slate-900">filiere_specialite</code> (VARCHAR(150))</div>
                <div><code className="font-mono font-medium text-slate-900">mention</code> (VARCHAR(50))</div>
                <div><code className="font-mono font-medium text-slate-900">date_delivrance</code> (DATE, NOT NULL)</div>
                <div><code className="font-mono font-medium text-slate-900">signataires_habilites</code> (TEXT)</div>
              </div>
            </div>

            {/* Table 5 */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-semibold text-slate-900 text-sm">Table : verifications_audit</span>
                <span className="text-slate-500">Rapports d'analyse médico-légale et journalisation</span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700">
                <div><code className="font-mono font-medium text-slate-900">id</code> (VARCHAR(36), PK)</div>
                <div><code className="font-mono font-medium text-slate-900">diplome_soumis_id</code> (VARCHAR(36), FK)</div>
                <div><code className="font-mono font-medium text-slate-900">agent_id</code> (VARCHAR(36), FK)</div>
                <div><code className="font-mono font-medium text-slate-900">verdict</code> (ENUM('AUTHENTIQUE','FALSIFIE','SUSPECT'))</div>
                <div><code className="font-mono font-medium text-slate-900">score_confiance</code> (INT, 0-100)</div>
                <div><code className="font-mono font-medium text-slate-900">concordance_registre</code> (BOOLEAN)</div>
                <div><code className="font-mono font-medium text-slate-900">details_discordances</code> (JSON)</div>
                <div><code className="font-mono font-medium text-slate-900">zones_suspectes_json</code> (JSON)</div>
                <div><code className="font-mono font-medium text-slate-900">signature_forensique_score</code> (INT)</div>
                <div><code className="font-mono font-medium text-slate-900">date_verification</code> (TIMESTAMP)</div>
              </div>
            </div>

            {/* Table 6 */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-semibold text-slate-900 text-sm">Table : empreintes_frauduleuses</span>
                <span className="text-slate-500">Registre d'interception immédiate des récidives</span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700">
                <div><code className="font-mono font-medium text-slate-900">sha256</code> (CHAR(64), PK)</div>
                <div><code className="font-mono font-medium text-slate-900">premiere_interception</code> (TIMESTAMP)</div>
                <div><code className="font-mono font-medium text-slate-900">nombre_tentatives</code> (INT)</div>
                <div><code className="font-mono font-medium text-slate-900">motif_fraude</code> (VARCHAR(255))</div>
                <div><code className="font-mono font-medium text-slate-900">dernier_candidat_fraudeur</code> (VARCHAR(150))</div>
              </div>
            </div>

            {/* Table 7 */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-semibold text-slate-900 text-sm">Table : utilisateurs</span>
                <span className="text-slate-500">Comptes agents, auditeurs et administrateurs</span>
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-700">
                <div><code className="font-mono font-medium text-slate-900">id</code> (VARCHAR(36), PK)</div>
                <div><code className="font-mono font-medium text-slate-900">nom_complet</code> (VARCHAR(100))</div>
                <div><code className="font-mono font-medium text-slate-900">email</code> (VARCHAR(150), UNIQUE)</div>
                <div><code className="font-mono font-medium text-slate-900">role</code> (ENUM('AGENT_SCOLARITE', 'RESPONSABLE_FRAUDE', 'ADMINISTRATEUR'))</div>
                <div><code className="font-mono font-medium text-slate-900">etablissement</code> (VARCHAR(100))</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'actors' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            3. Tous les acteurs et leurs rôles
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 font-semibold">Acteur</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Rôles et attributions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Candidat / Déposant</td>
                  <td className="py-3 px-3">Humain (Externe)</td>
                  <td className="py-3 px-3">
                    Dépose son dossier d'admission (copie certifiée ou numérisée de son diplôme) au campus de l'IAI-Cameroun.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Agent de Scolarité / Admission</td>
                  <td className="py-3 px-3">Humain (Opérationnel)</td>
                  <td className="py-3 px-3">
                    Numérise ou téléverse le diplôme, déclenche l'audit d'authenticité, examine le rapport et les zones suspectes, valide ou rejette le dossier, et édite l'Attestation Officielle de Conformité.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Responsable Conformité & Fraude</td>
                  <td className="py-3 px-3">Humain (Superviseur)</td>
                  <td className="py-3 px-3">
                    Supervise la base de référence des diplômes accrédités, traite les alertes en temps réel, lance des comparaisons côte à côte (original vs suspect) et consulte le journal d'audit immuable.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Moteur IA & Vision Multimodale</td>
                  <td className="py-3 px-3">Système Automatisé</td>
                  <td className="py-3 px-3">
                    Extrait les métadonnées textuelles par OCR, localise les retouches et polices altérées par boîte englobante, et effectue l'analyse biométrique des signatures et des sceaux.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">Registre National / Académique</td>
                  <td className="py-3 px-3">Système d'Information</td>
                  <td className="py-3 px-3">
                    Fournit la vérité terrain infalsifiable (titulaire officiel rattaché à chaque matricule émis) afin d'identifier immédiatement les usurpations d'identité.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'diagrams' && (
        <div className="space-y-6">
          {/* Diagramme de Cas d'Utilisation */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              4.1 Scénario pour le Diagramme de Cas d'Utilisation (Use Case)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Scénario :</strong> Lors du dépôt d'un dossier au campus IAI-Cameroun, l'Agent d'admission se connecte à la plateforme. Il téléverse le diplôme du candidat. Le cas d'utilisation principal <em>« Auditer l'authenticité d'un diplôme »</em> inclut obligatoirement les cas <em>« Contrôle croisé du registre national »</em> et <em>« Analyse forensique des signatures »</em>. En fin de processus, l'Agent peut <em>« Générer l'Attestation Officielle »</em> ou <em>« Signaler une tentative de fraude »</em>. L'Auditeur peut quant à lui <em>« Comparer deux diplômes côte à côte »</em> et <em>« Consulter le journal d'audit »</em>.
            </p>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs font-mono text-slate-800 overflow-x-auto whitespace-pre">
{`Acteur Principal : Agent de Scolarité
Cas d'Utilisation :
  - S'authentifier
  - Téléverser le diplôme du candidat
  - Auditer l'authenticité du document
      ├── <<include>> Contrôler l'empreinte SHA-256 (Anti-récidive)
      ├── <<include>> Extraire les métadonnées par OCR
      ├── <<include>> Vérifier la concordance dans le Registre National
      └── <<include>> Analyser les signatures et le sceau académique
  - Visualiser les zones suspectes géolocalisées
  - Générer l'Attestation Officielle de Conformité

Acteur Superviseur : Responsable Conformité
  - Comparer deux diplômes côte à côte (Banc d'examen)
  - Enregistrer un titre officiel dans le référentiel
  - Consulter et exporter le journal d'audit`}
            </div>
          </div>

          {/* Diagramme d'Activité */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              4.2 Scénario pour le Diagramme d'Activité
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Cheminement d'activité :</strong>
              <br />1. Réception du scan du diplôme lors du dépôt du dossier.
              <br />2. Calcul de l'empreinte cryptographique SHA-256.
              <br />3. Si l'empreinte figure dans la liste noire des faux diplômes, déclenchement d'une alerte et rejet immédiat.
              <br />4. Sinon, extraction des données textuelles (Nom, Matricule, Faculté).
              <br />5. Recherche du matricule dans la base du registre officiel :
              <br />   - Si inexistant : anomalie majeure (faux matricule).
              <br />   - Si existant mais nom différent : usurpation d'identité avérée.
              <br />6. Examen de cohérence visuelle (tampons, signatures, polices).
              <br />7. Calcul du score et décision : AUTHENTIQUE (≥ 85%), SUSPECT (50-84%), FALSIFIÉ (&lt; 50%).
              <br />8. Archivage immuable au journal d'audit.
            </p>
          </div>

          {/* Diagramme de Séquence */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              4.3 Scénario pour le Diagramme de Séquence
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Chronologie des échanges :</strong>
              <br />1. L'Agent envoie le fichier scanné : <code>POST /api/verify</code> vers le serveur backend.
              <br />2. Le serveur calcule <code>SHA-256(fichier)</code> et interroge la table <code>empreintes_frauduleuses</code>.
              <br />3. Le serveur soumet l'image au Moteur IA Multimodal qui renvoie les données extraites et les coordonnées des zones altérées.
              <br />4. Le serveur effectue une requête SQL vers <code>registre_diplomes_officiels</code> avec le numéro d'enregistrement.
              <br />5. Le serveur compare la concordance des titulaires et pondère les résultats forensiques.
              <br />6. Le serveur enregistre l'événement dans <code>verifications_audit</code>.
              <br />7. Le serveur retourne le rapport complet à l'interface de l'Agent.
            </p>
          </div>

          {/* Diagramme de Classes */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              4.4 Diagramme de Classes et Relations
            </h3>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs font-mono text-slate-800 overflow-x-auto whitespace-pre">
{`Candidat (1) ──── possède ────> (1..*) DossierCandidature
DossierCandidature (1) ──── contient ────> (1..*) DiplomeSoumis
DiplomeSoumis (1) ──── fait l'objet de ────> (1) VerificationAudit
VerificationAudit (1) ──── confronte ────> (0..1) RegistreDiplomeOfficiel
VerificationAudit (1) *─── compose ────> (0..*) ZoneSuspecte
VerificationAudit (1) *─── compose ────> (0..*) SignatureForensique
Utilisateur (Agent) (1) ──── effectue ────> (0..*) VerificationAudit
DiplomeSoumis (0..1) ──── vérifie si fiché ────> (0..1) EmpreinteFrauduleuse`}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'tech' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            5. Les technologies utilisées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="rounded-lg border border-slate-200 p-4 space-y-1.5">
              <div className="font-semibold text-slate-900 text-sm">React 18 & TypeScript</div>
              <p>Interface utilisateur réactive et typée garantissant l'intégrité des flux de données et la fluidité des interactions.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 space-y-1.5">
              <div className="font-semibold text-slate-900 text-sm">Tailwind CSS</div>
              <p>Framework d'utilitaires CSS assurant une esthétique épurée, sobre, sans éléments superflus et avec un contraste rigoureux.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 space-y-1.5">
              <div className="font-semibold text-slate-900 text-sm">Node.js & Express</div>
              <p>Serveur d'API REST robuste assurant l'exécution côté serveur des calculs cryptographiques et la protection des secrets.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 space-y-1.5">
              <div className="font-semibold text-slate-900 text-sm">Moteur IA Multimodal (Gemini Vision)</div>
              <p>Analyse optique à haute résolution pour l'extraction OCR, la détection des artefacts de retouche et l'évaluation des sceaux officiels.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 space-y-1.5">
              <div className="font-semibold text-slate-900 text-sm">Hachage Cryptographique SHA-256</div>
              <p>Garantie d'intégrité documentaire et indexation instantanée des documents frauduleux pour une protection anti-récidive infaillible.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 space-y-1.5">
              <div className="font-semibold text-slate-900 text-sm">HTML5 Canvas & Forensique de Tracé</div>
              <p>Banc d'examen vectoriel permettant de comparer la pression des traits de signatures et la régularité des signatures institutionnelles.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

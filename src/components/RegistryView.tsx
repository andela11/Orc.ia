import React, { useState } from 'react';
import { RegisteredDiploma } from '../types';
import { RegistryComparisonModal } from './RegistryComparisonModal';

interface RegistryViewProps {
  registry: RegisteredDiploma[];
  onAddDiploma: (newDiploma: Omit<RegisteredDiploma, 'id' | 'accredited'>) => void;
  onSelectDiplomaForVerification?: (diploma: RegisteredDiploma) => void;
  onLoadIntoVerifier?: (base64: string, fileName: string, mimeType: string, fileSize: string) => void;
}

export const RegistryView: React.FC<RegistryViewProps> = ({
  registry,
  onAddDiploma,
  onLoadIntoVerifier,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  // Comparison State
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonIdA, setComparisonIdA] = useState<string | undefined>(undefined);
  const [comparisonIdB, setComparisonIdB] = useState<string | undefined>(undefined);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // New Diploma Form State
  const [formDocId, setFormDocId] = useState('');
  const [formStudent, setFormStudent] = useState('');
  const [formInstitution, setFormInstitution] = useState('');
  const [formDegree, setFormDegree] = useState('');
  const [formField, setFormField] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formHonors, setFormHonors] = useState('Mention Très Bien');

  const filtered = registry.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.studentName.toLowerCase().includes(term) ||
      item.institution.toLowerCase().includes(term) ||
      item.documentId.toLowerCase().includes(term) ||
      item.degreeTitle.toLowerCase().includes(term)
    );
  });

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // Replace second item
        return [prev[0], id];
      }
      return [...prev, id];
    });
  };

  const handleOpenComparison = (idA?: string, idB?: string) => {
    const targetA = idA || selectedForCompare[0] || registry[0]?.id;
    const targetB = idB || selectedForCompare[1] || (registry[1]?.id !== targetA ? registry[1]?.id : registry[0]?.id);
    setComparisonIdA(targetA);
    setComparisonIdB(targetB);
    setIsComparisonOpen(true);
  };

  const handleOpenPresetComparison = (preset: 'fraud' | 'inter-univ') => {
    if (preset === 'fraud') {
      const sorbonne = registry.find((r) => r.documentId.includes('SORB-2023-M8921')) || registry[0];
      setComparisonIdA(sorbonne.id);
      setComparisonIdB('REG-FRAUD-SAMPLE');
    } else {
      const sorbonne = registry.find((r) => r.institution.includes('Sorbonne')) || registry[0];
      const poly = registry.find((r) => r.institution.includes('Polytechnique')) || registry[1] || registry[0];
      setComparisonIdA(sorbonne.id);
      setComparisonIdB(poly.id);
    }
    setIsComparisonOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDocId || !formStudent || !formInstitution || !formDegree) {
      alert('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    onAddDiploma({
      documentId: formDocId,
      studentName: formStudent,
      institution: formInstitution,
      degreeTitle: formDegree,
      fieldOfStudy: formField || 'Généraliste',
      issueDate: formDate,
      honors: formHonors,
    });

    setFormDocId('');
    setFormStudent('');
    setFormInstitution('');
    setFormDegree('');
    setFormField('');
    setIsAddingOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Registre des diplômes accrédités
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Référentiel centralisé servant au contrôle automatisé d'authenticité, à la comparaison visuelle bilatérale et à la détection des usurpations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {/* Compare Button */}
          <button
            id="open-side-by-side-comparison-btn"
            type="button"
            onClick={() => handleOpenComparison()}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <span>Comparateur côte à côte</span>
            {selectedForCompare.length > 0 && (
              <span className="font-mono text-slate-600">
                ({selectedForCompare.length})
              </span>
            )}
          </button>

          <button
            id="open-add-diploma-modal-btn"
            type="button"
            onClick={() => setIsAddingOpen(true)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            + Enregistrer un titre
          </button>
        </div>
      </div>

      {/* Quick Comparison Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-700">Analyses comparatives rapides :</span>
          <button
            type="button"
            onClick={() => handleOpenPresetComparison('fraud')}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Thomas Laurent (Original) vs Marc Lefebvre (Fraude/Usurpation)
          </button>
          <button
            type="button"
            onClick={() => handleOpenPresetComparison('inter-univ')}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Sorbonne Université vs École Polytechnique
          </button>
        </div>

        <span className="text-[11px] text-slate-500 hidden md:inline">
          Cochez 2 cases du tableau pour lancer une comparaison personnalisée
        </span>
      </div>

      {/* Floating or Inline Selection Banner if any items checked */}
      {selectedForCompare.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-900 bg-slate-900 text-white p-3.5 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold">
              {selectedForCompare.length === 1
                ? '1 diplôme sélectionné — cochez un second diplôme pour comparer :'
                : '2 diplômes sélectionnés pour examen côte à côte :'}
            </span>
            <span className="font-mono text-slate-300">
              {selectedForCompare
                .map((id) => registry.find((r) => r.id === id)?.studentName)
                .filter(Boolean)
                .join(' ⇄ ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenComparison(selectedForCompare[0], selectedForCompare[1])}
              className="rounded-md bg-white text-slate-900 font-semibold px-3 py-1 text-xs hover:bg-slate-100"
            >
              Ouvrir le comparateur côte à côte
            </button>
            <button
              onClick={() => setSelectedForCompare([])}
              className="rounded-md text-slate-300 hover:text-white px-2 py-1 text-xs"
            >
              Effacer la sélection
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par titulaire, établissement, spécialité ou numéro de série..."
          className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-slate-400 hover:text-slate-700 font-medium shrink-0"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Table of Registered Diplomas */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium">
                <th className="w-10 px-3 py-3 text-center">
                  <span className="sr-only">Sélectionner</span>
                </th>
                <th className="px-4 py-3">Numéro de série</th>
                <th className="px-4 py-3">Titulaire officiel</th>
                <th className="px-4 py-3">Grade & Spécialité</th>
                <th className="px-4 py-3">Établissement</th>
                <th className="px-4 py-3">Délivrance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((dip) => {
                const isSelected = selectedForCompare.includes(dip.id);
                return (
                  <tr
                    key={dip.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-slate-50/90 font-medium' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="w-10 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleCompare(dip.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        title="Sélectionner pour comparer"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-900">
                      {dip.documentId}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{dip.studentName}</div>
                      {dip.honors && (
                        <span className="text-[10px] text-slate-500 font-medium">{dip.honors}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-900 font-medium">{dip.degreeTitle}</div>
                      <div className="text-[11px] text-slate-500">{dip.fieldOfStudy}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {dip.institution}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono">
                      {dip.issueDate}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[11px] font-medium text-slate-600">
                          Accrédité
                        </span>

                        <button
                          type="button"
                          onClick={() => handleOpenComparison(dip.id)}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Comparer ce diplôme avec un autre"
                        >
                          Comparer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Aucun résultat trouvé pour "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isComparisonOpen && (
        <RegistryComparisonModal
          registry={registry}
          initialDiplomaAId={comparisonIdA}
          initialDiplomaBId={comparisonIdB}
          onClose={() => setIsComparisonOpen(false)}
          onLoadIntoVerifier={onLoadIntoVerifier}
        />
      )}

      {/* Modal to add diploma */}
      {isAddingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Enregistrer un titre académique
              </h3>
              <button
                onClick={() => setIsAddingOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Numéro d'enregistrement officiel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: SORB-2024-M9021"
                  value={formDocId}
                  onChange={(e) => setFormDocId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nom et prénom du titulaire *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Jean Dupont"
                  value={formStudent}
                  onChange={(e) => setFormStudent(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Établissement de délivrance *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Sorbonne Université, École Polytechnique..."
                  value={formInstitution}
                  onChange={(e) => setFormInstitution(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Intitulé du grade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Master en Informatique"
                    value={formDegree}
                    onChange={(e) => setFormDegree(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Spécialité / Domaine
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Données & IA"
                    value={formField}
                    onChange={(e) => setFormField(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Date de délivrance
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Distinction / Mention
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Mention Très Bien"
                    value={formHonors}
                    onChange={(e) => setFormHonors(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingOpen(false)}
                  className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

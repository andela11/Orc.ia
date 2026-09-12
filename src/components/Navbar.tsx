import React, { useState } from 'react';
import { User, LogIn, LogOut, ChevronDown, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type ActiveTab = 'verifier' | 'registry' | 'audit' | 'stats' | 'alertes' | 'documentation';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  registryCount: number;
  alertsCount?: number;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  registryCount,
  alertsCount = 0,
  onOpenAuthModal,
}) => {
  const { user, logout, quickLogin } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-semibold tracking-wider">
            VD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-slate-900">
                VerifDiplôme<span className="text-slate-500 font-normal">.ai</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Contrôle d'authenticité et certification académique
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Orderly, clean, uniform spacing */}
        <nav className="flex items-center gap-1.5 text-xs overflow-x-auto py-1">
          <button
            id="tab-verifier-btn"
            type="button"
            onClick={() => setActiveTab('verifier')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'verifier'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Vérificateur
          </button>

          <button
            id="tab-registry-btn"
            type="button"
            onClick={() => setActiveTab('registry')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'registry'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Registre ({registryCount})
          </button>

          <button
            id="tab-audit-btn"
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Journal d'audit
          </button>

          <button
            id="tab-stats-btn"
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Statistiques
          </button>

          <button
            id="tab-alerts-btn"
            type="button"
            onClick={() => setActiveTab('alertes')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'alertes'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Alertes ({alertsCount})
          </button>

          <button
            id="tab-doc-btn"
            type="button"
            onClick={() => setActiveTab('documentation')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'documentation'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Spécifications & Projet
          </button>
        </nav>

        {/* User Authentication & Session Controls - Orderly & well-aligned */}
        <div className="relative shrink-0 flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                id="user-session-menu-btn"
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 truncate max-w-[130px]">
                  {user.fullName}
                </span>
                <span className="text-slate-500 font-normal">
                  ({user.role})
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="pb-2 mb-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user.fullName}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{user.department}</div>
                  </div>

                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Changer de profil opérateur :
                  </div>
                  <div className="space-y-1 mb-2">
                    <button
                      type="button"
                      onClick={() => { quickLogin('admin'); setShowUserDropdown(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs rounded-md hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span className="text-slate-900">Dr. Alexandre Vernier</span>
                      <span className="text-slate-500 text-[11px]">Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { quickLogin('agent'); setShowUserDropdown(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs rounded-md hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span className="text-slate-900">Claire Fontaine</span>
                      <span className="text-slate-500 text-[11px]">Agent</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { quickLogin('enqueteur'); setShowUserDropdown(false); }}
                      className="w-full text-left px-2 py-1.5 text-xs rounded-md hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span className="text-slate-900">Marc-Antoine Dupuis</span>
                      <span className="text-slate-500 text-[11px]">Analyste</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => { onOpenAuthModal('register'); setShowUserDropdown(false); }}
                      className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Créer un compte</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { logout(); setShowUserDropdown(false); }}
                      className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="open-login-btn"
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Connexion</span>
              </button>
              <button
                id="open-register-btn"
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Créer un compte</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


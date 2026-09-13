import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  LogIn,
  LogOut,
  ChevronDown,
  UserPlus,
  Menu,
  X,
  ShieldCheck,
  Database,
  History,
  BarChart3,
  Bell,
  FileText,
  Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type ActiveTab = 'verifier' | 'registry' | 'audit' | 'stats' | 'alertes' | 'admin' | 'documentation';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActiveTab; label: string; count?: number; icon: React.ReactNode }[] = [
    { id: 'verifier', label: 'Vérificateur', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'registry', label: 'Registre', count: registryCount, icon: <Database className="h-4 w-4" /> },
    { id: 'audit', label: 'Audit', icon: <History className="h-4 w-4" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'alertes', label: 'Alertes', count: alertsCount, icon: <Bell className="h-4 w-4" /> },
    { id: 'admin', label: 'Administration', icon: <Shield className="h-4 w-4" /> },
    { id: 'documentation', label: 'Projet & Specs', icon: <FileText className="h-4 w-4" /> },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-semibold tracking-wider">
            VD
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold tracking-tight text-slate-900">
                VerifDiplôme<span className="text-slate-500 font-normal">.ai</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden xl:block leading-none mt-0.5">
              Contrôle d'authenticité des diplômes académiques
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Visible on lg+) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}-btn`}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-none ${
                      isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: User Session & Mobile Hamburger */}
        <div className="flex items-center gap-2 shrink-0">
          {/* User Authentication & Session Controls */}
          <div ref={dropdownRef} className="relative">
            {user ? (
              <div>
                <button
                  id="user-session-menu-btn"
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 truncate max-w-[90px] sm:max-w-[130px]">
                    {user.fullName}
                  </span>
                  <span className="text-slate-500 font-normal hidden sm:inline">
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
                        <span>Créer compte</span>
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
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  id="open-login-btn"
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Connexion</span>
                </button>
                <button
                  id="open-register-btn"
                  type="button"
                  onClick={() => onOpenAuthModal('register')}
                  className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 sm:px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Créer un compte</span>
                  <span className="sm:hidden">Inscription</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile / Tablet Menu Toggle (Visible on < lg) */}
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Menu principal"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Visible on < lg when opened) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150"
        >
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Navigation de la plateforme
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-tab-${item.id}-btn`}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-none ${
                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};


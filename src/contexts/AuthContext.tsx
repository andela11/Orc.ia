import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, AuthSession, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    department: string;
  }) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => Promise<void>;
  quickLogin: (username: string) => Promise<{ success: boolean; user?: UserProfile }>;
  demoUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_TOKEN_KEY = 'vdf_auth_token';
const LOCAL_STORAGE_USER_KEY = 'vdf_auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState<UserProfile[]>([]);

  // Fetch available demo users & verify current session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Fetch demo users
        const usersRes = await fetch('/api/auth/users');
        if (usersRes.ok) {
          const data = await usersRes.json();
          if (data.users) {
            setDemoUsers(data.users);
          }
        }

        // Verify existing token if present
        const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
        if (storedToken) {
          const meRes = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData.user) {
              setUser(meData.user);
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(meData.user));
            }
          } else {
            // Token expired or invalid
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            setUser(null);
            setToken(null);
          }
        } else {
          // No stored session: user starts unauthenticated on the landing page
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Erreur initialisation auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Identifiants invalides' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur réseau de connexion' };
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    department: string;
  }): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Erreur lors de l'enregistrement" };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur réseau' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn('Erreur logout:', err);
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      setUser(null);
      setToken(null);
    }
  };

  const quickLogin = async (username: string): Promise<{ success: boolean; user?: UserProfile }> => {
    const passwords: Record<string, string> = {
      admin: 'Admin2026!',
      agent: 'Agent2026!',
      verificateur: 'Agent2026!',
      enqueteur: 'Fraude2026!',
      analyste: 'Fraude2026!',
    };
    const password = passwords[username.toLowerCase()] || 'Admin2026!';
    return await login(username, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickLogin,
        demoUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

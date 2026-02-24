import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiRequest, clearTokens, setTokens } from '../api/client';

interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'user' | 'admin' | 'manager';
  profile: {
    neighborhood?: string;
    education?: string;
    educationField?: string;
    experience?: string;
    skills?: string[];
    interests?: string[];
    completionPercentage: number;
  };
  points: number;
  referralCode: string;
}

interface AuthContextType {
  user: User | null;
  login: (mobile: string, password: string) => Promise<void>;
  loginWithOTP: (mobile: string, otp: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialUser(): User | null {
  try {
    const stored = localStorage.getItem('campaign_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);

  useEffect(() => {
    const syncUser = async () => {
      try {
        const me = await apiRequest<User>('/auth/me');
        setUser(me);
        localStorage.setItem('campaign_user', JSON.stringify(me));
      } catch {
        setUser(null);
        localStorage.removeItem('campaign_user');
        clearTokens();
      }
    };
    void syncUser();
  }, []);

  const login = async (mobile: string, password: string) => {
    const response = await apiRequest<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login/password', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    });
    setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    setUser(response.user);
    localStorage.setItem('campaign_user', JSON.stringify(response.user));
  };

  const loginWithOTP = async (mobile: string, otp: string) => {
    throw new Error('ورود با کد یکبار مصرف هنوز فعال نشده است');
  };

  const register = async (data: any) => {
    const response = await apiRequest<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    setUser(response.user);
    localStorage.setItem('campaign_user', JSON.stringify(response.user));
  };

  const updateProfile = async (data: any) => {
    const updatedUser = await apiRequest<User>('/users/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    setUser(updatedUser);
    localStorage.setItem('campaign_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('campaign_refresh_token');
    void apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
    setUser(null);
    localStorage.removeItem('campaign_user');
    clearTokens();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithOTP,
        logout,
        register,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

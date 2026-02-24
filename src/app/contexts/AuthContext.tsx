import { createContext, useContext, useState, ReactNode } from 'react';

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

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'علی احمدی',
    mobile: '09123456789',
    email: 'ali@example.com',
    role: 'admin',
    profile: {
      neighborhood: 'تهران، ونک',
      education: 'کارشناسی ارشد',
      educationField: 'علوم سیاسی',
      experience: '5 سال فعالیت سیاسی',
      skills: ['سخنرانی', 'مدیریت', 'روابط عمومی'],
      interests: ['هماهنگی رویدادها', 'تحقیق و پژوهش'],
      completionPercentage: 100,
    },
    points: 1250,
    referralCode: 'ALI2024',
  },
  {
    id: '2',
    name: 'مریم کریمی',
    mobile: '09121234567',
    email: 'maryam@example.com',
    role: 'user',
    profile: {
      neighborhood: 'تهران، سعادت‌آباد',
      education: 'کارشناسی',
      educationField: 'گرافیک',
      experience: '3 سال طراحی گرافیک',
      skills: ['طراحی گرافیک', 'ویرایش ویدیو'],
      interests: ['تولید محتوا', 'طراحی'],
      completionPercentage: 80,
    },
    points: 450,
    referralCode: 'MARYAM2024',
  },
];

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

  const login = async (mobile: string, password: string) => {
    // Mock login logic
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = mockUsers.find(u => u.mobile === mobile);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('campaign_user', JSON.stringify(foundUser));
    } else {
      throw new Error('کاربر یافت نشد');
    }
  };

  const loginWithOTP = async (mobile: string, otp: string) => {
    // Mock OTP login
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = mockUsers.find(u => u.mobile === mobile);
    if (foundUser && otp === '1234') {
      setUser(foundUser);
      localStorage.setItem('campaign_user', JSON.stringify(foundUser));
    } else {
      throw new Error('کد تایید نادرست است');
    }
  };

  const register = async (data: any) => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      role: 'user',
      profile: {
        completionPercentage: 20,
      },
      points: 0,
      referralCode: `USER${Date.now()}`,
    };
    setUser(newUser);
    localStorage.setItem('campaign_user', JSON.stringify(newUser));
  };

  const updateProfile = async (data: any) => {
    if (!user) return;
    
    const updatedProfile = { ...user.profile, ...data };
    const fields = ['neighborhood', 'education', 'educationField', 'experience', 'skills', 'interests'];
    const filledFields = fields.filter(field => updatedProfile[field]);
    updatedProfile.completionPercentage = Math.round((filledFields.length / fields.length) * 100);
    
    const updatedUser = { ...user, profile: updatedProfile };
    setUser(updatedUser);
    localStorage.setItem('campaign_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campaign_user');
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

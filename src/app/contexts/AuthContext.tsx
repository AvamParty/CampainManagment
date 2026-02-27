import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  apiRequest,
  clearTokens,
  registerWithOTP as registerWithOTPApi,
  sendOTP as sendOTPApi,
  setTokens,
  verifyOTP as verifyOTPApi,
} from '../api/client'
import { isValidString } from '../utils/typeGuards'

interface User {
  id: string
  name: string
  mobile: string
  email?: string
  role: 'user' | 'admin' | 'manager'
  profile: {
    neighborhood?: string
    education?: string
    educationField?: string
    experience?: string
    skills?: string[]
    interests?: string[]
    completionPercentage: number
  }
  points: number
  referralCode: string
  invitedByUserId?: string | null
}

interface RegisterData {
  mobile: string
  password: string
  name: string
  email?: string
  referralCode: string
}

interface UpdateProfileData {
  name?: string
  email?: string
  bio?: string
  skills?: string[]
}

interface AuthContextType {
  user: User | null
  login: (mobile: string, password: string) => Promise<void>
  loginWithOTP: (mobile: string, otp: string) => Promise<void>
  sendOTP: (
    phone: string,
    purpose: 'login' | 'register' | 'reset',
  ) => Promise<{ message: string; otp?: string }>
  register: (data: RegisterData) => Promise<void>
  registerWithOTP: (
    phone: string,
    otp: string,
    name: string,
    email?: string,
  ) => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getInitialUser(): User | null {
  try {
    const stored = localStorage.getItem('campaign_user')
    return isValidString(stored) ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode
}): React.JSX.Element {
  const [user, setUser] = useState<User | null>(getInitialUser)

  useEffect(() => {
    const syncUser = async () => {
      try {
        const me = await apiRequest<User>('/auth/me')
        setUser(me)
        localStorage.setItem('campaign_user', JSON.stringify(me))
      } catch {
        setUser(null)
        localStorage.removeItem('campaign_user')
        clearTokens()
      }
    }
    void syncUser()
  }, [])

  const login = async (mobile: string, password: string) => {
    const response = await apiRequest<{
      user: User
      accessToken: string
      refreshToken: string
    }>('/auth/login/password', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    })
    setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    })
    setUser(response.user)
    localStorage.setItem('campaign_user', JSON.stringify(response.user))
  }

  const loginWithOTP = async (mobile: string, otp: string) => {
    const response = await verifyOTPApi(mobile, otp, 'login')
    setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    })
    setUser(response.user)
    localStorage.setItem('campaign_user', JSON.stringify(response.user))
  }

  const sendOTP = async (
    phone: string,
    purpose: 'login' | 'register' | 'reset',
  ) => {
    return await sendOTPApi(phone, purpose)
  }

  const registerWithOTP = async (
    phone: string,
    otp: string,
    name: string,
    email?: string,
  ) => {
    const response = await registerWithOTPApi(phone, otp, name, email)
    setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    })
    setUser(response.user)
    localStorage.setItem('campaign_user', JSON.stringify(response.user))
  }

  const register = async (data: RegisterData) => {
    const response = await apiRequest<{
      user: User
      accessToken: string
      refreshToken: string
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    })
    setUser(response.user)
    localStorage.setItem('campaign_user', JSON.stringify(response.user))
  }

  const updateProfile = async (data: UpdateProfileData) => {
    const updatedUser = await apiRequest<User>('/users/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    setUser(updatedUser)
    localStorage.setItem('campaign_user', JSON.stringify(updatedUser))
  }

  const logout = () => {
    const refreshToken = localStorage.getItem('campaign_refresh_token')
    void apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined)
    setUser(null)
    localStorage.removeItem('campaign_user')
    clearTokens()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithOTP,
        sendOTP,
        register,
        registerWithOTP,
        updateProfile,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import { isNotNull, isValidString } from '../utils/typeGuards'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string

const ACCESS_TOKEN_KEY = 'campaign_access_token'
const REFRESH_TOKEN_KEY = 'campaign_refresh_token'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(tokens: {
  accessToken: string
  refreshToken: string
}): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

type RequestInitWithRetry = RequestInit & {
  _retry?: boolean
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!isValidString(refreshToken)) return false
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!response.ok) return false
    const body = (await response.json()) as {
      accessToken: string
      refreshToken: string
    }
    setTokens({
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
    })
    return true
  } catch {
    return false
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInitWithRetry = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  const token = getAccessToken()
  if (isValidString(token)) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401 && !isNotNull(options._retry)) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return apiRequest<T>(path, { ...options, _retry: true })
    }
    clearTokens()
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string | string[]
    } | null
    const message = errorBody?.message ?? 'Unexpected API error'
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  return (await response.json()) as T
}

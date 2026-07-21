const AUTH_USER_KEY = 'kalit_current_user'
const AUTH_TOKEN_KEY = 'kalit_auth_token'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  company?: string | null
  phone?: string | null
  avatar?: string | null
}

// ── User ────────────────────────────────────────────────────────────────────

export function getCurrentUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY)
    return stored ? (JSON.parse(stored) as AuthUser) : null
  } catch {
    return null
  }
}

// ── Token ───────────────────────────────────────────────────────────────────

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

// ── Login / Logout ──────────────────────────────────────────────────────────

export function loginUser(user: AuthUser, token: string) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function logoutUser() {
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true if a user session and token are both present. */
export function isAuthenticated(): boolean {
  return Boolean(getCurrentUser() && getAuthToken())
}

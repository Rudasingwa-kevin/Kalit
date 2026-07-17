import type { TeamMember } from '@/data/mockData'

const AUTH_KEY = 'kalit_current_user'

export function getCurrentUser(): TeamMember | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function loginUser(member: TeamMember) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(member))
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY)
}

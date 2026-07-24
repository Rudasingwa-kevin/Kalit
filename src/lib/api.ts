import { getAuthToken, logoutUser } from './auth'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    logoutUser()
    window.location.href = '/login'
    throw new Error('Session expired')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }

  return res.json()
}

export const api = {
  // Projects
  getProjects: () => apiFetch<{ projects: any[] }>('/projects'),
  getProject: (id: string) => apiFetch<{ project: any }>(`/projects/${id}`),
  createProject: (data: any) => apiFetch<{ project: any }>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => apiFetch<{ project: any }>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => apiFetch<{ message: string }>(`/projects/${id}`, { method: 'DELETE' }),

  // Inventory
  getInventory: () => apiFetch<{ items: any[] }>('/inventory'),
  getInventoryItem: (id: string) => apiFetch<{ item: any }>(`/inventory/${id}`),
  createInventoryItem: (data: any) => apiFetch<{ item: any }>('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  updateInventoryItem: (id: string, data: any) => apiFetch<{ item: any }>(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInventoryItem: (id: string) => apiFetch<{ message: string }>(`/inventory/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboard: () => apiFetch<{ dashboardStats: any; recentActivity: any[]; milestones: any[]; projects: any[] }>('/dashboard'),

  // Team
  searchUsers: (email: string) => apiFetch<{ users: any[] }>(`/team/users/search?email=${encodeURIComponent(email)}`),
  addMember: (data: { userId: string; role: string }) => apiFetch<{ member: any }>('/team/members', { method: 'POST', body: JSON.stringify(data) }),
  createTeamInvite: (data: { userId: string; role: string; message?: string }) => apiFetch<{ invite: any }>('/team/invites', { method: 'POST', body: JSON.stringify(data) }),
  getTeamInvites: () => apiFetch<{ invites: any[] }>('/team/invites'),
  getPendingInviteCount: () => apiFetch<{ count: number }>('/team/invites/pending-count'),
  acceptTeamInvite: (id: string) => apiFetch<{ message: string }>(`/team/invites/${id}/accept`, { method: 'POST' }),
  declineTeamInvite: (id: string) => apiFetch<{ message: string }>(`/team/invites/${id}/decline`, { method: 'POST' }),
  revokeTeamInvite: (id: string) => apiFetch<{ message: string }>(`/team/invites/${id}`, { method: 'DELETE' }),
  getMembers: (params?: string) => apiFetch<{ members: any[] }>(`/team/members${params ? `?${params}` : ''}`),
  removeMember: (id: string) => apiFetch<{ message: string }>(`/team/members/${id}`, { method: 'DELETE' }),
  getInvitations: () => apiFetch<{ invitations: any[] }>('/team/invitations'),
  createInvitation: (data: any) => apiFetch<{ invitation: any }>('/team/invitations', { method: 'POST', body: JSON.stringify(data) }),
  revokeInvitation: (id: string) => apiFetch<{ message: string }>(`/team/invitations/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => apiFetch<{ notifications: any[]; unreadCount: number }>('/notifications'),
  markAllNotificationsRead: () => apiFetch<{ message: string }>('/notifications/read', { method: 'PUT' }),
  markNotificationRead: (id: string) => apiFetch<{ message: string }>(`/notifications/${id}/read`, { method: 'PUT' }),

  // Profile
  getMe: () => apiFetch<{ user: any }>('/auth/me'),
  updateProfile: (data: { name?: string; phone?: string; company?: string }) =>
    apiFetch<{ user: any }>('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ message: string }>('/auth/password', { method: 'PUT', body: JSON.stringify(data) }),

  // Password Reset
  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, newPassword: string) =>
    apiFetch<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),

  // Email Verification
  verifyEmail: (email: string, code: string) =>
    apiFetch<{ message: string; token: string; user: any }>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ email, code }) }),
  resendVerification: (email: string) =>
    apiFetch<{ message: string }>('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  register: (data: { name: string; email: string; company?: string; password: string }) =>
    apiFetch<{ message: string; userId: string; email: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Tasks
  getProjectTasks: (projectId: string) => apiFetch<{ tasks: any[] }>(`/tasks/project/${projectId}`),
  getTask: (id: string) => apiFetch<{ task: any }>(`/tasks/${id}`),
  createTask: (data: { title: string; description?: string; projectId: string; assigneeId: string; priority?: string; dueDate?: string; status?: string }) =>
    apiFetch<{ task: any }>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: { title?: string; description?: string; status?: string; priority?: string; assigneeId?: string; dueDate?: string }) =>
    apiFetch<{ task: any }>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id: string) => apiFetch<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' }),
  bulkUpdateTasks: (updates: { id: string; status: string }[]) =>
    apiFetch<{ message: string }>('/tasks/bulk/update', { method: 'PUT', body: JSON.stringify({ updates }) }),
}

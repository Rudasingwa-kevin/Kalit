import { getAuthToken } from './auth'

const API_BASE = 'http://localhost:3001/api'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

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
  getMembers: (params?: string) => apiFetch<{ members: any[] }>(`/team/members${params ? `?${params}` : ''}`),
  removeMember: (id: string) => apiFetch<{ message: string }>(`/team/members/${id}`, { method: 'DELETE' }),
  getInvitations: () => apiFetch<{ invitations: any[] }>('/team/invitations'),
  createInvitation: (data: any) => apiFetch<{ invitation: any }>('/team/invitations', { method: 'POST', body: JSON.stringify(data) }),
  revokeInvitation: (id: string) => apiFetch<{ message: string }>(`/team/invitations/${id}`, { method: 'DELETE' }),
}

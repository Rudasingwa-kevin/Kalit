import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

const STALE_TIME = 5 * 60 * 1000

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const data = await api.getDashboard()
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const data = await api.getProjects()
      return data.projects
    },
    staleTime: STALE_TIME,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const data = await api.getProject(id)
      return data.project
    },
    staleTime: STALE_TIME,
    enabled: !!id,
  })
}

export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const data = await api.getInventory()
      return data.items
    },
    staleTime: STALE_TIME,
  })
}

export function useTeamMembers(params?: string) {
  return useQuery({
    queryKey: ['team', params],
    queryFn: async () => {
      const data = await api.getMembers(params)
      return data.members
    },
    staleTime: STALE_TIME,
  })
}

export function useInvitations() {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const data = await api.getInvitations()
      return data.invitations
    },
    staleTime: STALE_TIME,
  })
}

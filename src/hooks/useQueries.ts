import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

const STALE_TIME = 5 * 60 * 1000

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
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

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; location: string; engineer?: string; budget: number; startDate?: string; endDate: string; description?: string }) =>
      api.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; category: string; stock: number; maxStock?: number; unit: string; value?: number; supplier: string; warehouse?: string; project?: string }) =>
      api.createInventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => api.forgotPassword(email),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      api.resetPassword(token, newPassword),
  })
}

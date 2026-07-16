import { useQuery } from '@tanstack/react-query'
import {
  projects,
  inventoryItems,
  dashboardStats,
  recentActivity,
  milestones,
} from '@/data/mockData'
import type { Project, InventoryItem } from '@/data/mockData'

const STALE_TIME = 5 * 60 * 1000

interface DashboardData {
  dashboardStats: typeof dashboardStats
  recentActivity: typeof recentActivity
  milestones: typeof milestones
  projects: Project[]
}

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ dashboardStats, recentActivity, milestones, projects })
        }, 100)
      }),
    staleTime: STALE_TIME,
  })
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(projects)
        }, 100)
      }),
    staleTime: STALE_TIME,
  })
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(projects.find((p) => p.id === id) || projects[0])
        }, 100)
      }),
    staleTime: STALE_TIME,
  })
}

export function useInventory() {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(inventoryItems)
        }, 100)
      }),
    staleTime: STALE_TIME,
  })
}

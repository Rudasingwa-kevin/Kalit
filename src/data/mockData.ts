export type UserRole = 'owner' | 'project_manager' | 'site_engineer' | 'storekeeper'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface Project {
  id: string
  name: string
  location: string
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed'
  progress: number
  budget: number
  spent: number
  startDate: string
  endDate: string
  engineer: string
  description: string
  materialsUsed: number
  tasksCompleted: number
  totalTasks: number
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  icon: string
  stock: number
  maxStock: number
  unit: string
  value: number
  supplier: string
  warehouse: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  lastRestocked: string
  usageHistory: number[]
}

export const currentUser: User = {
  id: '1',
  name: 'Jean-Paul Hakizimana',
  email: 'jp@kalit.io',
  role: 'owner',
}

export const projects: Project[] = [
  {
    id: '1',
    name: 'Kigali Heights Extension',
    location: 'Kigali, Rwanda',
    status: 'on_track',
    progress: 68,
    budget: 2400000,
    spent: 1632000,
    startDate: '2025-09-01',
    endDate: '2026-08-30',
    engineer: 'Alice Niyonzima',
    description: 'Modern office complex extension with 12 floors',
    materialsUsed: 342,
    tasksCompleted: 47,
    totalTasks: 69,
  },
  {
    id: '2',
    name: 'Lake View Residences',
    location: 'Rubavu, Rwanda',
    status: 'at_risk',
    progress: 42,
    budget: 1800000,
    spent: 820000,
    startDate: '2025-11-15',
    endDate: '2026-11-15',
    engineer: 'Patrick Mugabo',
    description: 'Luxury residential complex overlooking Lake Kivu',
    materialsUsed: 189,
    tasksCompleted: 23,
    totalTasks: 55,
  },
  {
    id: '3',
    name: 'Nyamata Health Center',
    location: 'Nyamata, Rwanda',
    status: 'on_track',
    progress: 85,
    budget: 950000,
    spent: 807500,
    startDate: '2025-06-01',
    endDate: '2026-04-30',
    engineer: 'Claude Uwimana',
    description: 'Community health center with modern facilities',
    materialsUsed: 567,
    tasksCompleted: 58,
    totalTasks: 68,
  },
  {
    id: '4',
    name: 'Huye Tech Campus',
    location: 'Huye, Rwanda',
    status: 'delayed',
    progress: 28,
    budget: 3200000,
    spent: 1120000,
    startDate: '2025-12-01',
    endDate: '2027-06-30',
    engineer: 'Diane Umutoni',
    description: 'Technology innovation campus with co-working spaces',
    materialsUsed: 124,
    tasksCompleted: 14,
    totalTasks: 50,
  },
  {
    id: '5',
    name: 'Musanze Eco Resort',
    location: 'Musanze, Rwanda',
    status: 'on_track',
    progress: 55,
    budget: 1500000,
    spent: 825000,
    startDate: '2025-10-01',
    endDate: '2026-12-31',
    engineer: 'Emmanuel Habimana',
    description: 'Sustainable eco-tourism resort near Volcanoes National Park',
    materialsUsed: 278,
    tasksCompleted: 33,
    totalTasks: 60,
  },
  {
    id: '6',
    name: 'Kigali Convention Center Phase 2',
    location: 'Kigali, Rwanda',
    status: 'completed',
    progress: 100,
    budget: 4500000,
    spent: 4230000,
    startDate: '2024-03-01',
    endDate: '2026-01-15',
    engineer: 'Alice Niyonzima',
    description: 'Expansion of the main convention center',
    materialsUsed: 891,
    tasksCompleted: 82,
    totalTasks: 82,
  },
]

export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Portland Cement',
    category: 'Structural',
    icon: 'building',
    stock: 450,
    maxStock: 600,
    unit: 'bags',
    value: 67500,
    supplier: 'Simba Cement Co.',
    warehouse: 'Warehouse A',
    status: 'in_stock',
    lastRestocked: '2026-07-01',
    usageHistory: [40, 52, 38, 61, 45, 55, 42],
  },
  {
    id: '2',
    name: 'Steel Rebar (12mm)',
    category: 'Structural',
    icon: 'ruler',
    stock: 120,
    maxStock: 300,
    unit: 'tons',
    value: 180000,
    supplier: 'Rwanda Steel Works',
    warehouse: 'Site Storage B',
    status: 'low_stock',
    lastRestocked: '2026-06-20',
    usageHistory: [15, 22, 18, 28, 20, 25, 12],
  },
  {
    id: '3',
    name: 'Concrete Blocks',
    category: 'Masonry',
    icon: 'box',
    stock: 2800,
    maxStock: 3000,
    unit: 'pcs',
    value: 28000,
    supplier: 'BlockMaster Ltd.',
    warehouse: 'Site Storage A',
    status: 'in_stock',
    lastRestocked: '2026-07-05',
    usageHistory: [200, 350, 280, 420, 300, 380, 250],
  },
  {
    id: '4',
    name: 'Electrical Cable (6mm)',
    category: 'Electrical',
    icon: 'zap',
    stock: 800,
    maxStock: 1000,
    unit: 'meters',
    value: 16000,
    supplier: 'PowerLine Supply',
    warehouse: 'Warehouse C',
    status: 'in_stock',
    lastRestocked: '2026-07-08',
    usageHistory: [60, 85, 72, 95, 78, 88, 65],
  },
  {
    id: '5',
    name: 'PVC Pipes (4 inch)',
    category: 'Plumbing',
    icon: 'pipe',
    stock: 45,
    maxStock: 200,
    unit: 'pcs',
    value: 4500,
    supplier: 'AquaFlow Pipes',
    warehouse: 'Warehouse B',
    status: 'low_stock',
    lastRestocked: '2026-06-15',
    usageHistory: [12, 18, 15, 22, 14, 16, 10],
  },
  {
    id: '6',
    name: 'Ceramic Tiles',
    category: 'Finishing',
    icon: 'grid-3x3',
    stock: 1500,
    maxStock: 2000,
    unit: 'sqft',
    value: 37500,
    supplier: 'TileWorld Rwanda',
    warehouse: 'Warehouse A',
    status: 'in_stock',
    lastRestocked: '2026-07-03',
    usageHistory: [120, 180, 145, 210, 160, 190, 130],
  },
  {
    id: '7',
    name: 'Sand (Fine)',
    category: 'Aggregate',
    icon: 'mountain',
    stock: 15,
    maxStock: 50,
    unit: 'tons',
    value: 1500,
    supplier: 'Kigali Aggregates',
    warehouse: 'Site Storage A',
    status: 'low_stock',
    lastRestocked: '2026-06-28',
    usageHistory: [3, 5, 4, 6, 4, 5, 3],
  },
  {
    id: '8',
    name: 'Glass Panels',
    category: 'Finishing',
    icon: 'square',
    stock: 0,
    maxStock: 100,
    unit: 'pcs',
    value: 0,
    supplier: 'Crystal Glass Co.',
    warehouse: 'Warehouse C',
    status: 'out_of_stock',
    lastRestocked: '2026-05-10',
    usageHistory: [8, 12, 10, 15, 11, 14, 0],
  },
]

export const recentActivity = [
  { id: '1', action: 'Material delivery confirmed', user: 'Store Keeper', timestamp: '10 min ago', type: 'inventory' as const },
  { id: '2', action: 'Budget report generated', user: 'Alice Niyonzima', timestamp: '25 min ago', type: 'project' as const },
  { id: '3', action: 'Task completed: Foundation inspection', user: 'Claude Uwimana', timestamp: '2 hr ago', type: 'task' as const },
  { id: '4', action: 'Low stock alert: Steel Rebar', user: 'System', timestamp: '3 hr ago', type: 'inventory' as const },
]

export const milestones = [
  { id: '1', name: 'Foundation Complete', date: '2025-12-15', status: 'completed' as const },
  { id: '2', name: 'Structural Frame', date: '2026-03-01', status: 'completed' as const },
  { id: '3', name: 'MEP Installation', date: '2026-06-15', status: 'in_progress' as const },
  { id: '4', name: 'Interior Finishing', date: '2026-09-30', status: 'upcoming' as const },
  { id: '5', name: 'Final Inspection', date: '2026-12-01', status: 'upcoming' as const },
]

export const dashboardStats = {
  totalBudget: 14350000,
  totalSpent: 9434500,
  activeProjects: 5,
  completedProjects: 1,
  totalMaterials: 2489,
  lowStockItems: 3,
  teamMembers: 24,
}

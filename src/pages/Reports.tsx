import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  FolderKanban,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  ArrowUpRight,
  Circle,
  ChevronDown,
  MapPin,
  Target,
  Layers,
  ListTodo,
  Wrench,
  Activity,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { FadeInUp, StatCard, StaggerContainer, StaggerItem } from '@/components/shared/SharedComponents'
import { useProjects, useProject, useInventory, useTeamMembers } from '@/hooks/useQueries'
import { cn, formatCurrency } from '@/lib/utils'

const CHART_COLORS = {
  accent: '#00B2FF',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  primary: '#1A2332',
  purple: '#8B5CF6',
}

const PIE_COLORS = [CHART_COLORS.accent, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.purple]

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  project_manager: 'Project Manager',
  site_engineer: 'Site Engineer',
  storekeeper: 'Storekeeper',
}

const statusLabels: Record<string, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
}

function ProjectSelector({ projects, selectedId, onChange }: { projects: any[]; selectedId: string; onChange: (id: string) => void }) {
  const selected = projects.find((p: any) => p.id === selectedId)
  return (
    <div className="relative">
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full sm:w-72 h-11 pl-4 pr-10 rounded-[12px] border border-border bg-white text-sm font-medium text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer"
      >
        <option value="all">All Projects Overview</option>
        {projects.map((p: any) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}

function MilestoneBar({ milestones }: { milestones: any[] }) {
  const completed = milestones.filter(m => m.status === 'completed').length
  const total = milestones.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">{completed} of {total} completed</span>
        <span className="text-xs font-bold text-accent">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-accent rounded-full"
        />
      </div>
      <div className="flex gap-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Completed</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> In Progress</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200" /> Upcoming</span>
      </div>
    </div>
  )
}

function TaskChart({ tasks }: { tasks: any[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach(t => {
      const s = t.status ?? 'todo'
      counts[s] = (counts[s] || 0) + 1
    })
    return Object.entries(counts).map(([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      value,
    }))
  }, [tasks])

  if (data.length === 0) return <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">No tasks yet</div>

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12px' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function BudgetBreakdownChart({ lines }: { lines: any[] }) {
  const data = useMemo(() => {
    return lines.map((l: any) => ({
      name: (l.category ?? l.name ?? 'Other').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      budget: Number(l.budgetedAmount ?? l.amount ?? 0),
      actual: Number(l.actualAmount ?? 0),
    }))
  }, [lines])

  if (data.length === 0) return <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">No budget lines</div>

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12px' }} formatter={(v: any) => [formatCurrency(v), '']} />
        <Bar dataKey="budget" fill={CHART_COLORS.accent} radius={[6, 6, 0, 0]} name="Budgeted" />
        <Bar dataKey="actual" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Actual" />
        <Legend verticalAlign="bottom" height={30} iconType="circle" iconSize={8} formatter={(v: string) => <span className="text-[11px] text-gray-600">{v}</span>} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SingleProjectView({ project }: { project: any }) {
  const budget = Number(project.budget ?? 0)
  const spent = Number(project.spent ?? 0)
  const progress = project.progress ?? 0
  const milestones = project.milestones ?? []
  const tasks = project.tasks ?? []
  const budgetLines = project.budgetLines ?? []
  const materials = project.materials ?? []
  const workers = project.workers ?? []
  const overBudget = budget > 0 && spent > budget

  const tasksByPriority = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach((t: any) => {
      const p = t.priority ?? 'medium'
      counts[p] = (counts[p] || 0) + 1
    })
    return Object.entries(counts).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }))
  }, [tasks])

  return (
    <div className="space-y-5">
      {/* Project Header */}
      <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-primary">{project.name}</h3>
            {project.location && (
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {project.location}
              </p>
            )}
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide',
              project.status === 'in_progress' && 'bg-accent/10 text-accent',
              project.status === 'completed' && 'bg-success/10 text-success',
              project.status === 'planning' && 'bg-gray-100 text-gray-500',
              project.status === 'on_hold' && 'bg-warning/10 text-warning',
            )}
          >
            {statusLabels[project.status] ?? project.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">Overall Progress</span>
            <span className="text-xs font-bold text-accent">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={cn('h-full rounded-full', progress >= 80 ? 'bg-success' : progress >= 40 ? 'bg-accent' : 'bg-warning')}
            />
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface rounded-[12px] p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Budget</p>
            <p className="text-sm font-bold text-primary">{formatCurrency(budget)}</p>
          </div>
          <div className="bg-surface rounded-[12px] p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Spent</p>
            <p className={cn('text-sm font-bold', overBudget ? 'text-danger' : 'text-primary')}>{formatCurrency(spent)}</p>
          </div>
          <div className="bg-surface rounded-[12px] p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Tasks</p>
            <p className="text-sm font-bold text-primary">{tasks.length}</p>
          </div>
          <div className="bg-surface rounded-[12px] p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Workers</p>
            <p className="text-sm font-bold text-primary">{workers.length}</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-primary flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" /> Milestones
          </h4>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wide">
            Timeline
          </span>
        </div>
        <MilestoneBar milestones={milestones} />
        {milestones.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {milestones.map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 text-sm">
                <span className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  m.status === 'completed' ? 'bg-success' : m.status === 'in_progress' ? 'bg-accent' : 'bg-gray-200'
                )} />
                <span className={cn('flex-1', m.status === 'upcoming' ? 'text-gray-400' : 'text-primary')}>{m.name}</span>
                {m.date && <span className="text-[11px] text-gray-400">{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tasks */}
        <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-accent" /> Tasks
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success uppercase tracking-wide">
              {tasks.length} total
            </span>
          </div>
          <TaskChart tasks={tasks} />
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" /> Budget Breakdown
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning uppercase tracking-wide">
              By Category
            </span>
          </div>
          <BudgetBreakdownChart lines={budgetLines} />
        </div>
      </div>

      {/* Materials & Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Materials */}
        <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
              <Wrench className="w-4 h-4 text-accent" /> Materials
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 uppercase tracking-wide">
              {materials.length} items
            </span>
          </div>
          {materials.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {materials.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-primary">{m.name}</p>
                    <p className="text-[11px] text-gray-400">{m.category ?? 'General'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{m.quantity} {m.unit ?? ''}</p>
                    {m.totalCost != null && <p className="text-[11px] text-gray-400">{formatCurrency(Number(m.totalCost))}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm py-8">No materials recorded</div>
          )}
        </div>

        {/* Workers */}
        <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" /> Workers
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wide">
              {workers.length} assigned
            </span>
          </div>
          {workers.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {workers.map((w: any) => (
                <div key={w.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-accent">
                      {(w.name ?? '?').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{w.name}</p>
                    <p className="text-[11px] text-gray-400">{w.role ?? 'Worker'}</p>
                  </div>
                  {w.dailyRate != null && (
                    <span className="text-xs font-semibold text-gray-500">{formatCurrency(Number(w.dailyRate))}/day</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm py-8">No workers assigned</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Reports() {
  const [selectedProjectId, setSelectedProjectId] = useState('all')
  const { data: projectsData, isLoading: projLoading } = useProjects()
  const { data: selectedProject, isLoading: singleLoading } = useProject(selectedProjectId !== 'all' ? selectedProjectId : '')
  const { data: inventoryData, isLoading: invLoading } = useInventory()
  const { data: teamData, isLoading: teamLoading } = useTeamMembers()

  const projects = (projectsData as any) ?? []
  const isLoading = projLoading || (selectedProjectId !== 'all' && singleLoading)

  const isAll = selectedProjectId === 'all'

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <FadeInUp>
        <div className="relative overflow-hidden rounded-[20px] md:rounded-[24px] bg-primary p-6 md:p-10">
          <div className="absolute inset-0 opacity-10">
            <div
              className="blueprint-grid absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
          </div>
          <div className="absolute top-6 right-6 w-48 h-48 border border-white/10 rounded-[40px] rotate-12 hidden md:block" />
          <div className="absolute bottom-6 right-24 w-32 h-32 border border-white/10 rounded-[32px] -rotate-6 hidden md:block" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-white/50 text-xs md:text-sm font-medium mb-2 uppercase tracking-widest">
                Reports & Analytics
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
                {isAll ? 'Performance Overview' : 'Project Report'}
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-lg">
                {isAll
                  ? 'Track project budgets, inventory health, and team productivity across your organization.'
                  : `Detailed analytics for ${selectedProject?.name ?? 'selected project'}.`}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <ProjectSelector
                projects={projects}
                selectedId={selectedProjectId}
                onChange={setSelectedProjectId}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-3 bg-white text-primary rounded-[14px] font-semibold text-sm hover:bg-white/90 transition-colors flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </motion.button>
            </div>
          </div>
        </div>
      </FadeInUp>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isAll ? (
        <AllProjectsView />
      ) : selectedProject ? (
        <SingleProjectView project={selectedProject} />
      ) : (
        <div className="text-center text-gray-400 py-16">Project not found</div>
      )}
    </div>
  )
}

function AllProjectsView() {
  const { data: projectsData } = useProjects()
  const { data: inventoryData } = useInventory()
  const { data: teamData } = useTeamMembers()

  const projects = (projectsData as any) ?? []
  const inventory = (inventoryData as any)?.items ?? []
  const team = (teamData as any)?.members ?? []

  const projectStatusData = useMemo(() => {
    const counts: Record<string, number> = {}
    projects.forEach((p: any) => {
      const status = p.status ?? 'unknown'
      counts[status] = (counts[status] || 0) + 1
    })
    return Object.entries(counts).map(([key, value]) => ({
      name: statusLabels[key] ?? key,
      value,
    }))
  }, [projects])

  const teamByRole = useMemo(() => {
    const counts: Record<string, number> = {}
    team.forEach((m: any) => {
      const role = m.role ?? 'unknown'
      counts[role] = (counts[role] || 0) + 1
    })
    return Object.entries(counts).map(([key, value]) => ({
      name: roleLabels[key] ?? key,
      value,
    }))
  }, [team])

  const inventoryStatusData = useMemo(() => {
    let inStock = 0, lowStock = 0, outOfStock = 0
    inventory.forEach((item: any) => {
      const qty = item.quantity ?? 0
      const min = item.minStock ?? 0
      if (qty === 0) outOfStock++
      else if (qty <= min) lowStock++
      else inStock++
    })
    return [
      { name: 'In Stock', value: inStock },
      { name: 'Low Stock', value: lowStock },
      { name: 'Out of Stock', value: outOfStock },
    ].filter(d => d.value > 0)
  }, [inventory])

  const budgetData = useMemo(() => {
    const monthly: Record<string, { budget: number; spent: number }> = {}
    projects.forEach((p: any) => {
      const created = new Date(p.createdAt ?? Date.now())
      const month = created.toLocaleString('en-US', { month: 'short' })
      if (!monthly[month]) monthly[month] = { budget: 0, spent: 0 }
      monthly[month].budget += Number(p.budget ?? 0)
      monthly[month].spent += Number(p.spent ?? 0)
    })
    return Object.entries(monthly).map(([month, data]) => ({
      month,
      budget: Math.round(data.budget / 1000),
      spent: Math.round(data.spent / 1000),
    }))
  }, [projects])

  const totalBudget = projects.reduce((sum: number, p: any) => sum + Number(p.budget ?? 0), 0)
  const totalSpent = projects.reduce((sum: number, p: any) => sum + Number(p.spent ?? 0), 0)
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  return (
    <>
      {/* Summary Stats */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <StaggerItem>
          <StatCard
            icon={FolderKanban}
            label="Total Projects"
            value={projects.length.toString()}
            change={`${projectStatusData.find(d => d.name === 'In Progress')?.value ?? 0} active`}
            color="bg-accent/8 text-accent"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Package}
            label="Inventory Items"
            value={inventory.length.toString()}
            change={`${inventoryStatusData.find(d => d.name === 'Low Stock')?.value ?? 0} low stock`}
            color="bg-success/8 text-success"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Users}
            label="Team Members"
            value={team.length.toString()}
            change={`${teamByRole.length} roles`}
            color="bg-purple-500/8 text-purple-500"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={DollarSign}
            label="Budget Utilization"
            value={`${budgetUtilization}%`}
            change={`${formatCurrency(totalSpent)} / ${formatCurrency(totalBudget)}`}
            color="bg-warning/8 text-warning"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FadeInUp delay={0.15}>
          <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary">Project Status</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wide">Breakdown</span>
            </div>
            {projectStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {projectStatusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(v: string) => <span className="text-xs text-gray-600">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm">No project data yet</div>
            )}
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary">Inventory Health</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success uppercase tracking-wide">Stock Levels</span>
            </div>
            {inventoryStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={inventoryStatusData} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12px' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {inventoryStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.name === 'In Stock' ? CHART_COLORS.success : entry.name === 'Low Stock' ? CHART_COLORS.warning : CHART_COLORS.danger} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm">No inventory data yet</div>
            )}
          </div>
        </FadeInUp>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FadeInUp delay={0.25}>
          <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary">Budget vs Spending</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning uppercase tracking-wide">$ thousands</span>
            </div>
            {budgetData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={budgetData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12px' }} formatter={(v: any) => [`$${v}K`, '']} />
                  <Bar dataKey="budget" fill={CHART_COLORS.accent} radius={[6, 6, 0, 0]} name="Budget" />
                  <Bar dataKey="spent" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Spent" />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(v: string) => <span className="text-xs text-gray-600">{v}</span>} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm">No budget data yet</div>
            )}
          </div>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-primary">Team Composition</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 uppercase tracking-wide">By Role</span>
            </div>
            {teamByRole.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={teamByRole} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                    {teamByRole.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(v: string) => <span className="text-xs text-gray-600">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm">No team data yet</div>
            )}
          </div>
        </FadeInUp>
      </div>

      {/* Detailed Project Table */}
      <FadeInUp delay={0.35}>
        <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-primary">Project Details</h3>
              <span className="text-xs text-gray-400 font-medium">{projects.length} projects</span>
            </div>
          </div>
          {projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Project</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Budget</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Spent</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {projects.map((project: any) => {
                    const budget = Number(project.budget ?? 0)
                    const spent = Number(project.spent ?? 0)
                    const progress = project.progress ?? 0
                    const overBudget = budget > 0 && spent > budget
                    return (
                      <tr key={project.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-primary truncate max-w-[200px]">{project.name}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{project.location ?? 'No location'}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide',
                            project.status === 'in_progress' && 'bg-accent/10 text-accent',
                            project.status === 'completed' && 'bg-success/10 text-success',
                            project.status === 'planning' && 'bg-gray-100 text-gray-500',
                            project.status === 'on_hold' && 'bg-warning/10 text-warning',
                            !['in_progress', 'completed', 'planning', 'on_hold'].includes(project.status) && 'bg-gray-100 text-gray-500'
                          )}>
                            {project.status === 'in_progress' && <Clock className="w-2.5 h-2.5" />}
                            {project.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                            {project.status === 'on_hold' && <AlertTriangle className="w-2.5 h-2.5" />}
                            {(project.status === 'planning' || !['in_progress', 'completed', 'on_hold'].includes(project.status)) && <Circle className="w-2.5 h-2.5" />}
                            {(project.status ?? 'unknown').replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium text-primary">{formatCurrency(budget)}</td>
                        <td className={cn('px-5 py-3.5 text-right font-medium', overBudget ? 'text-danger' : 'text-primary')}>
                          {formatCurrency(spent)}
                          {overBudget && <ArrowUpRight className="inline w-3 h-3 ml-0.5 text-danger" />}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full transition-all', progress >= 80 ? 'bg-success' : progress >= 40 ? 'bg-accent' : 'bg-warning')}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-500 w-8 text-right">{progress}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm">No projects to display</div>
          )}
        </div>
      </FadeInUp>
    </>
  )
}

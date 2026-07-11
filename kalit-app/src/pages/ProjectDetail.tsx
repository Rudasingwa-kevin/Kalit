import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Package,
  CheckCircle2,
  Circle,
  Camera,
  FileText,
  BarChart3,
  Clock,
  TrendingUp,
  Layers,
  Target,
  Activity,
  MessageSquare,
  Plus,
  ChevronRight,
  Edit,
  Share2,
  MoreHorizontal,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { projects, milestones } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { FadeInUp, StatusBadge, CircularProgress, ProgressBar, StaggerContainer, StaggerItem } from '@/components/shared/SharedComponents'
import GanttChart from '@/components/gantt/GanttChart'

const tabs = ['Overview', 'Budget', 'Tasks', 'Timeline', 'Materials', 'Expenses', 'Workers', 'Photos', 'Documents', 'Reports', 'Activity']

const budgetBreakdown = [
  { category: 'Materials', allocated: 680000, spent: 456000, color: '#2563EB' },
  { category: 'Labor', allocated: 520000, spent: 416000, color: '#1F2937' },
  { category: 'Equipment', allocated: 320000, spent: 288000, color: '#22C55E' },
  { category: 'Overhead', allocated: 280000, spent: 196000, color: '#F59E0B' },
  { category: 'Contingency', allocated: 200000, spent: 0, color: '#8B5CF6' },
]

const projectMaterials = [
  { name: 'Portland Cement', used: 450, remaining: 150, unit: 'bags', trend: [30, 42, 35, 48, 38, 45, 40] },
  { name: 'Steel Rebar (12mm)', used: 120, remaining: 30, unit: 'tons', trend: [12, 18, 14, 22, 16, 20, 10] },
  { name: 'Concrete Blocks', used: 1800, remaining: 200, unit: 'pcs', trend: [150, 220, 180, 280, 200, 240, 160] },
  { name: 'Electrical Cable', used: 800, remaining: 200, unit: 'meters', trend: [60, 85, 72, 95, 78, 88, 65] },
  { name: 'Ceramic Tiles', used: 1500, remaining: 500, unit: 'sqft', trend: [120, 180, 145, 210, 160, 190, 130] },
]

const workers = [
  { name: 'Patrick Mugabo', role: 'Site Supervisor', hours: 168, status: 'active' },
  { name: 'Claude Uwimana', role: 'Structural Engineer', hours: 152, status: 'active' },
  { name: 'Emmanuel Habimana', role: 'Electrical Engineer', hours: 144, status: 'active' },
  { name: 'Grace Musabende', role: 'Quality Inspector', hours: 128, status: 'active' },
  { name: 'Jean Mugiraneza', role: 'Safety Officer', hours: 160, status: 'active' },
  { name: 'Diane Umutoni', role: 'Project Coordinator', hours: 136, status: 'leave' },
]

const recentTasks = [
  { id: 1, title: 'Foundation inspection completed', assignee: 'Claude Uwimana', done: true, date: '2026-07-08' },
  { id: 2, title: 'Steel delivery verification', assignee: 'Patrick Mugabo', done: true, date: '2026-07-07' },
  { id: 3, title: 'MEP installation progress review', assignee: 'Emmanuel Habimana', done: false, date: '2026-07-10' },
  { id: 4, title: 'Quality control - Floor 6', assignee: 'Grace Musabende', done: false, date: '2026-07-11' },
  { id: 5, title: 'Material requisition - Glass panels', assignee: 'Store Keeper', done: false, date: '2026-07-12' },
]

const activityLog = [
  { action: 'Material delivery confirmed: 100 bags cement', time: '10 min ago', user: 'Store Keeper', type: 'inventory' },
  { action: 'Budget report generated for Q3', time: '25 min ago', user: 'Alice Niyonzima', type: 'report' },
  { action: 'Task completed: Foundation inspection', time: '2 hr ago', user: 'Claude Uwimana', type: 'task' },
  { action: 'New photo uploaded: Floor 6 progress', time: '3 hr ago', user: 'Patrick Mugabo', type: 'photo' },
  { action: 'Expense approved: Steel delivery - $45,000', time: '5 hr ago', user: 'Jean-Paul Hakizimana', type: 'expense' },
  { action: 'Worker attendance updated', time: '6 hr ago', user: 'System', type: 'system' },
]

export default function ProjectDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  const project = projects.find(p => p.id === id) || projects[0]

  const budgetProgress = (project.spent / project.budget) * 100

  return (
    <div className="space-y-8">
      {/* Breadcrumb + Header */}
      <FadeInUp>
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="bg-white rounded-[20px] border border-border/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-[16px] bg-accent/8 flex items-center justify-center flex-shrink-0">
                <Layers className="w-7 h-7 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-primary">{project.name}</h1>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />{project.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users className="w-3.5 h-3.5" />{project.engineer}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(project.startDate).toLocaleDateString()} — {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-[12px] text-sm font-semibold text-primary hover:bg-surface-hover transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-[12px] text-sm font-semibold hover:bg-accent-dark transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Project
              </motion.button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border-light">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Progress</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-primary">{project.progress}%</p>
                <div className="flex-1 h-2 rounded-full bg-border/50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1.2 }}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Budget Used</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(project.spent)}</p>
              <p className="text-xs text-gray-400 mt-0.5">of {formatCurrency(project.budget)}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Tasks</p>
              <p className="text-2xl font-bold text-primary">{project.tasksCompleted}/{project.totalTasks}</p>
              <p className="text-xs text-gray-400 mt-0.5">completed</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Materials Used</p>
              <p className="text-2xl font-bold text-primary">{project.materialsUsed}</p>
              <p className="text-xs text-gray-400 mt-0.5">items consumed</p>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Tabs */}
      <FadeInUp delay={0.1}>
        <div className="bg-white rounded-[16px] border border-border/50 p-1.5 inline-flex gap-1 overflow-x-auto max-w-full">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-[10px] text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-400 hover:text-primary hover:bg-surface-hover'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </FadeInUp>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Health + Milestones */}
              <div className="xl:col-span-2 space-y-6">
                {/* Construction Health */}
                <div className="bg-white rounded-[20px] border border-border/50 p-6">
                  <h3 className="text-lg font-bold text-primary mb-6">Construction Health</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <CircularProgress value={project.progress} size={90} strokeWidth={7} color="#2563EB" />
                      <p className="text-xs text-gray-400 font-medium mt-2">Overall Progress</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress value={82} size={90} strokeWidth={7} color="#22C55E" />
                      <p className="text-xs text-gray-400 font-medium mt-2">Quality Score</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress value={68} size={90} strokeWidth={7} color="#F59E0B" />
                      <p className="text-xs text-gray-400 font-medium mt-2">Schedule Adherence</p>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="bg-white rounded-[20px] border border-border/50 p-6">
                  <h3 className="text-lg font-bold text-primary mb-6">Milestones</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-border" />
                    <div className="space-y-5">
                      {milestones.map((ms, i) => (
                        <motion.div
                          key={ms.id}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative flex items-start gap-4 pl-1"
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                            ms.status === 'completed' ? 'bg-success text-white' :
                            ms.status === 'in_progress' ? 'bg-accent text-white' :
                            'bg-white border-2 border-border text-gray-300'
                          }`}>
                            {ms.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                             ms.status === 'in_progress' ? <Target className="w-3.5 h-3.5" /> :
                             <Circle className="w-2 h-2" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <h4 className={`text-sm font-semibold ${ms.status === 'upcoming' ? 'text-gray-400' : 'text-primary'}`}>
                              {ms.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5">{ms.date}</p>
                          </div>
                          {ms.status === 'in_progress' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                              Active
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Recent Tasks */}
                <div className="bg-white rounded-[20px] border border-border/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-primary">Recent Tasks</h3>
                    <button className="text-xs font-medium text-accent">View All</button>
                  </div>
                  <div className="space-y-3">
                    {recentTasks.map(task => (
                      <div key={task.id} className="flex items-start gap-3 p-3 rounded-[12px] hover:bg-surface-hover transition-colors">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          task.done ? 'bg-success text-white' : 'border-2 border-border'
                        }`}>
                          {task.done && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-primary'}`}>
                            {task.title}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{task.assignee} · {task.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-[20px] border border-border/50 p-6">
                  <h3 className="text-base font-bold text-primary mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Upload Photo', icon: Camera },
                      { label: 'Add Document', icon: FileText },
                      { label: 'Log Expense', icon: DollarSign },
                      { label: 'Add Material', icon: Package },
                    ].map(action => (
                      <motion.button
                        key={action.label}
                        whileHover={{ x: 4 }}
                        className="w-full flex items-center gap-3 p-3 rounded-[12px] text-left hover:bg-surface-hover transition-colors"
                      >
                        <action.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-primary">{action.label}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Budget' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[20px] border border-border/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-primary">Budget Breakdown</h3>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{formatCurrency(project.budget)}</p>
                    <p className="text-sm text-gray-400">Total Budget</p>
                  </div>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={budgetBreakdown.map(b => ({ ...b, percent: Math.round((b.spent / b.allocated) * 100) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={v => `${v / 1000}K`} />
                      <Tooltip
                        contentStyle={{
                          background: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                        }}
                        formatter={(value: number) => [formatCurrency(value)]}
                      />
                      <Area type="monotone" dataKey="allocated" stroke="#E5E7EB" fill="none" strokeWidth={2} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="spent" stroke="#2563EB" fill="rgba(37, 99, 235, 0.1)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-border-light">
                  {budgetBreakdown.map(item => (
                    <div key={item.category}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-medium text-gray-500">{item.category}</span>
                      </div>
                      <p className="text-sm font-bold text-primary">{formatCurrency(item.spent)}</p>
                      <p className="text-[11px] text-gray-400">of {formatCurrency(item.allocated)}</p>
                      <div className="w-full h-1.5 rounded-full bg-border/50 mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(item.spent / item.allocated) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Tasks' && (
            <div className="bg-white rounded-[20px] border border-border/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-primary">Project Tasks</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-[12px] text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </motion.button>
              </div>
              <div className="space-y-2">
                {recentTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 p-4 rounded-[14px] hover:bg-surface-hover transition-colors group">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      task.done ? 'bg-success text-white' : 'border-2 border-border group-hover:border-accent'
                    }`}>
                      {task.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-primary'}`}>{task.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{task.date}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{task.assignee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Materials' && (
            <div className="space-y-4">
              {projectMaterials.map((mat, i) => {
                const usagePercent = (mat.used / (mat.used + mat.remaining)) * 100
                return (
                  <motion.div
                    key={mat.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-[16px] border border-border/50 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-base font-bold text-primary">{mat.name}</h4>
                        <p className="text-xs text-gray-400">{mat.used} {mat.unit} used · {mat.remaining} remaining</p>
                      </div>
                      <div className="w-20 h-20">
                        <CircularProgress value={usagePercent} size={80} strokeWidth={6} color={usagePercent > 80 ? '#F59E0B' : '#2563EB'} />
                      </div>
                    </div>
                    <div className="flex items-end gap-[3px] h-10">
                      {mat.trend.map((val, j) => (
                        <motion.div
                          key={j}
                          className="flex-1 rounded-sm bg-accent/20"
                          initial={{ height: 0 }}
                          animate={{ height: `${(val / Math.max(...mat.trend)) * 100}%` }}
                          transition={{ duration: 0.5, delay: j * 0.05 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {activeTab === 'Workers' && (
            <div className="bg-white rounded-[20px] border border-border/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-primary">Team Members</h3>
                <span className="text-sm text-gray-400">{workers.length} members</span>
              </div>
              <div className="space-y-3">
                {workers.map((worker, i) => (
                  <motion.div
                    key={worker.name}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4 p-4 rounded-[14px] hover:bg-surface-hover transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-primary">{worker.name}</h4>
                      <p className="text-xs text-gray-400">{worker.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{worker.hours}h</p>
                      <p className="text-[11px] text-gray-400">this month</p>
                    </div>
                    <StatusBadge status={worker.status === 'active' ? 'active' : 'inactive'} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="bg-white rounded-[20px] border border-border/50 p-6">
              <h3 className="text-lg font-bold text-primary mb-6">Activity Feed</h3>
              <div className="space-y-4">
                {activityLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-[14px] hover:bg-surface-hover transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">{log.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{log.user}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{log.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Timeline' && (
            <GanttChart />
          )}

          {/* Default content for tabs without specific implementations */}
          {!['Overview', 'Budget', 'Tasks', 'Timeline', 'Materials', 'Workers', 'Activity'].includes(activeTab) && (
            <div className="bg-white rounded-[20px] border border-border/50 p-12 text-center">
              <div className="w-16 h-16 rounded-[20px] bg-surface mx-auto mb-4 flex items-center justify-center">
                <Layers className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-1">{activeTab}</h3>
              <p className="text-sm text-gray-400">This section is coming soon</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

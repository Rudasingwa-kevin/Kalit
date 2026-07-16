import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
  Circle,
  Target,
  Plus,
  ChevronRight,
  Edit,
  Share2,
} from 'lucide-react'
import { useProject } from '@/hooks/useQueries'
import { milestones } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { FadeInUp, StatusBadge, CircularProgress } from '@/components/shared/SharedComponents'

const tabs = ['Overview', 'Budget', 'Tasks', 'Materials', 'Workers', 'Activity']

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
  { name: 'Patrick Mugabo', role: 'Site Supervisor', hours: 168 },
  { name: 'Claude Uwimana', role: 'Structural Engineer', hours: 152 },
  { name: 'Emmanuel Habimana', role: 'Electrical Engineer', hours: 144 },
  { name: 'Grace Musabende', role: 'Quality Inspector', hours: 128 },
  { name: 'Jean Mugiraneza', role: 'Safety Officer', hours: 160 },
]

const recentTasks = [
  { id: 1, title: 'Foundation inspection completed', assignee: 'Claude Uwimana', done: true, date: '2026-07-08' },
  { id: 2, title: 'Steel delivery verification', assignee: 'Patrick Mugabo', done: true, date: '2026-07-07' },
  { id: 3, title: 'MEP installation progress review', assignee: 'Emmanuel Habimana', done: false, date: '2026-07-10' },
  { id: 4, title: 'Quality control - Floor 6', assignee: 'Grace Musabende', done: false, date: '2026-07-11' },
  { id: 5, title: 'Material requisition - Glass panels', assignee: 'Store Keeper', done: false, date: '2026-07-12' },
]

const activityLog = [
  { action: 'Material delivery confirmed: 100 bags cement', time: '10 min ago', user: 'Store Keeper' },
  { action: 'Budget report generated for Q3', time: '25 min ago', user: 'Alice Niyonzima' },
  { action: 'Task completed: Foundation inspection', time: '2 hr ago', user: 'Claude Uwimana' },
  { action: 'Expense approved: Steel delivery - RF 45,000', time: '5 hr ago', user: 'Jean-Paul Hakizimana' },
]

export default function ProjectDetail() {
  const { id } = useParams()
  const { data: project, isLoading } = useProject(id || '1')
  const [activeTab, setActiveTab] = useState('Overview')

  if (isLoading || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <FadeInUp>
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs md:text-sm text-gray-400 hover:text-accent transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="bg-white rounded-[16px] md:rounded-[20px] border border-border/50 p-5 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
            <div className="flex items-start gap-3 md:gap-5">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-[14px] md:rounded-[16px] bg-accent/8 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 md:w-7 md:h-7 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                  <h1 className="text-lg md:text-2xl font-bold text-primary">{project.name}</h1>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs md:text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400"><MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />{project.location}</span>
                  <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400"><Users className="w-3 h-3 md:w-3.5 md:h-3.5" />{project.engineer}</span>
                  <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400">
                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {new Date(project.startDate).toLocaleDateString()} — {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 border border-border rounded-[10px] md:rounded-[12px] text-xs md:text-sm font-semibold text-primary hover:bg-surface-hover transition-colors">
                <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-accent text-white rounded-[10px] md:rounded-[12px] text-xs md:text-sm font-semibold hover:bg-accent-dark transition-colors">
                <Edit className="w-4 h-4" /> Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-border-light">
            <div>
              <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Progress</p>
              <div className="flex items-center gap-2 md:gap-3">
                <p className="text-xl md:text-2xl font-bold text-primary">{project.progress}%</p>
                <div className="flex-1 h-2 rounded-full bg-border/50 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1.2 }} />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Budget Used</p>
              <p className="text-xl md:text-2xl font-bold text-primary truncate">{formatCurrency(project.spent)}</p>
              <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">of {formatCurrency(project.budget)}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Tasks</p>
              <p className="text-xl md:text-2xl font-bold text-primary">{project.tasksCompleted}/{project.totalTasks}</p>
              <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">completed</p>
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">Materials Used</p>
              <p className="text-xl md:text-2xl font-bold text-primary">{project.materialsUsed}</p>
              <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">items consumed</p>
            </div>
          </div>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div className="bg-white rounded-[14px] md:rounded-[16px] border border-border/50 p-1 inline-flex gap-1 overflow-x-auto max-w-full scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-[8px] md:rounded-[10px] text-xs md:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary hover:bg-surface-hover'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </FadeInUp>

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
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white rounded-[20px] border border-border/50 p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-primary mb-4 md:mb-6">Construction Health</h3>
                  <div className="grid grid-cols-3 gap-3 md:gap-6">
                    <div className="text-center">
                      <CircularProgress value={project.progress} size={70} strokeWidth={6} color="#2563EB" />
                      <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-2">Overall Progress</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress value={82} size={70} strokeWidth={6} color="#22C55E" />
                      <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-2">Quality Score</p>
                    </div>
                    <div className="text-center">
                      <CircularProgress value={68} size={70} strokeWidth={6} color="#F59E0B" />
                      <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-2">Schedule Adherence</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-[20px] border border-border/50 p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-primary mb-4 md:mb-6">Milestones</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-border" />
                    <div className="space-y-4 md:space-y-5">
                      {milestones.map((ms, i) => (
                        <motion.div key={ms.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative flex items-start gap-3 md:gap-4 pl-1">
                          <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${ms.status === 'completed' ? 'bg-success text-white' : ms.status === 'in_progress' ? 'bg-accent text-white' : 'bg-white border-2 border-border text-gray-300'}`}>
                            {ms.status === 'completed' ? <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" /> : ms.status === 'in_progress' ? <Target className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <Circle className="w-2 h-2" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <h4 className={`text-xs md:text-sm font-semibold ${ms.status === 'upcoming' ? 'text-gray-400' : 'text-primary'}`}>{ms.name}</h4>
                            <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">{ms.date}</p>
                          </div>
                          {ms.status === 'in_progress' && <span className="text-[9px] md:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">Active</span>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-[20px] border border-border/50 p-4 md:p-6">
                  <h3 className="text-sm md:text-base font-bold text-primary mb-3 md:mb-4">Recent Tasks</h3>
                  <div className="space-y-2 md:space-y-3">
                    {recentTasks.map(task => (
                      <div key={task.id} className="flex items-start gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-[10px] md:rounded-[12px] hover:bg-surface-hover transition-colors">
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${task.done ? 'bg-success text-white' : 'border-2 border-border'}`}>
                          {task.done && <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs md:text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-primary'}`}>{task.title}</p>
                          <p className="text-[9px] md:text-[11px] text-gray-400 mt-0.5">{task.assignee} · {task.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-[20px] border border-border/50 p-4 md:p-6">
                  <h3 className="text-sm md:text-base font-bold text-primary mb-3 md:mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {['Log Expense', 'Add Material', 'Upload Photo'].map(label => (
                      <button key={label} className="w-full flex items-center gap-3 p-2.5 md:p-3 rounded-[10px] md:rounded-[12px] text-left hover:bg-surface-hover transition-colors">
                        <span className="text-xs md:text-sm font-medium text-primary">{label}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Budget' && (
            <div className="bg-white rounded-[20px] border border-border/50 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-primary mb-4 md:mb-6">Budget Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                {budgetBreakdown.map(item => (
                  <div key={item.category}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] md:text-xs font-medium text-gray-500">{item.category}</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-primary">{formatCurrency(item.spent)}</p>
                    <p className="text-[10px] md:text-[11px] text-gray-400">of {formatCurrency(item.allocated)}</p>
                    <div className="w-full h-1.5 rounded-full bg-border/50 mt-2 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }} initial={{ width: 0 }} whileInView={{ width: `${(item.spent / item.allocated) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Tasks' && (
            <div className="bg-white rounded-[20px] border border-border/50 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-bold text-primary">Project Tasks</h3>
                <button className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-accent text-white rounded-[10px] md:rounded-[12px] text-xs md:text-sm font-semibold">
                  <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Task</span>
                </button>
              </div>
              <div className="space-y-2">
                {recentTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-[12px] md:rounded-[14px] hover:bg-surface-hover transition-colors group">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-success text-white' : 'border-2 border-border group-hover:border-accent'}`}>
                      {task.done && <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs md:text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-primary'}`}>{task.title}</p>
                      <p className="text-[9px] md:text-[11px] text-gray-400 mt-0.5">{task.date}</p>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-400 font-medium hidden sm:inline">{task.assignee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Materials' && (
            <div className="space-y-3 md:space-y-4">
              {projectMaterials.map((mat, i) => {
                const usagePercent = (mat.used / (mat.used + mat.remaining)) * 100
                return (
                  <motion.div key={mat.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-[14px] md:rounded-[16px] border border-border/50 p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm md:text-base font-bold text-primary">{mat.name}</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">{mat.used} {mat.unit} used · {mat.remaining} remaining</p>
                      </div>
                      <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                        <CircularProgress value={usagePercent} size={64} strokeWidth={5} color={usagePercent > 80 ? '#F59E0B' : '#2563EB'} />
                      </div>
                    </div>
                    <div className="flex items-end gap-[3px] h-8 md:h-10">
                      {mat.trend.map((val, j) => (
                        <motion.div key={j} className="flex-1 rounded-sm bg-accent/20" initial={{ height: 0 }} whileInView={{ height: `${(val / Math.max(...mat.trend)) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.5, delay: j * 0.05 }} />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {activeTab === 'Workers' && (
            <div className="bg-white rounded-[20px] border border-border/50 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-primary mb-4 md:mb-6">Team Members</h3>
              <div className="space-y-2 md:space-y-3">
                {workers.map((worker, i) => (
                  <motion.div key={worker.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-[12px] md:rounded-[14px] hover:bg-surface-hover transition-colors">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] md:text-xs font-bold text-primary">{worker.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-semibold text-primary truncate">{worker.name}</h4>
                      <p className="text-[10px] md:text-xs text-gray-400 truncate">{worker.role}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs md:text-sm font-bold text-primary">{worker.hours}h</p>
                      <p className="text-[9px] md:text-[11px] text-gray-400">this month</p>
                    </div>
                    <StatusBadge status="active" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="bg-white rounded-[20px] border border-border/50 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-primary mb-4 md:mb-6">Activity Feed</h3>
              <div className="space-y-3 md:space-y-4">
                {activityLog.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-[12px] md:rounded-[14px] hover:bg-surface-hover transition-colors">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs md:text-sm font-medium text-primary">{log.action}</p>
                      <div className="flex items-center gap-1.5 md:gap-2 mt-1">
                        <span className="text-[10px] md:text-xs text-gray-400">{log.user}</span>
                        <span className="text-[10px] md:text-xs text-gray-300">·</span>
                        <span className="text-[10px] md:text-xs text-gray-400">{log.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

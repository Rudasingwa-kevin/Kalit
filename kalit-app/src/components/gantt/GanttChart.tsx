import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Calendar,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeInUp } from '@/components/shared/SharedComponents'

type ZoomLevel = 'day' | 'week' | 'month'

interface GanttTask {
  id: string
  name: string
  engineer: string
  startDate: string
  endDate: string
  progress: number
  status: 'completed' | 'active' | 'delayed' | 'upcoming'
  dependencies?: string[]
  subtasks?: GanttTask[]
}

const sampleTasks: GanttTask[] = [
  {
    id: '1',
    name: 'Foundation Work',
    engineer: 'Claude Uwimana',
    startDate: '2025-09-01',
    endDate: '2025-12-15',
    progress: 100,
    status: 'completed',
    subtasks: [
      { id: '1-1', name: 'Excavation', engineer: 'Claude Uwimana', startDate: '2025-09-01', endDate: '2025-09-30', progress: 100, status: 'completed' },
      { id: '1-2', name: 'Footings', engineer: 'Claude Uwimana', startDate: '2025-10-01', endDate: '2025-10-31', progress: 100, status: 'completed' },
      { id: '1-3', name: 'Foundation Walls', engineer: 'Claude Uwimana', startDate: '2025-11-01', endDate: '2025-12-15', progress: 100, status: 'completed' },
    ],
  },
  {
    id: '2',
    name: 'Structural Frame',
    engineer: 'Claude Uwimana',
    startDate: '2025-12-16',
    endDate: '2026-03-01',
    progress: 100,
    status: 'completed',
    subtasks: [
      { id: '2-1', name: 'Steel Erection', engineer: 'Patrick Mugabo', startDate: '2025-12-16', endDate: '2026-01-31', progress: 100, status: 'completed' },
      { id: '2-2', name: 'Concrete Pouring', engineer: 'Claude Uwimana', startDate: '2026-02-01', endDate: '2026-03-01', progress: 100, status: 'completed' },
    ],
  },
  {
    id: '3',
    name: 'MEP Installation',
    engineer: 'Emmanuel Habimana',
    startDate: '2026-03-01',
    endDate: '2026-06-15',
    progress: 65,
    status: 'active',
    subtasks: [
      { id: '3-1', name: 'Electrical Rough-in', engineer: 'Emmanuel Habimana', startDate: '2026-03-01', endDate: '2026-04-15', progress: 100, status: 'completed' },
      { id: '3-2', name: 'Plumbing Rough-in', engineer: 'Emmanuel Habimana', startDate: '2026-04-01', endDate: '2026-05-15', progress: 75, status: 'active' },
      { id: '3-3', name: 'HVAC Installation', engineer: 'Emmanuel Habimana', startDate: '2026-05-01', endDate: '2026-06-15', progress: 20, status: 'active' },
    ],
  },
  {
    id: '4',
    name: 'Interior Finishing',
    engineer: 'Diane Umutoni',
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    progress: 0,
    status: 'upcoming',
    subtasks: [
      { id: '4-1', name: 'Drywall', engineer: 'Diane Umutoni', startDate: '2026-06-01', endDate: '2026-07-15', progress: 0, status: 'upcoming' },
      { id: '4-2', name: 'Painting', engineer: 'Diane Umutoni', startDate: '2026-07-01', endDate: '2026-08-15', progress: 0, status: 'upcoming' },
      { id: '4-3', name: 'Flooring', engineer: 'Diane Umutoni', startDate: '2026-08-01', endDate: '2026-09-30', progress: 0, status: 'upcoming' },
    ],
  },
  {
    id: '5',
    name: 'Exterior Works',
    engineer: 'Patrick Mugabo',
    startDate: '2026-07-01',
    endDate: '2026-10-31',
    progress: 0,
    status: 'delayed',
    subtasks: [
      { id: '5-1', name: 'Facade Cladding', engineer: 'Patrick Mugabo', startDate: '2026-07-01', endDate: '2026-08-31', progress: 0, status: 'upcoming' },
      { id: '5-2', name: 'Landscaping', engineer: 'Patrick Mugabo', startDate: '2026-09-01', endDate: '2026-10-31', progress: 0, status: 'upcoming' },
    ],
  },
  {
    id: '6',
    name: 'Quality Inspection',
    engineer: 'Grace Musabende',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    progress: 0,
    status: 'upcoming',
  },
  {
    id: '7',
    name: 'Final Handover',
    engineer: 'Alice Niyonzima',
    startDate: '2026-11-15',
    endDate: '2026-12-01',
    progress: 0,
    status: 'upcoming',
  },
]

const statusConfig = {
  completed: { color: '#22C55E', bg: 'bg-success/10', text: 'text-success', label: 'Completed', icon: CheckCircle2 },
  active: { color: '#2563EB', bg: 'bg-accent/10', text: 'text-accent', label: 'Active', icon: Clock },
  delayed: { color: '#EF4444', bg: 'bg-danger/10', text: 'text-danger', label: 'Delayed', icon: AlertTriangle },
  upcoming: { color: '#9CA3AF', bg: 'bg-gray-100', text: 'text-gray-400', label: 'Upcoming', icon: Circle },
}

function getDaysBetween(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDateFull(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function GanttChart() {
  const [zoom, setZoom] = useState<ZoomLevel>('week')
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(['1', '2', '3']))
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const projectStart = '2025-09-01'
  const projectEnd = '2026-12-01'

  const totalDays = getDaysBetween(projectStart, projectEnd)

  const dayWidth = zoom === 'day' ? 4 : zoom === 'week' ? 2 : 0.8

  const toggleTask = useCallback((id: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const visibleTasks = useMemo(() => {
    const result: { task: GanttTask; level: number; isParent: boolean }[] = []
    sampleTasks.forEach(task => {
      result.push({ task, level: 0, isParent: !!(task.subtasks && task.subtasks.length > 0) })
      if (expandedTasks.has(task.id) && task.subtasks) {
        task.subtasks.forEach(sub => {
          result.push({ task: sub, level: 1, isParent: false })
        })
      }
    })
    return result
  }, [expandedTasks])

  const getBarLeft = (date: string) => {
    const days = getDaysBetween(projectStart, date)
    return days * dayWidth
  }

  const getBarWidth = (start: string, end: string) => {
    const days = getDaysBetween(start, end)
    return Math.max(days * dayWidth, 4)
  }

  const timelineDays = useMemo(() => {
    const days: { date: string; label: string; isWeekStart: boolean; isMonthStart: boolean }[] = []
    const start = new Date(projectStart)
    const end = new Date(projectEnd)
    const current = new Date(start)

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0]
      const isWeekStart = current.getDay() === 1
      const isMonthStart = current.getDate() === 1
      let label = ''

      if (zoom === 'day') {
        label = current.toLocaleDateString('en-US', { day: 'numeric' })
      } else if (zoom === 'week' && isWeekStart) {
        label = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else if (zoom === 'month' && isMonthStart) {
        label = current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      }

      days.push({ date: dateStr, label, isWeekStart, isMonthStart })
      current.setDate(current.getDate() + 1)
    }
    return days
  }, [zoom])

  const shouldShowTick = (day: typeof timelineDays[0]) => {
    if (zoom === 'day') return true
    if (zoom === 'week') return day.isWeekStart
    return day.isMonthStart
  }

  return (
    <FadeInUp>
      <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div>
            <h3 className="text-lg font-bold text-primary">Project Timeline</h3>
            <p className="text-sm text-gray-400 mt-0.5">Kigali Heights Extension</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Status Legend */}
            <div className="hidden md:flex items-center gap-4 mr-4">
              {Object.entries(statusConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-[11px] text-gray-400 font-medium">{config.label}</span>
                </div>
              ))}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center bg-surface rounded-[10px] p-1">
              <button
                onClick={() => setZoom('day')}
                className={cn('px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all', zoom === 'day' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary')}
              >
                Day
              </button>
              <button
                onClick={() => setZoom('week')}
                className={cn('px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all', zoom === 'week' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary')}
              >
                Week
              </button>
              <button
                onClick={() => setZoom('month')}
                className={cn('px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all', zoom === 'month' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary')}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Gantt Body */}
        <div className="flex max-h-[600px] overflow-hidden">
          {/* Task Names (Sticky) */}
          <div className="w-[280px] flex-shrink-0 border-r border-border-light bg-white z-10">
            {/* Column header */}
            <div className="h-[52px] border-b border-border-light flex items-center px-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Task</span>
            </div>
            <div className="overflow-y-auto max-h-[548px]">
              {visibleTasks.map(({ task, level, isParent }) => {
                const config = statusConfig[task.status]
                const Icon = config.icon
                return (
                  <div
                    key={task.id}
                    className={cn(
                      'h-[44px] flex items-center px-4 border-b border-border-light/50 hover:bg-surface-hover transition-colors cursor-default',
                      hoveredTask === task.id && 'bg-surface-hover'
                    )}
                    style={{ paddingLeft: `${16 + level * 20}px` }}
                    onMouseEnter={() => setHoveredTask(task.id)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {isParent ? (
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mr-1.5 w-5 h-5 flex items-center justify-center rounded hover:bg-border/50 transition-colors"
                      >
                        {expandedTasks.has(task.id) ? (
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </button>
                    ) : (
                      <span className="w-[20px] mr-1.5" />
                    )}
                    <Icon className={cn('w-3.5 h-3.5 mr-2 flex-shrink-0', config.text)} />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium truncate', level > 0 ? 'text-gray-500' : 'text-primary')}>
                        {task.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">{task.engineer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="flex-1 overflow-x-auto" ref={scrollRef}>
            <div className="min-w-max">
              {/* Timeline Header */}
              <div className="h-[52px] border-b border-border-light flex items-end relative bg-surface/50">
                <div className="absolute inset-0 flex">
                  {timelineDays.map((day, i) => (
                    shouldShowTick(day) && day.label ? (
                      <div
                        key={i}
                        className="flex-shrink-0 border-l border-border-light/50 flex items-center h-full px-1"
                        style={{ width: dayWidth }}
                      >
                        <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{day.label}</span>
                      </div>
                    ) : null
                  ))}
                </div>
                {/* Today marker */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-accent z-10"
                  style={{ left: `${getBarLeft(new Date().toISOString().split('T')[0])}px` }}
                >
                  <div className="absolute -top-0 -left-[3px] w-[8px] h-[8px] rounded-full bg-accent" />
                </div>
              </div>

              {/* Task Bars */}
              <div className="relative">
                {/* Grid lines */}
                <div className="absolute inset-0 pointer-events-none">
                  {timelineDays.map((day, i) => (
                    shouldShowTick(day) ? (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-l border-border-light/30"
                        style={{ left: `${i * dayWidth}px` }}
                      />
                    ) : null
                  ))}
                </div>

                {visibleTasks.map(({ task, level, isParent }) => {
                  const left = getBarLeft(task.startDate)
                  const width = getBarWidth(task.startDate, task.endDate)
                  const config = statusConfig[task.status]

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'h-[44px] border-b border-border-light/50 relative flex items-center',
                        hoveredTask === task.id && 'bg-surface-hover/50'
                      )}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                    >
                      {/* Task Bar */}
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{
                          position: 'absolute',
                          left: `${left}px`,
                          width: `${width}px`,
                          transformOrigin: 'left center',
                        }}
                        className="flex items-center"
                      >
                        <div
                          className={cn(
                            'h-[26px] rounded-[8px] relative overflow-hidden group cursor-pointer transition-all hover:shadow-md',
                            level > 0 && 'h-[20px]'
                          )}
                          style={{ width: '100%', backgroundColor: `${config.color}15` }}
                        >
                          {/* Progress fill */}
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-[8px]"
                            style={{ backgroundColor: config.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                          {/* Label */}
                          {width > 60 && (
                            <div className="absolute inset-0 flex items-center px-2 z-10">
                              <span className={cn(
                                'text-[10px] font-semibold truncate',
                                task.progress > 50 ? 'text-white' : config.text
                              )}>
                                {task.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Tooltip on hover */}
                      {hoveredTask === task.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-20 bg-primary text-white rounded-[10px] px-3 py-2 text-[11px] shadow-lg pointer-events-none whitespace-nowrap"
                          style={{ left: `${Math.min(left + width + 8, 600)}px`, top: '4px' }}
                        >
                          <p className="font-semibold">{task.name}</p>
                          <p className="text-white/60">{formatDateFull(task.startDate)} — {formatDateFull(task.endDate)}</p>
                          <p className="text-white/60">{task.engineer} · {task.progress}%</p>
                        </motion.div>
                      )}
                    </div>
                  )
                })}

                {/* Today line */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-accent/40 z-10 pointer-events-none"
                  style={{ left: `${getBarLeft(new Date().toISOString().split('T')[0])}px` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border-light bg-surface/50">
          <p className="text-xs text-gray-400">
            {sampleTasks.length} milestones · {sampleTasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0)} tasks
          </p>
          <p className="text-xs text-gray-400">
            {formatDateFull(projectStart)} — {formatDateFull(projectEnd)}
          </p>
        </div>
      </div>
    </FadeInUp>
  )
}

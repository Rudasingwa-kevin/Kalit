import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  MoreHorizontal,
  GripVertical,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Calendar,
  User,
  Trash2,
  Pencil,
  X,
  ChevronDown,
} from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import { api } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'

const priorityConfig: Record<string, { label: string; color: string; dot: string }> = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
  medium: { label: 'Medium', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
  high: { label: 'High', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-500' },
  urgent: { label: 'Urgent', color: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
}

const columns = [
  { id: 'todo', label: 'To Do', icon: Circle, color: 'text-gray-400', bg: 'bg-gray-50' },
  { id: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-accent', bg: 'bg-accent/5' },
  { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5' },
] as const

interface Task {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  done: boolean
  dueDate?: string | null
  createdAt: string
  assignee: { id: string; name: string; email: string; avatar: string | null }
}

interface TeamMember {
  userId: string
  user: { id: string; name: string; email: string }
}

function CreateTaskModal({ projectId, members, onClose, onCreated }: { projectId: string; members: TeamMember[]; onClose: () => void; onCreated: (task: Task) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState(members[0]?.userId ?? '')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assigneeId) return
    setSaving(true)
    setError('')
    try {
      const { task } = await api.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        projectId,
        assigneeId,
        priority,
        dueDate: dueDate || undefined,
      })
      onCreated(task)
    } catch (err: any) {
      setError(err.message || 'Failed to create task')
    }
    setSaving(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-[20px] shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <h3 className="text-base font-bold text-primary">Create Task</h3>
          <button onClick={onClose} className="p-1.5 rounded-[8px] hover:bg-surface-hover text-gray-400 hover:text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-primary block mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Install plumbing fixtures"
              required
              className="w-full h-10 px-3.5 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional task details..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">Assignee *</label>
              <div className="relative">
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  required
                  className="appearance-none w-full h-10 pl-3.5 pr-8 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer"
                >
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>{m.user.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">Priority</label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="appearance-none w-full h-10 pl-3.5 pr-8 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-primary block mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-10 px-3.5 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-danger font-medium">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[10px] text-sm font-semibold text-gray-500 hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={saving || !title.trim() || !assigneeId}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-[10px] text-sm font-semibold text-white transition-all',
                saving || !title.trim() || !assigneeId
                  ? 'bg-accent/50 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-dark'
              )}
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
              Create
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function TaskCard({ task, onStatusChange, onDelete, onEdit }: { task: Task; onStatusChange: (id: string, status: string) => void; onDelete: (id: string) => void; onEdit: (task: Task) => void }) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.medium
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <div
      draggable
      onDragStart={(e: React.DragEvent) => {
        e.dataTransfer.setData('taskId', task.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      className="bg-white rounded-[12px] border border-border/50 p-3.5 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-accent/20 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-primary leading-snug flex-1">{task.title}</h4>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(task)} className="p-1 rounded-[6px] hover:bg-surface text-gray-400 hover:text-accent transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1 rounded-[6px] hover:bg-danger/10 text-gray-400 hover:text-danger transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 mb-2.5 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] text-[10px] font-semibold', priority.color)}>
          <span className={cn('w-1.5 h-1.5 rounded-full', priority.dot)} />
          {priority.label}
        </span>

        {task.dueDate && (
          <span className={cn('flex items-center gap-1 text-[10px] font-medium', isOverdue ? 'text-danger' : 'text-gray-400')}>
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border/30">
        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-bold text-accent">
            {task.assignee?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'}
          </span>
        </div>
        <span className="text-[11px] text-gray-400 truncate">{task.assignee?.name ?? 'Unassigned'}</span>
      </div>
    </div>
  )
}

function EditTaskModal({ task, members, onClose, onUpdated }: { task: Task; members: TeamMember[]; onClose: () => void; onUpdated: (task: Task) => void }) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [assigneeId, setAssigneeId] = useState(task.assignee?.id ?? '')
  const [priority, setPriority] = useState(task.priority)
  const [status, setStatus] = useState(task.status)
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { task: updated } = await api.updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        assigneeId,
        priority,
        status,
        dueDate: dueDate || undefined,
      })
      onUpdated(updated)
    } catch {}
    setSaving(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-[20px] shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <h3 className="text-base font-bold text-primary">Edit Task</h3>
          <button onClick={onClose} className="p-1.5 rounded-[8px] hover:bg-surface-hover text-gray-400 hover:text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-primary block mb-1.5">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full h-10 px-3.5 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all" />
          </div>

          <div>
            <label className="text-sm font-medium text-primary block mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">Status</label>
              <div className="relative">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="appearance-none w-full h-10 pl-3.5 pr-8 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">Priority</label>
              <div className="relative">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="appearance-none w-full h-10 pl-3.5 pr-8 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">Assignee</label>
              <div className="relative">
                <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="appearance-none w-full h-10 pl-3.5 pr-8 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer">
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>{m.user.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full h-10 px-3.5 rounded-[10px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-[10px] text-sm font-semibold text-gray-500 hover:bg-surface-hover transition-colors">
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={saving || !title.trim()}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-[10px] text-sm font-semibold text-white transition-all',
                saving || !title.trim() ? 'bg-accent/50 cursor-not-allowed' : 'bg-accent hover:bg-accent-dark'
              )}
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      const { tasks: data } = await api.getProjectTasks(projectId)
      setTasks(data)
    } catch {}
    setLoading(false)
  }, [projectId])

  const fetchMembers = useCallback(async () => {
    try {
      const { members: data } = await api.getMembers()
      setMembers(data)
    } catch {}
  }, [])

  useEffect(() => {
    fetchTasks()
    fetchMembers()
  }, [fetchTasks, fetchMembers])

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, done: newStatus === 'done' } : t))
    try {
      await api.updateTask(taskId, { status: newStatus })
      // Refresh to get updated counts
      const { tasks: updated } = await api.getProjectTasks(projectId)
      setTasks(updated)
    } catch {
      fetchTasks()
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Delete this task?')) return
    setTasks(prev => prev.filter(t => t.id !== taskId))
    try {
      await api.deleteTask(taskId)
    } catch {
      fetchTasks()
    }
  }

  const handleCreated = (task: Task) => {
    setTasks(prev => [...prev, task])
    setShowCreate(false)
  }

  const handleUpdated = (task: Task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t))
    setEditingTask(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(null)
    const taskId = e.dataTransfer.getData('taskId')
    if (!taskId) return
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status !== columnId) {
      handleStatusChange(taskId, columnId)
    }
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-primary">Task Board</h3>
          <span className="text-[11px] font-semibold text-gray-400 bg-surface px-2 py-0.5 rounded-full">
            {tasks.length} tasks
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </motion.button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => {
          const columnTasks = tasks.filter(t => t.status === col.id)
          const isOver = dragOverColumn === col.id
          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={cn(
                'rounded-[16px] border transition-all min-h-[200px]',
                col.bg,
                isOver ? 'border-accent/40 ring-2 ring-accent/10' : 'border-border/30'
              )}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <col.icon className={cn('w-4 h-4', col.color)} />
                  <span className="text-xs font-bold text-primary">{col.label}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-white/80 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {columnTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-2.5 space-y-2.5">
                <AnimatePresence>
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      onEdit={setEditingTask}
                    />
                  ))}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-xs text-gray-400">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <CreateTaskModal
            projectId={projectId}
            members={members}
            onClose={() => setShowCreate(false)}
            onCreated={handleCreated}
          />
        )}
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            members={members}
            onClose={() => setEditingTask(null)}
            onUpdated={handleUpdated}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

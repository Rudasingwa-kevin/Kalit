import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  ArrowRight,
  LayoutDashboard,
  FolderKanban,
  Package,
  ArrowLeftRight,
  Truck,
  Receipt,
  BarChart3,
  Settings,
  User,
  Plus,
  Bell,
  Moon,
  Sun,
  Command,
  CornerDownLeft,
  Hash,
  FileText,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  action: () => void
  category: 'navigation' | 'action' | 'search'
  shortcut?: string
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    { id: 'nav-dashboard', label: 'Dashboard', description: 'Go to dashboard', icon: LayoutDashboard, action: () => { navigate('/dashboard'); onClose() }, category: 'navigation', shortcut: 'G D' },
    { id: 'nav-projects', label: 'Projects', description: 'View all projects', icon: FolderKanban, action: () => { navigate('/projects'); onClose() }, category: 'navigation', shortcut: 'G P' },
    { id: 'nav-inventory', label: 'Inventory', description: 'Manage inventory', icon: Package, action: () => { navigate('/inventory'); onClose() }, category: 'navigation', shortcut: 'G I' },
    { id: 'nav-transactions', label: 'Transactions', description: 'Inventory transactions', icon: ArrowLeftRight, action: () => { navigate('/inventory/transactions'); onClose() }, category: 'navigation' },
    { id: 'nav-suppliers', label: 'Suppliers', description: 'Manage suppliers', icon: Truck, action: () => { navigate('/suppliers'); onClose() }, category: 'navigation' },
    { id: 'nav-expenses', label: 'Expenses', description: 'Track expenses', icon: Receipt, action: () => { navigate('/expenses'); onClose() }, category: 'navigation' },
    { id: 'nav-reports', label: 'Reports', description: 'View analytics', icon: BarChart3, action: () => { navigate('/reports'); onClose() }, category: 'navigation' },
    { id: 'nav-settings', label: 'Settings', description: 'App settings', icon: Settings, action: () => { navigate('/settings'); onClose() }, category: 'navigation' },
    { id: 'nav-profile', label: 'Profile', description: 'Your profile', icon: User, action: () => { navigate('/profile'); onClose() }, category: 'navigation' },

    // Actions
    { id: 'act-new-project', label: 'New Project', description: 'Create a new project', icon: Plus, action: () => { navigate('/projects'); onClose() }, category: 'action' },
    { id: 'act-add-inventory', label: 'Add Inventory Item', description: 'Add new material', icon: Package, action: () => { navigate('/inventory'); onClose() }, category: 'action' },
    { id: 'act-log-expense', label: 'Log Expense', description: 'Record a new expense', icon: Receipt, action: () => { navigate('/expenses'); onClose() }, category: 'action' },
    { id: 'act-view-reports', label: 'Generate Report', description: 'Create analytics report', icon: TrendingUp, action: () => { navigate('/reports'); onClose() }, category: 'action' },
  ], [navigate, onClose])

  const filtered = useMemo(() => {
    if (!query) return commands
    const q = query.toLowerCase()
    return commands.filter(
      cmd => cmd.label.toLowerCase().includes(q) || cmd.description?.toLowerCase().includes(q)
    )
  }, [query, commands])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].action()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [filtered, selectedIndex, onClose])

  const navCommands = filtered.filter(c => c.category === 'navigation')
  const actionCommands = filtered.filter(c => c.category === 'action')

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[4px] z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[560px] bg-white rounded-[20px] shadow-2xl z-[101] overflow-hidden border border-border/50"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-light">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, pages, actions..."
                className="flex-1 bg-transparent text-base text-primary placeholder:text-gray-400 outline-none"
              />
              <kbd className="px-2 py-1 text-[10px] font-semibold text-gray-400 bg-surface rounded border border-border-light">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-400">No results for "{query}"</p>
                </div>
              ) : (
                <>
                  {navCommands.length > 0 && (
                    <div className="mb-2">
                      <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
                      {navCommands.map((cmd, i) => {
                        const Icon = cmd.icon
                        const globalIndex = filtered.indexOf(cmd)
                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-colors text-left',
                              globalIndex === selectedIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover'
                            )}
                          >
                            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary">{cmd.label}</p>
                              {cmd.description && (
                                <p className="text-[11px] text-gray-400">{cmd.description}</p>
                              )}
                            </div>
                            {cmd.shortcut && (
                              <div className="flex items-center gap-1">
                                {cmd.shortcut.split(' ').map((key, j) => (
                                  <kbd key={j} className="px-1.5 py-0.5 text-[9px] font-semibold text-gray-400 bg-surface rounded border border-border-light">
                                    {key}
                                  </kbd>
                                ))}
                              </div>
                            )}
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {actionCommands.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</p>
                      {actionCommands.map((cmd, i) => {
                        const Icon = cmd.icon
                        const globalIndex = filtered.indexOf(cmd)
                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-colors text-left',
                              globalIndex === selectedIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover'
                            )}
                          >
                            <div className="w-7 h-7 rounded-[8px] bg-accent/8 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-3.5 h-3.5 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary">{cmd.label}</p>
                              {cmd.description && (
                                <p className="text-[11px] text-gray-400">{cmd.description}</p>
                              )}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border-light bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[9px] font-semibold text-gray-400 bg-white rounded border border-border-light">↑↓</kbd>
                  <span className="text-[10px] text-gray-400">Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[9px] font-semibold text-gray-400 bg-white rounded border border-border-light">
                    <CornerDownLeft className="w-2.5 h-2.5 inline" />
                  </kbd>
                  <span className="text-[10px] text-gray-400">Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[9px] font-semibold text-gray-400 bg-white rounded border border-border-light">ESC</kbd>
                  <span className="text-[10px] text-gray-400">Close</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <Command className="w-3 h-3" />
                <span>Kalit</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

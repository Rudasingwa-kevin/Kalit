import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Bell,
  Check,
  CheckCheck,
  Package,
  FolderKanban,
  DollarSign,
  AlertTriangle,
  Info,
  Trash2,
  Settings,
  Clock,
  ChevronRight,
  Inbox,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type NotificationCategory = 'all' | 'inventory' | 'projects' | 'expenses' | 'system'

export interface Notification {
  id: string
  title: string
  message: string
  category: NotificationCategory
  type: 'success' | 'warning' | 'error' | 'info'
  timestamp: string
  read: boolean
  actionUrl?: string
}

const categoryConfig: Record<NotificationCategory, { label: string; icon: React.ElementType; color: string }> = {
  all: { label: 'All', icon: Bell, color: 'text-primary' },
  inventory: { label: 'Inventory', icon: Package, color: 'text-accent' },
  projects: { label: 'Projects', icon: FolderKanban, color: 'text-success' },
  expenses: { label: 'Expenses', icon: DollarSign, color: 'text-warning' },
  system: { label: 'System', icon: Settings, color: 'text-gray-400' },
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  success: { icon: Check, color: 'text-success', bg: 'bg-success/10' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  error: { icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
  info: { icon: Info, color: 'text-accent', bg: 'bg-accent/10' },
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Portland Cement stock has dropped below minimum threshold. Current: 450 bags.',
    category: 'inventory',
    type: 'warning',
    timestamp: '5 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Project Milestone Reached',
    message: 'Kigali Heights Extension reached 68% completion. Structural frame is on track.',
    category: 'projects',
    type: 'success',
    timestamp: '25 min ago',
    read: false,
  },
  {
    id: '3',
    title: 'Expense Approved',
    message: 'Steel delivery expense of $45,000 has been approved by Jean-Paul.',
    category: 'expenses',
    type: 'success',
    timestamp: '1 hr ago',
    read: false,
  },
  {
    id: '4',
    title: 'Material Delivery',
    message: 'Simba Cement Co. delivered 300 bags of Portland Cement to Warehouse A.',
    category: 'inventory',
    type: 'info',
    timestamp: '2 hr ago',
    read: true,
  },
  {
    id: '5',
    title: 'Budget Warning',
    message: 'Huye Tech Campus has used 35% of budget but only completed 28% of tasks.',
    category: 'projects',
    type: 'warning',
    timestamp: '3 hr ago',
    read: true,
  },
  {
    id: '6',
    title: 'New Supplier Added',
    message: 'Crystal Glass Co. has been added to the supplier directory.',
    category: 'system',
    type: 'info',
    timestamp: '5 hr ago',
    read: true,
  },
  {
    id: '7',
    title: 'Out of Stock',
    message: 'Glass Panels are now out of stock. Immediate reorder required.',
    category: 'inventory',
    type: 'error',
    timestamp: '6 hr ago',
    read: true,
  },
  {
    id: '8',
    title: 'Expense Rejected',
    message: 'Site safety equipment expense of $8,200 was rejected. Reason: Budget exceeded.',
    category: 'expenses',
    type: 'error',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '9',
    title: 'Team Update',
    message: 'Diane Umutoni is now assigned to Huye Tech Campus as Lead Engineer.',
    category: 'projects',
    type: 'info',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '10',
    title: 'System Maintenance',
    message: 'Scheduled maintenance window: July 15, 2026 from 2:00 AM to 4:00 AM EAT.',
    category: 'system',
    type: 'info',
    timestamp: '2 days ago',
    read: true,
  },
]

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
}

export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(
    n => activeCategory === 'all' || n.category === activeCategory
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-accent/8 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">Notifications</h2>
                  <p className="text-xs text-gray-400">{unreadCount} unread</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold text-accent hover:bg-accent/8 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-[8px] text-gray-400 hover:text-primary hover:bg-surface-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 p-3 border-b border-border-light overflow-x-auto">
              {(Object.keys(categoryConfig) as NotificationCategory[]).map(cat => {
                const config = categoryConfig[cat]
                const Icon = config.icon
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:text-primary hover:bg-surface-hover'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {config.label}
                    {cat !== 'all' && (
                      <span className={cn(
                        'ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full',
                        isActive ? 'bg-white/20 text-white' : 'bg-surface text-gray-400'
                      )}>
                        {notifications.filter(n => n.category === cat).length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6">
                  <div className="w-16 h-16 rounded-[20px] bg-surface flex items-center justify-center mb-4">
                    <Inbox className="w-7 h-7 text-gray-300" />
                  </div>
                  <h3 className="text-base font-semibold text-primary mb-1">All caught up</h3>
                  <p className="text-sm text-gray-400 text-center">
                    No notifications in this category. We'll let you know when something needs your attention.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border-light/50">
                  {filteredNotifications.map((notification, i) => {
                    const typeCfg = typeConfig[notification.type]
                    const TypeIcon = typeCfg.icon
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn(
                          'flex items-start gap-3 p-4 hover:bg-surface-hover transition-colors cursor-pointer group',
                          !notification.read && 'bg-accent/[0.02]'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className={cn('w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0', typeCfg.bg)}>
                          <TypeIcon className={cn('w-4 h-4', typeCfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className={cn('text-sm font-semibold truncate', notification.read ? 'text-gray-500' : 'text-primary')}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                            )}
                          </div>
                          <p className={cn('text-xs leading-relaxed', notification.read ? 'text-gray-400' : 'text-gray-500')}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock className="w-3 h-3 text-gray-300" />
                            <span className="text-[11px] text-gray-400">{notification.timestamp}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="w-7 h-7 rounded-[8px] flex items-center justify-center text-gray-300 hover:text-danger hover:bg-danger/8 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-4 border-t border-border-light">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-xs font-semibold text-gray-400 hover:text-primary hover:bg-surface-hover transition-colors">
                  View all notifications
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

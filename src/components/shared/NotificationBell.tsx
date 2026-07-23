import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, X, Shield, Clock, CheckCircle2, UserMinus, AlertTriangle } from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import { api } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  project_manager: 'Project Manager',
  site_engineer: 'Site Engineer',
  storekeeper: 'Storekeeper',
}

interface TeamInvite {
  id: string
  role: string
  message: string
  status: string
  createdAt: string
  expiresAt: string
  owner: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
}

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  relatedUser: {
    id: string
    name: string
    email: string
    avatar: string | null
  } | null
}

const notifIcons: Record<string, React.ElementType> = {
  invite_accepted: CheckCircle2,
  invite_declined: UserMinus,
  invite_expired: AlertTriangle,
}

const notifColors: Record<string, string> = {
  invite_accepted: 'bg-success/10 text-success',
  invite_declined: 'bg-danger/10 text-danger',
  invite_expired: 'bg-warning/10 text-warning',
}

export function NotificationBell() {
  const user = getCurrentUser()
  const isOwner = user?.role === 'owner'
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'notifications' | 'invites'>(isOwner ? 'notifications' : 'invites')
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const pendingInviteCount = invites.filter((i) => i.status === 'pending').length
  const totalCount = (isOwner ? unreadCount : 0) + pendingInviteCount

  const fetchInvites = async () => {
    try {
      const { invites: data } = await api.getTeamInvites()
      setInvites(data)
    } catch {}
  }

  const fetchNotifications = async () => {
    if (!isOwner) return
    try {
      const { notifications: data, unreadCount: count } = await api.getNotifications()
      setNotifications(data)
      setUnreadCount(count)
    } catch {}
  }

  useEffect(() => {
    fetchInvites()
    fetchNotifications()
    const interval = setInterval(() => {
      fetchInvites()
      fetchNotifications()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleAccept = async (id: string) => {
    setActionLoading(id)
    try {
      await api.acceptTeamInvite(id)
      setInvites((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'accepted' } : i))
      )
    } catch {}
    setActionLoading(null)
  }

  const handleDecline = async (id: string) => {
    setActionLoading(id)
    try {
      await api.declineTeamInvite(id)
      setInvites((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'declined' } : i))
      )
    } catch {}
    setActionLoading(null)
  }

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {}
  }

  const isExpired = (expiresAt: string) => new Date() > new Date(expiresAt)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center rounded-[12px] hover:bg-surface-hover transition-colors text-gray-400 hover:text-primary"
      >
        <Bell className="w-5 h-5" />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-[16px] border border-border/50 shadow-2xl overflow-hidden z-50"
          >
            {/* Tabs */}
            {isOwner && (
              <div className="flex border-b border-border/50">
                <button
                  onClick={() => setTab('notifications')}
                  className={cn(
                    'flex-1 py-3 text-xs font-semibold transition-colors',
                    tab === 'notifications'
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-gray-400 hover:text-primary'
                  )}
                >
                  Notifications {unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-accent/10 text-accent rounded-full text-[10px]">{unreadCount}</span>}
                </button>
                <button
                  onClick={() => setTab('invites')}
                  className={cn(
                    'flex-1 py-3 text-xs font-semibold transition-colors',
                    tab === 'invites'
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-gray-400 hover:text-primary'
                  )}
                >
                  Invitations {pendingInviteCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-warning/10 text-warning rounded-full text-[10px]">{pendingInviteCount}</span>}
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {(!isOwner || tab === 'notifications') && isOwner && (
              <div>
                {unreadCount > 0 && (
                  <div className="px-4 pt-3 flex justify-end">
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-semibold text-accent hover:text-accent-dark transition-colors"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {notifications.map((notif) => {
                        const Icon = notifIcons[notif.type] || Bell
                        return (
                          <div
                            key={notif.id}
                            className={cn(
                              'p-3 rounded-[12px] mb-1 transition-colors',
                              !notif.read ? 'bg-accent/3' : 'hover:bg-surface-hover'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                                notifColors[notif.type] || 'bg-gray-100 text-gray-400'
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  'text-sm leading-snug',
                                  !notif.read ? 'font-semibold text-primary' : 'text-gray-600'
                                )}>
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Invites Tab */}
            {(tab === 'invites' || !isOwner) && (
              <div className="max-h-[400px] overflow-y-auto">
                {invites.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No invitations yet</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {invites.map((invite) => {
                      const expired = invite.status === 'pending' && isExpired(invite.expiresAt)
                      const status = expired ? 'expired' : invite.status

                      return (
                        <div
                          key={invite.id}
                          className={cn(
                            'p-3 rounded-[12px] mb-1 transition-colors',
                            status === 'pending' ? 'bg-accent/3 hover:bg-accent/5' : 'opacity-60'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-accent">
                                {invite.owner.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-primary">{invite.owner.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Shield className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {roleLabels[invite.role] || invite.role}
                                </span>
                              </div>
                              {invite.message && (
                                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                                  "{invite.message}"
                                </p>
                              )}

                              {status === 'pending' && !expired && (
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => handleAccept(invite.id)}
                                    disabled={actionLoading === invite.id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50"
                                  >
                                    <Check className="w-3 h-3" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleDecline(invite.id)}
                                    disabled={actionLoading === invite.id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-border/50 text-gray-500 text-xs font-semibold hover:bg-surface-hover transition-colors disabled:opacity-50"
                                  >
                                    <X className="w-3 h-3" />
                                    Decline
                                  </button>
                                </div>
                              )}

                              {status === 'accepted' && (
                                <p className="text-xs text-success font-medium mt-1.5">Accepted</p>
                              )}
                              {status === 'declined' && (
                                <p className="text-xs text-gray-400 font-medium mt-1.5">Declined</p>
                              )}
                              {(status === 'expired' || expired) && (
                                <div className="flex items-center gap-1 mt-1.5">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <p className="text-xs text-gray-400 font-medium">Expired</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

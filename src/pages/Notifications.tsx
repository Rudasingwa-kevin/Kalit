import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Check,
  X,
  Shield,
  Clock,
  CheckCircle2,
  UserMinus,
  AlertTriangle,
  Inbox,
  MailOpen,
  Filter,
  Users,
} from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import { api } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { FadeInUp } from '@/components/shared/SharedComponents'

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

const notifLabels: Record<string, string> = {
  invite_accepted: 'Accepted',
  invite_declined: 'Declined',
  invite_expired: 'Expired',
}

type Tab = 'all' | 'unread' | 'invites'

export default function Notifications() {
  const user = getCurrentUser()
  const isOwner = user?.role === 'owner'

  const [tab, setTab] = useState<Tab>(isOwner ? 'all' : 'invites')
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const pendingInviteCount = invites.filter(i => i.status === 'pending').length

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
    const load = async () => {
      await Promise.all([fetchInvites(), fetchNotifications()])
      setLoading(false)
    }
    load()
  }, [])

  const handleAccept = async (id: string) => {
    setActionLoading(id)
    try {
      await api.acceptTeamInvite(id)
      setInvites(prev => prev.map(i => (i.id === id ? { ...i, status: 'accepted' } : i)))
    } catch {}
    setActionLoading(null)
  }

  const handleDecline = async (id: string) => {
    setActionLoading(id)
    try {
      await api.declineTeamInvite(id)
      setInvites(prev => prev.map(i => (i.id === id ? { ...i, status: 'declined' } : i)))
    } catch {}
    setActionLoading(null)
  }

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {}
  }

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id)
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }

  const isExpired = (expiresAt: string) => new Date() > new Date(expiresAt)

  const filteredNotifications = tab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero */}
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
                Notifications
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
                Stay in the Loop
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-lg">
                {isOwner
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''} and ${pendingInviteCount} pending invitation${pendingInviteCount !== 1 ? 's' : ''}.`
                  : `You have ${pendingInviteCount} pending invitation${pendingInviteCount !== 1 ? 's' : ''}.`}
              </p>
            </div>

            {isOwner && notifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-[14px] font-semibold text-sm transition-colors self-start md:self-auto',
                  unreadCount === 0
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white text-primary hover:bg-white/90'
                )}
              >
                <MailOpen className="w-4 h-4" />
                Mark All Read
              </motion.button>
            )}
          </div>
        </div>
      </FadeInUp>

      {/* Tabs + Content */}
      <FadeInUp delay={0.05}>
        <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-border/50">
            {[
              { id: 'all' as Tab, label: 'All', count: notifications.length, show: isOwner },
              { id: 'unread' as Tab, label: 'Unread', count: unreadCount, show: isOwner },
              { id: 'invites' as Tab, label: 'Invitations', count: pendingInviteCount, show: true },
            ]
              .filter(t => t.show)
              .map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative',
                    tab === id ? 'text-accent' : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  {label}
                  {count > 0 && (
                    <span className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                      tab === id ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'
                    )}>
                      {count}
                    </span>
                  )}
                  {tab === id && (
                    <motion.div
                      layoutId="notifications-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {tab === 'invites' ? (
              <motion.div
                key="invites"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4 md:p-6"
              >
                {invites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                      <Users className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-primary mb-1">No invitations</p>
                    <p className="text-xs text-gray-400">When someone invites you to a team, it will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-2xl">
                    {invites.map(invite => {
                      const expired = invite.status === 'pending' && isExpired(invite.expiresAt)
                      const status = expired ? 'expired' : invite.status

                      return (
                        <motion.div
                          key={invite.id}
                          layout
                          className={cn(
                            'rounded-[16px] border p-5 transition-all',
                            status === 'pending'
                              ? 'border-accent/20 bg-accent/2'
                              : 'border-border/50 bg-white opacity-60'
                          )}
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-[14px] bg-accent/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-accent">
                                {invite.owner.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h4 className="text-sm font-bold text-primary">{invite.owner.name}</h4>
                                  <p className="text-xs text-gray-400">{invite.owner.email}</p>
                                </div>
                                <span className={cn(
                                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide flex-shrink-0',
                                  status === 'pending' && 'bg-accent/10 text-accent',
                                  status === 'accepted' && 'bg-success/10 text-success',
                                  status === 'declined' && 'bg-gray-100 text-gray-400',
                                  status === 'expired' && 'bg-warning/10 text-warning',
                                )}>
                                  {status === 'pending' && <Clock className="w-2.5 h-2.5" />}
                                  {status === 'accepted' && <CheckCircle2 className="w-2.5 h-2.5" />}
                                  {status === 'declined' && <X className="w-2.5 h-2.5" />}
                                  {status === 'expired' && <AlertTriangle className="w-2.5 h-2.5" />}
                                  {status}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 mt-2">
                                <Shield className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 font-medium">
                                  {roleLabels[invite.role] ?? invite.role}
                                </span>
                                <span className="text-gray-300">·</span>
                                <span className="text-xs text-gray-400">{timeAgo(invite.createdAt)}</span>
                              </div>

                              {invite.message && (
                                <p className="text-xs text-gray-500 mt-2.5 bg-surface rounded-[10px] px-3 py-2 italic">
                                  "{invite.message}"
                                </p>
                              )}

                              {status === 'pending' && !expired && (
                                <div className="flex items-center gap-2 mt-3">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAccept(invite.id)}
                                    disabled={actionLoading === invite.id}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50"
                                  >
                                    {actionLoading === invite.id ? (
                                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                      <Check className="w-3.5 h-3.5" />
                                    )}
                                    Accept
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDecline(invite.id)}
                                    disabled={actionLoading === invite.id}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-border/50 text-gray-500 text-xs font-semibold hover:bg-surface-hover transition-colors disabled:opacity-50"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    Decline
                                  </motion.button>
                                </div>
                              )}

                              {status === 'expired' && (
                                <p className="text-xs text-gray-400 mt-2.5 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  This invitation expired on {new Date(invite.expiresAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4 md:p-6"
              >
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                      <Bell className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-primary mb-1">
                      {tab === 'unread' ? 'All caught up' : 'No notifications yet'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {tab === 'unread'
                        ? 'You have read all your notifications.'
                        : 'When something happens, you will see it here.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-w-2xl">
                    {filteredNotifications.map(notif => {
                      const Icon = notifIcons[notif.type] || Bell
                      return (
                        <motion.div
                          key={notif.id}
                          layout
                          className={cn(
                            'flex items-start gap-4 p-4 rounded-[14px] transition-all group',
                            !notif.read ? 'bg-accent/3 border border-accent/10' : 'hover:bg-surface-hover border border-transparent'
                          )}
                        >
                          <div className={cn(
                            'w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0',
                            notifColors[notif.type] || 'bg-gray-100 text-gray-400'
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm leading-relaxed',
                              !notif.read ? 'font-semibold text-primary' : 'text-gray-600'
                            )}>
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[11px] text-gray-400">{timeAgo(notif.createdAt)}</span>
                              <span className="text-gray-300">·</span>
                              <span className={cn(
                                'text-[10px] font-semibold uppercase tracking-wide',
                                notifColors[notif.type]?.split(' ')[1] ?? 'text-gray-400'
                              )}>
                                {notifLabels[notif.type] ?? notif.type}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notif.read && (
                              <button
                                onClick={() => handleMarkRead(notif.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-[8px] hover:bg-surface text-gray-400 hover:text-accent"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-accent" />
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeInUp>
    </div>
  )
}

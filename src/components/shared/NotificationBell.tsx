import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, X, Shield, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

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

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const pendingCount = invites.filter((i) => i.status === 'pending').length

  const fetchInvites = async () => {
    try {
      const { invites: data } = await api.getTeamInvites()
      setInvites(data)
    } catch {}
  }

  useEffect(() => {
    fetchInvites()
    const interval = setInterval(fetchInvites, 30000)
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

  const isExpired = (expiresAt: string) => new Date() > new Date(expiresAt)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center rounded-[12px] hover:bg-surface-hover transition-colors text-gray-400 hover:text-primary"
      >
        <Bell className="w-5 h-5" />
        {pendingCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {pendingCount > 9 ? '9+' : pendingCount}
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
            className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-[16px] border border-border/50 shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary">Team Invitations</h3>
                {pendingCount > 0 && (
                  <span className="text-[10px] font-semibold text-white bg-accent px-2 py-0.5 rounded-full">
                    {pendingCount} pending
                  </span>
                )}
              </div>
            </div>

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

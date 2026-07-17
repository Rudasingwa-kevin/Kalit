import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Mail, Phone, Shield, MessageSquare, Copy, Check } from 'lucide-react'
import { useTeam } from '@/hooks/useTeam'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/data/mockData'

interface InviteModalProps {
  open: boolean
  onClose: () => void
}

export function InviteModal({ open, onClose }: InviteModalProps) {
  const { addInvitation, roleLabels } = useTeam()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('site_engineer')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return
    const result = addInvitation({ name, phone, role, message })
    setInviteCode(result.code)
    setSubmitted(true)
  }

  const joinLink = `${window.location.origin}/join/${inviteCode}`

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(joinLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setName('')
    setPhone('')
    setRole('site_engineer')
    setMessage('')
    setSubmitted(false)
    setInviteCode('')
    setCopied(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-[20px] border border-border/50 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-0">
                <h2 className="text-lg font-bold text-primary">
                  {submitted ? 'Invitation Sent!' : 'Invite Team Member'}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-surface-hover transition-colors text-gray-400 hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                {submitted ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-success" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Share this link with <span className="font-semibold text-primary">{name}</span> via WhatsApp or message.
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-surface rounded-[12px] mb-3">
                      <code className="flex-1 text-xs font-mono text-primary truncate">
                        {joinLink}
                      </code>
                      <button
                        onClick={copyLink}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-accent hover:bg-accent/5 transition-colors flex-shrink-0"
                      >
                        {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-surface rounded-[10px] mb-3">
                      <span className="text-[10px] text-gray-400">Code:</span>
                      <code className="text-sm font-mono font-bold text-accent tracking-wider">
                        {inviteCode}
                      </code>
                    </div>
                    <p className="text-xs text-gray-400">
                      The invitation expires in 7 days.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 w-full py-3 rounded-[12px] bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter full name"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-border/50 bg-white text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+250 7XX XXX XXX"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-border/50 bg-white text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Role</label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as UserRole)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-border/50 bg-white text-sm text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all cursor-pointer"
                        >
                          {Object.entries(roleLabels).filter(([key]) => key !== 'owner').map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Message (optional)</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Add a welcome message..."
                          rows={3}
                          className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-border/50 bg-white text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-3 rounded-[12px] border border-border/50 text-sm font-semibold text-gray-500 hover:bg-surface-hover transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-[12px] bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
                      >
                        Send Invitation
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

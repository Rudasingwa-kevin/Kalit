import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Mail, Phone, Shield, MessageSquare, Copy, Check, Search, UserCheck, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  project_manager: 'Project Manager',
  site_engineer: 'Site Engineer',
  storekeeper: 'Storekeeper',
}

interface InviteModalProps {
  open: boolean
  onClose: () => void
}

type Step = 'search' | 'found' | 'invite' | 'done'

interface FoundUser {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  avatar: string | null
}

export function InviteModal({ open, onClose }: InviteModalProps) {
  const [step, setStep] = useState<Step>('search')
  const [searchEmail, setSearchEmail] = useState('')
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [addRole, setAddRole] = useState('site_engineer')
  const [addMessage, setAddMessage] = useState('')
  const [adding, setAdding] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('site_engineer')
  const [message, setMessage] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')

  const [copied, setCopied] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && step === 'search') {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [open, step])

  const handleSearch = useCallback(async (email: string) => {
    if (email.length < 2) {
      setFoundUser(null)
      setSearchError('')
      return
    }
    setSearching(true)
    setSearchError('')
    try {
      const { users } = await api.searchUsers(email)
      if (users.length > 0) {
        setFoundUser(users[0])
        setStep('found')
      } else {
        setFoundUser(null)
        setSearchError('No user found. You can send an invitation instead.')
      }
    } catch {
      setSearchError('Failed to search users')
    }
    setSearching(false)
  }, [])

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
      handleSearch(searchEmail)
    }
  }

  const handleEmailChange = (value: string) => {
    setSearchEmail(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    if (value.length >= 2) {
      searchTimeout.current = setTimeout(() => handleSearch(value), 400)
    } else {
      setFoundUser(null)
      setSearchError('')
    }
  }

  const handleAddMember = async () => {
    if (!foundUser) return
    setAdding(true)
    try {
      await api.createTeamInvite({ userId: foundUser.id, role: addRole, message: addMessage || undefined })
      setAddSuccess(true)
    } catch (err: any) {
      setSearchError(err.message || 'Failed to send invitation')
    }
    setAdding(false)
  }

  const handleInviteInstead = () => {
    setName(searchEmail.includes('@') ? searchEmail.split('@')[0] : '')
    setStep('invite')
  }

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return
    setInviteError('')
    setInviteLoading(true)

    try {
      const { invitation } = await api.createInvitation({ name, phone, role, message })
      setInviteCode(invitation.code)
      setStep('done')
    } catch {
      setInviteError('Failed to send invitation')
    }
    setInviteLoading(false)
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
    setStep('search')
    setSearchEmail('')
    setFoundUser(null)
    setSearchError('')
    setAddRole('site_engineer')
    setAddMessage('')
    setAddSuccess(false)
    setName('')
    setPhone('')
    setRole('site_engineer')
    setMessage('')
    setInviteCode('')
    setCopied(false)
    setInviteError('')
    onClose()
  }

  const handleBack = () => {
    if (step === 'found' || step === 'invite') {
      setStep('search')
      setFoundUser(null)
      setSearchError('')
    } else if (step === 'done') {
      handleClose()
    }
  }

  const titles: Record<Step, string> = {
    search: 'Invite Team Member',
    found: 'Add to Team',
    invite: 'Send Invitation',
    done: 'Invitation Sent!',
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            style={{ zIndex: 1000 }}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 1001 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-[20px] border border-border/50 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-0">
                <div className="flex items-center gap-2">
                  {(step === 'found' || step === 'invite') && (
                    <button
                      onClick={handleBack}
                      className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-surface-hover transition-colors text-gray-400 hover:text-primary"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-primary">{titles[step]}</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-surface-hover transition-colors text-gray-400 hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 'search' && (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-gray-500">
                        Search for an existing user by email to add them to your team.
                      </p>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            ref={searchInputRef}
                            type="email"
                            value={searchEmail}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            onKeyDown={handleEmailKeyDown}
                            placeholder="Search by email..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-border/50 bg-white text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
                          />
                          {searching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {searchError && (
                        <div className="flex items-center gap-2 p-3 rounded-[10px] bg-surface text-gray-600 text-xs font-medium">
                          {searchError}
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={handleInviteInstead}
                          className="w-full py-3 rounded-[12px] border border-border/50 text-sm font-semibold text-gray-500 hover:bg-surface-hover transition-colors flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Invite by email instead
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'found' && foundUser && (
                    <motion.div
                      key="found"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      {addSuccess ? (
                        <div className="text-center py-4">
                          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                            <UserCheck className="w-8 h-8 text-success" />
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Invitation sent to <span className="font-semibold text-primary">{foundUser.name}</span>.
                          </p>
                          <p className="text-xs text-gray-400 mb-4">
                            They will see it in their notifications and can accept or decline. It expires in 7 days.
                          </p>
                          <button
                            onClick={handleClose}
                            className="mt-2 w-full py-3 rounded-[12px] bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 p-4 bg-surface rounded-[14px]">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold text-accent">
                                {foundUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-primary truncate">{foundUser.name}</p>
                              <p className="text-xs text-gray-400 truncate">{foundUser.email}</p>
                              {foundUser.phone && (
                                <p className="text-xs text-gray-400">{foundUser.phone}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Assign Role</label>
                            <div className="relative">
                              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <select
                                value={addRole}
                                onChange={(e) => setAddRole(e.target.value)}
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
                                value={addMessage}
                                onChange={(e) => setAddMessage(e.target.value)}
                                placeholder="Add a welcome message..."
                                rows={2}
                                className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-border/50 bg-white text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all resize-none"
                              />
                            </div>
                          </div>

                          {searchError && (
                            <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                              {searchError}
                            </div>
                          )}

                          <div className="flex items-center gap-3 pt-2">
                            <button
                              type="button"
                              onClick={handleBack}
                              className="flex-1 py-3 rounded-[12px] border border-border/50 text-sm font-semibold text-gray-500 hover:bg-surface-hover transition-colors"
                            >
                              Back
                            </button>
                            <button
                              onClick={handleAddMember}
                              disabled={adding}
                              className={cn(
                                'flex-1 py-3 rounded-[12px] text-sm font-semibold text-white transition-colors',
                                adding ? 'bg-accent/70 cursor-not-allowed' : 'bg-accent hover:bg-accent-dark'
                              )}
                            >
                              {adding ? 'Sending...' : 'Send Invitation'}
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {step === 'invite' && (
                    <motion.div
                      key="invite"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <form onSubmit={handleInviteSubmit} className="space-y-4">
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
                              onChange={(e) => setRole(e.target.value)}
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

                        {inviteError && (
                          <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                            {inviteError}
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-3 rounded-[12px] border border-border/50 text-sm font-semibold text-gray-500 hover:bg-surface-hover transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={inviteLoading}
                            className={cn(
                              'flex-1 py-3 rounded-[12px] text-sm font-semibold text-white transition-colors',
                              inviteLoading ? 'bg-accent/70 cursor-not-allowed' : 'bg-accent hover:bg-accent-dark'
                            )}
                          >
                            {inviteLoading ? 'Sending...' : 'Send Invitation'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {step === 'done' && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-4"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

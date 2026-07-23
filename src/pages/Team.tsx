import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  Calendar,
  Copy,
  Check,
  X,
  Trash2,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { getAuthToken, logoutUser } from '@/lib/auth'
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/shared/SharedComponents'
import { InviteModal } from '@/components/shared/InviteModal'

const API_BASE = 'http://localhost:3001/api'

function authFetch(url: string, options?: RequestInit) {
  const token = getAuthToken()
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  }).then((res) => {
    if (res.status === 401) {
      logoutUser()
      window.location.href = '/login'
    }
    return res
  })
}

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  project_manager: 'Project Manager',
  site_engineer: 'Site Engineer',
  storekeeper: 'Storekeeper',
}

const roleColors: Record<string, string> = {
  owner: 'bg-accent/10 text-accent',
  project_manager: 'bg-primary/10 text-primary',
  site_engineer: 'bg-success/10 text-success',
  storekeeper: 'bg-warning/10 text-warning',
}

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  inactive: 'bg-gray-100 text-gray-500',
}

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  joinedAt: string
  invitedBy: string | null
  avatar: string | null
}

interface Invitation {
  id: string
  name: string
  phone: string
  role: string
  message: string
  code: string
  status: string
  createdAt: string
  expiresAt: string
  invitedBy: string
}

function MemberCard({ member, onRemove }: {
  member: TeamMember
  onRemove: (id: string) => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="bg-white rounded-[16px] border border-border/50 p-4 md:p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
            roleColors[member.role] || 'bg-gray-100 text-gray-500'
          )}>
            {getInitials(member.name)}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-primary truncate">{member.name}</h3>
            <p className="text-xs text-gray-400 truncate">{member.email}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-surface-hover transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-10 z-20 w-40 bg-white rounded-[12px] border border-border shadow-lg overflow-hidden"
              >
                {member.role !== 'owner' && (
                  <button
                    onClick={() => { onRemove(member.id); setShowMenu(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-danger hover:bg-danger/5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Member
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize',
            roleColors[member.role] || 'bg-gray-100 text-gray-500'
          )}>
            {roleLabels[member.role] || member.role}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">{member.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">Joined {member.joinedAt}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize',
            statusColors[member.status]
          )}>
            {member.status}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function InvitationCard({ invitation, onRevoke }: {
  invitation: Invitation
  onRevoke: (id: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const joinLink = `${window.location.origin}/join/${invitation.code}`

  const copyLink = () => {
    navigator.clipboard.writeText(joinLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="bg-white rounded-[16px] border border-border/50 p-4 md:p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-warning" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-primary truncate">{invitation.name}</h3>
            <p className="text-xs text-gray-400">{invitation.phone}</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning capitalize">
          {invitation.status}
        </span>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize',
            roleColors[invitation.role] || 'bg-gray-100 text-gray-500'
          )}>
            {roleLabels[invitation.role] || invitation.role}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">Sent {invitation.createdAt}</span>
        </div>
        {invitation.message && (
          <p className="text-xs text-gray-500 italic">"{invitation.message}"</p>
        )}
      </div>

      <div className="flex items-center gap-2 p-2.5 bg-surface rounded-[10px] mb-3">
        <code className="flex-1 text-xs font-mono text-primary truncate">
          {joinLink}
        </code>
        <button
          onClick={copyLink}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-accent hover:bg-accent/5 transition-colors flex-shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="flex items-center gap-2 p-2 bg-surface rounded-[8px] mb-3">
        <span className="text-[10px] text-gray-400">Code:</span>
        <code className="text-xs font-mono font-bold text-accent tracking-wider">
          {invitation.code}
        </code>
      </div>

      <button
        onClick={() => onRevoke(invitation.id)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-xs font-medium text-danger hover:bg-danger/5 border border-danger/20 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
        Revoke Invitation
      </button>
    </motion.div>
  )
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [tab, setTab] = useState<'members' | 'invitations'>('members')
  const [loading, setLoading] = useState(true)

  const fetchMembers = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/team/members`)
      if (res.ok) {
        const data = await res.json()
        setMembers(data.members)
      }
    } catch {}
  }, [])

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/team/invitations`)
      if (res.ok) {
        const data = await res.json()
        setInvitations(data.invitations)
      }
    } catch {}
  }, [])

  useEffect(() => {
    Promise.all([fetchMembers(), fetchInvitations()]).then(() => setLoading(false))
  }, [fetchMembers, fetchInvitations])

  const removeMember = async (id: string) => {
    try {
      const res = await authFetch(`${API_BASE}/team/members/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, status: 'inactive' } : m))
      }
    } catch {}
  }

  const revokeInvitation = async (id: string) => {
    try {
      const res = await authFetch(`${API_BASE}/team/invitations/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setInvitations(prev => prev.filter(inv => inv.id !== id))
      }
    } catch {}
  }

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || m.role === roleFilter
    return matchesSearch && matchesRole
  })

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.phone.includes(search)
    return matchesSearch && inv.status === 'pending'
  })

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === 'active').length,
    pending: invitations.filter((inv) => inv.status === 'pending').length,
    roles: Object.entries(roleLabels).map(([key, label]) => ({
      label,
      count: members.filter((m) => m.role === key).length,
    })),
  }

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
            <div className="blueprint-grid absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-white/50 text-xs md:text-sm font-medium mb-2 uppercase tracking-widest">Team Management</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                Your Team
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-lg">
                Manage your team members, invite new collaborators, and assign roles.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white text-primary rounded-[14px] font-semibold text-sm hover:bg-white/90 transition-colors self-start md:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </motion.button>
          </div>
        </div>
      </FadeInUp>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StaggerItem>
          <div className="bg-white rounded-[16px] border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-accent/8 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-xs text-gray-400">Total Members</p>
              </div>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white rounded-[16px] border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-success/8 flex items-center justify-center">
                <Check className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.active}</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white rounded-[16px] border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-warning/8 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.pending}</p>
                <p className="text-xs text-gray-400">Pending Invites</p>
              </div>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white rounded-[16px] border border-border/50 p-4">
            <p className="text-xs text-gray-400 mb-2 font-medium">By Role</p>
            <div className="space-y-1.5">
              {stats.roles.filter(r => r.count > 0).map((role) => (
                <div key={role.label} className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">{role.label}</span>
                  <span className="text-xs font-bold text-primary">{role.count}</span>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Search + Tabs */}
      <FadeInUp delay={0.15}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-border/50 bg-white text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {tab === 'members' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 rounded-[12px] border border-border/50 bg-white text-xs font-medium text-primary appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="all">All Roles</option>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </FadeInUp>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface rounded-[14px] w-fit">
        <button
          onClick={() => setTab('members')}
          className={cn(
            'px-4 py-2 rounded-[10px] text-xs font-semibold transition-all',
            tab === 'members'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-400 hover:text-primary'
          )}
        >
          Members ({members.length})
        </button>
        <button
          onClick={() => setTab('invitations')}
          className={cn(
            'px-4 py-2 rounded-[10px] text-xs font-semibold transition-all',
            tab === 'invitations'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-400 hover:text-primary'
          )}
        >
          Pending ({filteredInvitations.length})
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'members' ? (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No team members found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onRemove={removeMember}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="invitations"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {filteredInvitations.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No pending invitations</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredInvitations.map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    onRevoke={revokeInvitation}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <InviteModal open={showInvite} onClose={() => { setShowInvite(false); fetchInvitations() }} />
    </div>
  )
}

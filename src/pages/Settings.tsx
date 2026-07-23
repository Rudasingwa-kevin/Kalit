import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Camera,
  Pencil,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { getCurrentUser, loginUser, type AuthUser } from '@/lib/auth'
import { FadeInUp } from '@/components/shared/SharedComponents'

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  project_manager: 'Project Manager',
  site_engineer: 'Site Engineer',
  storekeeper: 'Storekeeper',
}

const roleBadgeColors: Record<string, string> = {
  owner: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
  project_manager: 'bg-blue-500/10 text-blue-600 ring-blue-500/20',
  site_engineer: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20',
  storekeeper: 'bg-purple-500/10 text-purple-600 ring-purple-500/20',
}

type Tab = 'profile' | 'password'

export default function Settings() {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [company, setCompany] = useState(user?.company ?? '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError, setPwError] = useState('')

  const [joinedAt, setJoinedAt] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user: data } = await api.getMe()
        setUser(data)
        setName(data.name)
        setPhone(data.phone ?? '')
        setCompany(data.company ?? '')
        setJoinedAt(data.joinedAt)
      } catch {}
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setSaving(true)

    try {
      const { user: updated } = await api.updateProfile({ name, phone, company })
      const current = getCurrentUser()
      if (current) {
        const updatedUser: AuthUser = { ...current, ...updated }
        loginUser(updatedUser, localStorage.getItem('kalit_auth_token') ?? '')
        sessionStorage.setItem('kalit_current_user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
      setProfileSuccess('Profile updated successfully')
      setTimeout(() => setProfileSuccess(''), 3000)
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile')
    }
    setSaving(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters')
      return
    }

    setPwSaving(true)
    try {
      await api.changePassword({ currentPassword, newPassword })
      setPwSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPwSuccess(''), 3000)
    } catch (err: any) {
      setPwError(err.message || 'Failed to change password')
    }
    setPwSaving(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('kalit_current_user')
    localStorage.removeItem('kalit_auth_token')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section */}
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

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-white/50 text-xs md:text-sm font-medium mb-2 uppercase tracking-widest">
                Account Settings
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                Hi, {firstName}
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-lg">
                Manage your profile, update your password, and control your account preferences.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-[14px] font-semibold text-sm transition-colors self-start md:self-auto backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </FadeInUp>

      {/* Profile Overview Card */}
      <FadeInUp delay={0.05}>
        <div className="bg-white rounded-[20px] border border-border/50 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-[18px] bg-accent/10 flex items-center justify-center flex-shrink-0 ring-2 ring-accent/20 ring-offset-2">
                <span className="text-2xl font-bold text-accent">{initials}</span>
              </div>
              <div className="absolute inset-0 rounded-[18px] bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-primary truncate">{user?.name}</h2>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset',
                    roleBadgeColors[user?.role ?? ''] ?? 'bg-gray-100 text-gray-600 ring-gray-200'
                  )}
                >
                  <Shield className="w-3 h-3" />
                  {roleLabels[user?.role ?? ''] ?? user?.role}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {user?.email}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {user?.phone}
                  </span>
                )}
                {joinedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    Joined {new Date(joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {/* Edit Profile CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('profile')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-sm font-semibold transition-all',
                activeTab === 'profile'
                  ? 'bg-accent text-white'
                  : 'bg-surface hover:bg-accent/10 text-primary'
              )}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </motion.button>
          </div>
        </div>
      </FadeInUp>

      {/* Tabs */}
      <FadeInUp delay={0.1}>
        <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-border/50">
            {[
              { id: 'profile' as Tab, label: 'Profile Information', icon: Settings2 },
              { id: 'password' as Tab, label: 'Change Password', icon: Lock },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative',
                  activeTab === id
                    ? 'text-accent'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {activeTab === id && (
                  <motion.div
                    layoutId="settings-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-6 md:p-8"
              >
                <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-xl">
                  <h3 className="text-sm font-bold text-primary mb-1">Personal Details</h3>

                  <div>
                    <label className="text-sm font-medium text-primary block mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary block mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email ?? ''}
                        disabled
                        className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border/50 bg-surface text-sm text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">Email cannot be changed</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-primary block mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+250 7XX XXX XXX"
                          className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary block mb-2">Company</label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Your company"
                          className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {profileError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {profileError}
                    </motion.div>
                  )}

                  {profileSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-[10px] bg-success/5 text-success text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      {profileSuccess}
                    </motion.div>
                  )}

                  <div className="flex justify-end pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={saving || !name}
                      className={cn(
                        'flex items-center gap-2 px-6 py-2.5 rounded-[12px] text-sm font-semibold text-white transition-all',
                        saving || !name
                          ? 'bg-accent/50 cursor-not-allowed'
                          : 'bg-accent hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20'
                      )}
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-6 md:p-8"
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
                  <h3 className="text-sm font-bold text-primary mb-1">Security</h3>

                  <div>
                    <label className="text-sm font-medium text-primary block mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                        className="w-full h-11 pl-11 pr-12 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-primary block mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          required
                          className="w-full h-11 pl-11 pr-12 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary block mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          required
                          className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {pwError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {pwError}
                    </motion.div>
                  )}

                  {pwSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-[10px] bg-success/5 text-success text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      {pwSuccess}
                    </motion.div>
                  )}

                  <div className="flex justify-end pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
                      className={cn(
                        'flex items-center gap-2 px-6 py-2.5 rounded-[12px] text-sm font-semibold text-white transition-all',
                        pwSaving || !currentPassword || !newPassword || !confirmPassword
                          ? 'bg-accent/50 cursor-not-allowed'
                          : 'bg-accent hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20'
                      )}
                    >
                      {pwSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Update Password
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeInUp>
    </div>
  )
}

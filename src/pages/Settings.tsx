import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

export default function Settings() {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
      {/* Profile Section */}
      <FadeInUp>
        <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-accent">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">{user?.name}</h2>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium">
                    {roleLabels[user?.role ?? ''] ?? user?.role}
                  </span>
                  {joinedAt && (
                    <>
                      <span className="text-gray-300">·</span>
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        Joined {new Date(joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="p-6 md:p-8 space-y-5">
            <h3 className="text-sm font-bold text-primary">Profile Information</h3>

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
              <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-[10px] bg-success/5 text-success text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {profileSuccess}
              </div>
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
        </div>
      </FadeInUp>

      {/* Password Section */}
      <FadeInUp delay={0.1}>
        <div className="bg-white rounded-[20px] border border-border/50 p-6 md:p-8">
          <h3 className="text-sm font-bold text-primary mb-5">Change Password</h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
              <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-[10px] bg-success/5 text-success text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {pwSuccess}
              </div>
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
        </div>
      </FadeInUp>
    </div>
  )
}

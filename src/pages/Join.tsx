import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Key, Mail, User, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { useTeam } from '@/hooks/useTeam'
import { cn } from '@/lib/utils'

export default function Join() {
  const { code: urlCode } = useParams()
  const { getInvitationByCode, acceptInvitation, roleLabels } = useTeam()
  const [code, setCode] = useState(urlCode || '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'code' | 'details' | 'done'>(
    urlCode ? 'details' : 'code'
  )
  const [error, setError] = useState('')
  const [invitation, setInvitation] = useState<ReturnType<typeof getInvitationByCode> | null>(null)

  useEffect(() => {
    if (urlCode) {
      const found = getInvitationByCode(urlCode)
      if (found) {
        setInvitation(found)
      } else {
        setError('Invalid or expired invitation code')
        setStep('code')
      }
    }
  }, [urlCode])

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const found = getInvitationByCode(code)
    if (!found) {
      setError('Invalid or expired invitation code')
      return
    }
    setInvitation(found)
    setStep('details')
  }

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!invitation) return
    const result = acceptInvitation(invitation.code, name, email)
    if (!result) {
      setError('Failed to join team. Code may have been used already.')
      return
    }
    setStep('done')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px]"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/kalit-icon.png" alt="Kalit" className="w-10 h-10 rounded-[12px]" />
          <span className="text-xl font-bold text-primary">Kalit</span>
        </div>

        {/* Step: Enter Code */}
        {step === 'code' && (
          <div className="bg-white rounded-[20px] border border-border/50 p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-xl font-bold text-primary mb-1">Join a Team</h1>
              <p className="text-sm text-gray-400">Enter the invitation code shared by your team owner</p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-primary block mb-2">Invitation Code</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="KLT-XXXX"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary font-mono font-bold tracking-widest placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-center text-lg"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full h-12 rounded-[12px] bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all flex items-center justify-center gap-2"
              >
                Verify Code
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Don't have a code? Ask your team owner to invite you.
            </p>
          </div>
        )}

        {/* Step: Enter Details */}
        {step === 'details' && invitation && (
          <div className="bg-white rounded-[20px] border border-border/50 p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-success" />
              </div>
              <h1 className="text-xl font-bold text-primary mb-1">Complete Your Profile</h1>
              <p className="text-sm text-gray-400">
                You've been invited as{' '}
                <span className="font-semibold text-primary">
                  {roleLabels[invitation.role]}
                </span>
              </p>
            </div>

            <div className="p-3 rounded-[10px] bg-surface mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Invitation for</span>
                <span className="text-sm font-semibold text-primary">{invitation.name}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">Role</span>
                <span className="text-xs font-semibold text-accent">{roleLabels[invitation.role]}</span>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-primary block mb-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-primary block mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full h-12 rounded-[12px] bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all flex items-center justify-center gap-2"
              >
                Join Team
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="bg-white rounded-[20px] border border-border/50 p-6 md:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-xl font-bold text-primary mb-2">Welcome to the Team!</h1>
            <p className="text-sm text-gray-400 mb-6">
              You've been added as <span className="font-semibold text-primary">{invitation && roleLabels[invitation.role]}</span>. You now have access to your assigned projects.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/login" className="text-accent hover:text-accent-dark font-medium">
            Already have an account? Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

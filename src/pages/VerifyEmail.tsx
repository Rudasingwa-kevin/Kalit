import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { loginUser, type AuthUser } from '@/lib/auth'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = (location.state as any)?.email || ''

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.verifyEmail(email, code)
      const user: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone ?? null,
        avatar: null,
      }
      loginUser(user, data.token)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err: any) {
      setError(err.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendMessage('')
    setError('')
    setResending(true)
    try {
      await api.resendVerification(email)
      setResendMessage('New code sent!')
      setCooldown(60)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  if (!email) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        <div className="flex items-center gap-3 mb-10">
          <img src="/kalit-icon.png" alt="Kalit" className="w-10 h-10 rounded-[12px]" />
          <span className="text-xl font-bold text-primary">Kalit</span>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-[20px] bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
              Email verified!
            </h2>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
              Verify your email
            </h2>
            <p className="text-sm text-gray-400 mb-8">
              Enter the 6-digit code sent to{' '}
              <span className="font-medium text-primary">{email}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-primary block mb-2">Verification code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  maxLength={6}
                  className="w-full h-12 px-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-center text-2xl font-mono font-bold tracking-[0.5em]"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading || code.length < 6}
                className={cn(
                  'w-full h-12 rounded-[12px] text-sm font-semibold text-white transition-all flex items-center justify-center gap-2',
                  loading || code.length < 6
                    ? 'bg-accent/70 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20'
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              {resendMessage && (
                <p className="text-xs text-success mb-2">{resendMessage}</p>
              )}
              <button
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-medium transition-colors',
                  cooldown > 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:text-primary'
                )}
              >
                <RotateCcw className={cn('w-3.5 h-3.5', resending && 'animate-spin')} />
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

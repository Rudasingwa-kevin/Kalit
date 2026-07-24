import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await api.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Invalid or expired reset link')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] text-center"
        >
          <div className="w-16 h-16 rounded-[20px] bg-danger/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-danger" />
          </div>
          <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
            Invalid reset link
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            This password reset link is invalid or missing a token.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Request a new reset link
          </Link>
        </motion.div>
      </div>
    )
  }

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
              Password reset!
            </h2>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Your password has been updated. Redirecting to sign in...
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </motion.div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
              Set new password
            </h2>
            <p className="text-sm text-gray-400 mb-8">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-primary block mb-2">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="w-full h-12 pl-11 pr-12 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-primary block mb-2">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className={cn(
                  'w-full h-12 rounded-[12px] text-sm font-semibold text-white transition-all flex items-center justify-center gap-2',
                  loading
                    ? 'bg-accent/70 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20'
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

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

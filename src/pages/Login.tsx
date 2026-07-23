import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { loginUser, type AuthUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.')
        setLoading(false)
        return
      }

      const user: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone ?? null,
        avatar: null,
      }
      loginUser(user, data.token)
      navigate('/dashboard')
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute top-16 right-16 w-64 h-64 border border-white/10 rounded-[60px] rotate-12" />
        <div className="absolute bottom-20 left-12 w-40 h-40 border border-white/5 rounded-[40px] -rotate-6" />
        <div className="absolute top-1/3 left-16 w-20 h-20 border border-white/5 rounded-full" />

        <div className="relative z-10 text-center px-12">
          <img src="/kalit-icon.png" alt="Kalit" className="w-20 h-20 mx-auto mb-8 rounded-[20px]" />
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Build with clarity
          </h1>
          <p className="text-white/50 text-lg max-w-md leading-relaxed">
            The modern construction management platform trusted by 500+ companies worldwide.
          </p>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/40 mt-1">Projects</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">15K+</p>
              <p className="text-sm text-white/40 mt-1">Team Members</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-sm text-white/40 mt-1">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/kalit-icon.png" alt="Kalit" className="w-10 h-10 rounded-[12px]" />
            <span className="text-xl font-bold text-primary">Kalit</span>
          </div>

          <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Sign in with your email and password
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-primary block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@kalit.io"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-primary block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password or KLT code"
                  required
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
              <p className="text-[11px] text-gray-400 mt-1.5">Use your password or invitation code (KLT-XXXX)</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-[10px] bg-danger/5 text-danger text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
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
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-accent hover:text-accent-dark transition-colors">
              Create one
            </Link>
          </p>

          {/* Join link */}
          <p className="text-center text-sm text-gray-400 mt-3">
            New team member?{' '}
            <Link to="/join" className="font-semibold text-accent hover:text-accent-dark transition-colors">
              Join with invitation code
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

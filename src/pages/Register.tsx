import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { loginUser } from '@/lib/auth'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', company: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }
      loginUser(data.user, data.token)
      window.location.href = '/dashboard'
    } catch {
      setError('Network error. Please try again.')
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

        <div className="relative z-10 text-center px-12">
          <img src="/kalit-icon.png" alt="Kalit" className="w-20 h-20 mx-auto mb-8 rounded-[20px]" />
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Start building smarter
          </h1>
          <p className="text-white/50 text-lg max-w-md leading-relaxed">
            Join 500+ construction companies that trust Kalit to manage their projects, inventory, and teams.
          </p>

          <div className="mt-12 space-y-4 text-left max-w-sm mx-auto">
            {[
              'Track projects in real-time',
              'Manage materials and inventory',
              'Collaborate with your team',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <span className="text-sm text-white/60">{feature}</span>
              </div>
            ))}
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
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/kalit-icon.png" alt="Kalit" className="w-10 h-10 rounded-[12px]" />
            <span className="text-xl font-bold text-primary">Kalit</span>
          </div>

          <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
            Create your account
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Free for small teams. No credit card required.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-[12px] bg-danger/8 border border-danger/20 text-sm text-danger font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-primary block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-primary block mb-2">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@company.com"
                  className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="text-sm font-medium text-primary block mb-2">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder="Acme Construction"
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
                  value={formData.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Min. 8 characters"
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

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-border text-accent focus:ring-accent/20 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-accent hover:text-accent-dark font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-accent hover:text-accent-dark font-medium">Privacy Policy</a>
              </label>
            </div>

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
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent hover:text-accent-dark transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

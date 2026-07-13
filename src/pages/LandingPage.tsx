import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  BarChart3,
  Package,
  Shield,
  Zap,
  Globe,
  Users,
  Layers,
  CheckCircle2,
  Star,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Clock,
  Target,
  Workflow,
  LineChart,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Layers,
    title: 'Project Intelligence',
    description: 'Real-time project health scores, budget tracking, and milestone management with predictive analytics.',
    color: 'bg-accent/8 text-accent',
  },
  {
    icon: Package,
    title: 'Smart Inventory',
    description: 'AI-powered stock predictions, automated reorder alerts, and multi-warehouse tracking.',
    color: 'bg-success/8 text-success',
  },
  {
    icon: BarChart3,
    title: 'Financial Clarity',
    description: 'Live expense tracking, budget forecasting, and one-click report generation.',
    color: 'bg-warning/8 text-warning',
  },
  {
    icon: Users,
    title: 'Team Sync',
    description: 'Role-based dashboards, real-time collaboration, and field-to-office communication.',
    color: 'bg-primary/8 text-primary',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'Automate approvals, notifications, and material requisitions across your projects.',
    color: 'bg-accent/8 text-accent',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant, end-to-end encryption, and granular permission controls.',
    color: 'bg-success/8 text-success',
  },
]

const stats = [
  { value: '500+', label: 'Projects Managed', icon: Building2 },
  { value: '$2.1B', label: 'Materials Tracked', icon: TrendingUp },
  { value: '15K+', label: 'Team Members', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: Shield },
]

const testimonials = [
  {
    quote: "Kalit replaced 5 different tools we were using. The unified dashboard alone saves us 10 hours per week.",
    author: "Sarah Mensah",
    role: "VP of Operations, BuildRight Africa",
    rating: 5,
  },
  {
    quote: "The inventory alerts have saved us from costly delays three times already this quarter. Game changer.",
    author: "Jean-Luc Ndayisaba",
    role: "Project Director, Horizon Construction",
    rating: 5,
  },
  {
    quote: "Finally, construction software that doesn't look like it was built in 2005. Our team actually enjoys using it.",
    author: "Amina Hassan",
    role: "CEO, Summit Builders",
    rating: 5,
  },
]

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'glass-strong shadow-sm' : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] md:h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/kalit-logo.png" alt="Kalit" className="h-8 md:h-10 w-auto object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-500 hover:text-primary transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-primary hover:bg-primary-light px-5 py-2.5 rounded-[12px] transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              Get Started Free
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-[12px] hover:bg-surface transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass-strong border-t border-border-light px-6 py-4"
          >
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-border-light mt-2 space-y-2">
              <Link to="/login" className="block text-center text-sm font-medium text-primary py-2.5">
                Sign In
              </Link>
              <Link to="/register" className="block text-center text-sm font-semibold text-white bg-primary py-2.5 rounded-[12px]">
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 blueprint-dots opacity-40" />
        <div className="absolute top-20 right-[10%] w-72 h-72 border border-accent/10 rounded-[60px] rotate-12 hidden lg:block" />
        <div className="absolute bottom-20 left-[5%] w-48 h-48 border border-primary/5 rounded-[40px] -rotate-6 hidden lg:block" />
        <div className="absolute top-40 left-[15%] w-24 h-24 border border-accent/5 rounded-full hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-accent/8 border border-accent/10 mb-6 md:mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
              <span className="text-xs md:text-sm font-semibold text-accent">Construction, Reimagined</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary tracking-tight leading-[1.1] mb-5 md:mb-6"
            >
              The future of
              <br />
              <span className="text-gradient">construction management</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed"
            >
              Kalit unifies project tracking, inventory, budgets, and teams into one
              elegant platform. Built for contractors who demand excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
            >
              <Link
                to="/register"
                className="group flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-primary text-white rounded-[14px] md:rounded-[16px] text-sm md:text-base font-semibold hover:bg-primary-light transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                Start Building
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-gray-500 hover:text-primary rounded-[14px] md:rounded-[16px] text-sm md:text-base font-medium transition-colors w-full sm:w-auto justify-center"
              >
                See How it Works
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-12 md:mt-16 lg:mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-4 bg-gradient-to-b from-accent/20 via-accent/5 to-transparent rounded-[32px] blur-2xl" />
              <div className="relative bg-white rounded-[20px] md:rounded-[24px] border border-border/50 shadow-2xl shadow-primary/10 overflow-hidden">
                <div className="h-8 md:h-10 bg-surface border-b border-border-light flex items-center gap-2 px-3 md:px-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-danger/60" />
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-warning/60" />
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-3 md:px-4 py-1 rounded-lg bg-white border border-border-light text-[10px] md:text-[11px] text-gray-400">
                      app.kalit.io/dashboard
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">Today's Overview</p>
                      <h3 className="text-lg md:text-2xl font-bold text-primary">Good morning, Jean-Paul</h3>
                    </div>
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-[14px] md:rounded-[16px] bg-success/10 flex items-center justify-center">
                      <Target className="w-5 h-5 md:w-7 md:h-7 text-success" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 mb-6 md:mb-8">
                    {[
                      { label: 'Active Projects', value: '5', change: '+2' },
                      { label: 'Budget Used', value: '68%', change: '+4%' },
                      { label: 'Materials', value: '2,489', change: '+12%' },
                      { label: 'Team', value: '24', change: '' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="bg-surface rounded-[12px] md:rounded-[14px] p-3 md:p-4"
                      >
                        <p className="text-base md:text-2xl font-bold text-primary">{stat.value}</p>
                        <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 md:mt-1">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-surface rounded-[14px] md:rounded-[16px] p-4 md:p-6">
                    <div className="flex items-center gap-4 md:gap-6 mb-3 md:mb-4">
                      <span className="text-xs md:text-sm font-semibold text-primary">Budget Overview</span>
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent/30" />
                        <span className="text-[10px] md:text-[11px] text-gray-400">Budget</span>
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-[10px] md:text-[11px] text-gray-400">Spent</span>
                      </div>
                    </div>
                    <div className="h-24 md:h-32 flex items-end gap-1.5 md:gap-2">
                      {[40, 55, 45, 65, 50, 70, 60, 75, 55, 80, 65, 85].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1.2 + i * 0.05, duration: 0.6 }}
                          className="flex-1 bg-gradient-to-t from-accent/20 to-accent rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 md:py-16 border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-[14px] bg-accent/8 flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-xs md:text-sm font-semibold text-accent uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4">
              Everything you need,
              <br className="hidden sm:block" />
              nothing you don't
            </h2>
            <p className="text-sm md:text-lg text-gray-400 max-w-xl mx-auto">
              Purpose-built tools for construction professionals. No bloat, no complexity — just clarity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)' }}
                className="bg-white rounded-[16px] md:rounded-[20px] border border-border/50 p-6 md:p-8 cursor-default"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-[14px] ${feature.color} flex items-center justify-center mb-4 md:mb-5`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-16 md:py-24 lg:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-xs md:text-sm font-semibold text-accent uppercase tracking-widest mb-3">How it Works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4">
              Up and running in minutes
            </h2>
            <p className="text-sm md:text-lg text-gray-400 max-w-xl mx-auto">
              No complex setup. No lengthy onboarding. Start managing projects today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Workspace',
                description: 'Set up your company, invite your team, and configure roles in under 2 minutes.',
                icon: Zap,
              },
              {
                step: '02',
                title: 'Add Your Projects',
                description: 'Import existing data or start fresh. Kalit adapts to your workflow.',
                icon: Layers,
              },
              {
                step: '03',
                title: 'Build with Clarity',
                description: 'Track progress, manage budgets, and coordinate teams — all from one dashboard.',
                icon: LineChart,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-5xl md:text-[80px] font-black text-border/50 leading-none mb-3 md:mb-4">{item.step}</div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-[14px] bg-accent/8 flex items-center justify-center mb-3 md:mb-4">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-xs md:text-sm font-semibold text-accent uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4">
              Trusted by builders
            </h2>
            <p className="text-sm md:text-lg text-gray-400 max-w-xl mx-auto">
              See how leading construction companies transformed their operations with Kalit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[16px] md:rounded-[20px] border border-border/50 p-6 md:p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-primary leading-relaxed mb-5 md:mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-primary">{testimonial.author}</p>
                  <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-primary rounded-[24px] md:rounded-[32px] p-8 md:p-12 lg:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="blueprint-grid absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }} />
            </div>
            <div className="absolute top-8 right-8 w-40 h-40 border border-white/10 rounded-[40px] rotate-12 hidden md:block" />
            <div className="absolute bottom-8 left-8 w-28 h-28 border border-white/5 rounded-full hidden md:block" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 md:mb-4">
                Ready to build smarter?
              </h2>
              <p className="text-sm md:text-lg text-white/60 max-w-xl mx-auto mb-8 md:mb-10">
                Join 500+ construction companies that trust Kalit to manage their projects. Free for small teams.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-white text-primary rounded-[14px] md:rounded-[16px] text-sm md:text-base font-semibold hover:bg-white/90 transition-all hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#"
                  className="flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-white/70 hover:text-white rounded-[14px] md:rounded-[16px] text-sm md:text-base font-medium transition-colors w-full sm:w-auto justify-center"
                >
                  Schedule a Demo
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="col-span-2 md:col-span-1">
              <img src="/kalit-logo.png" alt="Kalit" className="h-6 md:h-7 w-auto object-contain mb-3 md:mb-4" />
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                The modern construction management platform.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
              },
              {
                title: 'Resources',
                links: ['Documentation', 'Help Center', 'API Reference', 'Status', 'Community'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Security', 'Cookies', 'GDPR'],
              },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs md:text-sm font-semibold text-primary mb-3 md:mb-4">{col.title}</h4>
                <ul className="space-y-2 md:space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[11px] md:text-sm text-gray-400 hover:text-primary transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 md:pt-8 border-t border-border-light flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-[11px] md:text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Kalit. All rights reserved.
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                <a key={social} href="#" className="text-[11px] md:text-sm text-gray-400 hover:text-primary transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

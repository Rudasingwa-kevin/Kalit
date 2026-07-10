import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Key,
  Activity,
  FolderKanban,
  Package,
  Clock,
} from 'lucide-react'
import { currentUser, projects } from '@/data/mockData'
import { FadeInUp } from '@/components/shared/SharedComponents'

export default function Profile() {
  const userProjects = projects.filter(p => p.engineer === 'Alice Niyonzima' || currentUser.role === 'owner')

  return (
    <div className="max-w-4xl space-y-8">
      <FadeInUp>
        {/* Profile Header */}
        <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-br from-primary via-primary-light to-accent relative">
            <div className="absolute inset-0 blueprint-grid opacity-20" />
            <div className="absolute -bottom-10 left-8">
              <div className="w-24 h-24 rounded-[24px] bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-14 pb-8 px-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary">{currentUser.name}</h2>
                <p className="text-sm text-gray-400 capitalize">{currentUser.role.replace('_', ' ')}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-[12px] text-sm font-semibold text-primary hover:bg-surface-hover transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </motion.button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+250 788 123 456</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Joined Jan 2024</span>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Stats */}
      <FadeInUp delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Projects', value: '6', icon: FolderKanban, color: 'text-accent' },
            { label: 'Team Members', value: '24', icon: Shield, color: 'text-primary' },
            { label: 'Total Materials', value: '2,489', icon: Package, color: 'text-success' },
            { label: 'Hours Logged', value: '1,847', icon: Clock, color: 'text-warning' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className="bg-white rounded-[16px] border border-border/50 p-5"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </FadeInUp>

      {/* Recent Projects */}
      <FadeInUp delay={0.15}>
        <div className="bg-white rounded-[20px] border border-border/50 p-6">
          <h3 className="text-lg font-bold text-primary mb-6">Assigned Projects</h3>
          <div className="space-y-4">
            {userProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-4 p-4 rounded-[14px] hover:bg-surface-hover transition-colors"
              >
                <div className="w-10 h-10 rounded-[12px] bg-accent/8 flex items-center justify-center flex-shrink-0">
                  <FolderKanban className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-primary">{project.name}</h4>
                  <p className="text-xs text-gray-400">{project.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{project.progress}%</p>
                  <div className="w-16 h-1.5 rounded-full bg-border/50 mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Security */}
      <FadeInUp delay={0.2}>
        <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light">
            <h3 className="text-base font-bold text-primary">Security</h3>
          </div>
          <div className="divide-y divide-border-light">
            {[
              { label: 'Change Password', description: 'Update your password regularly', icon: Key },
              { label: 'Two-Factor Auth', description: 'Add an extra layer of security', icon: Shield },
              { label: 'Login History', description: 'View recent login activity', icon: Activity },
            ].map(item => (
              <motion.div
                key={item.label}
                whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                className="flex items-center gap-4 px-6 py-5 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-[12px] bg-surface flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInUp>
    </div>
  )
}

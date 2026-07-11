import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Database,
  Shield,
  Moon,
  Sun,
  Monitor,
  Check,
} from 'lucide-react'
import { FadeInUp } from '@/components/shared/SharedComponents'
import { cn } from '@/lib/utils'

const settingsSections = [
  {
    title: 'Account',
    items: [
      { label: 'Profile Information', description: 'Manage your personal details', icon: User },
      { label: 'Security', description: 'Password, 2FA, and login history', icon: Lock },
      { label: 'Notifications', description: 'Email, push, and in-app alerts', icon: Bell },
    ],
  },
  {
    title: 'Appearance',
    items: [
      { label: 'Theme', description: 'Light, dark, or system', icon: Palette },
      { label: 'Language', description: 'English (US)', icon: Globe },
      { label: 'Data & Privacy', description: 'Export data, delete account', icon: Database },
    ],
  },
]

export default function Settings() {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | 'system'>('light')

  return (
    <div className="max-w-4xl space-y-8">
      <FadeInUp>
        {/* Profile Card */}
        <div className="bg-white rounded-[20px] border border-border/50 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-[20px] overflow-hidden">
              <img src="/kalit-icon.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Jean-Paul Hakizimana</h2>
              <p className="text-sm text-gray-400">jp@kalit.io · Owner</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-auto px-5 py-2.5 border border-border rounded-[12px] text-sm font-semibold text-primary hover:bg-surface-hover transition-colors"
            >
              Edit Profile
            </motion.button>
          </div>
        </div>
      </FadeInUp>

      {/* Theme Selection */}
      <FadeInUp delay={0.1}>
        <div className="bg-white rounded-[20px] border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-accent/8 flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Appearance</h3>
              <p className="text-xs text-gray-400">Customize the look and feel</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light' as const, label: 'Light', icon: Sun },
              { id: 'dark' as const, label: 'Dark', icon: Moon },
              { id: 'system' as const, label: 'System', icon: Monitor },
            ].map(theme => (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={cn(
                  'flex flex-col items-center gap-3 p-5 rounded-[16px] border-2 transition-all',
                  activeTheme === theme.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-gray-300'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-[12px] flex items-center justify-center',
                  activeTheme === theme.id ? 'bg-accent text-white' : 'bg-surface text-gray-400'
                )}>
                  <theme.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-primary">{theme.label}</span>
                {activeTheme === theme.id && (
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Settings Sections */}
      {settingsSections.map((section, si) => (
        <FadeInUp key={section.title} delay={0.15 + si * 0.05}>
          <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-border-light">
              <h3 className="text-base font-bold text-primary">{section.title}</h3>
            </div>
            <div className="divide-y divide-border-light">
              {section.items.map(item => (
                <motion.div
                  key={item.label}
                  whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                  className="flex items-center gap-4 px-6 py-5 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-[12px] bg-surface flex items-center justify-center flex-shrink-0">
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
      ))}
    </div>
  )
}

import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { currentUser } from '@/data/mockData'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/inventory', label: 'Inventory', icon: Package },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white border-r border-border"
    >
      <div className="flex items-center h-[72px] px-6 border-b border-border-light">
        <div className="flex items-center min-w-0">
          <AnimatePresence>
            {!collapsed ? (
              <motion.img
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                src="/kalit-logo.png"
                alt="Kalit"
                className="h-10 w-auto flex-shrink-0 object-contain"
              />
            ) : (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src="/kalit-icon.png"
                alt="Kalit"
                className="w-12 h-12 rounded-[14px] flex-shrink-0 object-cover mx-auto"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path)
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all duration-200 group relative',
                  isActive
                    ? 'bg-accent/8 text-accent'
                    : 'text-gray-500 hover:text-primary hover:bg-surface-hover'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent rounded-r-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-accent')} strokeWidth={isActive ? 2.5 : 2} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn('text-sm font-medium whitespace-nowrap overflow-hidden', isActive && 'text-accent font-semibold')}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            )
          })}
        </div>
      </nav>

      <div className="px-3 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-gray-400 hover:text-primary hover:bg-surface-hover transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="p-3 border-t border-border-light">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-surface-hover transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-accent">{getInitials(currentUser.name)}</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden min-w-0"
              >
                <p className="text-sm font-semibold text-primary truncate">{currentUser.name}</p>
                <p className="text-[11px] text-gray-400 truncate capitalize">{currentUser.role.replace('_', ' ')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

export function TopBar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 glass-strong">
      <div className="flex items-center justify-between h-[72px] px-8">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">{title}</h1>
        </div>
      </div>
    </header>
  )
}

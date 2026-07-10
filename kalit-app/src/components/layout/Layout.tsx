import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  ArrowLeftRight,
  Truck,
  Receipt,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  Building2,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { currentUser } from '@/data/mockData'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/inventory/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/suppliers', label: 'Suppliers', icon: Truck },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/profile', label: 'Profile', icon: User },
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
      {/* Logo */}
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

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
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

      {/* Collapse Button */}
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

      {/* User Card */}
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
  const [searchFocused, setSearchFocused] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <header className="sticky top-0 z-30 glass-strong">
      <div className="flex items-center justify-between h-[72px] px-8">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-[12px] border transition-all duration-300',
              searchFocused
                ? 'border-accent ring-4 ring-accent/10 w-80'
                : 'border-border w-64 hover:border-gray-300'
            )}
          >
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-sm text-primary placeholder:text-gray-400 outline-none w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-surface rounded border border-border-light">
              ⌘K
            </kbd>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 flex items-center justify-center rounded-[12px] text-gray-400 hover:text-primary hover:bg-surface-hover transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="w-10 h-10 flex items-center justify-center rounded-[12px] text-gray-400 hover:text-primary hover:bg-surface-hover transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-border-light cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-white">{getInitials(currentUser.name)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

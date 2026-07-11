import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/inventory': 'Inventory',
  '/inventory/transactions': 'Transactions',
  '/suppliers': 'Suppliers',
  '/expenses': 'Expenses',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/profile': 'Profile',
}

export default function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 mb-6"
    >
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-primary transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const label = routeLabels[routeTo] || (name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '))

        return (
          <div key={routeTo} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-gray-300" />
            {isLast ? (
              <span className="text-xs font-semibold text-primary">{label}</span>
            ) : (
              <Link
                to={routeTo}
                className="text-xs font-medium text-gray-400 hover:text-primary transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </motion.nav>
  )
}

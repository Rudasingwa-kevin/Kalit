import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar, TopBar } from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import Inventory from '@/pages/Inventory'
import InventoryTransactions from '@/pages/InventoryTransactions'
import Suppliers from '@/pages/Suppliers'
import Expenses from '@/pages/Expenses'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import Profile from '@/pages/Profile'
import { motion } from 'framer-motion'

const queryClient = new QueryClient()

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/inventory': 'Inventory',
  '/inventory/transactions': 'Inventory Transactions',
  '/suppliers': 'Suppliers',
  '/expenses': 'Expenses',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/profile': 'Profile',
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/projects/')) return 'Project Detail'
  return pageTitles[pathname] || 'Kalit'
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = window.location.pathname

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-[280px] transition-all duration-300">
        <TopBar title={getPageTitle(pathname)} />
        <main className="p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/projects" element={<AppLayout><Projects /></AppLayout>} />
          <Route path="/projects/:id" element={<AppLayout><ProjectDetail /></AppLayout>} />
          <Route path="/inventory" element={<AppLayout><Inventory /></AppLayout>} />
          <Route path="/inventory/transactions" element={<AppLayout><InventoryTransactions /></AppLayout>} />
          <Route path="/suppliers" element={<AppLayout><Suppliers /></AppLayout>} />
          <Route path="/expenses" element={<AppLayout><Expenses /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

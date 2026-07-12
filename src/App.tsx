import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar, TopBar } from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import Dashboard from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import Inventory from '@/pages/Inventory'
import { motion } from 'framer-motion'

const queryClient = new QueryClient()

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/inventory': 'Inventory',
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/projects" element={<AppLayout><Projects /></AppLayout>} />
          <Route path="/projects/:id" element={<AppLayout><ProjectDetail /></AppLayout>} />
          <Route path="/inventory" element={<AppLayout><Inventory /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

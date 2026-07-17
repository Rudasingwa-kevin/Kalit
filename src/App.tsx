import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar, TopBar } from '@/components/layout/Layout'
import { NavigationLoadingBar } from '@/components/shared/SharedComponents'
import { ErrorBoundary, SidebarErrorFallback } from '@/components/shared/ErrorBoundary'
import {
  DashboardSkeleton,
  ProjectsSkeleton,
  ProjectDetailSkeleton,
  InventorySkeleton,
  AuthPageSkeleton,
} from '@/components/shared/Skeletons'
import { motion, AnimatePresence } from 'framer-motion'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Projects = lazy(() => import('@/pages/Projects'))
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))
const Inventory = lazy(() => import('@/pages/Inventory'))
const Team = lazy(() => import('@/pages/Team'))
const Join = lazy(() => import('@/pages/Join'))

const queryClient = new QueryClient()

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/inventory': 'Inventory',
  '/team': 'Team Management',
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/projects/')) return 'Project Detail'
  return pageTitles[pathname] || 'Kalit'
}

function AppLayout({ skeleton, children }: { skeleton: React.ReactNode; children: React.ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="md:ml-[280px] transition-all duration-300">
        <TopBar title={getPageTitle(pathname)} />
        <main className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ErrorBoundary>
                <Suspense fallback={skeleton}>
                  {children}
                </Suspense>
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function NavigationTracker() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return <NavigationLoadingBar isLoading={isLoading} />
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ErrorBoundary><LandingPage /></ErrorBoundary>} />
        <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
        <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
        <Route path="/forgot-password" element={<ErrorBoundary><ForgotPassword /></ErrorBoundary>} />
        <Route path="/join" element={<Join />} />
        <Route path="/join/:code" element={<Join />} />
        <Route path="/dashboard" element={<AppLayout skeleton={<DashboardSkeleton />}><Dashboard /></AppLayout>} />
        <Route path="/projects" element={<AppLayout skeleton={<ProjectsSkeleton />}><Projects /></AppLayout>} />
        <Route path="/projects/:id" element={<AppLayout skeleton={<ProjectDetailSkeleton />}><ProjectDetail /></AppLayout>} />
        <Route path="/inventory" element={<AppLayout skeleton={<InventorySkeleton />}><Inventory /></AppLayout>} />
        <Route path="/team" element={<AppLayout skeleton={<AuthPageSkeleton />}><Team /></AppLayout>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigationTracker />
        <ErrorBoundary fallback={<SidebarErrorFallback />}>
          <Suspense fallback={<AuthPageSkeleton />}>
            <AnimatedRoutes />
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

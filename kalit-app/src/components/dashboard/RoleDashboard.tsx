import { motion } from 'framer-motion'
import {
  Building2,
  DollarSign,
  Package,
  FolderKanban,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Truck,
  BarChart3,
  FileText,
  Wrench,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar,
  Layers,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { AnimatedCounter, CircularProgress, ProgressBar, FadeInUp, StaggerContainer, StaggerItem, StatusBadge } from '@/components/shared/SharedComponents'

type UserRole = 'owner' | 'project_manager' | 'site_engineer' | 'storekeeper'

interface Widget {
  id: string
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down'
  icon: React.ElementType
  color: string
  bgColor: string
  description?: string
}

interface DashboardSection {
  title: string
  widgets: Widget[]
}

const roleConfig: Record<UserRole, { greeting: string; subtitle: string; sections: DashboardSection[] }> = {
  owner: {
    greeting: 'Company Overview',
    subtitle: 'Full visibility across all projects and operations',
    sections: [
      {
        title: 'Financial Health',
        widgets: [
          { id: 'total-budget', title: 'Total Budget', value: '$14.4M', change: '+12%', changeType: 'up', icon: DollarSign, color: 'text-accent', bgColor: 'bg-accent/8' },
          { id: 'total-spent', title: 'Total Spent', value: '$9.4M', change: '66%', icon: TrendingUp, color: 'text-primary', bgColor: 'bg-primary/8' },
          { id: 'pending-expenses', title: 'Pending Approvals', value: 2, icon: Clock, color: 'text-warning', bgColor: 'bg-warning/8', description: 'Expenses awaiting review' },
          { id: 'net-profit', title: 'Net Profit', value: '$5M', change: '+18%', changeType: 'up', icon: BarChart3, color: 'text-success', bgColor: 'bg-success/8' },
        ],
      },
      {
        title: 'Operations',
        widgets: [
          { id: 'active-projects', title: 'Active Projects', value: 5, change: '+2', changeType: 'up', icon: FolderKanban, color: 'text-accent', bgColor: 'bg-accent/8' },
          { id: 'team-members', title: 'Team Members', value: 24, icon: Users, color: 'text-primary', bgColor: 'bg-primary/8' },
          { id: 'total-materials', title: 'Materials Value', value: '$335K', icon: Package, color: 'text-success', bgColor: 'bg-success/8' },
          { id: 'low-stock', title: 'Low Stock Items', value: 3, icon: AlertTriangle, color: 'text-danger', bgColor: 'bg-danger/8', description: 'Requires attention' },
        ],
      },
    ],
  },
  project_manager: {
    greeting: 'Project Dashboard',
    subtitle: 'Track progress, deadlines, and team activity',
    sections: [
      {
        title: 'My Projects',
        widgets: [
          { id: 'assigned', title: 'Assigned Projects', value: 3, icon: FolderKanban, color: 'text-accent', bgColor: 'bg-accent/8' },
          { id: 'on-track', title: 'On Track', value: 2, icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/8' },
          { id: 'at-risk', title: 'At Risk', value: 1, icon: AlertTriangle, color: 'text-warning', bgColor: 'bg-warning/8' },
          { id: 'avg-progress', title: 'Avg Progress', value: '65%', icon: Target, color: 'text-primary', bgColor: 'bg-primary/8' },
        ],
      },
      {
        title: 'Deadlines & Activity',
        widgets: [
          { id: 'upcoming-deadlines', title: 'Upcoming Deadlines', value: 4, icon: Calendar, color: 'text-warning', bgColor: 'bg-warning/8', description: 'Next 7 days' },
          { id: 'material-requests', title: 'Material Requests', value: 3, icon: Package, color: 'text-accent', bgColor: 'bg-accent/8', description: 'Pending approval' },
          { id: 'team-activity', title: 'Team Updates', value: 12, icon: Users, color: 'text-primary', bgColor: 'bg-primary/8', description: 'Today' },
          { id: 'completed-tasks', title: 'Tasks Done', value: 47, change: '+8', changeType: 'up', icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/8' },
        ],
      },
    ],
  },
  site_engineer: {
    greeting: "Today's Focus",
    subtitle: 'Tasks, materials, and timeline for your site',
    sections: [
      {
        title: "Today's Tasks",
        widgets: [
          { id: 'today-tasks', title: 'Tasks Today', value: 5, icon: ClipboardList, color: 'text-accent', bgColor: 'bg-accent/8' },
          { id: 'completed-today', title: 'Completed', value: 2, icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/8' },
          { id: 'pending-tasks', title: 'Pending', value: 3, icon: Clock, color: 'text-warning', bgColor: 'bg-warning/8' },
          { id: 'reports-due', title: 'Reports Due', value: 1, icon: FileText, color: 'text-danger', bgColor: 'bg-danger/8' },
        ],
      },
      {
        title: 'Site Info',
        widgets: [
          { id: 'project-progress', title: 'Project Progress', value: '68%', icon: Layers, color: 'text-accent', bgColor: 'bg-accent/8' },
          { id: 'materials-needed', title: 'Materials Needed', value: 4, icon: Package, color: 'text-warning', bgColor: 'bg-warning/8', description: 'For this week' },
          { id: 'equipment', title: 'Equipment Status', value: 'All OK', icon: Wrench, color: 'text-success', bgColor: 'bg-success/8' },
          { id: 'weather', title: 'Weather', value: '24°C', icon: Target, color: 'text-accent', bgColor: 'bg-accent/8', description: 'Partly Cloudy' },
        ],
      },
    ],
  },
  storekeeper: {
    greeting: 'Inventory Control',
    subtitle: 'Stock levels, deliveries, and transactions',
    sections: [
      {
        title: 'Stock Overview',
        widgets: [
          { id: 'total-items', title: 'Total Items', value: 8, icon: Package, color: 'text-accent', bgColor: 'bg-accent/8' },
          { id: 'in-stock', title: 'In Stock', value: 5, icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/8' },
          { id: 'low-stock', title: 'Low Stock', value: 2, icon: AlertTriangle, color: 'text-warning', bgColor: 'bg-warning/8' },
          { id: 'out-of-stock', title: 'Out of Stock', value: 1, icon: AlertTriangle, color: 'text-danger', bgColor: 'bg-danger/8' },
        ],
      },
      {
        title: 'Deliveries & Movement',
        widgets: [
          { id: 'pending-deliveries', title: 'Pending Deliveries', value: 2, icon: Truck, color: 'text-accent', bgColor: 'bg-accent/8' },
          { id: 'today-transactions', title: 'Today Transactions', value: 4, icon: ArrowUpRight, color: 'text-primary', bgColor: 'bg-primary/8' },
          { id: 'inventory-value', title: 'Inventory Value', value: '$335K', icon: DollarSign, color: 'text-success', bgColor: 'bg-success/8' },
          { id: 'reorder-alerts', title: 'Reorder Alerts', value: 3, icon: AlertTriangle, color: 'text-warning', bgColor: 'bg-warning/8', description: 'Items below minimum' },
        ],
      },
    ],
  },
}

export function RoleDashboard({ role }: { role: UserRole }) {
  const config = roleConfig[role]

  return (
    <div className="space-y-8">
      {/* Role Header */}
      <FadeInUp>
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-[20px] p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          <div className="relative z-10">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">{role.replace('_', ' ')}</p>
            <h2 className="text-2xl font-bold mb-1">{config.greeting}</h2>
            <p className="text-white/60 text-sm">{config.subtitle}</p>
          </div>
        </div>
      </FadeInUp>

      {/* Widget Sections */}
      {config.sections.map((section, si) => (
        <FadeInUp key={section.title} delay={si * 0.1}>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{section.title}</h3>
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {section.widgets.map(widget => {
                const Icon = widget.icon
                return (
                  <StaggerItem key={widget.id}>
                    <motion.div
                      whileHover={{ y: -2, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06)' }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-[16px] border border-border/50 p-5 cursor-default"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-[12px] ${widget.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${widget.color}`} />
                        </div>
                        {widget.change && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                            widget.changeType === 'up' ? 'text-success bg-success/8' : 'text-danger bg-danger/8'
                          }`}>
                            {widget.changeType === 'up' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                            {widget.change}
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-primary">{widget.value}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{widget.title}</p>
                      {widget.description && (
                        <p className="text-[10px] text-gray-300 mt-1">{widget.description}</p>
                      )}
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>
        </FadeInUp>
      ))}
    </div>
  )
}

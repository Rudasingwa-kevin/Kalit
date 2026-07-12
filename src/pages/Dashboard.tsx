import { motion } from 'framer-motion'
import {
  TrendingUp,
  Package,
  FolderKanban,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  CheckCircle2,
  Circle,
  MapPin,
  DollarSign,
  Target,
  Layers,
  Calendar,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { AnimatedCounter, CircularProgress, FadeInUp, StatCard, StaggerContainer, StaggerItem, StatusBadge } from '@/components/shared/SharedComponents'
import { projects, dashboardStats, recentActivity, milestones } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

const budgetChartData = [
  { month: 'Jan', budget: 1200, spent: 980 },
  { month: 'Feb', budget: 1400, spent: 1180 },
  { month: 'Mar', budget: 1600, spent: 1350 },
  { month: 'Apr', budget: 1800, spent: 1520 },
  { month: 'May', budget: 2000, spent: 1680 },
  { month: 'Jun', budget: 2200, spent: 1890 },
  { month: 'Jul', budget: 2400, spent: 1950 },
]

const materialUsageData = [
  { name: 'Cement', value: 450, fill: '#2563EB' },
  { name: 'Steel', value: 320, fill: '#1F2937' },
  { name: 'Blocks', value: 280, fill: '#22C55E' },
  { name: 'Tiles', value: 200, fill: '#F59E0B' },
  { name: 'Cable', value: 150, fill: '#8B5CF6' },
]

const activityIcons: Record<string, React.ElementType> = {
  project: FolderKanban,
  inventory: Package,
  expense: DollarSign,
  task: CheckCircle2,
}

const activityColors: Record<string, string> = {
  project: 'bg-accent/8 text-accent',
  inventory: 'bg-success/8 text-success',
  expense: 'bg-warning/8 text-warning',
  task: 'bg-primary/8 text-primary',
}

export default function Dashboard() {
  const budgetProgress = (dashboardStats.totalSpent / dashboardStats.totalBudget) * 100
  const healthScore = 82

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <FadeInUp>
        <div className="relative overflow-hidden rounded-[24px] bg-primary p-10 md:p-12">
          {/* Blueprint grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="blueprint-grid absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }} />
          </div>
          {/* Geometric decoration */}
          <div className="absolute top-6 right-6 w-48 h-48 border border-white/10 rounded-[40px] rotate-12" />
          <div className="absolute bottom-6 right-24 w-32 h-32 border border-white/10 rounded-[32px] -rotate-6" />
          <div className="absolute top-20 right-48 w-20 h-20 border border-white/5 rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-white/50 text-sm font-medium mb-2 uppercase tracking-widest">Today's Overview</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                Good morning, Jean-Paul
              </h2>
              <p className="text-white/60 text-base max-w-lg">
                You have <span className="text-white font-semibold">3 active projects</span> and{' '}
                <span className="text-white font-semibold">2 pending approvals</span> today.
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Health Score */}
              <div className="text-center">
                <CircularProgress value={healthScore} size={100} strokeWidth={8} color="#22C55E" />
                <p className="text-white/50 text-xs font-medium mt-2">Health Score</p>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Stats Row */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StaggerItem>
          <StatCard
            label="Total Budget"
            value={formatCurrency(dashboardStats.totalBudget)}
            change="+12%"
            icon={DollarSign}
            color="text-accent"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Active Projects"
            value={dashboardStats.activeProjects}
            change="+2"
            icon={FolderKanban}
            color="text-primary"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Materials Tracked"
            value={dashboardStats.totalMaterials.toLocaleString()}
            change="+8%"
            icon={Package}
            color="text-success"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Low Stock Alerts"
            value={dashboardStats.lowStockItems}
            icon={AlertTriangle}
            color="text-danger"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Budget Chart - Large */}
        <FadeInUp delay={0.2} className="xl:col-span-2">
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-primary">Budget Overview</h3>
                <p className="text-sm text-gray-400 mt-0.5">Monthly budget vs actual spending</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent/20" />
                  <span className="text-xs text-gray-400 font-medium">Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-xs text-gray-400 font-medium">Spent</span>
                </div>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Total Progress</span>
                <span className="text-sm font-bold text-primary">{Math.round(budgetProgress)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-border/50 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetProgress}%` }}
                  transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-400">{formatCurrency(dashboardStats.totalSpent)} spent</span>
                <span className="text-xs text-gray-400">{formatCurrency(dashboardStats.totalBudget)} total</span>
              </div>
            </div>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={budgetChartData}>
                  <defs>
                    <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    }}
                    formatter={(value: any) => [formatCurrency(Number(value) * 1000)]}
                  />
                  <Area type="monotone" dataKey="budget" stroke="#E5E7EB" fill="none" strokeWidth={2} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="spent" stroke="#2563EB" fill="url(#budgetGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeInUp>

        {/* Weather + Material Usage */}
        <FadeInUp delay={0.3} className="space-y-6">
          {/* Weather Widget */}
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">Weather</h3>
              <span className="text-xs text-gray-400 font-medium">Kigali, Rwanda</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-[16px] bg-accent/8 flex items-center justify-center">
                <Sun className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">24°C</p>
                <p className="text-sm text-gray-400">Partly Cloudy</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-[10px] bg-surface">
                <Droplets className="w-4 h-4 text-accent mx-auto mb-1" />
                <p className="text-xs font-semibold text-primary">62%</p>
                <p className="text-[10px] text-gray-400">Humidity</p>
              </div>
              <div className="text-center p-2 rounded-[10px] bg-surface">
                <Wind className="w-4 h-4 text-accent mx-auto mb-1" />
                <p className="text-xs font-semibold text-primary">12 km/h</p>
                <p className="text-[10px] text-gray-400">Wind</p>
              </div>
              <div className="text-center p-2 rounded-[10px] bg-surface">
                <CloudRain className="w-4 h-4 text-accent mx-auto mb-1" />
                <p className="text-xs font-semibold text-primary">20%</p>
                <p className="text-[10px] text-gray-400">Rain</p>
              </div>
            </div>
          </div>

          {/* Material Usage */}
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Material Usage</h3>
            <div className="space-y-3">
              {materialUsageData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 w-14">{item.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-border/50 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.fill }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / 450) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary w-12 text-right">{item.value}t</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Projects + Activity Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Active Projects */}
        <FadeInUp delay={0.3} className="xl:col-span-3">
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary">Active Projects</h3>
              <a href="/projects" className="text-sm font-medium text-accent hover:text-accent-dark transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-4">
              {projects.filter(p => p.status !== 'completed').slice(0, 4).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-[16px] hover:bg-surface-hover transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-[14px] bg-accent/8 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/12 transition-colors">
                    <Layers className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-primary truncate">{project.name}</h4>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">{project.progress}%</p>
                    <div className="w-20 h-1.5 rounded-full bg-border/50 mt-1.5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Recent Activity */}
        <FadeInUp delay={0.4} className="xl:col-span-2">
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary">Recent Activity</h3>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => {
                const Icon = activityIcons[activity.type] || Circle
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 ${activityColors[activity.type] || 'bg-gray-100 text-gray-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary leading-snug">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{activity.user}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{activity.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Milestones + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Milestones Timeline */}
        <FadeInUp delay={0.4} className="xl:col-span-2">
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary">Project Milestones</h3>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-border" />
              <div className="space-y-6">
                {milestones.map((milestone, i) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="relative flex items-start gap-4 pl-2"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                      milestone.status === 'completed' ? 'bg-success text-white' :
                      milestone.status === 'in_progress' ? 'bg-accent text-white' :
                      'bg-white border-2 border-border text-gray-400'
                    }`}>
                      {milestone.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                      {milestone.status === 'in_progress' && <Target className="w-3.5 h-3.5" />}
                      {milestone.status === 'upcoming' && <Circle className="w-2.5 h-2.5" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-semibold ${milestone.status === 'upcoming' ? 'text-gray-400' : 'text-primary'}`}>
                          {milestone.name}
                        </h4>
                        {milestone.status === 'in_progress' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wide">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{milestone.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Quick Actions */}
        <FadeInUp delay={0.5}>
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <h3 className="text-lg font-bold text-primary mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'New Project', icon: FolderKanban, color: 'bg-accent/8 text-accent hover:bg-accent/12' },
                { label: 'Add Inventory', icon: Package, color: 'bg-success/8 text-success hover:bg-success/12' },
                { label: 'Log Expense', icon: DollarSign, color: 'bg-warning/8 text-warning hover:bg-warning/12' },
                { label: 'Generate Report', icon: TrendingUp, color: 'bg-primary/8 text-primary hover:bg-primary/12' },
              ].map((action, i) => (
                <motion.button
                  key={action.label}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 p-4 rounded-[14px] transition-colors ${action.color}`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{action.label}</span>
                  <ArrowUpRight className="w-4 h-4 ml-auto opacity-50" />
                </motion.button>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  )
}

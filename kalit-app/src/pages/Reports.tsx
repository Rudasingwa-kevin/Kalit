import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Filter,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  FolderKanban,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { FadeInUp } from '@/components/shared/SharedComponents'
import { formatCurrency } from '@/lib/utils'

const monthlyData = [
  { month: 'Jan', revenue: 420, expenses: 310, profit: 110 },
  { month: 'Feb', revenue: 480, expenses: 350, profit: 130 },
  { month: 'Mar', revenue: 520, expenses: 380, profit: 140 },
  { month: 'Apr', revenue: 590, expenses: 420, profit: 170 },
  { month: 'May', revenue: 650, expenses: 460, profit: 190 },
  { month: 'Jun', revenue: 720, expenses: 510, profit: 210 },
  { month: 'Jul', revenue: 780, expenses: 540, profit: 240 },
]

const categoryData = [
  { name: 'Materials', value: 380, fill: '#2563EB' },
  { name: 'Labor', value: 280, fill: '#1F2937' },
  { name: 'Equipment', value: 180, fill: '#22C55E' },
  { name: 'Transport', value: 120, fill: '#F59E0B' },
  { name: 'Other', value: 80, fill: '#8B5CF6' },
]

const projectPerformance = [
  { name: 'Kigali Heights', progress: 68, budget: 2400, spent: 1632 },
  { name: 'Lake View', progress: 42, budget: 1800, spent: 820 },
  { name: 'Nyamata Health', progress: 85, budget: 950, spent: 807 },
  { name: 'Huye Tech', progress: 28, budget: 3200, spent: 1120 },
  { name: 'Musanze Eco', progress: 55, budget: 1500, spent: 825 },
]

export default function Reports() {
  const [dateRange, setDateRange] = useState('7d')

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {['7d', '30d', '90d', '1y'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  dateRange === range
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-gray-500 border border-border hover:border-gray-300'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-border rounded-[14px] font-semibold text-sm text-primary hover:bg-surface-hover transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
        </div>
      </FadeInUp>

      {/* KPIs */}
      <FadeInUp delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Revenue', value: '$780K', change: '+12%', up: true, icon: DollarSign, color: 'bg-accent/8 text-accent' },
            { label: 'Expenses', value: '$540K', change: '+8%', up: true, icon: TrendingUp, color: 'bg-warning/8 text-warning' },
            { label: 'Net Profit', value: '$240K', change: '+18%', up: true, icon: TrendingUp, color: 'bg-success/8 text-success' },
            { label: 'Projects', value: '6', change: '+1', up: true, icon: FolderKanban, color: 'bg-primary/8 text-primary' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              whileHover={{ y: -2 }}
              className="bg-white rounded-[16px] border border-border/50 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-1 ${kpi.up ? 'text-success' : 'text-danger'}`}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-primary">{kpi.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{kpi.label}</p>
            </motion.div>
          ))}
        </div>
      </FadeInUp>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue vs Expenses */}
        <FadeInUp delay={0.2} className="xl:col-span-2">
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <h3 className="text-lg font-bold text-primary mb-1">Revenue vs Expenses</h3>
            <p className="text-sm text-gray-400 mb-6">Monthly comparison (in thousands)</p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" fill="#E5E7EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeInUp>

        {/* Expense Breakdown */}
        <FadeInUp delay={0.3}>
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <h3 className="text-lg font-bold text-primary mb-1">Expense Breakdown</h3>
            <p className="text-sm text-gray-400 mb-6">By category</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map(cat => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.fill }} />
                  <span className="text-xs font-medium text-gray-500 flex-1">{cat.name}</span>
                  <span className="text-xs font-bold text-primary">{formatCurrency(cat.value * 1000)}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Profit Trend */}
      <FadeInUp delay={0.3}>
        <div className="bg-white rounded-[20px] border border-border/50 p-6">
          <h3 className="text-lg font-bold text-primary mb-1">Profit Trend</h3>
          <p className="text-sm text-gray-400 mb-6">Monthly net profit (in thousands)</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="profit" stroke="#22C55E" fill="url(#profitGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeInUp>
    </div>
  )
}

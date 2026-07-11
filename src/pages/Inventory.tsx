import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Package,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Warehouse,
  MapPin,
  Clock,
  AlertTriangle,
  Grid3X3,
  List,
  Box,
  Building,
  Ruler,
  Zap,
  Mountain,
  Square,
  Grid3x3,
} from 'lucide-react'
import { inventoryItems } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { StatusBadge, FadeInUp, StaggerContainer, StaggerItem, CircularProgress } from '@/components/shared/SharedComponents'

const categoryFilters = ['All', 'Structural', 'Masonry', 'Electrical', 'Plumbing', 'Finishing', 'Aggregate']

const iconMap: Record<string, React.ElementType> = {
  building: Building,
  ruler: Ruler,
  box: Box,
  zap: Zap,
  pipe: Package,
  'grid-3x3': Grid3x3,
  mountain: Mountain,
  square: Square,
}

const statusOrder: Record<string, number> = {
  out_of_stock: 0,
  low_stock: 1,
  in_stock: 2,
}

export default function Inventory() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredItems = inventoryItems
    .filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  const totalValue = filteredItems.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-8">
      {/* Summary Bar */}
      <FadeInUp>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Items', value: inventoryItems.length, icon: Package, color: 'text-accent' },
            { label: 'Total Value', value: formatCurrency(inventoryItems.reduce((s, i) => s + i.value, 0)), icon: TrendingUp, color: 'text-success' },
            { label: 'Low Stock', value: inventoryItems.filter(i => i.status === 'low_stock').length, icon: TrendingDown, color: 'text-warning' },
            { label: 'Out of Stock', value: inventoryItems.filter(i => i.status === 'out_of_stock').length, icon: AlertTriangle, color: 'text-danger' },
          ].map((stat, i) => (
            <div key={stat.label} className="bg-white rounded-[16px] border border-border/50 p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${stat.color === 'text-accent' ? 'bg-accent/8' : stat.color === 'text-success' ? 'bg-success/8' : stat.color === 'text-warning' ? 'bg-warning/8' : 'bg-danger/8'}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeInUp>

      {/* Header */}
      <FadeInUp delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-[14px] border border-border bg-white">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-primary placeholder:text-gray-400 outline-none w-full"
              />
            </div>
            <div className="flex items-center bg-white rounded-[12px] border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-[14px] font-semibold text-sm hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </motion.button>
        </div>
      </FadeInUp>

      {/* Category Filters */}
      <FadeInUp delay={0.15}>
        <div className="flex items-center gap-2 flex-wrap">
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-gray-500 border border-border hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeInUp>

      {/* Inventory Grid */}
      <StaggerContainer className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'space-y-3'}>
        {filteredItems.map((item) => {
          const Icon = iconMap[item.icon] || Package
          const stockPercentage = (item.stock / item.maxStock) * 100
          const IconBg = item.status === 'out_of_stock' ? 'bg-danger/8' : item.status === 'low_stock' ? 'bg-warning/8' : 'bg-accent/8'
          const IconColor = item.status === 'out_of_stock' ? 'text-danger' : item.status === 'low_stock' ? 'text-warning' : 'text-accent'
          const ProgressColor = item.status === 'out_of_stock' ? '#EF4444' : item.status === 'low_stock' ? '#F59E0B' : '#2563EB'

          if (viewMode === 'grid') {
            return (
              <StaggerItem key={item.id}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)' }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[20px] border border-border/50 p-6 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-[14px] ${IconBg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${IconColor}`} />
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <h3 className="text-base font-bold text-primary mb-1 group-hover:text-accent transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mb-4">{item.category}</p>

                  {/* Circular Progress */}
                  <div className="flex items-center gap-4 mb-4">
                    <CircularProgress value={stockPercentage} size={64} strokeWidth={5} color={ProgressColor} />
                    <div>
                      <p className="text-2xl font-bold text-primary">{item.stock}</p>
                      <p className="text-xs text-gray-400">/ {item.maxStock} {item.unit}</p>
                    </div>
                  </div>

                  {/* Mini sparkline */}
                  <div className="flex items-end gap-[3px] h-8 mb-4">
                    {item.usageHistory.map((val, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{ backgroundColor: i === item.usageHistory.length - 1 ? ProgressColor : `${ProgressColor}33` }}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(val / Math.max(...item.usageHistory)) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-light">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Value</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{formatCurrency(item.value)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Supplier</p>
                      <p className="text-sm font-semibold text-primary mt-0.5 truncate">{item.supplier.split(' ')[0]}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          }

          // List view
          return (
            <StaggerItem key={item.id}>
              <motion.div
                whileHover={{ x: 4 }}
                className="bg-white rounded-[16px] border border-border/50 p-4 flex items-center gap-5 cursor-pointer group"
              >
                <div className={`w-11 h-11 rounded-[12px] ${IconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${IconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{item.name}</h3>
                  <p className="text-xs text-gray-400">{item.category} · {item.supplier}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary">{item.stock} {item.unit}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(item.value)}</p>
                </div>
                <div className="w-24 flex-shrink-0">
                  <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${stockPercentage}%`, backgroundColor: ProgressColor }} />
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </motion.div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </div>
  )
}

import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Star,
  Phone,
  Mail,
  Package,
  TrendingUp,
  Users,
} from 'lucide-react'
import { suppliers } from '@/data/mockData'
import { FadeInUp, StaggerContainer, StaggerItem, StatusBadge } from '@/components/shared/SharedComponents'

export default function Suppliers() {
  return (
    <div className="space-y-8">
      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400 font-medium">{suppliers.length} total suppliers</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-[14px] font-semibold text-sm hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </motion.button>
        </div>
      </FadeInUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {suppliers.map(supplier => (
          <StaggerItem key={supplier.id}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)' }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[20px] border border-border/50 p-6 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-[14px] bg-primary/8 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <StatusBadge status={supplier.status} />
              </div>

              <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">
                {supplier.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4">{supplier.contact}</p>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(supplier.rating) ? 'text-warning fill-warning' : 'text-gray-200'}`}
                  />
                ))}
                <span className="text-sm font-semibold text-primary ml-2">{supplier.rating}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{supplier.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {supplier.materials.map(mat => (
                  <span key={mat} className="px-2.5 py-1 bg-surface rounded-full text-[10px] font-semibold text-gray-500">
                    {mat}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-border-light">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Total Orders</span>
                  <span className="text-sm font-bold text-primary">{supplier.totalOrders}</span>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  TrendingUp,
  Receipt,
} from 'lucide-react'
import { expenses } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { FadeInUp, StaggerContainer, StaggerItem, StatusBadge } from '@/components/shared/SharedComponents'

const categoryColors: Record<string, string> = {
  Materials: 'bg-accent/8 text-accent',
  Labor: 'bg-success/8 text-success',
  Equipment: 'bg-warning/8 text-warning',
  Safety: 'bg-danger/8 text-danger',
  Transport: 'bg-primary/8 text-primary',
}

export default function Expenses() {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = expenses.filter(e => statusFilter === 'all' || e.status === statusFilter)

  const totalApproved = expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0)
  const totalPending = expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-8">
      {/* Summary */}
      <FadeInUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-[16px] border border-border/50 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-accent/8 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}</p>
              <p className="text-xs text-gray-400 font-medium">Total Expenses</p>
            </div>
          </div>
          <div className="bg-white rounded-[16px] border border-border/50 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-success/8 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalApproved)}</p>
              <p className="text-xs text-gray-400 font-medium">Approved</p>
            </div>
          </div>
          <div className="bg-white rounded-[16px] border border-border/50 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-warning/8 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-gray-400 font-medium">Pending Approval</p>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Header */}
      <FadeInUp delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'approved', 'pending', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all capitalize ${
                  statusFilter === s
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-gray-500 border border-border hover:border-gray-300'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-[14px] font-semibold text-sm hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Expense
          </motion.button>
        </div>
      </FadeInUp>

      {/* Expense List */}
      <StaggerContainer className="space-y-3">
        {filtered.map(expense => (
          <StaggerItem key={expense.id}>
            <motion.div
              whileHover={{ x: 4 }}
              className="bg-white rounded-[16px] border border-border/50 p-5 flex items-center gap-5"
            >
              <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 ${categoryColors[expense.category] || 'bg-gray-100 text-gray-400'}`}>
                <Receipt className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-primary mb-1">{expense.description}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{expense.project}</span>
                  <span>·</span>
                  <span>{expense.date}</span>
                  <span>·</span>
                  <span>By {expense.approvedBy.split(' ')[0]}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${categoryColors[expense.category] || 'bg-gray-100 text-gray-400'}`}>
                  {expense.category}
                </span>
                <p className="text-lg font-bold text-primary w-24 text-right">{formatCurrency(expense.amount)}</p>
                <StatusBadge status={expense.status} />
                {expense.status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded-full bg-success/8 flex items-center justify-center text-success hover:bg-success/15 transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-danger/8 flex items-center justify-center text-danger hover:bg-danger/15 transition-colors">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}

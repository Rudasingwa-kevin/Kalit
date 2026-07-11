import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export function AnimatedCounter({ value, duration = 2, prefix = '', suffix = '' }: {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = value
    const incrementTime = (duration * 1000) / end
    const step = end > 100 ? Math.ceil(end / 60) : 1

    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, incrementTime * step)

    return () => clearInterval(timer)
  }, [value, duration, isInView])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export function CircularProgress({ value, size = 80, strokeWidth = 6, color = '#2563EB' }: {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-primary">{Math.round(value)}%</span>
      </div>
    </div>
  )
}

export function ProgressBar({ value, height = 8, color = 'bg-accent' }: {
  value: number
  height?: number
  color?: string
}) {
  return (
    <div className="w-full rounded-full bg-border/50 overflow-hidden" style={{ height }}>
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  )
}

export function FadeInUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StatCard({ label, value, change, icon: Icon, color = 'text-accent' }: {
  label: string
  value: string | number
  change?: string
  icon: React.ElementType
  color?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)' }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-[20px] p-6 border border-border/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center ${color === 'text-accent' ? 'bg-accent/8' : color === 'text-success' ? 'bg-success/8' : color === 'text-warning' ? 'bg-warning/8' : color === 'text-danger' ? 'bg-danger/8' : 'bg-primary/8'}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change.startsWith('+') ? 'text-success bg-success/8' : 'text-danger bg-danger/8'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-primary tracking-tight">{value}</p>
      <p className="text-sm text-gray-400 mt-1 font-medium">{label}</p>
    </motion.div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    on_track: 'bg-success/8 text-success',
    at_risk: 'bg-warning/8 text-warning',
    delayed: 'bg-danger/8 text-danger',
    completed: 'bg-accent/8 text-accent',
    active: 'bg-success/8 text-success',
    inactive: 'bg-gray-100 text-gray-400',
    in_stock: 'bg-success/8 text-success',
    low_stock: 'bg-warning/8 text-warning',
    out_of_stock: 'bg-danger/8 text-danger',
    approved: 'bg-success/8 text-success',
    pending: 'bg-warning/8 text-warning',
    rejected: 'bg-danger/8 text-danger',
  }

  const labels: Record<string, string> = {
    on_track: 'On Track',
    at_risk: 'At Risk',
    delayed: 'Delayed',
    completed: 'Completed',
    active: 'Active',
    inactive: 'Inactive',
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock',
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${styles[status] || 'bg-gray-100 text-gray-400'}`}>
      {labels[status] || status}
    </span>
  )
}

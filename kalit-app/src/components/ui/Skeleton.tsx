import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-shimmer bg-gradient-to-r from-border/50 via-border/30 to-border/50 bg-[length:200%_100%] rounded-[12px]', className)} />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-border/50 p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-11 h-11 rounded-[14px]" />
        <Skeleton className="w-12 h-5 rounded-full" />
      </div>
      <Skeleton className="w-24 h-8 mb-2" />
      <Skeleton className="w-20 h-4" />
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-border/50 p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-[14px]" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-32 h-5 mb-2" />
      <Skeleton className="w-full h-4 mb-4" />
      <Skeleton className="w-24 h-3 mb-4" />
      <Skeleton className="w-full h-2 rounded-full mb-4" />
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-light">
        <div>
          <Skeleton className="w-12 h-3 mb-1" />
          <Skeleton className="w-20 h-4" />
        </div>
        <div>
          <Skeleton className="w-12 h-3 mb-1" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
    </div>
  )
}

export function InventoryCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-border/50 p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-[14px]" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-28 h-5 mb-1" />
      <Skeleton className="w-16 h-3 mb-4" />
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div>
          <Skeleton className="w-14 h-7 mb-1" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <div className="flex items-end gap-1 h-8 mb-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${30 + Math.random() * 70}%` }} />
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-[20px] border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border-light">
        <Skeleton className="w-40 h-6" />
      </div>
      <div className="divide-y divide-border-light/50">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 px-6">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
            {[...Array(cols - 2)].map((_, j) => (
              <Skeleton key={j} className="w-20 h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="bg-primary rounded-[24px] p-10 h-[180px] relative overflow-hidden">
        <Skeleton className="w-48 h-4 mb-3 bg-white/10" />
        <Skeleton className="w-72 h-8 mb-2 bg-white/10" />
        <Skeleton className="w-96 h-4 bg-white/10" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[20px] border border-border/50 p-6">
          <Skeleton className="w-36 h-6 mb-6" />
          <Skeleton className="w-full h-[260px] rounded-[12px]" />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <Skeleton className="w-24 h-6 mb-4" />
            <Skeleton className="w-full h-[120px] rounded-[12px]" />
          </div>
          <div className="bg-white rounded-[20px] border border-border/50 p-6">
            <Skeleton className="w-32 h-6 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full h-8 rounded-[8px]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200/60 rounded-[14px] overflow-hidden relative animate-pulse ${className}`} />
  )
}

function SkeletonCircle({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`rounded-full bg-gray-200/60 animate-pulse ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3.5 ${i === lines - 1 ? 'w-3/5' : 'w-full'}`} />
      ))}
    </div>
  )
}

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-[20px] border border-border/50 p-4 md:p-6 ${className}`}>
      <Skeleton className="h-5 w-1/3 mb-4" />
      <SkeletonText lines={2} />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero skeleton */}
      <Skeleton className="h-[180px] md:h-[220px] rounded-[20px] md:rounded-[24px]" />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[16px] md:rounded-[20px] border border-border/50 p-4 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-[10px] md:rounded-[14px]" />
              <Skeleton className="w-10 h-5 rounded-full" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SkeletonCard className="xl:col-span-2 min-h-[320px] md:min-h-[380px]" />
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>

      {/* Projects + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <SkeletonCard className="xl:col-span-3 min-h-[300px]" />
        <SkeletonCard className="xl:col-span-2 min-h-[300px]" />
      </div>

      {/* Milestones + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SkeletonCard className="xl:col-span-2 min-h-[280px]" />
        <SkeletonCard className="min-h-[280px]" />
      </div>
    </div>
  )
}

export function ProjectsSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-32 rounded-[14px]" />
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-[14px]" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-[14px]" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <SkeletonText lines={2} className="mb-4" />
            <Skeleton className="h-3 w-24 mb-4" />
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-border-light">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-2.5 w-12 mb-1.5" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back link */}
      <Skeleton className="h-4 w-28" />

      {/* Project header */}
      <div className="bg-white rounded-[16px] md:rounded-[20px] border border-border/50 p-5 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
          <div className="flex items-start gap-3 md:gap-5">
            <Skeleton className="w-11 h-11 md:w-14 md:h-14 rounded-[14px] md:rounded-[16px]" />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <SkeletonText lines={2} className="max-w-lg" />
              <div className="flex gap-4 mt-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-40" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-[10px]" />
            <Skeleton className="h-9 w-16 rounded-[10px]" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-border-light">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-2.5 w-16 mb-2" />
              <Skeleton className="h-7 w-20 mb-1" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-full rounded-[14px]" />

      {/* Tab content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SkeletonCard className="xl:col-span-2 min-h-[300px]" />
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}

export function InventorySkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[14px] md:rounded-[16px] border border-border/50 p-3.5 md:p-5 flex items-center gap-3 md:gap-4">
            <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-[10px] md:rounded-[12px] flex-shrink-0" />
            <div className="min-w-0">
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Search + controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-12 flex-1 rounded-[14px]" />
          <Skeleton className="h-10 w-20 rounded-[12px]" />
          <Skeleton className="h-10 w-28 rounded-[14px]" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Inventory grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[20px] border border-border/50 p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-[14px]" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4 mb-1" />
            <Skeleton className="h-3 w-20 mb-4" />
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <SkeletonCircle size={56} />
              <div>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex items-end gap-[3px] h-7 md:h-8 mb-4">
              {Array.from({ length: 7 }).map((_, j) => (
                <Skeleton key={j} className="flex-1 rounded-sm h-full" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-border-light">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-2.5 w-10 mb-1" />
                  <Skeleton className="h-3.5 w-14" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[20px] border border-border/50 p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-12 w-full rounded-[14px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-12 w-full rounded-[14px]" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-[14px]" />
          <Skeleton className="h-4 w-36 mx-auto" />
        </div>
      </div>
    </div>
  )
}

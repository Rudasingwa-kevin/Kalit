import { useState, useEffect, useCallback, useRef } from 'react'

export interface RealTimeEvent {
  id: string
  type: 'inventory_update' | 'project_update' | 'expense_update' | 'notification' | 'stats_update'
  data: Record<string, unknown>
  timestamp: number
}

type Subscriber = (event: RealTimeEvent) => void

class RealTimeService {
  private subscribers: Set<Subscriber> = new Set()
  private intervalId: ReturnType<typeof setInterval> | null = null
  private eventQueue: RealTimeEvent[] = []

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private emit(event: RealTimeEvent) {
    this.subscribers.forEach(cb => cb(event))
  }

  start() {
    if (this.intervalId) return

    // Simulate random real-time events
    this.intervalId = setInterval(() => {
      const events: Omit<RealTimeEvent, 'id' | 'timestamp'>[] = [
        {
          type: 'inventory_update',
          data: { item: 'Portland Cement', change: -5, stock: 445, unit: 'bags' },
        },
        {
          type: 'project_update',
          data: { project: 'Kigali Heights Extension', progress: 68.5 },
        },
        {
          type: 'stats_update',
          data: { totalSpent: 9440000, activeProjects: 5 },
        },
        {
          type: 'notification',
          data: { title: 'Stock Update', message: 'Steel Rebar delivery confirmed', type: 'info' },
        },
      ]

      const randomEvent = events[Math.floor(Math.random() * events.length)]
      this.emit({
        ...randomEvent,
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
      })
    }, 8000) // Every 8 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  // Simulate immediate events (for user actions)
  emitImmediate(type: RealTimeEvent['type'], data: Record<string, unknown>) {
    this.emit({
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      data,
      timestamp: Date.now(),
    })
  }
}

export const realTimeService = new RealTimeService()

export function useRealTime(type?: RealTimeEvent['type']) {
  const [events, setEvents] = useState<RealTimeEvent[]>([])
  const latestEvent = useRef<RealTimeEvent | null>(null)

  useEffect(() => {
    realTimeService.start()

    const unsubscribe = realTimeService.subscribe((event) => {
      if (type && event.type !== type) return
      latestEvent.current = event
      setEvents(prev => [event, ...prev].slice(0, 50))
    })

    return () => {
      unsubscribe()
    }
  }, [type])

  return { events, latestEvent: latestEvent.current }
}

export function useAnimatedValue(target: number, duration = 1000) {
  const [value, setValue] = useState(target)
  const prevTarget = useRef(target)

  useEffect(() => {
    const start = prevTarget.current
    const diff = target - start
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(start + diff * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
    prevTarget.current = target
  }, [target, duration])

  return value
}

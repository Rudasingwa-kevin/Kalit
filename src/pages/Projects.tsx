import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  ArrowUpRight,
  Layers,
  ChevronDown,
} from 'lucide-react'
import { projects } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { StatusBadge, FadeInUp, StaggerContainer, StaggerItem } from '@/components/shared/SharedComponents'

const statusFilters = ['All', 'On Track', 'At Risk', 'Delayed', 'Completed']

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = activeFilter === 'All' || p.status === activeFilter.toLowerCase().replace(' ', '_')
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">{projects.length} total projects</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-[14px] font-semibold text-sm hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </motion.button>
        </div>
      </FadeInUp>

      {/* Filters */}
      <FadeInUp delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md px-4 py-3 rounded-[14px] border border-border bg-white">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-primary placeholder:text-gray-400 outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-gray-500 border border-border hover:border-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Project Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <StaggerItem key={project.id}>
            <Link to={`/projects/${project.id}`}>
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0, 0, 0, 0.08)' }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[20px] border border-border/50 p-6 cursor-pointer group h-full flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-[14px] bg-accent/8 flex items-center justify-center group-hover:bg-accent/12 transition-colors">
                    <Layers className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={project.status} />
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{project.description}</p>

                {/* Location */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{project.location}</span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Progress</span>
                    <span className="text-sm font-bold text-primary">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border/50 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-light">
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Budget</p>
                    <p className="text-sm font-bold text-primary mt-0.5">{formatCurrency(project.budget)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Engineer</p>
                    <p className="text-sm font-semibold text-primary mt-0.5 truncate">{project.engineer}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Tasks</p>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {project.tasksCompleted}/{project.totalTasks}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">End Date</p>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {filteredProjects.length === 0 && (
        <FadeInUp>
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-[20px] bg-surface mx-auto mb-4 flex items-center justify-center">
              <Layers className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-1">No projects found</h3>
            <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        </FadeInUp>
      )}
    </div>
  )
}

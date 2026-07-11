import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  FolderKanban,
  Package,
  Receipt,
  Users,
  X,
  ArrowUpRight,
} from 'lucide-react'

const actions = [
  { id: 'project', label: 'New Project', icon: FolderKanban, path: '/projects', color: 'bg-accent text-white' },
  { id: 'inventory', label: 'Add Inventory', icon: Package, path: '/inventory', color: 'bg-success text-white' },
  { id: 'expense', label: 'Log Expense', icon: Receipt, path: '/expenses', color: 'bg-warning text-white' },
  { id: 'supplier', label: 'Add Supplier', icon: Users, path: '/suppliers', color: 'bg-primary text-white' },
]

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {actions.map((action, i) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  navigate(action.path)
                  setOpen(false)
                }}
                className="flex items-center gap-3 pl-5 pr-4 py-2.5 bg-white rounded-full shadow-lg border border-border/50 hover:shadow-xl transition-all group"
              >
                <span className="text-sm font-semibold text-primary whitespace-nowrap">{action.label}</span>
                <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-accent text-white shadow-lg shadow-accent/30 flex items-center justify-center hover:shadow-xl hover:shadow-accent/40 transition-shadow"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  )
}

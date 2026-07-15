import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FolderKanban, Package, User, MapPin, Calendar, DollarSign, Hash, Truck, Warehouse } from 'lucide-react'
import { projects } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-[20px] border border-border/50 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-0">
                <h2 className="text-lg font-bold text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-surface-hover transition-colors text-gray-400 hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function InputField({ label, icon: Icon, placeholder, type = 'text', value, onChange, required = true }: {
  label: string
  icon: React.ElementType
  placeholder: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div>
      <label className="text-sm font-medium text-primary block mb-2">{label} {required && <span className="text-danger">*</span>}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
        />
      </div>
    </div>
  )
}

function SelectField({ label, icon: Icon, options, value, onChange }: {
  label: string
  icon: React.ElementType
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-sm font-medium text-primary block mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-[12px] border border-border text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all appearance-none bg-white"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export function NewProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', location: '', engineer: '', budget: '', startDate: '', endDate: '', description: '',
  })

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  const handleClose = () => {
    setSubmitted(false)
    setForm({ name: '', location: '', engineer: '', budget: '', startDate: '', endDate: '', description: '' })
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Project">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="w-16 h-16 rounded-[20px] bg-success/10 flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-bold text-primary mb-1">Project created</h3>
          <p className="text-sm text-gray-400 mb-6">"{form.name}" has been added to your projects.</p>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-accent text-white rounded-[12px] text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            Done
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Project Name" icon={FolderKanban} placeholder="e.g. Kimironko Residential Tower" value={form.name} onChange={v => update('name', v)} />
          <InputField label="Location" icon={MapPin} placeholder="e.g. Kigali, Rwanda" value={form.location} onChange={v => update('location', v)} />
          <InputField label="Lead Engineer" icon={User} placeholder="e.g. Claude Uwimana" value={form.engineer} onChange={v => update('engineer', v)} />
          <InputField label="Budget" icon={DollarSign} placeholder="e.g. 2500000" type="number" value={form.budget} onChange={v => update('budget', v)} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Start Date" icon={Calendar} placeholder="" type="date" value={form.startDate} onChange={v => update('startDate', v)} />
            <InputField label="End Date" icon={Calendar} placeholder="" type="date" value={form.endDate} onChange={v => update('endDate', v)} />
          </div>
          <div>
            <label className="text-sm font-medium text-primary block mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Brief project description..."
              rows={3}
              className="w-full px-4 py-3 rounded-[12px] border border-border text-sm text-primary placeholder:text-gray-300 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all resize-none"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-11 rounded-[12px] border border-border text-sm font-semibold text-primary hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading || !form.name}
              className={cn(
                'flex-1 h-11 rounded-[12px] text-sm font-semibold text-white transition-all flex items-center justify-center gap-2',
                loading || !form.name
                  ? 'bg-accent/50 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20'
              )}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Project'
              )}
            </motion.button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export function AddItemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', category: 'Structural', stock: '', maxStock: '', unit: 'bags', value: '', supplier: '', warehouse: '', project: '',
  })

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  const handleClose = () => {
    setSubmitted(false)
    setForm({ name: '', category: 'Structural', stock: '', maxStock: '', unit: 'bags', value: '', supplier: '', warehouse: '', project: '' })
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Inventory Item">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="w-16 h-16 rounded-[20px] bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-bold text-primary mb-1">Item added</h3>
          <p className="text-sm text-gray-400 mb-6">"{form.name}" has been added to inventory for project "{form.project}".</p>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-accent text-white rounded-[12px] text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            Done
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Item Name" icon={Package} placeholder="e.g. Portland Cement" value={form.name} onChange={v => update('name', v)} />
          <SelectField label="Project" icon={FolderKanban} options={projects.map(p => p.name)} value={form.project} onChange={v => update('project', v)} />
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Category" icon={Hash} options={['Structural', 'Masonry', 'Electrical', 'Plumbing', 'Finishing', 'Aggregate']} value={form.category} onChange={v => update('category', v)} />
            <SelectField label="Unit" icon={Hash} options={['bags', 'tons', 'pcs', 'meters', 'sqft', 'rolls', 'bundles']} value={form.unit} onChange={v => update('unit', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Current Stock" icon={Package} placeholder="e.g. 450" type="number" value={form.stock} onChange={v => update('stock', v)} />
            <InputField label="Max Capacity" icon={Package} placeholder="e.g. 600" type="number" value={form.maxStock} onChange={v => update('maxStock', v)} />
          </div>
          <InputField label="Unit Value" icon={DollarSign} placeholder="e.g. 25000" type="number" value={form.value} onChange={v => update('value', v)} />
          <InputField label="Supplier" icon={Truck} placeholder="e.g. Cimerwa Ltd" value={form.supplier} onChange={v => update('supplier', v)} />
          <InputField label="Warehouse" icon={Warehouse} placeholder="e.g. Main Depot" value={form.warehouse} onChange={v => update('warehouse', v)} />
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-11 rounded-[12px] border border-border text-sm font-semibold text-primary hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading || !form.name || !form.project}
              className={cn(
                'flex-1 h-11 rounded-[12px] text-sm font-semibold text-white transition-all flex items-center justify-center gap-2',
                loading || !form.name || !form.project
                  ? 'bg-accent/50 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20'
              )}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Add to Inventory'
              )}
            </motion.button>
          </div>
        </form>
      )}
    </Modal>
  )
}

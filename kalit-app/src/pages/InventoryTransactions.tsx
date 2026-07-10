import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Package,
  Calendar,
  User,
  FileText,
} from 'lucide-react'
import { FadeInUp, StaggerContainer, StaggerItem, StatusBadge } from '@/components/shared/SharedComponents'

interface Transaction {
  id: string
  type: 'inbound' | 'outbound'
  material: string
  quantity: number
  unit: string
  project: string
  date: string
  processedBy: string
  reference: string
  status: 'completed' | 'pending' | 'cancelled'
}

const transactions: Transaction[] = [
  { id: 'TXN-001', type: 'inbound', material: 'Portland Cement', quantity: 100, unit: 'bags', project: 'Kigali Heights Extension', date: '2026-07-08', processedBy: 'Jean-Paul Hakizimana', reference: 'PO-2026-045', status: 'completed' },
  { id: 'TXN-002', type: 'outbound', material: 'Steel Rebar (12mm)', quantity: 15, unit: 'tons', project: 'Lake View Residences', date: '2026-07-07', processedBy: 'Store Keeper', reference: 'MR-2026-089', status: 'completed' },
  { id: 'TXN-003', type: 'inbound', material: 'Concrete Blocks', quantity: 500, unit: 'pcs', project: 'Nyamata Health Center', date: '2026-07-06', processedBy: 'Jean-Paul Hakizimana', reference: 'PO-2026-046', status: 'pending' },
  { id: 'TXN-004', type: 'outbound', material: 'Electrical Cable (6mm)', quantity: 200, unit: 'meters', project: 'Huye Tech Campus', date: '2026-07-05', processedBy: 'Store Keeper', reference: 'MR-2026-090', status: 'completed' },
  { id: 'TXN-005', type: 'outbound', material: 'PVC Pipes (4 inch)', quantity: 20, unit: 'pcs', project: 'Musanze Eco Resort', date: '2026-07-04', processedBy: 'Store Keeper', reference: 'MR-2026-091', status: 'completed' },
  { id: 'TXN-006', type: 'inbound', material: 'Ceramic Tiles', quantity: 200, unit: 'sqft', project: 'Kigali Heights Extension', date: '2026-07-03', processedBy: 'Jean-Paul Hakizimana', reference: 'PO-2026-047', status: 'cancelled' },
  { id: 'TXN-007', type: 'outbound', material: 'Sand (Fine)', quantity: 5, unit: 'tons', project: 'Lake View Residences', date: '2026-07-02', processedBy: 'Store Keeper', reference: 'MR-2026-092', status: 'completed' },
  { id: 'TXN-008', type: 'inbound', material: 'Glass Panels', quantity: 30, unit: 'pcs', project: 'Kigali Heights Extension', date: '2026-07-01', processedBy: 'Jean-Paul Hakizimana', reference: 'PO-2026-048', status: 'pending' },
]

export default function InventoryTransactions() {
  const [filter, setFilter] = useState<'all' | 'inbound' | 'outbound'>('all')

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter)

  return (
    <div className="space-y-8">
      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {(['all', 'inbound', 'outbound'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all capitalize ${
                  filter === f
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-gray-500 border border-border hover:border-gray-300'
                }`}
              >
                {f === 'all' ? 'All Transactions' : `${f} Only`}
              </button>
            ))}
          </div>
        </div>
      </FadeInUp>

      <StaggerContainer className="space-y-3">
        {filtered.map(txn => (
          <StaggerItem key={txn.id}>
            <motion.div
              whileHover={{ x: 4 }}
              className="bg-white rounded-[16px] border border-border/50 p-5 flex items-center gap-5"
            >
              <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 ${
                txn.type === 'inbound' ? 'bg-success/8' : 'bg-danger/8'
              }`}>
                {txn.type === 'inbound' ? (
                  <ArrowDownRight className="w-5 h-5 text-success" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-danger" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-primary">{txn.material}</h4>
                  <span className="text-[10px] font-mono text-gray-400 bg-surface px-2 py-0.5 rounded">{txn.id}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Package className="w-3 h-3" />{txn.quantity} {txn.unit}</span>
                  <span>·</span>
                  <span>{txn.project}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{txn.date}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400 mb-1">{txn.reference}</p>
                <StatusBadge status={txn.status} />
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}

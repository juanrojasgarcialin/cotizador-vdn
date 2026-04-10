import { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'

const fmt = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)

function estimateBudget(formData, productMap, settings) {
  const slack   = settings?.cable_slack_pct ?? 0.10
  const ppPorts = settings?.patch_panel_ports ?? 24
  const reelM   = settings?.cable_reel_meters ?? 305

  const nodes  = parseInt(formData.num_nodes)    || 0
  const cameras = parseInt(formData.num_cameras)  || 0
  const dist    = parseFloat(formData.avg_distance_m) || 0
  const points  = nodes + cameras

  let mat = 0, labor = 0
  const lines = []

  const addProduct = (pid, qty, label) => {
    const p = productMap[parseInt(pid)]
    if (!p || !qty) return
    const m = p.price * qty
    const l = p.labor_cost * qty
    mat   += m
    labor += l
    lines.push({ label, subtotal: m + l })
  }

  if (formData.cable_product_id && points > 0 && dist > 0) {
    const p = productMap[parseInt(formData.cable_product_id)]
    if (p) {
      const meters = points * dist * (1 + slack)
      const mpU = p.meters_per_unit || reelM
      addProduct(formData.cable_product_id, Math.ceil(meters / mpU), 'Cable')
    }
  }
  if (formData.conduit_product_id && points > 0 && dist > 0) {
    const p = productMap[parseInt(formData.conduit_product_id)]
    if (p) {
      const meters = points * dist * (1 + slack)
      addProduct(formData.conduit_product_id, Math.ceil(meters / (p.meters_per_unit || 1)), 'Tubería')
    }
  }
  addProduct(formData.keystone_product_id,      nodes, 'Keystones')
  addProduct(formData.faceplate_product_id,     nodes, 'Faceplates')
  addProduct(formData.patch_cord_1m_product_id, nodes, 'Patch Cords 1m')
  addProduct(formData.patch_cord_3m_product_id, nodes, 'Patch Cords 3m')
  if (formData.patch_panel_product_id && nodes > 0)
    addProduct(formData.patch_panel_product_id, Math.ceil(nodes / ppPorts), 'Patch Panel')
  addProduct(formData.switch_product_id, 1, 'Switch PoE')
  addProduct(formData.nvr_product_id,    1, 'NVR/DVR')
  ;(formData.camera_items || []).forEach((item) => {
    if (item.product_id && item.quantity) {
      const p = productMap[parseInt(item.product_id)]
      const name = p ? p.name.split(' ').slice(0, 3).join(' ') : 'Cámara'
      addProduct(item.product_id, parseInt(item.quantity), name)
    }
  })

  return { mat, labor, total: mat + labor, lines }
}

export default function BudgetSidebar({ formData, products, settings, step }) {
  const productMap = useMemo(() => {
    const map = {}
    ;(products || []).forEach((p) => { map[p.id] = p })
    return map
  }, [products])

  const { mat, labor, total, lines } = useMemo(
    () => estimateBudget(formData, productMap, settings),
    [formData, productMap, settings]
  )

  const hasData = total > 0
  const pct = mat + labor > 0 ? Math.round((labor / (mat + labor)) * 100) : 0

  return (
    <div className="sticky top-20 space-y-3">
      {/* Panel principal */}
      <div className={`rounded-lg overflow-hidden border-2 transition-all duration-300
        ${hasData ? 'border-vdn-blue shadow-lg shadow-vdn-blue/20' : 'border-gray-200'}`}>

        {/* Header */}
        <div className={`px-4 py-3 flex items-center gap-2
          ${hasData ? 'bg-vdn-blue' : 'bg-gray-100'}`}>
          <TrendingUp size={16} className={hasData ? 'text-white' : 'text-gray-400'} />
          <span className={`text-sm font-bold tracking-wide ${hasData ? 'text-white' : 'text-gray-400'}`}>
            Presupuesto estimado
          </span>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold
            ${hasData ? 'bg-vdn-green text-white' : 'bg-gray-200 text-gray-400'}`}>
            Paso {step + 1}/3
          </span>
        </div>

        {/* Total */}
        <div className="px-5 py-5 text-center border-b border-gray-100 bg-white">
          <p className={`font-heading text-4xl font-black transition-all
            ${hasData ? 'text-vdn-dark' : 'text-gray-200'}`}>
            {hasData ? fmt(total) : '$—'}
          </p>
          <p className="text-xs text-vdn-gray mt-1 uppercase tracking-wide">Total estimado</p>

          {/* Barra mat vs MO */}
          {hasData && (
            <div className="mt-3 space-y-1">
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden flex">
                <div className="h-full bg-vdn-blue transition-all duration-500" style={{ width: `${100 - pct}%` }} />
                <div className="h-full bg-vdn-green transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-vdn-blue inline-block" /> Mat.</span>
                <span className="flex items-center gap-1">M.O. <span className="w-2 h-2 rounded-full bg-vdn-green inline-block" /></span>
              </div>
            </div>
          )}
        </div>

        {/* Líneas */}
        <div className="px-4 py-3 bg-white space-y-2">
          {lines.length === 0 && (
            <p className="text-xs text-gray-400 italic text-center py-3">
              Selecciona productos para ver el estimado en tiempo real
            </p>
          )}
          {lines.map((line, i) => (
            <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-50 last:border-0">
              <span className="text-vdn-gray truncate mr-2">{line.label}</span>
              <span className="font-semibold text-vdn-dark shrink-0">{fmt(line.subtotal)}</span>
            </div>
          ))}
        </div>

        {/* Subtotales */}
        {hasData && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-vdn-gray">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vdn-blue inline-block" /> Materiales
              </span>
              <span className="font-semibold text-vdn-dark">{fmt(mat)}</span>
            </div>
            <div className="flex justify-between text-vdn-gray">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vdn-green inline-block" /> Mano de obra
              </span>
              <span className="font-semibold text-vdn-dark">{fmt(labor)}</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Estimado en tiempo real. El total final se confirma al generar la cotización.
      </p>
    </div>
  )
}

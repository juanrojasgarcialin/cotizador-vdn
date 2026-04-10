import { CheckCircle, Printer, RotateCcw } from 'lucide-react'
import { WaveDivider } from '../Layout'

const fmt = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

function ItemRow({ item }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors text-sm">
      <td className="py-3 px-4 text-vdn-dark font-medium">{item.description}</td>
      <td className="py-3 px-4 text-right text-vdn-gray">{item.quantity} <span className="text-xs">{item.unit}</span></td>
      <td className="py-3 px-4 text-right text-vdn-gray">{fmt(item.unit_price)}</td>
      <td className="py-3 px-4 text-right text-vdn-blue">{fmt(item.unit_labor)}</td>
      <td className="py-3 px-4 text-right font-semibold text-vdn-dark">{fmt(item.subtotal_materials)}</td>
      <td className="py-3 px-4 text-right font-semibold text-vdn-green">{fmt(item.subtotal_labor)}</td>
    </tr>
  )
}

export default function Step4Results({ quote, onReset }) {
  if (!quote) return null

  return (
    <div className="space-y-0">
      {/* Banner de éxito */}
      <div className="bg-vdn-blue rounded-xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center
                      justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <CheckCircle className="text-vdn-green shrink-0" size={32} />
          <div>
            <h2 className="font-heading text-white font-bold text-xl">Cotización generada</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              Folio #{quote.id} &mdash;{' '}
              {new Date(quote.created_at).toLocaleDateString('es-MX', { dateStyle: 'long' })}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => window.print()} className="btn-green">
            <Printer size={15} /> Imprimir / PDF
          </button>
          <button onClick={onReset} className="btn-outline">
            <RotateCcw size={15} /> Nueva cotización
          </button>
        </div>
      </div>

      {/* Datos del proyecto */}
      {(quote.client_name || quote.project_name) && (
        <div className="card mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {quote.client_name  && <div><span className="text-vdn-gray text-xs uppercase tracking-wide block mb-1">Cliente</span><strong>{quote.client_name}</strong></div>}
          {quote.client_email && <div><span className="text-vdn-gray text-xs uppercase tracking-wide block mb-1">Correo</span>{quote.client_email}</div>}
          {quote.project_name && <div><span className="text-vdn-gray text-xs uppercase tracking-wide block mb-1">Proyecto</span><strong>{quote.project_name}</strong></div>}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {[
          { label: 'Nodos de red',   value: quote.num_nodes,        color: 'border-t-vdn-blue' },
          { label: 'Cámaras',        value: quote.num_cameras,      color: 'border-t-vdn-green' },
          { label: 'Dist. promedio', value: `${quote.avg_distance_m} m`, color: 'border-t-vdn-blue' },
          { label: 'Tipo de cable',  value: quote.cable_type || '—', color: 'border-t-vdn-green' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card-vdn text-center py-5 ${color}`}>
            <p className="font-heading text-2xl font-black text-vdn-dark">{value}</p>
            <p className="text-xs text-vdn-gray mt-1 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabla de detalle */}
      <div className="card p-0 overflow-hidden mt-4 border-t-4 border-t-vdn-blue">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-heading font-bold text-vdn-dark">Desglose de materiales y mano de obra</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-vdn-blue text-white text-xs uppercase tracking-wide">
                <th className="py-3 px-4 text-left">Descripción</th>
                <th className="py-3 px-4 text-right">Cant.</th>
                <th className="py-3 px-4 text-right">P. Unit.</th>
                <th className="py-3 px-4 text-right">M.O. Unit.</th>
                <th className="py-3 px-4 text-right">Subtotal Mat.</th>
                <th className="py-3 px-4 text-right">Subtotal M.O.</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item) => <ItemRow key={item.id} item={item} />)}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col items-end gap-2 text-sm">
            <div className="flex gap-16 text-vdn-gray">
              <span>Total Materiales</span>
              <span className="font-semibold text-vdn-dark w-36 text-right">{fmt(quote.total_materials)}</span>
            </div>
            <div className="flex gap-16 text-vdn-blue">
              <span>Total Mano de Obra</span>
              <span className="font-semibold w-36 text-right">{fmt(quote.total_labor)}</span>
            </div>
            <div className="flex gap-16 border-t border-gray-300 pt-3 mt-1">
              <span className="font-heading font-black text-vdn-dark text-lg">TOTAL PROYECTO</span>
              <span className="font-heading font-black text-vdn-green text-2xl w-36 text-right">
                {fmt(quote.total_price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {quote.notes && (
        <div className="card mt-4 text-sm text-vdn-gray border-l-4 border-vdn-blue">
          <strong className="text-vdn-dark">Notas: </strong>{quote.notes}
        </div>
      )}

      {/* Footer de cotización */}
      <div className="mt-6 text-center text-xs text-gray-400 py-4 border-t border-gray-200">
        Cotización generada por Voice &amp; Data Network — vdn.com.mx | contacto@vdn.com.mx | 664-185-3947
      </div>
    </div>
  )
}

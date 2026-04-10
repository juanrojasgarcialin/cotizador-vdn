import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function SettingsForm() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getSettings().then(setForm)
  }, [])

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: parseFloat(e.target.value) || e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.updateSettings({
        cable_slack_pct: parseFloat(form.cable_slack_pct),
        profit_margin_pct: parseFloat(form.profit_margin_pct),
        patch_panel_ports: parseInt(form.patch_panel_ports),
        cable_reel_meters: parseFloat(form.cable_reel_meters),
      })
      toast.success('Configuracion guardada')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <p className="text-gray-400 text-sm">Cargando...</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div>
        <label className="label">Holgura de cable (%)</label>
        <p className="text-xs text-gray-400 mb-1">
          Porcentaje extra que se agrega al cable por curvas y desperdicios. Valor entre 0 y 1. (0.10 = 10%)
        </p>
        <input
          type="number" min="0" max="1" step="0.01" className="input"
          value={form.cable_slack_pct} onChange={set('cable_slack_pct')}
        />
      </div>

      <div>
        <label className="label">Margen de ganancia (%)</label>
        <p className="text-xs text-gray-400 mb-1">
          Porcentaje sobre el costo de compra para calcular el precio de venta sugerido. (0.30 = 30%)
        </p>
        <input
          type="number" min="0" max="2" step="0.01" className="input"
          value={form.profit_margin_pct} onChange={set('profit_margin_pct')}
        />
      </div>

      <div>
        <label className="label">Puertos por Patch Panel</label>
        <p className="text-xs text-gray-400 mb-1">
          Numero de puertos del panel por defecto para el calculo de cantidad de paneles.
        </p>
        <select className="input" value={form.patch_panel_ports} onChange={set('patch_panel_ports')}>
          <option value={24}>24 puertos</option>
          <option value={48}>48 puertos</option>
        </select>
      </div>

      <div>
        <label className="label">Metros por bobina de cable</label>
        <p className="text-xs text-gray-400 mb-1">
          Longitud estandar de una caja/bobina de cable. Por defecto 305 m.
        </p>
        <input
          type="number" min="1" step="1" className="input"
          value={form.cable_reel_meters} onChange={set('cable_reel_meters')}
        />
      </div>

      <button type="submit" disabled={saving} className="btn-primary">
        <Save size={15} /> {saving ? 'Guardando...' : 'Guardar configuracion'}
      </button>
    </form>
  )
}

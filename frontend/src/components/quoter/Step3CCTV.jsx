import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Camera, Zap, Plus, Trash2 } from 'lucide-react'

export default function Step3CCTV({ data, onChange }) {
  const [cameras, setCameras] = useState([])
  const [switches, setSwitches] = useState([])
  const [nvrs, setNvrs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProducts({ active_only: true, limit: 200 }).then((prods) => {
      setCameras(prods.filter((p) => p.category.slug === 'camara'))
      setSwitches(prods.filter((p) => p.category.slug === 'activo' && p.name.toLowerCase().includes('switch')))
      setNvrs(prods.filter((p) => p.category.slug === 'activo' && (p.name.toLowerCase().includes('nvr') || p.name.toLowerCase().includes('dvr'))))
      setLoading(false)
    })
  }, [])

  const set = (field) => (val) => onChange({ ...data, [field]: val })

  // Manejo de lista de cámaras
  const addCameraItem = () =>
    onChange({ ...data, camera_items: [...(data.camera_items || []), { product_id: '', quantity: 1 }] })

  const updateCameraItem = (idx, field, val) => {
    const items = [...(data.camera_items || [])]
    items[idx] = { ...items[idx], [field]: val }
    onChange({ ...data, camera_items: items })
  }

  const removeCameraItem = (idx) => {
    const items = (data.camera_items || []).filter((_, i) => i !== idx)
    onChange({ ...data, camera_items: items })
  }

  if (loading) return <p className="text-gray-500 text-sm">Cargando productos...</p>

  const totalCams = (data.camera_items || []).reduce((s, i) => s + (parseInt(i.quantity) || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Paso 3 — CCTV y Equipos Activos</h2>
        <p className="text-sm text-gray-500 mt-1">
          Selecciona los tipos de cámaras, switch PoE y grabador.
        </p>
      </div>

      {/* Cámaras */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Camera size={18} className="text-indigo-500" /> Cámaras de Seguridad
          </h3>
          <button onClick={addCameraItem} className="btn-secondary text-xs">
            <Plus size={14} /> Agregar tipo
          </button>
        </div>

        {(!data.camera_items || data.camera_items.length === 0) && (
          <p className="text-sm text-gray-400 italic">No se han agregado cámaras. Haz clic en "Agregar tipo".</p>
        )}

        {(data.camera_items || []).map((item, idx) => (
          <div key={idx} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <label className="label">Modelo de cámara</label>
              <select
                className="input"
                value={item.product_id}
                onChange={(e) => updateCameraItem(idx, 'product_id', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {cameras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.brand ? `${c.brand} — ` : ''}{c.name} | ${c.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label className="label">Cantidad</label>
              <input
                type="number"
                min="1"
                className="input"
                value={item.quantity}
                onChange={(e) => updateCameraItem(idx, 'quantity', e.target.value)}
              />
            </div>
            <button onClick={() => removeCameraItem(idx)} className="btn-danger p-2 mb-0.5">
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {totalCams > 0 && (
          <p className="text-xs text-indigo-700 bg-indigo-50 rounded p-2">
            Total cámaras seleccionadas: <strong>{totalCams}</strong>
            {data.num_cameras && parseInt(data.num_cameras) !== totalCams && (
              <span className="text-orange-600 ml-2">
                (Paso 1 indica {data.num_cameras} — verifica que coincidan)
              </span>
            )}
          </p>
        )}
      </div>

      {/* Switch PoE */}
      <div className="card space-y-4">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <Zap size={18} className="text-yellow-500" /> Switch PoE
        </h3>
        {data.num_nodes && (
          <p className="text-xs text-gray-500">
            Con {parseInt(data.num_nodes || 0) + parseInt(data.num_cameras || 0)} puntos totales,
            se recomienda un switch de{' '}
            <strong>
              {[8, 16, 24, 48].find(
                (s) => s >= parseInt(data.num_nodes || 0) + parseInt(data.num_cameras || 0)
              ) || 48}+ puertos
            </strong>.
          </p>
        )}
        <label className="label">Modelo de Switch PoE</label>
        <select
          className="input"
          value={data.switch_product_id}
          onChange={(e) => set('switch_product_id')(e.target.value)}
        >
          <option value="">Sin seleccionar</option>
          {switches.map((s) => (
            <option key={s.id} value={s.id}>
              {s.brand ? `${s.brand} — ` : ''}{s.name} | ${s.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      {/* NVR/DVR */}
      <div className="card space-y-4">
        <h3 className="font-medium text-gray-700">Grabador (NVR / DVR)</h3>
        <label className="label">Modelo de grabador</label>
        <select
          className="input"
          value={data.nvr_product_id}
          onChange={(e) => set('nvr_product_id')(e.target.value)}
        >
          <option value="">Sin seleccionar</option>
          {nvrs.map((n) => (
            <option key={n.id} value={n.id}>
              {n.brand ? `${n.brand} — ` : ''}{n.name} | ${n.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      {/* Notas */}
      <div className="card space-y-2">
        <h3 className="font-medium text-gray-700">Notas adicionales</h3>
        <textarea
          className="input min-h-[80px] resize-none"
          placeholder="Observaciones, condiciones especiales, aclaraciones..."
          value={data.notes || ''}
          onChange={(e) => set('notes')(e.target.value)}
        />
      </div>
    </div>
  )
}

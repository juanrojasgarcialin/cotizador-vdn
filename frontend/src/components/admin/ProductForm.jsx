import { useState, useEffect, useRef } from 'react'
import { api } from '../../services/api'
import toast from 'react-hot-toast'
import { Upload, Trash2 } from 'lucide-react'

const UNITS = ['pieza', 'metro', 'caja_305m', 'tramo_3m', 'rollo']
const STANDARDS = ['Cat5e', 'Cat6', 'Cat6a', 'Fibra', 'universal']

export default function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '', brand: '', category_id: '', unit: 'pieza',
    meters_per_unit: '', price: '', cost: '', labor_cost: '',
    is_active: true, notes: '', standard: '', image_url: '',
    ...initial,
  })
  const [categories, setCategories] = useState([])
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    api.getCategories().then(setCategories)
  }, [])

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !initial?.id) {
      toast.error('Guarda el producto primero para poder subir imagen.')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`http://localhost:8000/products/${initial.id}/image`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error al subir imagen')
      }
      const updated = await res.json()
      setForm((f) => ({ ...f, image_url: updated.image_url }))
      toast.success('Imagen actualizada')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!initial?.id) return
    try {
      await fetch(`http://localhost:8000/products/${initial.id}/image`, { method: 'DELETE' })
      setForm((f) => ({ ...f, image_url: null }))
      toast.success('Imagen eliminada')
    } catch {
      toast.error('No se pudo eliminar la imagen')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        category_id:     parseInt(form.category_id),
        price:           parseFloat(form.price)           || 0,
        cost:            parseFloat(form.cost)            || 0,
        labor_cost:      parseFloat(form.labor_cost)      || 0,
        meters_per_unit: form.meters_per_unit ? parseFloat(form.meters_per_unit) : null,
        standard:        form.standard || null,
      }
      await onSave(payload)
    } finally {
      setSaving(false)
    }
  }

  const imgSrc = form.image_url ? `http://localhost:8000${form.image_url}` : null

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Imagen */}
        <div className="md:col-span-2">
          <label className="label">Imagen del producto</label>
          <div className="flex items-start gap-4">
            <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
              {imgSrc ? (
                <img src={imgSrc} alt="producto" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">📦</span>
              )}
            </div>
            <div className="space-y-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading || !initial?.id}
                className="btn-secondary text-xs"
              >
                <Upload size={13} /> {uploading ? 'Subiendo...' : 'Subir imagen'}
              </button>
              {imgSrc && (
                <button type="button" onClick={handleDeleteImage} className="btn-danger text-xs">
                  <Trash2 size={13} /> Quitar
                </button>
              )}
              {!initial?.id && (
                <p className="text-xs text-gray-400">Guarda el producto primero para subir imagen.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="label">Nombre *</label>
          <input className="input" required value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label">Marca</label>
          <input className="input" value={form.brand} onChange={set('brand')} placeholder="Ej. Panduit" />
        </div>
        <div>
          <label className="label">Categoría *</label>
          <select className="input" required value={form.category_id} onChange={set('category_id')}>
            <option value="">Seleccionar...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Estándar de compatibilidad</label>
          <select className="input" value={form.standard || ''} onChange={set('standard')}>
            <option value="">Sin especificar</option>
            {STANDARDS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Controla con qué tipo de cable es compatible el producto.
          </p>
        </div>
        <div>
          <label className="label">Unidad de medida *</label>
          <select className="input" value={form.unit} onChange={set('unit')}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Metros por unidad</label>
          <input className="input" type="number" min="0" step="0.1" value={form.meters_per_unit}
            onChange={set('meters_per_unit')} placeholder="Solo para cable/tubería" />
        </div>
        <div>
          <label className="label">Precio de venta (MXN) *</label>
          <input className="input" type="number" min="0" step="0.01" required value={form.price} onChange={set('price')} />
        </div>
        <div>
          <label className="label">Costo de compra (MXN)</label>
          <input className="input" type="number" min="0" step="0.01" value={form.cost} onChange={set('cost')} />
        </div>
        <div>
          <label className="label">Mano de obra por unidad (MXN)</label>
          <input className="input" type="number" min="0" step="0.01" value={form.labor_cost} onChange={set('labor_cost')} />
        </div>
      </div>

      <div>
        <label className="label">Notas</label>
        <textarea className="input resize-none" rows={2} value={form.notes || ''} onChange={set('notes')} />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_active" checked={form.is_active} onChange={set('is_active')} className="rounded" />
        <label htmlFor="is_active" className="text-sm text-gray-700">Producto activo</label>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Guardando...' : initial?.id ? 'Actualizar' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import ProductTable from '../components/admin/ProductTable'
import ProductForm from '../components/admin/ProductForm'
import SettingsForm from '../components/admin/SettingsForm'
import { WaveDivider } from '../components/Layout'
import { Plus, TrendingUp, Settings, Package, ClipboardList } from 'lucide-react'

const TABS = [
  { id: 'products',  label: 'Productos',      icon: Package },
  { id: 'bulk',      label: 'Ajuste masivo',  icon: TrendingUp },
  { id: 'settings',  label: 'Configuración',  icon: Settings },
  { id: 'quotes',    label: 'Cotizaciones',   icon: ClipboardList },
]

const fmt = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

export default function AdminPage() {
  const [tab, setTab]         = useState('products')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [quotes, setQuotes]   = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [bulkFactor, setBulkFactor] = useState('1.10')
  const [bulkCat, setBulkCat] = useState('')
  const [loading, setLoading] = useState(true)

  const loadProducts = () => api.getProducts({ active_only: false, limit: 500 }).then(setProducts)

  useEffect(() => {
    Promise.all([loadProducts(), api.getCategories().then(setCategories), api.getQuotes().then(setQuotes)])
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (payload) => {
    try {
      if (editing?.id) { await api.updateProduct(editing.id, payload); toast.success('Producto actualizado') }
      else             { await api.createProduct(payload);              toast.success('Producto creado') }
      await loadProducts(); setShowForm(false); setEditing(null)
    } catch (err) {
      const msg = err.response?.data?.detail
      toast.error(typeof msg === 'string' ? msg : 'Error al guardar')
    }
  }

  const handleDelete = async (p) => {
    if (!window.confirm(`Eliminar "${p.name}"?`)) return
    try { await api.deleteProduct(p.id); toast.success('Eliminado'); await loadProducts() }
    catch { toast.error('No se pudo eliminar') }
  }

  const handleBulk = async () => {
    const factor = parseFloat(bulkFactor)
    if (!factor || factor <= 0) { toast.error('Factor inválido'); return }
    if (!window.confirm(`Aplicar factor ${factor}?`)) return
    try {
      const res = await api.bulkPriceUpdate({ factor, category_id: bulkCat ? parseInt(bulkCat) : undefined })
      toast.success(`${res.updated} productos actualizados`)
      await loadProducts()
    } catch { toast.error('Error en actualización masiva') }
  }

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Eliminar esta cotización?')) return
    await api.deleteQuote(id)
    setQuotes((q) => q.filter((x) => x.id !== id))
    toast.success('Cotizacion eliminada')
  }

  if (loading) return <div className="text-center py-20 text-vdn-gray">Cargando...</div>

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-r from-vdn-bluedk to-vdn-blue py-10 relative">
        <div className="max-w-6xl mx-auto px-6 flex items-end justify-between">
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Voice & Data Network</p>
            <h1 className="font-heading text-3xl font-black text-white">Panel de Administración</h1>
            <p className="text-blue-200 text-sm mt-1">Gestión de productos, precios y cotizaciones</p>
          </div>
          {tab === 'products' && !showForm && (
            <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-green no-print">
              <Plus size={16} /> Nuevo producto
            </button>
          )}
        </div>
        <WaveDivider fill="#f9fafb" />
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 pb-16 pt-6">

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 shadow-sm mb-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setTab(id); setShowForm(false) }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg
                            text-sm font-semibold transition-all
                  ${tab === id
                    ? 'bg-vdn-blue text-white shadow'
                    : 'text-vdn-gray hover:text-vdn-dark hover:bg-gray-50'}`}>
                <Icon size={15} />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab: Productos */}
          {tab === 'products' && (
            showForm ? (
              <div className="card border-t-4 border-t-vdn-blue">
                <h2 className="font-heading font-bold text-vdn-dark text-lg mb-5">
                  {editing ? 'Editar producto' : 'Nuevo producto'}
                </h2>
                <ProductForm
                  initial={editing}
                  onSave={handleSave}
                  onCancel={() => { setShowForm(false); setEditing(null) }}
                />
              </div>
            ) : (
              <div className="card p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-white">
                  <h2 className="font-heading font-bold text-vdn-dark">Catálogo de productos</h2>
                </div>
                <div className="p-6">
                  <ProductTable
                    products={products}
                    onEdit={(p) => { setEditing(p); setShowForm(true) }}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            )
          )}

          {/* Tab: Bulk */}
          {tab === 'bulk' && (
            <div className="card border-t-4 border-t-vdn-blue max-w-lg space-y-5">
              <h2 className="font-heading font-bold text-vdn-dark text-lg">Actualización masiva de precios</h2>
              <p className="text-sm text-vdn-gray">
                Aplica un factor multiplicador a los precios de venta.
                <br /><strong>1.15</strong> = subir 15% · <strong>0.90</strong> = bajar 10%
              </p>
              <div>
                <label className="label">Categoría</label>
                <select className="input" value={bulkCat} onChange={(e) => setBulkCat(e.target.value)}>
                  <option value="">Todas las categorías</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Factor multiplicador</label>
                <input type="number" min="0.01" step="0.01" className="input"
                  value={bulkFactor} onChange={(e) => setBulkFactor(e.target.value)} />
              </div>
              <button onClick={handleBulk} className="btn-green w-full justify-center">
                <TrendingUp size={15} /> Aplicar actualización
              </button>
            </div>
          )}

          {/* Tab: Settings */}
          {tab === 'settings' && (
            <div className="card border-t-4 border-t-vdn-blue">
              <h2 className="font-heading font-bold text-vdn-dark text-lg mb-6">Parámetros del sistema</h2>
              <SettingsForm />
            </div>
          )}

          {/* Tab: Cotizaciones */}
          {tab === 'quotes' && (
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <h2 className="font-heading font-bold text-vdn-dark">Historial de cotizaciones</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-vdn-blue text-white text-xs uppercase tracking-wide">
                      <th className="py-3 px-4 text-left">#</th>
                      <th className="py-3 px-4 text-left">Cliente</th>
                      <th className="py-3 px-4 text-left">Proyecto</th>
                      <th className="py-3 px-4 text-left">Fecha</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.length === 0 && (
                      <tr><td colSpan={6} className="py-10 text-center text-vdn-gray">Sin cotizaciones aún.</td></tr>
                    )}
                    {quotes.map((q) => (
                      <tr key={q.id} className="border-t border-gray-100 hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4 text-vdn-gray">#{q.id}</td>
                        <td className="py-3 px-4 font-medium">{q.client_name || '—'}</td>
                        <td className="py-3 px-4 text-vdn-gray">{q.project_name || '—'}</td>
                        <td className="py-3 px-4 text-vdn-gray">
                          {new Date(q.created_at).toLocaleDateString('es-MX')}
                        </td>
                        <td className="py-3 px-4 text-right font-heading font-bold text-vdn-green text-base">
                          {fmt(q.total_price)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => handleDeleteQuote(q.id)}
                            className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Pencil, Trash2, Search } from 'lucide-react'

const fmt = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

export default function ProductTable({ products, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')

  const categories = [...new Set(products.map((p) => p.category.name))].sort()

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(search.toLowerCase())
    const matchesCat = catFilter ? p.category.name === catFilter : true
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input w-auto" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="py-3 px-4 text-left">Producto</th>
              <th className="py-3 px-4 text-left">Categoría</th>
              <th className="py-3 px-4 text-left">Unidad</th>
              <th className="py-3 px-4 text-right">Precio</th>
              <th className="py-3 px-4 text-right">M.O.</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 text-sm">
                  No se encontraron productos.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-2.5 px-4">
                  <div className="font-medium text-gray-800">{p.name}</div>
                  {p.brand && <div className="text-xs text-gray-400">{p.brand}</div>}
                </td>
                <td className="py-2.5 px-4 text-gray-600">{p.category.name}</td>
                <td className="py-2.5 px-4 text-gray-500">{p.unit}</td>
                <td className="py-2.5 px-4 text-right font-medium">{fmt(p.price)}</td>
                <td className="py-2.5 px-4 text-right text-blue-600">{fmt(p.labor_cost)}</td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`badge ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(p)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete(p)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400">{filtered.length} productos mostrados de {products.length} total</p>
    </div>
  )
}

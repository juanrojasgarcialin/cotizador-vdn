import { useEffect, useState } from 'react'
import { api } from '../../services/api'

const CABLE_TYPES = [
  { value: 'Cat5e', label: 'Cat5e',  desc: 'Hasta 1 Gbps · Oficinas con bajo presupuesto', color: 'gray' },
  { value: 'Cat6',  label: 'Cat6',   desc: 'Hasta 10 Gbps · Recomendado estándar actual',  color: 'blue' },
  { value: 'Cat6a', label: 'Cat6a',  desc: 'Hasta 10 Gbps · 100m garantizados · Entornos exigentes', color: 'indigo' },
  { value: 'Fibra', label: 'Fibra',  desc: 'Distancias largas · Backbone entre pisos',     color: 'purple' },
]

const colorMap = {
  gray:   { btn: 'border-gray-400 bg-gray-50 text-gray-700',   active: 'border-gray-600 bg-gray-600 text-white' },
  blue:   { btn: 'border-blue-300 bg-blue-50 text-blue-700',    active: 'border-blue-600 bg-blue-600 text-white' },
  indigo: { btn: 'border-indigo-300 bg-indigo-50 text-indigo-700', active: 'border-indigo-600 bg-indigo-600 text-white' },
  purple: { btn: 'border-purple-300 bg-purple-50 text-purple-700', active: 'border-purple-600 bg-purple-600 text-white' },
}

function ProductCard({ product, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(selected ? '' : String(product.id))}
      className={`text-left p-3 rounded-xl border-2 transition-all w-full
        ${selected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}
    >
      {/* Imagen del producto */}
      <div className="w-full h-28 rounded-lg mb-2 overflow-hidden bg-gray-100 flex items-center justify-center">
        {product.image_url ? (
          <img
            src={`http://localhost:8000${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl select-none">📦</span>
        )}
      </div>
      <div className="space-y-1">
        {product.brand && (
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{product.brand}</span>
        )}
        <p className="text-sm font-medium text-gray-800 leading-snug">{product.name}</p>
        <p className="text-xs text-gray-500">{product.unit}</p>
        {product.notes && <p className="text-xs text-gray-400 italic truncate">{product.notes}</p>}
        <p className="text-base font-bold text-gray-900 mt-1">
          ${product.price.toFixed(2)}
          <span className="text-xs text-gray-400 font-normal ml-1">/ {product.unit}</span>
        </p>
        {selected && (
          <span className="inline-block text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Seleccionado</span>
        )}
      </div>
    </button>
  )
}

function ProductGrid({ products, selectedId, onSelect, emptyMsg }) {
  if (products.length === 0)
    return <p className="text-sm text-gray-400 italic col-span-full">{emptyMsg}</p>
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          selected={String(p.id) === String(selectedId)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default function Step2Cable({ data, onChange }) {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProducts({ active_only: true, limit: 300 }).then((prods) => {
      setAllProducts(prods)
      setLoading(false)
    })
  }, [])

  const set = (field) => (val) => onChange({ ...data, [field]: val })

  // Filtra por slug de categoría y compatibilidad con el cable seleccionado
  const bySlug = (slug) => allProducts.filter((p) => p.category.slug === slug)

  const compatible = (products) =>
    products.filter(
      (p) => !p.standard || p.standard === 'universal' || p.standard === data.cable_type
    )

  if (loading) return <p className="text-gray-500 text-sm py-8 text-center">Cargando productos...</p>

  const cableProducts   = compatible(bySlug('cable'))
  const conduitProducts = compatible(bySlug('tuberia'))
  const keystones       = compatible(bySlug('remate')).filter((p) => p.name.toLowerCase().includes('keystone'))
  const faceplates      = compatible(bySlug('remate')).filter((p) => p.name.toLowerCase().includes('faceplate'))
  const cords1m         = compatible(bySlug('remate')).filter((p) => p.name.toLowerCase().includes('1m'))
  const cords3m         = compatible(bySlug('remate')).filter((p) => p.name.toLowerCase().includes('3m'))
  const panels          = compatible(bySlug('patch_panel'))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Paso 2 — Cableado y Remates</h2>
        <p className="text-sm text-gray-500 mt-1">
          Selecciona el estándar de cable. Los productos compatibles se filtran automáticamente.
        </p>
      </div>

      {/* ── Tipo de cable ─────────────────────────────────────────────────── */}
      <section className="card space-y-4">
        <h3 className="font-semibold text-gray-700">1. Estándar de cable</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CABLE_TYPES.map(({ value, label, desc, color }) => {
            const active = data.cable_type === value
            const c = colorMap[color]
            return (
              <button
                key={value}
                onClick={() => {
                  // Al cambiar estándar, limpiar selecciones de productos dependientes
                  onChange({
                    ...data,
                    cable_type: value,
                    cable_product_id: '',
                    keystone_product_id: '',
                    faceplate_product_id: '',
                    patch_cord_1m_product_id: '',
                    patch_cord_3m_product_id: '',
                    patch_panel_product_id: '',
                  })
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all
                  ${active ? c.active : c.btn}`}
              >
                <p className="font-bold text-base">{label}</p>
                <p className={`text-xs mt-1 leading-snug ${active ? 'opacity-80' : 'opacity-70'}`}>{desc}</p>
              </button>
            )
          })}
        </div>

        {data.cable_type && (
          <div className="mt-2">
            <p className="label mb-2">Producto de cable <span className="text-blue-600">— {data.cable_type} compatible</span></p>
            <ProductGrid
              products={cableProducts}
              selectedId={data.cable_product_id}
              onSelect={set('cable_product_id')}
              emptyMsg={`No hay cables ${data.cable_type} en el catálogo.`}
            />
          </div>
        )}
      </section>

      {/* ── Tubería ───────────────────────────────────────────────────────── */}
      <section className="card space-y-3">
        <h3 className="font-semibold text-gray-700">2. Tubería / Canalización</h3>
        <p className="text-xs text-gray-500">
          La tubería es universal — sirve independientemente del tipo de cable.
          Selecciona una para incluirla en el presupuesto.
        </p>
        <ProductGrid
          products={conduitProducts}
          selectedId={data.conduit_product_id}
          onSelect={set('conduit_product_id')}
          emptyMsg="No hay tuberías en el catálogo."
        />
      </section>

      {/* ── Remates ───────────────────────────────────────────────────────── */}
      <section className="card space-y-5">
        <div>
          <h3 className="font-semibold text-gray-700">3. Remates por nodo</h3>
          <p className="text-xs text-gray-500 mt-1">
            Por cada nodo de red se incluye automáticamente 1 pieza de cada remate.
            Solo se muestran productos compatibles con <strong>{data.cable_type}</strong>.
          </p>
        </div>

        {[
          { label: 'Keystone', products: keystones, field: 'keystone_product_id' },
          { label: 'Faceplate', products: faceplates, field: 'faceplate_product_id' },
          { label: 'Patch Cord 1m (rack)', products: cords1m, field: 'patch_cord_1m_product_id' },
          { label: 'Patch Cord 3m (área de trabajo)', products: cords3m, field: 'patch_cord_3m_product_id' },
        ].map(({ label, products, field }) => (
          <div key={field} className="space-y-2">
            <p className="label">{label}</p>
            <ProductGrid
              products={products}
              selectedId={data[field]}
              onSelect={set(field)}
              emptyMsg={`No hay ${label} ${data.cable_type} en el catálogo.`}
            />
          </div>
        ))}
      </section>

      {/* ── Patch Panel ───────────────────────────────────────────────────── */}
      <section className="card space-y-3">
        <h3 className="font-semibold text-gray-700">4. Patch Panel</h3>
        <p className="text-xs text-gray-500">
          La cantidad necesaria se calcula automáticamente: ceil({data.num_nodes || '?'} nodos / puertos del panel).
        </p>
        <ProductGrid
          products={panels}
          selectedId={data.patch_panel_product_id}
          onSelect={set('patch_panel_product_id')}
          emptyMsg={`No hay Patch Panels ${data.cable_type} en el catálogo.`}
        />
      </section>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import Step1Site from '../components/quoter/Step1Site'
import Step2Cable from '../components/quoter/Step2Cable'
import Step3CCTV from '../components/quoter/Step3CCTV'
import Step4Results from '../components/quoter/Step4Results'
import BudgetSidebar from '../components/quoter/BudgetSidebar'
import { WaveDivider } from '../components/Layout'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const STEPS = [
  { label: 'Parámetros', desc: 'Nodos, cámaras y distancia' },
  { label: 'Cableado',   desc: 'Cable, tubería y remates' },
  { label: 'CCTV',       desc: 'Cámaras y equipos activos' },
]

const INITIAL = {
  num_nodes: '', num_cameras: '0', avg_distance_m: '',
  client_name: '', client_email: '', project_name: '',
  cable_type: 'Cat6',
  cable_product_id: '', conduit_product_id: '',
  keystone_product_id: '', faceplate_product_id: '',
  patch_cord_1m_product_id: '', patch_cord_3m_product_id: '',
  patch_panel_product_id: '',
  switch_product_id: '', nvr_product_id: '',
  camera_items: [], notes: '',
}

function validate(step, data) {
  if (step === 0) {
    if (!data.num_nodes || parseInt(data.num_nodes) <= 0) return 'Ingresa el número de nodos (mínimo 1)'
    if (!data.avg_distance_m || parseFloat(data.avg_distance_m) <= 0) return 'Ingresa la distancia promedio'
  }
  return null
}

export default function QuoterPage() {
  const [step, setStep]         = useState(0)
  const [formData, setFormData] = useState(INITIAL)
  const [quote, setQuote]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [settings, setSettings]       = useState(null)

  useEffect(() => {
    Promise.all([
      api.getProducts({ active_only: true, limit: 300 }),
      api.getSettings(),
    ]).then(([prods, sett]) => { setAllProducts(prods); setSettings(sett) })
  }, [])

  const goNext = () => {
    const err = validate(step, formData)
    if (err) { toast.error(err); return }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goPrev = () => {
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        num_nodes:   parseInt(formData.num_nodes),
        num_cameras: parseInt(formData.num_cameras) || 0,
        avg_distance_m: parseFloat(formData.avg_distance_m),
        cable_type:  formData.cable_type,
        client_name:  formData.client_name  || null,
        client_email: formData.client_email || null,
        project_name: formData.project_name || null,
        notes: formData.notes || null,
        cable_product_id:         formData.cable_product_id         ? parseInt(formData.cable_product_id)         : null,
        conduit_product_id:       formData.conduit_product_id       ? parseInt(formData.conduit_product_id)       : null,
        keystone_product_id:      formData.keystone_product_id      ? parseInt(formData.keystone_product_id)      : null,
        faceplate_product_id:     formData.faceplate_product_id     ? parseInt(formData.faceplate_product_id)     : null,
        patch_cord_1m_product_id: formData.patch_cord_1m_product_id ? parseInt(formData.patch_cord_1m_product_id) : null,
        patch_cord_3m_product_id: formData.patch_cord_3m_product_id ? parseInt(formData.patch_cord_3m_product_id) : null,
        patch_panel_product_id:   formData.patch_panel_product_id   ? parseInt(formData.patch_panel_product_id)   : null,
        switch_product_id:        formData.switch_product_id        ? parseInt(formData.switch_product_id)        : null,
        camera_items: (formData.camera_items || [])
          .filter((i) => i.product_id)
          .map((i) => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) })),
      }
      const result = await api.createQuote(payload)
      setQuote(result)
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast.success('Cotizacion generada exitosamente')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al generar la cotizacion'
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setFormData(INITIAL); setQuote(null); setStep(0); window.scrollTo({ top: 0 }) }

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────── */}
      {step < 3 && (
        <div className="bg-gradient-to-r from-vdn-bluedk to-vdn-blue py-10 relative">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Voice & Data Network</p>
            <h1 className="font-heading text-3xl font-black text-white">Cotizador de Infraestructura</h1>
            <p className="text-blue-200 text-sm mt-2">Cableado estructurado y CCTV — Presupuesto profesional en 3 pasos</p>
          </div>
          <WaveDivider fill="#f9fafb" />
        </div>
      )}

      <div className={`${step < 3 ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 pb-16 pt-6">

          {/* ── Stepper ─────────────────────────────────────────── */}
          {step < 3 && (
            <div className="flex items-center mb-8 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
              {STEPS.map(({ label, desc }, idx) => {
                const done   = idx < step
                const active = idx === step
                return (
                  <div key={label}
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${active ? 'bg-vdn-blue' : done ? 'bg-vdn-green/10' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm
                      ${active ? 'bg-white text-vdn-blue'
                      : done   ? 'bg-vdn-green text-white'
                      : 'bg-gray-200 text-gray-400'}`}>
                      {done ? '✓' : idx + 1}
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-sm font-bold leading-none ${active ? 'text-white' : done ? 'text-vdn-green' : 'text-gray-400'}`}>
                        {label}
                      </p>
                      <p className={`text-xs mt-0.5 ${active ? 'text-blue-200' : 'text-gray-400'}`}>{desc}</p>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <ChevronRight size={16} className={`ml-auto ${active ? 'text-blue-300' : 'text-gray-300'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Layout ──────────────────────────────────────────── */}
          {step < 3 ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6 items-start">
              <div className="min-w-0 space-y-0">
                {step === 0 && <Step1Site data={formData} onChange={setFormData} />}
                {step === 1 && <Step2Cable data={formData} onChange={setFormData} />}
                {step === 2 && <Step3CCTV data={formData} onChange={setFormData} />}

                {/* Navegación */}
                <div className="flex justify-between pt-6">
                  <button onClick={goPrev} disabled={step === 0} className="btn-ghost">
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  {step < 2 ? (
                    <button onClick={goNext} className="btn-blue">
                      Siguiente <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={loading} className="btn-green px-8">
                      {loading ? 'Calculando...' : 'Generar cotización'}
                      {!loading && <ChevronRight size={16} />}
                    </button>
                  )}
                </div>
              </div>

              <BudgetSidebar formData={formData} products={allProducts} settings={settings} step={step} />
            </div>
          ) : (
            <Step4Results quote={quote} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { FileText, Network, Camera, Zap, LayoutGrid, Construction, Wrench } from 'lucide-react'
import { WaveDivider } from '../components/Layout'

/* Ícono envuelto en círculo azul, estilo VDN */
function VdnIcon({ emoji, size = 'md' }) {
  const sz = size === 'lg' ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-xl'
  return (
    <div className={`${sz} rounded-full bg-vdn-blue flex items-center justify-center shadow-md mx-auto mb-4`}>
      <span>{emoji}</span>
    </div>
  )
}

/* Tarjeta de servicio — tech style con decoraciones */
function ServiceCard({ Icon, title, desc, gradient, accentColor = '#1976d2' }) {
  return (
    <div className={`relative rounded-xl overflow-hidden min-h-[240px] flex flex-col justify-end
                     group cursor-default transition-all duration-300 hover:-translate-y-1
                     hover:shadow-2xl ${gradient}`}>

      {/* Patrón de puntos (tech grid) */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Línea decorativa top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent
                      group-hover:via-white/80 transition-all duration-500" />

      {/* Círculo decorativo grande difuso */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5
                      group-hover:bg-white/10 transition-all duration-500 group-hover:scale-110" />

      {/* Icono */}
      <div className="absolute top-5 left-5">
        <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center
                        group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-300
                        group-hover:scale-110">
          <Icon size={22} className="text-white drop-shadow" />
        </div>
      </div>

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80
                      group-hover:to-black/60 transition-all duration-400" />

      {/* Content */}
      <div className="relative p-5 space-y-1.5">
        {/* Línea accent */}
        <div className="w-8 h-0.5 bg-vdn-green mb-2 group-hover:w-14 transition-all duration-300" />
        <h3 className="font-heading font-bold text-white text-lg leading-tight drop-shadow">{title}</h3>
        <p className="text-blue-100/80 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* Contador de logros */
function StatCounter({ value, label, suffix = '' }) {
  return (
    <div className="text-center space-y-1">
      <p className="font-heading text-4xl font-black text-white">
        {value}<span className="text-vdn-green">{suffix}</span>
      </p>
      <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">{label}</p>
    </div>
  )
}

const services = [
  { Icon: Network,      title: 'Cableado Estructurado', desc: 'Cat5e, Cat6, Cat6a y Fibra Óptica con materiales de marca certificados.', gradient: 'bg-gradient-to-br from-blue-800 to-blue-950' },
  { Icon: Camera,       title: 'Cámaras CCTV & IP',     desc: 'Domo, bala, PTZ y fisheye. IP y analógicas, interior y exterior.',         gradient: 'bg-gradient-to-br from-slate-700 to-slate-900' },
  { Icon: Zap,          title: 'Equipos Activos',         desc: 'Switches PoE, NVR/DVR Hikvision y Dahua. Instalación y configuración.',    gradient: 'bg-gradient-to-br from-indigo-700 to-indigo-950' },
  { Icon: LayoutGrid,   title: 'Patch Panels & Remates',  desc: 'Keystones, faceplates y patch cords certificados Panduit y Linkedpro.',    gradient: 'bg-gradient-to-br from-teal-700 to-teal-950' },
  { Icon: Construction, title: 'Tubería & Canalización',  desc: 'PVC, EMT y charola portacable. Instalación limpia y profesional.',         gradient: 'bg-gradient-to-br from-gray-600 to-gray-900' },
  { Icon: Wrench,       title: 'Mantenimiento',            desc: 'Pólizas preventivas y correctivas para toda tu infraestructura de red.',   gradient: 'bg-gradient-to-br from-emerald-700 to-emerald-950' },
]

const steps = [
  { n: '01', title: 'Describe el sitio',    desc: 'Ingresa cuántos nodos de red y cámaras necesitas, y la distancia estimada al rack.' },
  { n: '02', title: 'Selecciona productos', desc: 'Elige marca, estándar de cable y equipos. Solo verás productos compatibles entre sí.' },
  { n: '03', title: 'Obtén tu presupuesto', desc: 'Materiales y mano de obra calculados al instante. Listo para imprimir o compartir.' },
]

export default function Home() {
  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-vdn-bluedk via-vdn-blue to-slate-800
                          min-h-[520px] overflow-hidden pb-16">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fadeup">
            <span className="inline-block bg-vdn-green text-white text-xs font-bold px-3 py-1.5
                             rounded uppercase tracking-widest">
              Cotizador Profesional
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-white leading-tight">
              Presupuesta tu proyecto<br />
              <span className="text-vdn-green">de infraestructura</span><br />
              en minutos
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
              Cableado estructurado y CCTV con precios reales de mercado.
              Materiales + mano de obra, desglosados al instante.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/cotizar" className="btn-green text-base px-8 py-4 shadow-xl shadow-black/30">
                <FileText size={18} /> Iniciar cotización
              </Link>
              <Link to="/nosotros" className="btn-outline text-base px-8 py-4">
                Quiénes somos
              </Link>
            </div>
          </div>

          {/* Tarjeta decorativa */}
          <div className="hidden lg:block animate-fadeup" style={{ animationDelay: '150ms' }}>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-4">
              <p className="text-white font-semibold text-sm uppercase tracking-wide">Ejemplo de cotización</p>
              {[
                { label: '20 nodos Cat6 — Belden', value: '$7,400' },
                { label: '8 cámaras IP Hikvision',  value: '$9,600' },
                { label: 'Switch PoE 48p TP-Link',  value: '$7,800' },
                { label: 'Mano de obra total',       value: '$3,200' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm border-b border-white/10 pb-2">
                  <span className="text-blue-100">{label}</span>
                  <span className="text-white font-bold">{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-heading font-black text-lg pt-1">
                <span className="text-blue-200">TOTAL</span>
                <span className="text-vdn-green">$28,000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider fill="#f9fafb" />
        </div>
      </section>

      {/* ── SERVICIOS ────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-vdn-blue text-xs font-bold uppercase tracking-widest">Lo que cotizamos</span>
            <h2 className="section-title">Servicios incluidos</h2>
            <div className="w-16 h-1 bg-vdn-pink mx-auto rounded-full" />
            <p className="section-subtitle mx-auto text-center mt-3">
              El cotizador cubre todos los elementos de un proyecto de red profesional,
              desde el cable hasta los equipos activos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => <ServiceCard key={s.title} Icon={s.Icon} title={s.title} desc={s.desc} gradient={s.gradient} />)}
          </div>
        </div>
      </section>

      {/* ── CONTADORES ─────────────────────────────────────────── */}
      <section className="bg-vdn-blue py-16 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value="20+" suffix="" label="Años de experiencia" />
            <StatCounter value="500+" suffix="" label="Proyectos entregados" />
            <StatCounter value="29"   suffix="" label="Productos en catálogo" />
            <StatCounter value="100"  suffix="%" label="Cálculo automático" />
          </div>
        </div>
        <WaveDivider fill="#ffffff" />
      </section>

      {/* ── CÓMO FUNCIONA ──────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-vdn-blue text-xs font-bold uppercase tracking-widest">Proceso</span>
            <h2 className="section-title">¿Cómo funciona?</h2>
            <div className="w-16 h-1 bg-vdn-pink mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Línea conectora (solo desktop) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gray-200" />

            {steps.map(({ n, title, desc }) => (
              <div key={n} className="text-center space-y-4 relative">
                <div className="w-20 h-20 rounded-full bg-vdn-blue flex items-center justify-center mx-auto
                                shadow-lg shadow-vdn-blue/30 relative z-10">
                  <span className="font-heading font-black text-white text-2xl">{n}</span>
                </div>
                <h3 className="font-heading font-bold text-vdn-dark text-xl">{title}</h3>
                <p className="text-vdn-gray text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-r from-vdn-bluedk to-vdn-blue rounded-2xl p-10 md:p-14
                          flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="font-heading text-3xl font-black text-white">
                ¿Listo para cotizar tu proyecto?
              </h2>
              <p className="text-blue-100 text-base max-w-lg leading-relaxed">
                Completa 3 pasos y obtén un desglose profesional con precios de materiales
                y mano de obra. Sin registro ni costos.
              </p>
            </div>
            <Link to="/cotizar"
              className="btn-green text-base px-10 py-4 whitespace-nowrap shadow-xl shadow-black/20">
              <FileText size={18} /> Cotizar ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

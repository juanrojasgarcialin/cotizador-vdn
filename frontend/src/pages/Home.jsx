import { Link } from 'react-router-dom'
import { FileText, Network, Camera, Zap, LayoutGrid, Construction, Wrench, ArrowRight, ChevronRight } from 'lucide-react'

/* ── Red de nodos animada SVG ──────────────────────────────────────────── */
function NetworkBg() {
  const nodes = [
    { cx: 80,  cy: 120 }, { cx: 260, cy: 60  }, { cx: 420, cy: 180 },
    { cx: 600, cy: 80  }, { cx: 720, cy: 220 }, { cx: 900, cy: 100 },
    { cx: 150, cy: 320 }, { cx: 360, cy: 340 }, { cx: 540, cy: 280 },
    { cx: 800, cy: 300 }, { cx: 950, cy: 240 }, { cx: 100, cy: 460 },
    { cx: 480, cy: 420 }, { cx: 680, cy: 400 }, { cx: 880, cy: 440 },
  ]
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[1,7],[2,7],[3,8],[4,9],
    [5,10],[6,7],[7,8],[8,9],[9,10],[6,11],[7,12],[8,12],[9,13],[10,14],
    [11,12],[12,13],[13,14],
  ]
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 520"
      preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nodeglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6dbe04" stopOpacity="1" />
          <stop offset="100%" stopColor="#6dbe04" stopOpacity="0" />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#1976d2" strokeWidth="0.8" strokeOpacity="0.6" />
      ))}
      {nodes.map(({ cx, cy }, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="14" fill="url(#nodeglow)" opacity="0.3" />
          <circle cx={cx} cy={cy} r="3" fill="#6dbe04"
            style={{ animation: `pulse-node ${2 + (i % 3) * 0.7}s ease-in-out infinite alternate` }} />
        </g>
      ))}
    </svg>
  )
}

/* ── Fila de servicio horizontal ───────────────────────────────────────── */
const services = [
  { num: '01', Icon: Network,      title: 'Cableado Estructurado', desc: 'Cat5e, Cat6, Cat6a y Fibra Óptica. Materiales certificados Belden, Panduit y Linkedpro.',  accent: '#1565c0' },
  { num: '02', Icon: Camera,       title: 'Cámaras CCTV & IP',     desc: 'Domo, bala, PTZ y fisheye. IP y analógicas, interior/exterior. Hikvision y Dahua.',        accent: '#6dbe04' },
  { num: '03', Icon: Zap,          title: 'Equipos Activos',        desc: 'Switches PoE, NVR/DVR. Configuración e instalación incluida en el presupuesto.',           accent: '#1976d2' },
  { num: '04', Icon: LayoutGrid,   title: 'Patch Panels & Remates', desc: 'Keystones, faceplates y patch cords certificados. Todo compatible entre sí.',              accent: '#6dbe04' },
  { num: '05', Icon: Construction, title: 'Tubería & Canalización', desc: 'PVC, EMT y charola portacable. Instalación limpia con acabados profesionales.',            accent: '#1565c0' },
  { num: '06', Icon: Wrench,       title: 'Mantenimiento',          desc: 'Pólizas preventivas y correctivas para toda tu infraestructura de red activa.',           accent: '#6dbe04' },
]

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO — fondo negro tech con red animada
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060b14 0%, #0d1b2a 50%, #0a1628 100%)' }}>

        {/* Red de nodos */}
        <NetworkBg />

        {/* Líneas de grid diagonal */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '40px 40px' }} />

        {/* Gradiente radial que ilumina la esquina izquierda */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 20% 50%, rgba(21,101,192,0.25) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 w-full py-24 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Columna izquierda */}
            <div className="space-y-8">
              {/* Tag */}
              <div className="inline-flex items-center gap-2 border border-vdn-green/40 rounded-full
                              px-4 py-1.5 bg-vdn-green/10">
                <span className="w-2 h-2 rounded-full bg-vdn-green animate-pulse" />
                <span className="text-vdn-green text-xs font-bold tracking-widest uppercase">
                  Sistema activo — Cotizador profesional
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="font-heading font-black text-white leading-none"
                  style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
                  Infraestructura de red
                </h1>
                <h1 className="font-heading font-black leading-none"
                  style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', color: '#6dbe04' }}>
                  cotizada en minutos.
                </h1>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                Cableado estructurado y CCTV con precios reales de mercado.
                Materiales + mano de obra, desglosados al instante.
                Sin registro, sin costo.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/cotizar"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4
                             text-white font-bold text-sm uppercase tracking-wider rounded-lg
                             transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #6dbe04, #5aaa02)' }}>
                  <FileText size={18} />
                  Iniciar cotización
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/nosotros"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4
                             border border-white/20 text-white/80 hover:text-white hover:border-white/50
                             font-semibold text-sm uppercase tracking-wider rounded-lg transition-all duration-300">
                  Quiénes somos
                </Link>
              </div>

              {/* Métricas inline */}
              <div className="flex gap-8 pt-4 border-t border-white/10">
                {[
                  { v: '25+', l: 'años' },
                  { v: '500+', l: 'proyectos' },
                  { v: '3 pasos', l: 'para cotizar' },
                ].map(({ v, l }) => (
                  <div key={l}>
                    <p className="font-heading font-black text-white text-2xl">{v}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha — panel de cotización */}
            <div className="hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden border border-white/10"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>

                {/* Header del panel */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10"
                  style={{ background: 'rgba(21,101,192,0.3)' }}>
                  <span className="w-3 h-3 rounded-full bg-red-400/60" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <span className="w-3 h-3 rounded-full bg-vdn-green/60" />
                  <span className="ml-3 text-xs text-gray-400 font-mono">cotizacion_preview.vdn</span>
                </div>

                <div className="p-6 space-y-4 font-mono text-sm">
                  <p className="text-gray-500 text-xs">// Ejemplo de cotización generada</p>
                  {[
                    { label: 'cable_cat6_belden',  qty: '4 rollos', total: '$7,400' },
                    { label: 'camara_ip_hikvision', qty: '8 pzas',   total: '$9,600' },
                    { label: 'switch_poe_48p',      qty: '1 pza',    total: '$7,800' },
                    { label: 'mano_de_obra',        qty: 'global',   total: '$3,200' },
                  ].map(({ label, qty, total }) => (
                    <div key={label} className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <p className="text-vdn-green text-xs">{label}</p>
                        <p className="text-gray-500 text-xs">{qty}</p>
                      </div>
                      <span className="text-white font-bold">{total}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 uppercase tracking-wider text-xs">total_estimado</span>
                    <span className="font-heading font-black text-vdn-green text-2xl">$28,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corte diagonal en la parte baja */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: '80px' }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg">
            <polygon fill="#f8fafc" points="0,80 1440,0 1440,80" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SERVICIOS — lista horizontal numerada
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-10">

          {/* Header de sección */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-vdn-green text-xs font-bold uppercase tracking-widest mb-3">
                — Lo que cotizamos
              </p>
              <h2 className="font-heading font-black text-vdn-dark leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                Servicios incluidos<br />en el cotizador
              </h2>
            </div>
            <Link to="/cotizar"
              className="inline-flex items-center gap-2 text-vdn-blue font-semibold text-sm
                         hover:text-vdn-bluedk transition-colors group shrink-0">
              Ver cotizador
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid de servicios 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
            {services.map(({ num, Icon, title, desc, accent }) => (
              <div key={num}
                className="group bg-white hover:bg-vdn-dark transition-all duration-300
                           p-7 md:p-8 flex gap-5 cursor-default">
                <div className="shrink-0 pt-1">
                  <span className="font-heading font-black text-3xl leading-none transition-colors duration-300"
                    style={{ color: '#e2e8f0' }}
                    onMouseEnter={e => e.target.style.color = accent}
                    onMouseLeave={e => e.target.style.color = '#e2e8f0'}>
                    {num}
                  </span>
                </div>
                <div className="space-y-3 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                      style={{ background: `${accent}20` }}>
                      <Icon size={18} style={{ color: accent }}
                        className="group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-heading font-bold text-vdn-dark group-hover:text-white
                                   text-base md:text-lg transition-colors duration-300 leading-tight">
                      {title}
                    </h3>
                  </div>
                  <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed
                                transition-colors duration-300">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS — fondo oscuro, números grandes
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060b14 0%, #0d1b2a 100%)' }}>

        {/* Grid de fondo */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { value: '25', suffix: '+', label: 'Años en el mercado', sub: 'Desde 1999' },
              { value: '500', suffix: '+', label: 'Proyectos entregados', sub: 'En Baja California' },
              { value: '6', suffix: '', label: 'Líneas de servicio', sub: 'Red, CCTV y más' },
              { value: '100', suffix: '%', label: 'Cálculo automático', sub: 'Materiales + labor' },
            ].map(({ value, suffix, label, sub }) => (
              <div key={label} className="px-6 md:px-10 py-4 first:pl-0 last:pr-0 text-center md:text-left">
                <p className="font-heading font-black text-white leading-none mb-1"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  {value}<span className="text-vdn-green">{suffix}</span>
                </p>
                <p className="text-white/80 text-sm font-semibold">{label}</p>
                <p className="text-gray-600 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CÓMO FUNCIONA — pasos con línea conectora
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-10">

          <div className="text-center mb-16">
            <p className="text-vdn-green text-xs font-bold uppercase tracking-widest mb-3">— Proceso</p>
            <h2 className="font-heading font-black text-vdn-dark"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              3 pasos para tu cotización
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Línea horizontal conectora */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-vdn-blue via-vdn-green to-vdn-blue opacity-30" />

            {[
              { n: '01', title: 'Describe el sitio', desc: 'Ingresa nodos, cámaras y distancia promedio al rack. El sistema visualiza tu instalación en tiempo real.' },
              { n: '02', title: 'Selecciona productos', desc: 'Elige marca y estándar de cable. Solo verás productos compatibles entre sí — sin errores de selección.' },
              { n: '03', title: 'Obtén tu presupuesto', desc: 'Materiales y mano de obra calculados al instante. Desglose profesional listo para imprimir o compartir.' },
            ].map(({ n, title, desc }, i) => (
              <div key={n} className="relative flex flex-col items-center md:items-start px-8 py-4">
                {/* Número grande de fondo */}
                <div className="absolute top-0 left-4 font-heading font-black text-8xl text-gray-50 select-none
                                pointer-events-none leading-none z-0" aria-hidden>
                  {n}
                </div>
                <div className="relative z-10 space-y-4 text-center md:text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black
                                  text-white text-sm mx-auto md:mx-0"
                    style={{ background: i === 1 ? '#6dbe04' : '#1565c0' }}>
                    {n}
                  </div>
                  <h3 className="font-heading font-bold text-vdn-dark text-xl mt-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA FINAL — full bleed oscuro
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24"
        style={{ background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #0a7a1a 100%)' }}>

        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-4xl mx-auto px-5 md:px-10 text-center space-y-8">
          <h2 className="font-heading font-black text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            ¿Listo para cotizar<br />
            <span className="text-vdn-green">tu proyecto?</span>
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-xl mx-auto">
            Completa 3 pasos y obtén un desglose profesional con precios de materiales
            y mano de obra. Sin registro ni costos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cotizar"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5
                         font-bold text-base uppercase tracking-wider rounded-xl
                         transition-all duration-300 text-white shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #6dbe04, #5aaa02)' }}>
              <FileText size={20} />
              Cotizar ahora — es gratis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contacto"
              className="inline-flex items-center justify-center gap-2 px-10 py-5
                         border-2 border-white/30 text-white hover:bg-white/10
                         font-semibold text-base uppercase tracking-wider rounded-xl transition-all duration-300">
              Hablar con un experto
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

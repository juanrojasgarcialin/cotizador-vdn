import { Link } from 'react-router-dom'
import { WaveDivider } from '../components/Layout'
import { Target, Eye, Users, Award, Cpu, Shield, Headphones, Briefcase } from 'lucide-react'

function StatBox({ value, suffix = '', label }) {
  return (
    <div className="text-center p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
      <p className="font-heading text-4xl font-black text-white">
        {value}<span className="text-vdn-green">{suffix}</span>
      </p>
      <p className="text-blue-200 text-sm mt-1 uppercase tracking-wide">{label}</p>
    </div>
  )
}

function ValueCard({ Icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md
                    transition-shadow group">
      <div className="w-12 h-12 rounded-lg bg-vdn-blue/10 flex items-center justify-center mb-4
                      group-hover:bg-vdn-blue group-hover:text-white transition-all duration-300">
        <Icon size={22} className="text-vdn-blue group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-heading font-bold text-vdn-dark text-lg mb-2">{title}</h3>
      <p className="text-vdn-gray text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function TeamCard({ role, desc, icon: Icon }) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-vdn-blue flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <h4 className="font-heading font-bold text-vdn-dark text-sm">{role}</h4>
        <p className="text-vdn-gray text-xs leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-vdn-bluedk to-vdn-blue py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-blue-200 text-xs uppercase tracking-widest mb-2">Voice & Data Network</p>
          <h1 className="font-heading text-4xl font-black text-white mb-3">Quiénes somos</h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            Más de 25 años conectando empresas en Baja California con soluciones de telecomunicaciones
            confiables, innovadoras y a la medida.
          </p>
        </div>
        <WaveDivider fill="#f9fafb" />
      </div>

      {/* ── Historia ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-5">
            <span className="text-vdn-blue text-xs font-bold uppercase tracking-widest">Nuestra historia</span>
            <h2 className="font-heading text-3xl font-bold text-vdn-dark leading-tight">
              Desde 1999 construyendo<br />
              <span className="text-vdn-blue">infraestructura que conecta</span>
            </h2>
            <div className="w-14 h-1 bg-vdn-pink rounded-full" />
            <p className="text-vdn-gray leading-relaxed">
              Voice &amp; Data Network nació en 1999 ofreciendo servicios de cómputo a pequeñas empresas
              y usuarios particulares. Conforme crecía la confianza de nuestros clientes, expandimos
              nuestra oferta hacia telefonía, conmutadores analógicos, cámaras de seguridad, sistemas
              de alarmas y control de acceso.
            </p>
            <p className="text-vdn-gray leading-relaxed">
              En el año 2000 nos constituimos formalmente como empresa, lo que nos permitió escalar
              operaciones y atender a clientes corporativos de mayor envergadura. Hoy somos una empresa
              de telecomunicaciones consolidada con sede en Tijuana, B.C., especializada en cableado
              estructurado, redes y videovigilancia.
            </p>
          </div>

          {/* Timeline visual */}
          <div className="space-y-0">
            {[
              { year: '1999', label: 'Inicio de operaciones', desc: 'Servicios de cómputo para pequeñas empresas.' },
              { year: '2000', label: 'Constitución legal', desc: 'Registro formal y expansión a clientes corporativos.' },
              { year: '2005', label: 'Expansión de servicios', desc: 'Integración de CCTV, telefonía IP y control de acceso.' },
              { year: '2015', label: 'Liderazgo regional', desc: 'Referente en cableado estructurado en Baja California.' },
              { year: 'Hoy',  label: '+25 años de experiencia', desc: 'Más de 500 proyectos entregados en la región.' },
            ].map(({ year, label, desc }, i, arr) => (
              <div key={year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-vdn-blue flex items-center justify-center
                                  shrink-0 text-white font-heading font-black text-xs z-10">
                    {i === arr.length - 1 ? '★' : year.slice(-2)}
                  </div>
                  {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-vdn-blue/20 my-1" />}
                </div>
                <div className="pb-6">
                  <p className="text-vdn-blue text-xs font-bold uppercase tracking-wider">{year}</p>
                  <p className="font-heading font-bold text-vdn-dark text-sm">{label}</p>
                  <p className="text-vdn-gray text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Estadísticas ── */}
      <section className="bg-gradient-to-r from-vdn-bluedk to-vdn-blue py-16 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatBox value="25"  suffix="+" label="Años en el mercado" />
            <StatBox value="500" suffix="+" label="Proyectos entregados" />
            <StatBox value="6"          label="Líneas de servicio" />
            <StatBox value="100" suffix="%" label="Compromiso con calidad" />
          </div>
        </div>
        <WaveDivider fill="#ffffff" />
      </section>

      {/* ── Misión y Visión ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-vdn-blue text-xs font-bold uppercase tracking-widest">Propósito</span>
            <h2 className="font-heading text-3xl font-bold text-vdn-dark">Misión y Visión</h2>
            <div className="w-14 h-1 bg-vdn-pink mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-vdn-bluedk to-vdn-blue p-8 text-white">
              <div className="absolute top-4 right-4 opacity-10">
                <Target size={80} />
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
                <Target size={22} className="text-white" />
              </div>
              <h3 className="font-heading font-black text-2xl mb-3">Misión</h3>
              <p className="text-blue-100 leading-relaxed">
                Conectar a las personas y empresas a través de soluciones de tecnologías innovadoras,
                manteniendo el compromiso con la calidad del servicio y la optimización eficiente
                de la comunicación.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-950 p-8 text-white">
              <div className="absolute top-4 right-4 opacity-10">
                <Eye size={80} />
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
                <Eye size={22} className="text-white" />
              </div>
              <h3 className="font-heading font-black text-2xl mb-3">Visión</h3>
              <p className="text-gray-300 leading-relaxed">
                Convertirnos en líderes en soluciones de telecomunicaciones, reconocidos por la
                implementación de tecnología innovadora, competitividad en el mercado y cobertura
                integral de garantía en todos nuestros servicios y productos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-vdn-blue text-xs font-bold uppercase tracking-widest">Lo que nos define</span>
            <h2 className="font-heading text-3xl font-bold text-vdn-dark">Nuestros valores</h2>
            <div className="w-14 h-1 bg-vdn-pink mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ValueCard Icon={Award}      title="Calidad"      desc="Materiales y mano de obra certificados en cada proyecto que entregamos." />
            <ValueCard Icon={Cpu}        title="Innovación"   desc="Adoptamos las tecnologías más recientes para dar soluciones futuro-proof." />
            <ValueCard Icon={Shield}     title="Confiabilidad" desc="25 años de trayectoria respaldan nuestra capacidad de cumplir compromisos." />
            <ValueCard Icon={Headphones} title="Servicio"     desc="Atención personalizada antes, durante y después de cada proyecto." />
          </div>
        </div>
      </section>

      {/* ── Equipo ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-vdn-blue text-xs font-bold uppercase tracking-widest">Las personas detrás</span>
            <h2 className="font-heading text-3xl font-bold text-vdn-dark">Nuestro equipo</h2>
            <div className="w-14 h-1 bg-vdn-pink mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <TeamCard icon={Cpu}       role="Ingenieros de proyecto"  desc="Analizan cada proyecto del cliente, identifican problemáticas y proponen soluciones técnicas innovadoras." />
            <TeamCard icon={Users}     role="Integradores"            desc="Ejecutan los proyectos bajo supervisión de ingeniería y sugieren mejoras durante la instalación." />
            <TeamCard icon={Briefcase} role="Personal administrativo" desc="Gestionan logística, compras, contabilidad y ventas para garantizar operaciones fluidas." />
            <TeamCard icon={Award}     role="Practicantes"            desc="Apoyamos a estudiantes universitarios con prácticas profesionales en un entorno real de trabajo." />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-r from-vdn-bluedk to-vdn-blue rounded-2xl p-10 md:p-14
                          flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="font-heading text-3xl font-black text-white">¿Listo para trabajar juntos?</h2>
              <p className="text-blue-100 text-base max-w-lg leading-relaxed">
                Contáctanos o genera una cotización en minutos con nuestro cotizador profesional.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link to="/cotizar" className="btn-green text-base px-8 py-4 shadow-xl shadow-black/20">
                Cotizar proyecto
              </Link>
              <Link to="/contacto" className="btn-outline text-base px-8 py-4">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

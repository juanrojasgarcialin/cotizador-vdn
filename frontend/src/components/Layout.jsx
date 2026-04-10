import { Link, useLocation } from 'react-router-dom'

/* ── Onda SVG divisora ─────────────────────────────────────────────────── */
export function WaveDivider({ fill = '#ffffff', flip = false }) {
  return (
    <div className={`w-full leading-none ${flip ? 'rotate-180' : ''}`} style={{ marginBottom: '-1px' }}>
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        className="w-full h-12 md:h-16 block">
        <path fill={fill}
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
      </svg>
    </div>
  )
}

const navLinks = [
  { to: '/',          label: 'Inicio'    },
  { to: '/nosotros',  label: 'Nosotros'  },
  { to: '/cotizar',   label: 'Cotizador' },
  { to: '/contacto',  label: 'Contacto'  },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col font-body">

      {/* ── Barra superior de contacto ──────────────────────────────── */}
      <div className="bg-vdn-black text-gray-400 text-xs py-2 hidden md:block">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <span>Lun–Vie 9:00–18:00 &nbsp;|&nbsp; Sáb 10:00–14:00</span>
          <div className="flex items-center gap-6">
            <span>📞 664-185-3947</span>
            <span>💬 WhatsApp: 664-302-5511</span>
            <a href="mailto:contacto@vdn.com.mx" className="hover:text-white transition-colors">
              contacto@vdn.com.mx
            </a>
          </div>
        </div>
      </div>

      {/* ── Navbar principal ────────────────────────────────────────── */}
      <header className="bg-vdn-blue shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo-VDN.png" alt="VDN Logo" className="h-10 w-auto object-contain" />
              <div className="leading-tight">
                <p className="text-white font-heading font-bold text-sm tracking-wide">
                  Voice &amp; D<span className="text-vdn-green">@</span>ta Network
                </p>
                <p className="text-blue-200 text-xs">Cotizador de Infraestructura</p>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center">
              {navLinks.map(({ to, label }) => {
                const active = pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-5 text-sm font-semibold tracking-wide transition-colors border-b-3
                      ${active
                        ? 'text-white bg-vdn-bluedk border-b-4 border-vdn-green'
                        : 'text-blue-100 hover:text-white hover:bg-vdn-bluedk border-b-4 border-transparent'
                      }`}
                  >
                    {label}
                  </Link>
                )
              })}
              <Link
                to="/cotizar"
                className="ml-3 px-4 py-2 bg-vdn-green text-white text-sm font-bold rounded
                           uppercase tracking-wide hover:bg-vdn-greendk transition-colors shadow"
              >
                Cotizar ahora
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Contenido principal ─────────────────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-vdn-black text-gray-400">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-VDN.png" alt="VDN Logo" className="h-8 w-auto object-contain" />
              <span className="text-white font-heading font-bold text-sm">
                Voice &amp; D<span className="text-vdn-green">@</span>ta Network
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Empresa de telecomunicaciones establecida en Tijuana, B.C. desde 2001.
              Especialistas en cableado estructurado, redes y videovigilancia.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Servicios</h4>
            {['Cableado Estructurado', 'Cámaras CCTV', 'Control de Acceso', 'Telefonía IP', 'Mantenimiento'].map(s => (
              <p key={s} className="text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vdn-green shrink-0" />
                {s}
              </p>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <p className="text-sm">📞 664-185-3947</p>
            <p className="text-sm">💬 664-302-5511</p>
            <p className="text-sm">✉️ contacto@vdn.com.mx</p>
            <p className="text-sm leading-relaxed">
              📍 Calzada Tecnológico 817 Local 4<br />
              Otay Universidad, Tijuana B.C.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 py-4">
          <p className="text-center text-xs text-gray-600">
            © {new Date().getFullYear()} Voice &amp; Data Network — Cotizador de Infraestructura v1.0
          </p>
        </div>
      </footer>
    </div>
  )
}

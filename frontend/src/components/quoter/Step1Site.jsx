import { useState } from 'react'
import { Info } from 'lucide-react'

function SiteIllustration({ nodes, cameras, distance }) {
  const n    = Math.min(parseInt(nodes)   || 0, 8)
  const c    = Math.min(parseInt(cameras) || 0, 6)
  const dist = parseFloat(distance) || 0

  const nodePositions = Array.from({ length: n }, (_, i) => {
    const angle = (i / Math.max(n, 1)) * 2 * Math.PI - Math.PI / 2
    return { x: 200 + Math.cos(angle) * 125, y: 165 + Math.sin(angle) * 105 }
  })
  const camPositions = Array.from({ length: c }, (_, i) => {
    const angle = (i / Math.max(c, 1)) * 2 * Math.PI - Math.PI / 4
    return { x: 200 + Math.cos(angle) * 150, y: 165 + Math.sin(angle) * 125 }
  })

  return (
    <svg viewBox="0 0 400 330" className="w-full" aria-hidden>
      <rect width="400" height="330" fill="#eff6ff" rx="12" />
      {nodePositions.map((pos, i) => (
        <line key={`nl-${i}`} x1="200" y1="165" x2={pos.x} y2={pos.y}
          stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="5 3" />
      ))}
      {camPositions.map((pos, i) => (
        <line key={`cl-${i}`} x1="200" y1="165" x2={pos.x} y2={pos.y}
          stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="5 3" />
      ))}
      {nodePositions[0] && dist > 0 && (
        <>
          <line x1="200" y1="165" x2={nodePositions[0].x} y2={nodePositions[0].y}
            stroke="#3498db" strokeWidth="2.5" />
          <text x={(200 + nodePositions[0].x) / 2 + 8} y={(165 + nodePositions[0].y) / 2 - 5}
            fontSize="11" fill="#227bc3" fontWeight="bold">{dist}m</text>
        </>
      )}
      {/* Rack */}
      <rect x="178" y="143" width="44" height="44" rx="6" fill="#3498db" />
      <rect x="183" y="149" width="34" height="4" rx="1" fill="#bfdbfe" />
      <rect x="183" y="156" width="34" height="4" rx="1" fill="#bfdbfe" />
      <rect x="183" y="163" width="34" height="4" rx="1" fill="#93c5fd" />
      <rect x="183" y="170" width="34" height="4" rx="1" fill="#93c5fd" />
      <circle cx="208" cy="180" r="2.5" fill="#6dbe04" />
      <text x="200" y="198" textAnchor="middle" fontSize="9" fill="#227bc3" fontWeight="bold">RACK</text>

      {nodePositions.map((pos, i) => (
        <g key={`n-${i}`}>
          <rect x={pos.x-12} y={pos.y-9} width="24" height="18" rx="3" fill="#dbeafe" stroke="#3498db" strokeWidth="1.5"/>
          <rect x={pos.x-10} y={pos.y-7} width="20" height="11" rx="1" fill="#93c5fd"/>
          <rect x={pos.x-5}  y={pos.y+5} width="10" height="2" rx="1" fill="#3498db"/>
        </g>
      ))}
      {camPositions.map((pos, i) => (
        <g key={`c-${i}`}>
          <circle cx={pos.x} cy={pos.y} r="11" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5"/>
          <circle cx={pos.x} cy={pos.y} r="5" fill="#7c3aed"/>
          <circle cx={pos.x} cy={pos.y} r="2" fill="white"/>
        </g>
      ))}
      {/* Leyenda */}
      <g transform="translate(12,295)">
        <rect width="12" height="10" rx="2" fill="#dbeafe" stroke="#3498db" strokeWidth="1"/>
        <text x="16" y="9" fontSize="10" fill="#374151">Nodo de red</text>
        <circle cx="90" cy="5" r="6" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1"/>
        <text x="99" y="9" fontSize="10" fill="#374151">Cámara</text>
        <rect x="162" width="12" height="10" rx="2" fill="#3498db"/>
        <text x="178" y="9" fontSize="10" fill="#374151">Rack/Site</text>
      </g>
    </svg>
  )
}

function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button type="button" className="text-gray-400 hover:text-vdn-blue transition-colors"
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <Info size={14} />
      </button>
      {open && (
        <span className="absolute left-6 top-0 z-20 w-60 bg-vdn-dark text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed">
          {text}
        </span>
      )}
    </span>
  )
}

export default function Step1Site({ data, onChange }) {
  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value })

  const totalPoints = (parseInt(data.num_nodes) || 0) + (parseInt(data.num_cameras) || 0)
  const meters = totalPoints * (parseFloat(data.avg_distance_m) || 0) * 1.10
  const reels  = meters > 0 ? Math.ceil(meters / 305) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">

          {/* Nodos */}
          <div className="card border-l-4 border-l-vdn-blue space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🖥️</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-vdn-dark">Nodos de Red</span>
                  <InfoTooltip text="Un nodo de red es cualquier dispositivo con conexión de datos por cable: PC, impresora, teléfono IP, punto de acceso WiFi. Cada nodo requiere 1 salida RJ-45 en la pared." />
                </div>
                <p className="text-xs text-vdn-gray">PC · Impresora · Teléfono IP · AP WiFi</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-vdn-blue leading-relaxed">
              <strong>¿Cómo contar?</strong> Recorre cada área y cuenta los equipos que necesitan red.
              Agrega 15-20% extra para crecimiento futuro.
            </div>
            <input type="number" min="1" className="input font-semibold text-lg"
              placeholder="Ej. 20" value={data.num_nodes} onChange={set('num_nodes')} />
          </div>

          {/* Cámaras */}
          <div className="card border-l-4 border-l-purple-500 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📷</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-vdn-dark">Cámaras CCTV</span>
                  <InfoTooltip text="Las cámaras IP se conectan por cable UTP igual que los nodos. Consumen energía PoE a través del mismo cable. Las analógicas usan cable coaxial independiente." />
                </div>
                <p className="text-xs text-vdn-gray">IP (PoE) · Analógicas · PTZ · Domo · Bala</p>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-xs text-purple-700 leading-relaxed">
              <strong>Tip:</strong> Las cámaras IP se alimentan por PoE desde el mismo switch de red.
              Planifica: entradas, pasillos, estacionamientos y zonas críticas.
            </div>
            <input type="number" min="0" className="input font-semibold text-lg"
              placeholder="Ej. 8" value={data.num_cameras} onChange={set('num_cameras')} />
          </div>

          {/* Distancia */}
          <div className="card border-l-4 border-l-vdn-green space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📐</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-vdn-dark">Distancia Promedio</span>
                  <InfoTooltip text="Mide desde el rack/cuarto de telecomunicaciones hasta cada punto, siguiendo la ruta real del cable (por plafón, paredes y pasillos), no en línea recta." />
                </div>
                <p className="text-xs text-vdn-gray">Del rack a cada punto, en metros</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-xs text-green-700 leading-relaxed">
              <strong>Cálculo práctico:</strong> suma las distancias de todos los puntos y divídelas
              entre el total. El estándar TIA/EIA limita el canal a <strong>90 metros</strong>.
            </div>
            <div className="flex gap-3 items-center">
              <input type="number" min="1" step="0.5" className="input font-semibold text-lg flex-1"
                placeholder="Ej. 30" value={data.avg_distance_m} onChange={set('avg_distance_m')} />
              <span className="text-vdn-gray font-semibold text-sm">metros</span>
            </div>
            {parseFloat(data.avg_distance_m) > 90 && (
              <div className="text-orange-700 text-xs bg-orange-50 border border-orange-200 p-2 rounded-lg">
                ⚠️ Distancia superior a 90m. Considera un switch intermedio o fibra óptica.
              </div>
            )}
          </div>
        </div>

        {/* Ilustración + estimado */}
        <div className="space-y-4">
          <div className="card p-3 bg-blue-50 border-blue-100">
            <p className="text-xs text-center text-vdn-blue font-semibold mb-2 uppercase tracking-wide">
              Vista del sitio en tiempo real
            </p>
            <SiteIllustration nodes={data.num_nodes} cameras={data.num_cameras} distance={data.avg_distance_m} />
          </div>

          {totalPoints > 0 && parseFloat(data.avg_distance_m) > 0 && (
            <div className="bg-vdn-blue rounded-xl p-5 space-y-3">
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Estimado de cable</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-vdn-bluedk rounded-lg p-3 text-center">
                  <p className="font-heading text-3xl font-black text-white">{Math.round(meters)}</p>
                  <p className="text-blue-300 text-xs">metros de cable</p>
                </div>
                <div className="bg-vdn-bluedk rounded-lg p-3 text-center">
                  <p className="font-heading text-3xl font-black text-vdn-green">{reels}</p>
                  <p className="text-blue-300 text-xs">caja{reels !== 1 ? 's' : ''} de 305m</p>
                </div>
              </div>
              <p className="text-blue-300 text-xs">
                {totalPoints} puntos × {data.avg_distance_m}m × 1.10 de holgura
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="card">
        <h3 className="font-heading font-bold text-vdn-dark mb-4">
          Datos del cliente <span className="text-xs text-vdn-gray font-sans font-normal">(opcional)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Nombre del cliente</label>
            <input className="input" placeholder="Empresa o persona" value={data.client_name} onChange={set('client_name')} />
          </div>
          <div>
            <label className="label">Correo electrónico</label>
            <input className="input" type="email" placeholder="correo@empresa.com" value={data.client_email} onChange={set('client_email')} />
          </div>
          <div>
            <label className="label">Nombre del proyecto</label>
            <input className="input" placeholder="Ej. Piso 3 — Oficinas" value={data.project_name} onChange={set('project_name')} />
          </div>
        </div>
      </div>
    </div>
  )
}

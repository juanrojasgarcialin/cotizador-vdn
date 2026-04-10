import { useState } from 'react'
import { WaveDivider } from '../components/Layout'
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, CheckCircle } from 'lucide-react'

function ContactCard({ Icon, title, children, accent }) {
  return (
    <div className={`bg-white rounded-xl p-6 border-l-4 shadow-sm ${accent}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-vdn-blue/10 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-vdn-blue" />
        </div>
        <div>
          <p className="font-heading font-bold text-vdn-dark text-sm mb-1">{title}</p>
          <div className="text-vdn-gray text-sm space-y-0.5">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    /* Simulación de envío — reemplazar con API real */
    setTimeout(() => { setSending(false); setSent(true) }, 1200)
  }

  return (
    <div>
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-vdn-bluedk to-vdn-blue py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-blue-200 text-xs uppercase tracking-widest mb-2">Voice & Data Network</p>
          <h1 className="font-heading text-4xl font-black text-white mb-3">Contacto</h1>
          <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
            ¿Tienes un proyecto en mente? Escríbenos o llámanos. Estamos en Tijuana, B.C. y atendemos
            toda la región de Baja California.
          </p>
        </div>
        <WaveDivider fill="#f9fafb" />
      </div>

      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

            {/* ── Formulario ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading font-bold text-vdn-dark text-2xl mb-1">Envíanos un mensaje</h2>
              <p className="text-vdn-gray text-sm mb-6">Te respondemos en menos de 24 horas hábiles.</p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-vdn-green/10 flex items-center justify-center">
                    <CheckCircle size={36} className="text-vdn-green" />
                  </div>
                  <h3 className="font-heading font-bold text-vdn-dark text-xl">¡Mensaje enviado!</h3>
                  <p className="text-vdn-gray text-sm max-w-xs">
                    Gracias por contactarnos. Uno de nuestros ingenieros se pondrá en contacto contigo pronto.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }) }}
                    className="btn-blue mt-2">
                    Nuevo mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Nombre *</label>
                      <input name="name" value={form.name} onChange={handleChange} required
                        className="input" placeholder="Tu nombre completo" />
                    </div>
                    <div>
                      <label className="label">Teléfono</label>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        className="input" placeholder="664-xxx-xxxx" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Correo electrónico *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                      className="input" placeholder="tu@empresa.com" />
                  </div>
                  <div>
                    <label className="label">Mensaje *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required
                      rows={5} className="input resize-none"
                      placeholder="Cuéntanos sobre tu proyecto: número de nodos, ubicación, tipo de instalación..." />
                  </div>
                  <button type="submit" disabled={sending} className="btn-green w-full justify-center">
                    {sending
                      ? <span className="animate-pulse">Enviando...</span>
                      : <><Send size={15} /> Enviar mensaje</>
                    }
                  </button>
                  <p className="text-xs text-vdn-gray text-center">
                    O contáctanos directamente por WhatsApp al{' '}
                    <a href="https://wa.me/526643025511" target="_blank" rel="noreferrer"
                      className="text-vdn-green font-semibold hover:underline">
                      664-302-5511
                    </a>
                  </p>
                </form>
              )}
            </div>

            {/* ── Info de contacto ── */}
            <div className="space-y-4">
              <ContactCard Icon={MapPin} title="Dirección" accent="border-l-vdn-blue">
                <p>Calzada Tecnológico 817, Local 4</p>
                <p>Otay Universidad</p>
                <p>Tijuana, Baja California</p>
              </ContactCard>

              <ContactCard Icon={Phone} title="Teléfono" accent="border-l-vdn-blue">
                <p>
                  <a href="tel:6641853947" className="hover:text-vdn-blue transition-colors">
                    664-185-3947
                  </a>
                </p>
              </ContactCard>

              <ContactCard Icon={MessageCircle} title="WhatsApp" accent="border-l-vdn-green">
                <p>
                  <a href="https://wa.me/526643025511" target="_blank" rel="noreferrer"
                    className="hover:text-vdn-green transition-colors font-medium">
                    664-302-5511
                  </a>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Respuesta rápida por WhatsApp</p>
              </ContactCard>

              <ContactCard Icon={Mail} title="Correo electrónico" accent="border-l-vdn-pink">
                <p>
                  <a href="mailto:contacto@vdn.com.mx" className="hover:text-vdn-blue transition-colors">
                    contacto@vdn.com.mx
                  </a>
                </p>
              </ContactCard>

              <ContactCard Icon={Clock} title="Horario de atención" accent="border-l-vdn-blue">
                <p>Lunes – Viernes: 9:00 – 18:00</p>
                <p>Sábado: 10:00 – 14:00</p>
                <p className="text-gray-400">Domingo: Cerrado</p>
              </ContactCard>

              {/* Mapa embed */}
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 h-48">
                <iframe
                  title="Ubicación VDN"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3360.0!2d-116.934!3d32.523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDMxJzIyLjgiTiAxMTbCsDU2JzAyLjQiVw!5e0!3m2!1ses!2smx!4v1"
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen="" loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

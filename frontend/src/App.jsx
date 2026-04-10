import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import QuoterPage from './pages/QuoterPage'
import AdminPage from './pages/AdminPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/nosotros"  element={<AboutPage />} />
        <Route path="/cotizar"   element={<QuoterPage />} />
        <Route path="/contacto"  element={<ContactPage />} />
        <Route path="/admin"     element={<AdminPage />} />
      </Routes>
    </Layout>
  )
}

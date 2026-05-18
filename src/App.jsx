import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import About from './pages/About'
import CustomOrder from './components/CustomOrder'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'oklch(0.15 0 0)',
            color: 'oklch(0.97 0 0)',
            border: '1px solid oklch(0.25 0 0)',
          },
          success: {
            iconTheme: {
              primary: 'oklch(0.7 0.17 162)',
              secondary: 'oklch(0.07 0 0)',
            },
          },
        }}
      />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/custom_build" element={<CustomOrder />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default App

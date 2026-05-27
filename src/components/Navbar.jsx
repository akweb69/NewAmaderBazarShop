import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineMenuAlt3, HiX, HiSearch, HiHome,
  HiShoppingBag, HiLightningBolt, HiCube,
  HiInformationCircle, HiMail,
} from 'react-icons/hi'
import {
  BsBag, BsBagFill, BsHeart, BsHeartFill,
  BsPerson, BsPersonFill, BsCamera,
} from 'react-icons/bs'
import { RiFireFill } from 'react-icons/ri'
import { MdOutlineLocalShipping } from 'react-icons/md'
import { IoBookSharp } from "react-icons/io5";


// import logo from "../assets/logo/image-removebg-preview (6).png"
import useNavbarData from '../NewResellar/Hooks/useNavbarData'

const navLinks = [
  { name: 'Home', path: '/', Icon: HiHome },
  { name: 'COD Products', path: '/cod_products', Icon: MdOutlineLocalShipping },
  { name: 'Emergency Order', path: '/emergency_order', Icon: HiLightningBolt },
  { name: 'Blogs', path: '/blogs', Icon: IoBookSharp },
  { name: 'About', path: '/about', Icon: HiInformationCircle },
  { name: 'Contact', path: '/contact', Icon: HiMail },
]

// ── Animated fire dot ─────────────────────────────────────────────────────────
const FireDot = () => (
  <motion.span
    className="inline-flex text-green-400 ml-1"
    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 1.4, repeat: Infinity }}
  >
    <RiFireFill size={9} />
  </motion.span>
)

// ── Glow Icon Button ──────────────────────────────────────────────────────────
const GlowBtn = ({ IconOutline, IconFilled, to, onClick, label, badge, active }) => {
  const [hovered, setHovered] = useState(false)
  const Icon = hovered || active ? IconFilled : IconOutline
  const inner = (
    <motion.span
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="relative w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer
        bg-white/[0.08] border border-green-400/20 text-white/80
        hover:bg-green-500/20 hover:border-green-400/50 hover:text-green-300
        transition-colors duration-200"
      aria-label={label}
    >
      {/* Glow behind */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute inset-0 rounded-2xl bg-green-500/15 blur-sm"
          />
        )}
      </AnimatePresence>
      <Icon size={19} className="relative z-10" />
      {badge > 0 && (
        <motion.span
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full
            bg-gradient-to-br from-green-400 to-teal-500
            text-white text-[9px] font-black flex items-center justify-center
            shadow-lg shadow-green-500/40 border border-green-300/30 z-20"
        >
          {badge > 9 ? '9+' : badge}
        </motion.span>
      )}
    </motion.span>
  )
  if (to) return <Link to={to}>{inner}</Link>
  return <button onClick={onClick}>{inner}</button>
}

// ── Search Bar ────────────────────────────────────────────────────────────────
const SearchBar = ({ query, setQuery, onSubmit, onCamera, fileRef, className = '' }) => (
  <form onSubmit={onSubmit}
    className={`flex items-center bg-white/[0.1] border border-green-400/25 rounded-2xl
      backdrop-blur-sm overflow-hidden
      focus-within:border-green-400/60 focus-within:bg-white/[0.14]
      focus-within:shadow-lg focus-within:shadow-green-500/15
      transition-all duration-300 ${className}`}
  >
    <HiSearch size={17} className="ml-4 text-green-300/60 flex-shrink-0" />
    <input
      type="text"
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search Product…"
      className="flex-1 px-3 py-2.5 bg-transparent text-white text-sm
        placeholder-white/30 outline-none min-w-0"
    />
    {query && (
      <motion.button type="button" initial={{ scale: 0 }} animate={{ scale: 1 }}
        onClick={() => setQuery('')}
        className="mr-1 w-5 h-5 rounded-full bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors">
        <HiX size={11} />
      </motion.button>
    )}
    {/* Divider */}
    <span className="w-px h-5 bg-green-400/20 flex-shrink-0 mx-1" />
    {/* Camera */}
    <motion.button
      type="button"
      onClick={() => fileRef.current?.click()}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      className="w-9 h-9 mr-1 rounded-xl bg-green-500/20 border border-green-400/20
        text-green-300 hover:bg-green-500/35 hover:text-green-200
        flex items-center justify-center transition-all duration-200 flex-shrink-0"
      aria-label="Image search"
    >
      <BsCamera size={15} />
    </motion.button>
    <input ref={fileRef} type="file" accept="image/*" className="hidden"
      onChange={e => { const f = e.target.files?.[0]; if (f) console.log('Img search:', f.name) }} />
  </form>
)

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const [cartCount] = useState(3)   // replace with real cart state
  const [wishCount] = useState(1)   // replace with real wishlist state
  const location = useLocation()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const { logo, logoLoading } = useNavbarData()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  const handleSearch = e => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={` z-50 transition-all duration-300
          ${scrolled
            ? 'bg-[#0c0400]/90 backdrop-blur-2xl shadow-xl shadow-green-500/10 border-b border-green-500/15'
            : 'bg-gradient-to-b from-[#0c0400] to-[#0c0400]/95'
          }`}
      >


        <div className="max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between gap-3 md:gap-5 h-[64px] lg:h-[72px]">

            {/* ══ LEFT: Logo ══ */}
            <Link to="/" className="flex-shrink-0">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="relative">
                {/* Glow behind logo */}
                <div className="absolute inset-0 blur-xl bg-green-500/20 rounded-full scale-150 pointer-events-none" />
                <img
                  src={logo[0]?.logo?.logo}
                  alt="AmaderBazarShop"
                  className="relative w-[110px] sm:w-[130px] md:w-[150px] h-auto object-contain drop-shadow-[0_0_12px_rgba(249,115,22,0.35)]"
                />
              </motion.div>
            </Link>

            {/* ══ CENTER: Search (desktop) ══ */}
            <SearchBar
              query={query} setQuery={setQuery}
              onSubmit={handleSearch} fileRef={fileRef}
              className="hidden md:flex flex-1 max-w-[500px] xl:max-w-[560px]"
            />

            {/* ══ RIGHT: Icons (desktop) ══ */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-2 flex-shrink-0">
              <GlowBtn IconOutline={BsBag} IconFilled={BsBagFill} to="/cart" label="Cart" badge={cartCount} />
              <GlowBtn IconOutline={BsHeart} IconFilled={BsHeartFill} to="/wishlist" label="Wishlist" badge={wishCount} />
              <GlowBtn IconOutline={BsPerson} IconFilled={BsPersonFill} to="/account" label="Account" />

              {/* CTA */}
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="ml-1">
                <Link to="/cod_products"
                  className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl
                    bg-gradient-to-r from-green-500 to-green-600
                    text-white text-[13px] font-bold tracking-wide
                    shadow-lg shadow-green-500/30 hover:shadow-green-500/50
                    border border-green-400/30 transition-all duration-200 overflow-hidden group">
                  {/* Shimmer */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <HiShoppingBag size={15} className="relative z-10 flex-shrink-0" />
                  <span className="relative z-10 hidden lg:inline">Shop Now</span>
                </Link>
              </motion.div>
            </div>

            {/* ══ MOBILE: Cart + Hamburger ══ */}
            <div className="flex items-center gap-1.5 md:hidden flex-shrink-0">
              <GlowBtn IconOutline={BsBag} IconFilled={BsBagFill} to="/cart" label="Cart" badge={cartCount} />
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-green-400/20
                  text-white/80 hover:bg-green-500/20 hover:text-green-300 hover:border-green-400/50
                  flex items-center justify-center transition-all duration-200"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen
                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><HiX size={20} /></motion.span>
                    : <motion.span key="hm" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><HiOutlineMenuAlt3 size={20} /></motion.span>
                  }
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>





        {/* ══ MOBILE MENU ══ */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden border-t border-green-500/15 bg-[#0c0400]/98 backdrop-blur-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">

                {/* Mobile Search */}
                <SearchBar
                  query={query} setQuery={setQuery}
                  onSubmit={handleSearch} fileRef={fileRef}
                  className="flex"
                />

                {/* Nav links */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {navLinks.map(({ name, path, Icon }, i) => {
                    const isActive = location.pathname === path
                    return (
                      <motion.div key={path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}>
                        <Link to={path}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200
                            ${isActive
                              ? 'bg-green-500/20 text-green-400 border border-green-500/25'
                              : 'text-white/55 bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:text-white/80'
                            }`}>
                          <Icon size={15} className="flex-shrink-0" />
                          <span className="truncate">{name}</span>
                          {path === '/emergency_order' && <FireDot />}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Mobile icons + CTA */}
                <div className="flex items-center gap-2 pt-1 pb-1">
                  <GlowBtn IconOutline={BsHeart} IconFilled={BsHeartFill} to="/wishlist" label="Wishlist" badge={wishCount} />
                  <GlowBtn IconOutline={BsPerson} IconFilled={BsPersonFill} to="/account" label="Account" />
                  <Link to="/cod_products"
                    className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl
                      bg-gradient-to-r from-green-500 to-green-600 text-white text-[13px] font-bold
                      shadow-lg shadow-green-500/30 border border-green-400/30 transition-all hover:shadow-green-500/50">
                    <HiShoppingBag size={15} />
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>


    </>
  )
}
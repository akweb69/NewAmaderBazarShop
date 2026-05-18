import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import TrendingProducts from '../components/TrendingProducts'
import ProductsGrid from '../components/ProductsGrid'
import CustomOrder from '../components/CustomOrder'
import WhyChooseUs from '../components/WhyChooseUs'
import Newsletter from '../components/Newsletter'
import Consultation from '../components/Consultation'
import ContactSection from '../components/ContactSection'
import FAQ from '../components/FAQ'
import AboutSection from '../components/AboutSection'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function Home() {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <TrendingProducts />
      <ProductsGrid />
      <CustomOrder />
      <AboutSection />
      <WhyChooseUs />
      <Newsletter />
      <Consultation />
      <ContactSection />
      <FAQ />
    </motion.main>
  )
}

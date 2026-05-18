import { motion } from 'framer-motion'
import ContactSection from '../components/ContactSection'
import FAQ from '../components/FAQ'
import Consultation from '../components/Consultation'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function Contact() {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="pt-24"
    >
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions? {"We'd"} love to hear from you. Send us a message and {"we'll"} respond as soon as possible.
          </p>
        </motion.div>
      </div>

      <ContactSection />
      <Consultation />
      <FAQ />
    </motion.main>
  )
}

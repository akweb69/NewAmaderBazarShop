import { motion } from 'framer-motion'
import AboutSection from '../components/AboutSection'
import WhyChooseUs from '../components/WhyChooseUs'
import Newsletter from '../components/Newsletter'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function About() {
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
            About WebTahri
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {"We're"} on a mission to help developers and businesses build better digital products, faster.
          </p>
        </motion.div>
      </div>

      <AboutSection />
      <WhyChooseUs />
      <Newsletter />
    </motion.main>
  )
}

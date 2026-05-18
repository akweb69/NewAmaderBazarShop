import { motion } from 'framer-motion'
import { HiOutlineLightningBolt, HiOutlineSupport, HiOutlineCode, HiOutlineShieldCheck, HiOutlineRefresh, HiOutlineCurrencyDollar } from 'react-icons/hi'

const features = [
  {
    icon: HiOutlineLightningBolt,
    title: 'Lightning Fast',
    description: 'All our products are optimized for maximum performance and speed.',
  },
  {
    icon: HiOutlineCode,
    title: 'Clean Code',
    description: 'Well-documented, modular code following industry best practices.',
  },
  {
    icon: HiOutlineSupport,
    title: '24/7 Support',
    description: 'Get help whenever you need it with our dedicated support team.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure & Reliable',
    description: 'Built with security in mind, following OWASP guidelines.',
  },
  {
    icon: HiOutlineRefresh,
    title: 'Regular Updates',
    description: 'Free lifetime updates with new features and improvements.',
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: 'Best Value',
    description: 'Premium quality at competitive prices with no hidden fees.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function WhyChooseUs() {
  return (
    <section className="py-20   bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why WebTahri
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {"We're"} committed to delivering exceptional quality and value with every product
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group p-6 lg:p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

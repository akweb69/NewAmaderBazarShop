import { motion } from 'framer-motion'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const features = [
  'Custom design tailored to your brand',
  'Fully responsive across all devices',
  'SEO optimized structure',
  'Fast loading performance',
  'Clean, maintainable code',
  'Ongoing support included',
]

export default function CustomOrder() {
  return (
    <section className="py-20  lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Custom Development
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Need a Custom Website Design?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {"Can't"} find exactly what you need? Let our team of expert designers and developers
              create a custom solution tailored specifically to your business requirements.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <FiCheck className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-foreground text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 group"
            >
              Place Custom Order
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right Content - Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card rounded-3xl border border-border p-8 lg:p-10 relative overflow-hidden">
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="text-sm text-primary font-medium mb-2">Starting from</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-foreground">$99</span>
                  <span className="text-muted-foreground">/project</span>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    'Discovery & Strategy Session',
                    'Custom UI/UX Design',
                    'Development & Testing',
                    '30 Days Free Support',
                    'Source Code Ownership',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <FiCheck className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all group"
                >
                  Get Free Consultation
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  No commitment required • Free project estimate
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

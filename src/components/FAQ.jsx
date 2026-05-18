import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

const faqs = [
  {
    question: 'What types of digital products do you offer?',
    answer: 'We offer a wide range of digital products including website templates, full-stack websites, source code bundles, landing page templates, admin dashboards, and UI component kits. All our products are built with modern technologies like React, Next.js, Vue.js, and Tailwind CSS.',
  },
  {
    question: 'Do I get lifetime access to the products?',
    answer: 'Yes! Once you purchase any of our products, you get lifetime access including all future updates and improvements. There are no recurring fees or subscriptions required.',
  },
  {
    question: 'Can I use the products for multiple projects?',
    answer: 'Absolutely! Our standard license allows you to use the purchased product for unlimited personal and client projects. However, you cannot resell or redistribute the source code as your own product.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We provide comprehensive support including detailed documentation, video tutorials, and email support. Premium packages also include priority support with faster response times and one-on-one assistance.',
  },
  {
    question: 'Do you offer custom development services?',
    answer: 'Yes! If you need a custom solution tailored to your specific requirements, we offer custom development services. Book a free consultation to discuss your project needs and get a personalized quote.',
  },
  {
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee on all our products. If you\'re not satisfied with your purchase for any reason, simply contact us within 30 days and we\'ll process your refund, no questions asked.',
  },
  {
    question: 'Are the templates SEO optimized?',
    answer: 'Yes, all our templates are built with SEO best practices in mind. They include proper semantic HTML structure, optimized meta tags, fast loading speeds, and mobile-responsive design - all important factors for search engine rankings.',
  },
  {
    question: 'How do I get updates for purchased products?',
    answer: 'All updates are delivered through our customer portal. You\'ll receive email notifications when updates are available, and you can download the latest version anytime from your account dashboard.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20  ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our products and services
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <FiChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

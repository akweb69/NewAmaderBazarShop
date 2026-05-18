import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import { HiOutlineCode, HiOutlineTemplate, HiOutlineGlobe, HiOutlineDocumentText } from 'react-icons/hi'

const products = [
  {
    id: 1,
    name: 'SaaS Dashboard Pro',
    category: 'Website Template',
    price: 49,
    originalPrice: 79,
    rating: 4.9,
    reviews: 128,
    image: HiOutlineTemplate,
    tags: ['Next.js', 'Tailwind'],
    featured: true,
  },
  {
    id: 2,
    name: 'E-commerce Starter',
    category: 'Full Website',
    price: 89,
    originalPrice: 129,
    rating: 4.8,
    reviews: 96,
    image: HiOutlineGlobe,
    tags: ['React', 'Node.js'],
    featured: true,
  },
  {
    id: 3,
    name: 'Landing Page Kit',
    category: 'Landing Page',
    price: 29,
    originalPrice: 49,
    rating: 4.9,
    reviews: 234,
    image: HiOutlineDocumentText,
    tags: ['HTML', 'CSS'],
    featured: true,
  },
  {
    id: 4,
    name: 'Auth System Boilerplate',
    category: 'Source Code',
    price: 39,
    originalPrice: 59,
    rating: 4.7,
    reviews: 87,
    image: HiOutlineCode,
    tags: ['TypeScript', 'JWT'],
    featured: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TrendingProducts() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Trending Now
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Popular Landing Pages
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our most popular templates and code bundles loved by thousands of developers
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Product Image */}
              <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <product.image className="w-16 h-16 text-primary/50 group-hover:text-primary/70 transition-colors" />
                </div>
                {product.featured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="text-xs text-primary font-medium mb-2">{product.category}</div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">${product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors border border-border group"
          >
            View All Products
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

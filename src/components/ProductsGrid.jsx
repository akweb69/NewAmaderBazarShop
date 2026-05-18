import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiStar, FiFilter } from 'react-icons/fi'
import { HiOutlineCode, HiOutlineTemplate, HiOutlineGlobe, HiOutlineDocumentText, HiOutlineDatabase, HiOutlineDeviceMobile } from 'react-icons/hi'

const categories = ['All', 'Templates', 'Full Websites', 'Source Code', 'Landing Pages']

const allProducts = [
  { id: 1, name: 'SaaS Dashboard Pro', category: 'Templates', price: 49, rating: 4.9, reviews: 128, icon: HiOutlineTemplate, tags: ['Next.js', 'Tailwind'] },
  { id: 2, name: 'E-commerce Starter', category: 'Full Websites', price: 89, rating: 4.8, reviews: 96, icon: HiOutlineGlobe, tags: ['React', 'Node.js'] },
  { id: 3, name: 'Landing Page Kit', category: 'Landing Pages', price: 29, rating: 4.9, reviews: 234, icon: HiOutlineDocumentText, tags: ['HTML', 'CSS'] },
  { id: 4, name: 'Auth System Boilerplate', category: 'Source Code', price: 39, rating: 4.7, reviews: 87, icon: HiOutlineCode, tags: ['TypeScript', 'JWT'] },
  { id: 5, name: 'Admin Panel Template', category: 'Templates', price: 59, rating: 4.8, reviews: 156, icon: HiOutlineTemplate, tags: ['Vue.js', 'Vuetify'] },
  { id: 6, name: 'Mobile App UI Kit', category: 'Templates', price: 35, rating: 4.6, reviews: 78, icon: HiOutlineDeviceMobile, tags: ['React Native', 'Expo'] },
  { id: 7, name: 'API Starter Kit', category: 'Source Code', price: 45, rating: 4.9, reviews: 112, icon: HiOutlineDatabase, tags: ['Node.js', 'MongoDB'] },
  { id: 8, name: 'Portfolio Website', category: 'Full Websites', price: 39, rating: 4.7, reviews: 189, icon: HiOutlineGlobe, tags: ['Astro', 'Tailwind'] },
]

export default function ProductsGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-20  bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Browse Collection
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            All Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our complete collection of premium digital products
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-10"
        >
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Product Image */}
              <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <product.icon className="w-14 h-14 text-primary/50 group-hover:text-primary/70 transition-colors" />
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
                    <span key={tag} className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Rating & Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">${product.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FiFilter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

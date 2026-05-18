import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiStar, FiFilter, FiGrid, FiList } from 'react-icons/fi'
import { HiOutlineCode, HiOutlineTemplate, HiOutlineGlobe, HiOutlineDocumentText, HiOutlineDatabase, HiOutlineDeviceMobile, HiOutlineCube, HiOutlineCollection } from 'react-icons/hi'

const categories = ['All', 'Templates', 'Full Websites', 'Source Code', 'Landing Pages', 'UI Kits']

const allProducts = [
  { id: 1, name: 'SaaS Dashboard Pro', category: 'Templates', price: 49, originalPrice: 79, rating: 4.9, reviews: 128, icon: HiOutlineTemplate, tags: ['Next.js', 'Tailwind'], featured: true },
  { id: 2, name: 'E-commerce Starter', category: 'Full Websites', price: 89, originalPrice: 129, rating: 4.8, reviews: 96, icon: HiOutlineGlobe, tags: ['React', 'Node.js'], featured: true },
  { id: 3, name: 'Landing Page Kit', category: 'Landing Pages', price: 29, originalPrice: 49, rating: 4.9, reviews: 234, icon: HiOutlineDocumentText, tags: ['HTML', 'CSS'], featured: true },
  { id: 4, name: 'Auth System Boilerplate', category: 'Source Code', price: 39, originalPrice: 59, rating: 4.7, reviews: 87, icon: HiOutlineCode, tags: ['TypeScript', 'JWT'], featured: false },
  { id: 5, name: 'Admin Panel Template', category: 'Templates', price: 59, originalPrice: 89, rating: 4.8, reviews: 156, icon: HiOutlineTemplate, tags: ['Vue.js', 'Vuetify'], featured: false },
  { id: 6, name: 'Mobile App UI Kit', category: 'UI Kits', price: 35, originalPrice: 55, rating: 4.6, reviews: 78, icon: HiOutlineDeviceMobile, tags: ['React Native', 'Expo'], featured: false },
  { id: 7, name: 'API Starter Kit', category: 'Source Code', price: 45, originalPrice: 69, rating: 4.9, reviews: 112, icon: HiOutlineDatabase, tags: ['Node.js', 'MongoDB'], featured: false },
  { id: 8, name: 'Portfolio Website', category: 'Full Websites', price: 39, originalPrice: 59, rating: 4.7, reviews: 189, icon: HiOutlineGlobe, tags: ['Astro', 'Tailwind'], featured: false },
  { id: 9, name: 'Blog Platform', category: 'Full Websites', price: 69, originalPrice: 99, rating: 4.8, reviews: 145, icon: HiOutlineGlobe, tags: ['Next.js', 'MDX'], featured: true },
  { id: 10, name: 'Component Library', category: 'UI Kits', price: 49, originalPrice: 79, rating: 4.9, reviews: 203, icon: HiOutlineCube, tags: ['React', 'Storybook'], featured: false },
  { id: 11, name: 'Marketing Landing', category: 'Landing Pages', price: 25, originalPrice: 45, rating: 4.7, reviews: 167, icon: HiOutlineDocumentText, tags: ['Tailwind', 'Alpine'], featured: false },
  { id: 12, name: 'Dashboard UI Kit', category: 'UI Kits', price: 55, originalPrice: 85, rating: 4.8, reviews: 134, icon: HiOutlineCollection, tags: ['Figma', 'React'], featured: false },
]

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popular')

  const filteredProducts = allProducts
    .filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return b.reviews - a.reviews // popular (default)
    })

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="pt-24 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Browse Products
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our complete collection of premium digital products
          </p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-4 lg:p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
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

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-background border border-border rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid/List */}
        <motion.div
          layout
          className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: viewMode === 'grid' ? -5 : 0 }}
              className={`group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`bg-secondary relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-[4/3]'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <product.icon className="w-14 h-14 text-primary/50 group-hover:text-primary/70 transition-colors" />
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
              <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-foreground">${product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FiFilter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}

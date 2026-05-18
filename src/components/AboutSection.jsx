import { motion } from 'framer-motion'
import { HiOutlineUsers, HiOutlineGlobe, HiOutlineSparkles, HiOutlineHeart } from 'react-icons/hi'

const stats = [
  { label: 'Happy Customers', value: '120+', icon: HiOutlineUsers },
  { label: 'Projects Sold', value: '500+', icon: HiOutlineSparkles },
  { label: 'Countries Reached', value: '10+', icon: HiOutlineGlobe },
  { label: 'Satisfaction Rate', value: '99%', icon: HiOutlineHeart },
]

const team = [
  { name: 'Abu Kalam', role: 'Founder & CEO', initial: 'AK', image: "https://i.ibb.co/sJNBbnWg/j-kkkkkkk.jpg" },
  { name: 'Tahrima Akter', role: 'Lead Designer', initial: 'TA', image: "https://i.ibb.co/vvfZmH4d/6280629156705931570.jpg" },
  { name: 'Salman Farshi', role: 'Senior Developer', initial: 'SF', image: "https://i.ibb.co/twYWxfm1/PSFix-20230512-172155-02-01-copy-300x300.jpg" },
  { name: 'Mashruf ', role: 'Senior Developer', initial: 'MS', image: "https://i.ibb.co/LdHN2ZV2/Whats-App-Image-2025-08-23-at-20-52-35-4fc06ef7.jpg" },
  { name: 'Abdur Razzaq', role: 'Developer', initial: 'AR' },
  { name: 'Rehena Akhter', role: 'Developer', initial: 'RA', image: "https://i.ibb.co/Xxqdn2yJ/IMG-2439.jpg" },
  { name: 'Abdur Rashid', role: 'Customer Success', initial: 'AR', image: "https://i.ibb.co/MDjRPqPR/b0c03e38-e0f1-4275-9e90-4c8b3d979468.jpg" },
]

export default function AboutSection() {
  return (
    <section className="py-20  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Building the Future of Digital Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            {"We're"} a passionate team of designers and developers dedicated to creating premium digital products
            that help businesses and developers build faster and better. Our mission is to democratize access
            to high-quality web development resources.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Our Story</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                WebTahri was founded in 2020 with a simple goal: to create digital products that developers
                actually want to use. We noticed that most templates and UI kits on the market were either
                outdated, poorly coded, or lacked proper documentation.
              </p>
              <p>
                We set out to change that by building products with the same attention to detail and quality
                that we would want in our own projects. Every template, every component, and every line of
                code is crafted with care.
              </p>
              <p>
                Today, {"we're"} proud to serve over 12,000 customers worldwide, from solo developers to
                Fortune 500 companies. But {"we're"} just getting started.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl border border-border p-8 lg:p-10"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Our Values</h3>
            <div className="space-y-4">
              {[
                { title: 'Quality First', desc: 'We never compromise on code quality or design standards.' },
                { title: 'Customer Focus', desc: 'Your success is our success. We\'re here to help you build.' },
                { title: 'Continuous Improvement', desc: 'We constantly update and improve our products.' },
                { title: 'Transparency', desc: 'Clear pricing, honest communication, no hidden surprises.' },
              ].map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">{value.title}</div>
                    <div className="text-sm text-muted-foreground">{value.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">Meet the Team</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 text-center hover:border-primary/50 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {
                    member.image
                      ? <img src={member.image} alt="" className="w-full h-full object-cover rounded-full" />
                      : <span className="text-xl font-bold text-primary">{member.initial}</span>
                  }
                </div>
                <div className="font-semibold text-foreground mb-1">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.role}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

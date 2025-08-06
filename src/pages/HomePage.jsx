"use client"

import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { ArrowRight, Leaf, Award, Heart } from "lucide-react"
import Menu from "../components/Menu"
import Gallery from "../components/Gallery"

const HomePage = ({ setCurrentPage }) => {
  const { t } = useTranslation()

  const features = [
    { icon: Leaf, key: "feature1" },
    { icon: Award, key: "feature2" },
    { icon: Heart, key: "feature3" },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/terraza.png')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-forest-green/60 via-forest-green/40 to-sage-green/60"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center text-white max-w-5xl mx-auto px-6"
        >
          <motion.div
            className="mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-6xl font-sans font-medium text-white tracking-wide mb-2">GASTROBAR</span>
              <span className="text-2xl md:text-9xl font-sans font-bold text-white/90 tracking-widest">TEPUY</span>
            </div>
          </motion.div>

          {/* <motion.h1
            className="font-sans text-3xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {t("hero.title")}
          </motion.h1> */}

          {/* <motion.p
            className="text-xl md:text-2xl mb-12 font-light leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {t("hero.subtitle")}
          </motion.p> */}

          <motion.button
            onClick={() => setCurrentPage("reservations")}
            className="bg-natural-wood hover:bg-natural-wood/90 text-white font-sans font-semibold text-xl px-12 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t("hero.cta")}</span>
            <ArrowRight size={22} />
          </motion.button>
        </motion.div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* About Section */}
      <section className="bg-warm-cream section-spacing">
        <div className="container section-padding">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-light text-forest-green mb-8">
              {t("about.title")}
            </h2>
            <div className="w-32 h-1 bg-natural-wood mx-auto mb-10"></div>
            <p className="text-body-large leading-relaxed max-w-4xl mx-auto text-charcoal">{t("about.description")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center bg-white rounded-2xl p-10 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-sage-green/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                  <feature.icon className="text-sage-green" size={36} />
                </div>
                <h3 className="font-sans text-2xl font-semibold mb-6 text-forest-green">
                  {t(`about.${feature.key}.title`)}
                </h3>
                <p className="text-body text-charcoal leading-relaxed">{t(`about.${feature.key}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Menu Section */}
      <Menu />

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Gallery Section */}
      <Gallery />
    </div>
  )
}

export default HomePage

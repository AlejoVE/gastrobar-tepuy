"use client"

import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

const Gallery = () => {
  const { t } = useTranslation()

  const galleryImages = [
    {
      src: "/images/salmorejo.png",
      alt: t("gallery.image1"),
    },
    {
      src: "/images/salon.png",
      alt: t("gallery.image2"),
    },
    {
      src: "/images/cocina.png",
      alt: t("gallery.image3"),
    },
    {
      src: "/images/barra1.png",
      alt: t("gallery.image4"),
    },
    {
      src: "/images/personal.png",
      alt: t("gallery.image5"),
    },
    {
      src: "/images/terraza.png",
      alt: t("gallery.image6"),
    },
  ]

  return (
    <section className="bg-soft-beige section-spacing">
      <div className="container section-padding">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-light text-forest-green mb-8">
            {t("gallery.title")}
          </h2>
          <div className="w-32 h-1 bg-natural-wood mx-auto mb-10"></div>
          <p className="text-body-large leading-relaxed max-w-4xl mx-auto text-charcoal">{t("gallery.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer bg-white"
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-green/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                <p className="text-white font-sans text-lg font-medium text-center px-6 pb-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery

"use client"

import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react"

const Footer = () => {
  const { t } = useTranslation()

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.address"),
      content: "Plaza de La Encarnación\nSevilla, España",
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      content: "+34 605 25 29 28",
    },
    {
      icon: Mail,
      title: t("contact.email"),
      content: "info@gastrobartepuy.com",
    },
    {
      icon: Clock,
      title: t("contact.hours"),
      content: t("contact.schedule"),
    },
  ]

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/gastrobartepuy", label: "Instagram" },
  ]

  return (
    <>
      {/* Section Divider */}
      <div className="section-divider"></div>

      <footer className="bg-forest-green text-white">
        <div className="container py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="mb-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-sans font-bold text-white tracking-wide">GASTROBAR</span>
                  <span className="text-lg font-sans font-medium text-white/80 -mt-1 tracking-widest">TEPUY</span>
                </div>
              </div>
              <p className="text-body leading-relaxed mb-10 text-white/80">{t("footer.description")}</p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={22} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Information */}
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-natural-wood rounded-xl">
                    <item.icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-sans font-semibold text-xl">{item.title}</h3>
                </div>
                <p className="text-body leading-relaxed whitespace-pre-line text-white/80 ml-16">{item.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="border-t border-white/20 mt-20 pt-10 text-center"
          >
            <p className="text-body text-white/60">© 2024 Gastrobar Tepuy. {t("footer.rights")}</p>
          </motion.div>
        </div>
      </footer>
    </>
  )
}

export default Footer

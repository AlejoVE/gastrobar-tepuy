"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Menu, X, Globe } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Header = () => {
  const { t, i18n } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
  ]

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setIsLangOpen(false)
  }

  if (!mounted) return null;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-pure-white/95 backdrop-blur-sm border-b border-sage-green/20 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex flex-col">
                <span className="text-2xl font-sans font-bold text-forest-green tracking-wide">GASTROBAR</span>
                <span className="text-lg font-sans font-medium text-sage-green -mt-1 tracking-widest">TEPUY</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-sans font-medium transition-all duration-300 px-6 py-3 rounded-xl text-lg ${pathname === "/"
                ? "text-forest-green bg-warm-cream shadow-sm"
                : "text-charcoal hover:text-forest-green hover:bg-warm-cream"
                }`}
            >
              {t("nav.home")}
            </Link>

            <Link href="/reservations" className="btn-primary text-lg">
              {t("nav.book")}
            </Link>

            {/* Language Switcher (Se queda igual porque no navega a otra URL) */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 text-charcoal hover:text-forest-green transition-colors px-4 py-3 rounded-xl hover:bg-warm-cream"
                aria-label={t("nav.language")}
              >
                <Globe size={22} />
                <span className="text-base font-sans font-medium">{i18n.language.toUpperCase()}</span>
              </button>

              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-sage-green/20 overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="block w-full text-left px-6 py-4 text-base hover:bg-warm-cream transition-colors font-sans"
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 text-charcoal hover:text-forest-green transition-colors rounded-xl hover:bg-warm-cream"
            aria-label={t("nav.menu")}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-sage-green/20 bg-white/95 backdrop-blur-sm"
          >
            <div className="py-8 space-y-6">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left font-sans font-medium px-6 py-4 rounded-xl transition-colors text-lg ${pathname === "/" ? "text-forest-green bg-warm-cream" : "text-charcoal hover:bg-warm-cream"
                  }`}
              >
                {t("nav.home")}
              </Link>
              <div className="px-6">
                {/* Añadimos flex justify-center para asegurar que el botón Link llene el ancho en móvil */}
                <Link
                  href="/reservations"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary w-full text-lg flex justify-center"
                >
                  {t("nav.book")}
                </Link>
              </div>

              {/* Language switcher mobile (Se queda igual) */}
              <div className="flex space-x-3 pt-6 px-6 border-t border-sage-green/20">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-5 py-3 text-sm rounded-xl font-sans font-medium transition-colors ${i18n.language === lang.code
                      ? "bg-forest-green text-white"
                      : "bg-warm-cream text-charcoal hover:bg-sage-green hover:text-white"
                      }`}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header
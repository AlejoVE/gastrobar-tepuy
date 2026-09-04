import React from 'react'
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
// ✨ Creamos un Link animado fusionando Next.js con Framer Motion
const MotionLink = motion(Link);

const Hero = () => {
    const { t } = useTranslation()

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/images/terraza.avif')`,
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

                <MotionLink
                    href="/reservations"
                    className="bg-natural-wood hover:bg-natural-wood/90 text-white font-sans font-semibold text-xl px-12 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3 shadow-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span>{t("hero.cta")}</span>
                    <ArrowRight size={22} />
                </MotionLink>
            </motion.div>
        </section>
    )
}

export default Hero
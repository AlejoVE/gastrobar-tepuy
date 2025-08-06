"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ReservationsPage from "./pages/ReservationsPage"
import "./i18n/i18n"
import "./index.css"

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const { i18n } = useTranslation()

  useEffect(() => {
    // Set default language to Spanish
    i18n.changeLanguage("es")
  }, [i18n])

  return (
    <div className="min-h-screen bg-pure-white font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HomePage setCurrentPage={setCurrentPage} />
            </motion.div>
          ) : (
            <motion.div
              key="reservations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReservationsPage setCurrentPage={setCurrentPage} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App

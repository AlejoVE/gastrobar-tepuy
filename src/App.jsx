"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ReservationsPage from "./pages/ReservationsPage"
import ManageBookingPage from "./pages/ManageBookingPage"

import "./index.css"

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [magicToken, setMagicToken] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setMagicToken(token);
      setCurrentPage("manage");
    }
  }, [])

  return (
    <div className="min-h-screen bg-pure-white font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HomePage setCurrentPage={setCurrentPage} />
            </motion.div>
          )}

          {currentPage === "reservations" && (
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

          {currentPage === "manage" && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ManageBookingPage
                token={magicToken}
                setCurrentPage={setCurrentPage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App
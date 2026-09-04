// src/views/ReservationsPage.jsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useReservation } from "../hooks/useReservation"

import { Step1Date, Step2Table, Step3Details, Step4Confirm, BookingSuccess } from "../components/reservation-steps/ReservationSteps"

const ReservationsPage = () => {
  const reservationProps = useReservation()
  const { step, bookingSuccess } = reservationProps

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  if (bookingSuccess) {
    return <BookingSuccess t={reservationProps.t} />
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-pure-white">
      {/* PROGRESS BAR */}
      <div className="w-full max-w-2xl mb-8 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-forest-green' : 'bg-sage-green/20'}`} />
        ))}
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-sage-green/20 p-8 md:p-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={`step-${step}`} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {step === 1 && <Step1Date {...reservationProps} />}
            {step === 2 && <Step2Table {...reservationProps} />}
            {step === 3 && <Step3Details {...reservationProps} />}
            {step === 4 && <Step4Confirm {...reservationProps} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ReservationsPage
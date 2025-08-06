"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, CalendarIcon, Users, CreditCard, CheckCircle } from "lucide-react"
import Calendar from "../components/Calendar"

const ReservationsPage = ({ setCurrentPage }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    date: null,
    time: "",
    guests: 2,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  const timeSlots = [
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ]

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Simulate booking confirmation
    setStep(4)
  }

  const stepIcons = {
    1: CalendarIcon,
    2: Users,
    3: CreditCard,
    4: CheckCircle,
  }

  return (
    <div className="min-h-screen bg-soft-beige">
      <div className="max-w-4xl mx-auto section-padding">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <button
            onClick={() => setCurrentPage("home")}
            className="inline-flex items-center space-x-2 text-forest-green hover:text-forest-green/80 transition-colors mb-6 font-sans font-medium"
          >
            <ArrowLeft size={20} />
            <span>{t("reservations.back")}</span>
          </button>

          <h1 className="font-sans text-4xl md:text-5xl font-light text-forest-green mb-4">
            {t("reservations.title")}
          </h1>
          <p className="text-lg text-charcoal">{t("reservations.subtitle")}</p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => {
              const Icon = stepIcons[stepNumber]
              const isCompleted = step > stepNumber
              const isCurrent = step === stepNumber

              return (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-forest-green text-white shadow-lg"
                        : isCurrent
                          ? "bg-natural-wood text-white shadow-lg"
                          : "bg-white text-gray-400 border-2 border-gray-300"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  {stepNumber < 4 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-colors duration-300 ${
                        step > stepNumber ? "bg-forest-green" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-2xl font-semibold text-forest-green mb-6">
                  {t("reservations.step1.title")}
                </h2>
                <Calendar selectedDate={formData.date} onDateSelect={(date) => setFormData({ ...formData, date })} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-2xl font-semibold text-forest-green mb-6">
                  {t("reservations.step2.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                      {t("reservations.step2.name")}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                      {t("reservations.step2.email")}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                      {t("reservations.step2.phone")}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                      {t("reservations.step2.guests")}
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number.parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {t("reservations.step2.people")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                    {t("reservations.step2.time")}
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`px-4 py-3 rounded-lg font-sans font-medium transition-all duration-200 ${
                          formData.time === time
                            ? "bg-forest-green text-white shadow-lg transform scale-105"
                            : "bg-warm-cream text-charcoal hover:bg-sage-green/20 hover:text-forest-green border border-sage-green/20"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                    {t("reservations.step2.requests")}
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    placeholder={t("reservations.step2.requestsPlaceholder")}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-2xl font-semibold text-forest-green mb-6">
                  {t("reservations.step3.title")}
                </h2>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>{t("reservations.step3.disclaimer")}</strong> {t("reservations.step3.disclaimerText")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                      {t("reservations.step3.cardNumber")}
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                      {t("reservations.step3.expiry")}
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                      {t("reservations.step3.cvv")}
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-sans font-medium text-charcoal mb-2">
                      {t("reservations.step3.cardName")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("reservations.step3.cardNamePlaceholder")}
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-sage-green/30 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-warm-cream rounded-lg p-6">
                  <h3 className="font-sans font-semibold text-forest-green mb-4">{t("reservations.step3.summary")}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t("reservations.step3.date")}:</span>
                      <span>{formData.date?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("reservations.step3.time")}:</span>
                      <span>{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("reservations.step3.guests")}:</span>
                      <span>
                        {formData.guests} {t("reservations.step2.people")}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>{t("reservations.step3.deposit")}:</span>
                        <span>€25.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="text-green-600" size={40} />
                </div>

                <h2 className="font-sans text-3xl font-semibold text-forest-green">{t("reservations.step4.title")}</h2>

                <p className="text-lg text-charcoal max-w-md mx-auto">{t("reservations.step4.message")}</p>

                <div className="bg-warm-cream rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="font-sans font-semibold text-forest-green mb-4">{t("reservations.step4.details")}</h3>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex justify-between">
                      <span>{t("reservations.step4.confirmation")}:</span>
                      <span className="font-mono">#GT{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("reservations.step3.date")}:</span>
                      <span>{formData.date?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("reservations.step3.time")}:</span>
                      <span>{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("reservations.step3.guests")}:</span>
                      <span>
                        {formData.guests} {t("reservations.step2.people")}
                      </span>
                    </div>
                  </div>
                </div>

                <button onClick={() => setCurrentPage("home")} className="btn-primary">
                  {t("reservations.step4.home")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-sans transition-colors ${
                  step === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-warm-cream text-charcoal hover:bg-sage-green/20"
                }`}
              >
                <ArrowLeft size={20} />
                <span>{t("reservations.previous")}</span>
              </button>

              <button
                onClick={step === 3 ? handleSubmit : handleNext}
                disabled={
                  (step === 1 && !formData.date) ||
                  (step === 2 && (!formData.name || !formData.email || !formData.phone || !formData.time))
                }
                className="inline-flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{step === 3 ? t("reservations.confirm") : t("reservations.next")}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationsPage

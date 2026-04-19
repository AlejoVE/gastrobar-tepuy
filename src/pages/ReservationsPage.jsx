"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import Calendar from "../components/Calendar"

const ReservationsPage = ({ setCurrentPage }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    date: null,
    guests: "",
    zone: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    requests: ""
  })

  const [availability, setAvailability] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const WEBHOOK_AVAILABILITY = "https://n8n.alemontilla.dev/webhook/disponibilidad"
  const WEBHOOK_CREATE_BOOKING = "https://n8n.alemontilla.dev/webhook/new-booking"

  const inputStyle = "w-full p-4 rounded-xl border-2 border-sage-green/20 bg-pure-white text-charcoal placeholder:text-sage-green/60 focus:border-forest-green focus:ring-0 outline-none transition-all"

  useEffect(() => {
    if (formData.date) {
      setAvailability(null)
      setFormData(prev => ({ ...prev, guests: "", zone: "", time: "" }))
      setSubmitError(null)
    }
  }, [formData.date])

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const fetchAvailability = async (selectedDate, guestsCount) => {
    if (!selectedDate || !guestsCount) return;
    setIsLoading(true);
    setAvailability(null);
    setFormData(prev => ({ ...prev, zone: "", time: "" }));

    try {
      const localDate = new Date(selectedDate);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      const formattedDate = localDate.toISOString().split('T')[0];

      const response = await fetch(`${WEBHOOK_AVAILABILITY}?date=${formattedDate}&guests=${guestsCount}`);
      let data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        data = data[0];
      }

      setAvailability(Object.keys(data).length === 0 ? { error: t("reservations.messages.error_full") } : data);
    } catch (error) {
      setAvailability({ error: "Network error." });
    } finally {
      setIsLoading(false);
    }
  }

  const submitBooking = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const localDate = new Date(formData.date);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

      const payload = {
        customer_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        booking_date: localDate.toISOString().split('T')[0],
        start_time: formData.time,
        guests: parseInt(formData.guests),
        preferred_zone: formData.zone,
        allergies: formData.requests || "None"
      };

      const response = await fetch(WEBHOOK_CREATE_BOOKING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && !data.error && !data.message?.includes("Sorry")) {
        setBookingSuccess(true);
      } else {
        setSubmitError(data.message || data.error || t("reservations.messages.error_full"));
      }
    } catch (error) {
      setSubmitError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-pure-white">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle2 size={80} className="text-forest-green mx-auto mb-6" />
          <h2 className="text-4xl font-sans font-bold text-forest-green mb-4">{t("reservations.messages.success_title")}</h2>
          <p className="text-lg text-charcoal mb-8">{t("reservations.messages.success_desc")}</p>
          <button onClick={() => setCurrentPage("home")} className="px-8 py-4 bg-forest-green text-white rounded-xl hover:bg-charcoal transition-all font-medium">
            {t("reservations.buttons.success_back")}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-pure-white">
      {/* PROGRESS BAR*/}
      <div className="w-full max-w-2xl mb-8 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-forest-green' : 'bg-sage-green/20'}`} />
        ))}
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-sage-green/20 p-8 md:p-12 overflow-hidden">
        <AnimatePresence mode="wait">

          {/* PASO 1: DATE */}
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <h2 className="text-3xl font-sans font-bold text-forest-green mb-8 text-center">{t("reservations.steps.date")}</h2>
              <Calendar selectedDate={formData.date} onDateSelect={(date) => setFormData({ ...formData, date })} />
              <div className="mt-10 flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!formData.date}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all ${formData.date ? "bg-forest-green text-white hover:bg-charcoal" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  {t("reservations.buttons.next")} <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* PASO 2: TABLE AND TIME */}
          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <h2 className="text-3xl font-sans font-bold text-forest-green mb-8 text-center">{t("reservations.steps.table")}</h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">{t("reservations.form.guests")}</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => {
                      setFormData({ ...formData, guests: e.target.value });
                      fetchAvailability(formData.date, e.target.value);
                    }}
                    className={inputStyle}
                  >
                    <option value="">...</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Pax' : 'Paxes'}</option>
                    ))}
                  </select>
                </div>

                {isLoading && <div className="flex justify-center py-8"><Loader2 className="animate-spin text-forest-green" size={32} /></div>}

                {availability && availability.error && <p className="text-center text-red-500 font-medium">{availability.error}</p>}

                {availability && !availability.error && !isLoading && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-sm font-medium text-charcoal mb-3">{t("reservations.form.zone")}</label>
                    <div className="grid grid-cols-2 gap-4">
                      {availability['Lounge'] && (
                        <button onClick={() => setFormData({ ...formData, zone: 'Lounge', time: '' })} className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${formData.zone === 'Lounge' ? 'border-forest-green bg-forest-green text-white shadow-md' : 'border-sage-green/20 text-charcoal hover:border-forest-green/50'}`}>
                          <span className="block mb-1">{t("reservations.form.lounge")}</span>
                        </button>
                      )}
                      {availability['Terrace'] && (
                        <button onClick={() => setFormData({ ...formData, zone: 'Terrace', time: '' })} className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${formData.zone === 'Terrace' ? 'border-forest-green bg-forest-green text-white shadow-md' : 'border-sage-green/20 text-charcoal hover:border-forest-green/50'}`}>
                          <span className="block mb-1">{t("reservations.form.terrace")}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {formData.zone && availability[formData.zone] && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-sage-green/20">
                    <label className="block text-sm font-medium text-charcoal mb-3">{t("reservations.form.hours")}</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availability[formData.zone].map((slot) => (
                        <button
                          key={slot.time}
                          disabled={slot.status === 'full'}
                          onClick={() => {
                            if (slot.status !== 'full') {
                              setFormData({ ...formData, time: slot.time });
                              setSubmitError(null);
                            }
                          }}
                          className={`py-3 px-2 rounded-xl border-2 font-medium transition-all text-center text-sm ${slot.status === 'full'
                            ? 'bg-red-50/50 text-red-300 border-red-100 cursor-not-allowed'
                            : formData.time === slot.time
                              ? 'ring-4 ring-forest-green/20 border-forest-green bg-forest-green text-white'
                              : slot.status === 'available'
                                ? 'bg-sage-green/10 text-forest-green border-sage-green hover:bg-sage-green hover:text-white'
                                : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-500 hover:text-white'
                            }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="mt-10 flex justify-between">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-4 text-charcoal hover:bg-warm-cream rounded-xl transition-colors"><ArrowLeft size={20} /> {t("reservations.buttons.back")}</button>
                <button onClick={nextStep} disabled={!formData.time} className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all ${formData.time ? 'bg-forest-green text-white hover:bg-charcoal' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>{t("reservations.buttons.next")} <ArrowRight size={20} /></button>
              </div>
            </motion.div>
          )}

          {/* PASO 3: PERSONAL DATA */}
          {step === 3 && (
            <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <h2 className="text-3xl font-sans font-bold text-forest-green mb-8 text-center">{t("reservations.steps.details")}</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">{t("reservations.form.name")}</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputStyle} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">{t("reservations.form.email")}</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">{t("reservations.form.phone")}</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">{t("reservations.form.requests")}</label>
                  <textarea value={formData.requests} onChange={(e) => setFormData({ ...formData, requests: e.target.value })} className={`${inputStyle} resize-none`} rows="3" placeholder={t("reservations.form.placeholder_requests")} />
                </div>
              </div>
              <div className="mt-10 flex justify-between">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-4 text-charcoal hover:bg-warm-cream rounded-xl transition-colors"><ArrowLeft size={20} /> {t("reservations.buttons.back")}</button>
                <button onClick={nextStep} disabled={!formData.name || !formData.email || !formData.phone} className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all ${formData.name && formData.email && formData.phone ? 'bg-forest-green text-white hover:bg-charcoal' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>{t("reservations.buttons.review")} <ArrowRight size={20} /></button>
              </div>
            </motion.div>
          )}

          {/* PASO 4: CONFIRMATION */}
          {step === 4 && (
            <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <h2 className="text-3xl font-sans font-bold text-forest-green mb-8 text-center">{t("reservations.steps.confirm")}</h2>

              {/* ERROR BANNER*/}
              {submitError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{submitError}</p>
                </motion.div>
              )}

              <div className="bg-warm-cream p-6 rounded-2xl space-y-4 mb-10 text-charcoal border border-sage-green/10">
                <div className="flex justify-between border-b border-sage-green/20 pb-4">
                  <span className="font-medium">{t("reservations.form.summary_date")}:</span>
                  <span className="font-bold">{formData.date?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b border-sage-green/20 pb-4">
                  <span className="font-medium">{t("reservations.form.summary_table")}:</span>
                  <span className="font-bold">{formData.guests} pax - {formData.zone === 'Lounge' ? t("reservations.form.lounge") : t("reservations.form.terrace")} - {formData.time}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="font-medium">{t("reservations.form.summary_name")}:</span>
                  <span className="font-bold">{formData.name}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-4 text-charcoal hover:bg-warm-cream rounded-xl transition-colors" disabled={isSubmitting}><ArrowLeft size={20} /> {t("reservations.buttons.back")}</button>
                <button onClick={submitBooking} disabled={isSubmitting} className="flex items-center justify-center gap-2 px-8 py-4 bg-forest-green text-white rounded-xl font-medium hover:bg-charcoal transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t("reservations.buttons.confirm")}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

export default ReservationsPage
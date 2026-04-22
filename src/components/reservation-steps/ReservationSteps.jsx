import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Calendar from "../Calendar" // Ajusta la ruta

const inputStyle = "w-full p-4 rounded-xl border-2 border-sage-green/20 bg-pure-white text-charcoal placeholder:text-sage-green/60 focus:border-forest-green focus:ring-0 outline-none transition-all"

export const Step1Date = ({ t, formData, setFormData, nextStep, minDate }) => (
    <>
        <h2 className="text-3xl font-sans font-bold text-forest-green mb-8 text-center">{t("reservations.steps.date")}</h2>
        <Calendar selectedDate={formData.date} onDateSelect={(date) => setFormData({ ...formData, date, })} minDate={minDate} />
        <div className="mt-10 flex justify-end">
            <button onClick={nextStep} disabled={!formData.date} className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all ${formData.date ? "bg-forest-green text-white hover:bg-charcoal" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                {t("reservations.buttons.next")} <ArrowRight size={20} />
            </button>
        </div>
    </>
)

export const Step2Table = ({ t, formData, setFormData, fetchAvailability, isLoading, availability, setSubmitError, prevStep, nextStep }) => {

    // --- NUEVA LÓGICA DE VALIDACIÓN TEMPORAL (FRONTEND) ---
    const checkIfPast = (slotTime) => {
        if (!formData.date) return false;

        // 1. Calcular el límite actual en España (+30 min de margen)
        const limitTimeObj = new Date();
        limitTimeObj.setMinutes(limitTimeObj.getMinutes() + 30);
        const options = { timeZone: 'Europe/Madrid', hour12: false };

        const spainToday = limitTimeObj.toLocaleDateString('en-CA', options); // YYYY-MM-DD
        const limitTime = limitTimeObj.toLocaleTimeString('es-ES', options).substring(0, 5); // HH:MM

        // 2. Formatear la fecha seleccionada por el usuario
        const selectedDate = new Date(formData.date);
        const selectedDateStr = selectedDate.toLocaleDateString('en-CA', options);

        // 3. Evaluar
        const isToday = selectedDateStr === spainToday;
        return isToday && slotTime < limitTime; // Retorna true si es hoy y la hora ya pasó
    };
    // -----------------------------------------------------

    return (
        <>
            <h2 className="text-3xl font-sans font-bold text-forest-green mb-8 text-center">{t("reservations.steps.table")}</h2>
            <div className="space-y-8">

                {/* Selector de Personas */}
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">{t("reservations.form.guests")}</label>
                    <select
                        value={formData.guests}
                        onChange={(e) => { setFormData({ ...formData, guests: e.target.value }); fetchAvailability(formData.date, e.target.value); }}
                        className={inputStyle}
                    >
                        <option value="">...</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Pax' : 'Paxes'}</option>
                        ))}
                    </select>
                </div>

                {isLoading && <div className="flex justify-center py-8"><Loader2 className="animate-spin text-forest-green" size={32} /></div>}
                {availability?.error && <p className="text-center text-red-500 font-medium">{availability.error}</p>}

                {/* Selector de Zona */}
                {availability && !availability.error && !isLoading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <label className="block text-sm font-medium text-charcoal mb-3">{t("reservations.form.zone")}</label>
                        <div className="grid grid-cols-2 gap-4">
                            {['Lounge', 'Terrace'].map(zone => availability[zone] && (
                                <button key={zone} onClick={() => setFormData({ ...formData, zone, time: '' })} className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${formData.zone === zone ? 'border-forest-green bg-forest-green text-white shadow-md' : 'border-sage-green/20 text-charcoal hover:border-forest-green/50'}`}>
                                    <span className="block mb-1">{t(`reservations.form.${zone.toLowerCase()}`)}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Selector de Horas */}
                {formData.zone && availability[formData.zone] && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-sage-green/20">
                        <label className="block text-sm font-medium text-charcoal mb-3">{t("reservations.form.hours")}</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {availability[formData.zone].map((slot) => {

                                // EJECUTAMOS LA VALIDACIÓN AQUÍ
                                const isPast = checkIfPast(slot.time);
                                const isUnavailable = slot.status === 'full' || isPast;

                                return (
                                    <button
                                        key={slot.time}
                                        disabled={isUnavailable}
                                        onClick={() => { if (!isUnavailable) { setFormData({ ...formData, time: slot.time }); setSubmitError(null); } }}
                                        className={`py-3 px-2 rounded-xl border-2 font-medium transition-all text-center text-sm 
                      ${isUnavailable
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' // Estilo para horas pasadas/llenas
                                                : formData.time === slot.time
                                                    ? 'ring-4 ring-forest-green/20 border-forest-green bg-forest-green text-white'
                                                    : 'bg-sage-green/10 text-forest-green border-sage-green hover:bg-sage-green hover:text-white'
                                            }`}
                                    >
                                        {slot.time}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="mt-10 flex justify-between">
                <button onClick={prevStep} className="flex items-center gap-2 px-6 py-4 text-charcoal hover:bg-warm-cream rounded-xl transition-colors"><ArrowLeft size={20} /> {t("reservations.buttons.back")}</button>
                <button onClick={nextStep} disabled={!formData.time} className={`flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all ${formData.time ? 'bg-forest-green text-white hover:bg-charcoal' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>{t("reservations.buttons.next")} <ArrowRight size={20} /></button>
            </div>
        </>
    )
}

export const Step3Details = ({ t, formData, setFormData, prevStep, nextStep }) => (
    <>
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
    </>
)

export const Step4Confirm = ({ t, formData, prevStep, submitBooking, isSubmitting, submitError }) => (
    <>
        <h2 className="text-3xl font-sans font-bold text-forest-green mb-8 text-center">{t("reservations.steps.confirm")}</h2>
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
    </>
)

export const BookingSuccess = ({ setCurrentPage, t }) => (
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
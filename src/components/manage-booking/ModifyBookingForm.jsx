import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Users, MapPin, AlertCircle, Phone, Info } from 'lucide-react';
import { useModifyBooking } from '../../hooks/useModifyBooking';
import Calendar from '../Calendar';
import { isTimeSlotPast, getMinDate } from '../../utils/dateUtils.js';

const inputClasses = "w-full pl-10 pr-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green outline-none shadow-sm cursor-pointer";

export const ModifyBookingForm = ({ booking, token, t, onCancel, onSuccess }) => {
    const { formData, availableTimes, isLoadingTimes, isSaving, error, handleChange, saveChanges } = useModifyBooking(booking, token, onSuccess);

    // Estado para mostrar/ocultar tu calendario personalizado
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el calendario está abierto, y el clic NO fue dentro del contenedor referenciado, lo cerramos
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        // Solo escuchamos clics si el calendario está visible
        if (showCalendar) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showCalendar]);

    const originalTime = booking.start_time.substring(0, 5);
    const isBasicDataUnchanged =
        formData.date === booking.booking_date.split('T')[0] &&
        parseInt(formData.pax) === booking.guests &&
        formData.zone === (booking.confirmed_zone || 'Lounge');

    // ARREGLO DEL CRASH: availableTimes es un array de objetos {time, status}
    let timesToRender = [...availableTimes];

    // Regla de gracia: Inyectamos la hora original como objeto si no estaba
    if (isBasicDataUnchanged && !timesToRender.some(slot => slot.time === originalTime)) {
        timesToRender.push({ time: originalTime, status: 'available' });
        timesToRender.sort((a, b) => a.time.localeCompare(b.time));
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6">
            <h3 className="text-xl font-bold text-forest-green mb-6">{t("modify_booking.modify_title")}</h3>

            {/* Errores */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-start font-medium border border-red-200">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    {t(`modify_booking.errors.${error}`, { defaultValue: error })}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {/* Comensales */}
                <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">{t("modify_booking.guests_label")}</label>
                    <div className="relative">
                        <Users className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        <select value={formData.pax} onChange={(e) => handleChange('pax', e.target.value)} className={inputClasses}>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1} {t("modify_booking.people")}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fecha (REEMPLAZADA POR TU CALENDARIO) */}
                <div ref={calendarRef} className="relative">
                    <label className="block text-sm font-semibold text-charcoal mb-2">{t("modify_booking.date_label")}</label>
                    <div className="relative">
                        <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        <div onClick={() => setShowCalendar(!showCalendar)} className={`${inputClasses} flex items-center`}>
                            {formData.date}
                        </div>
                    </div>

                    <AnimatePresence>
                        {showCalendar && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                // ✨ absolute y z-50 hacen que flote por encima de todo
                                className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                            >
                                <Calendar
                                    compact={true}
                                    selectedDate={formData.date}
                                    onDateSelect={(date) => {
                                        const localDate = new Date(date);
                                        localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
                                        const dateString = localDate.toISOString().split('T')[0];
                                        handleChange('date', dateString);
                                        setShowCalendar(false);
                                    }}
                                    minDate={getMinDate()}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Zona (SOLO LOUNGE Y TERRACE) */}
                <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">{t("modify_booking.zone_label")}</label>
                    <div className="relative">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        <select value={formData.zone} onChange={(e) => handleChange('zone', e.target.value)} className={inputClasses}>
                            <option value="Lounge">{t("reservations.form.lounge", "Lounge")}</option>
                            <option value="Terrace">{t("reservations.form.terrace", "Terrace")}</option>
                        </select>
                    </div>
                </div>

                {/* Teléfono */}
                <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">{t("reservations.form.phone")}</label>
                    <div className="relative">
                        <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        <input type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClasses} />
                    </div>
                </div>

                {/* Alergias */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-charcoal mb-2">{t("reservations.form.requests")}</label>
                    <div className="relative">
                        <Info className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        <input type="text" value={formData.allergies} onChange={(e) => handleChange('allergies', e.target.value)} className={inputClasses} />
                    </div>
                </div>
            </div>

            {/* Horas */}
            <div className="mb-8 p-5 bg-white rounded-xl border border-sage-green/20">
                <label className="block text-sm font-bold text-charcoal mb-4">{t("modify_booking.time_label")}</label>

                {isLoadingTimes ? (
                    <div className="flex items-center text-forest-green font-medium">
                        <div className="w-5 h-5 border-2 border-forest-green border-t-transparent rounded-full animate-spin mr-3"></div>
                        {t("modify_booking.loading_times")}
                    </div>
                ) : timesToRender.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {timesToRender.map((slot) => {
                            // ✨ MAGIA: Evaluamos usando tu utilidad con 60 MINUTOS de margen
                            const isPast = isTimeSlotPast(formData.date, slot.time, 60);

                            // Si el status es full o la hora ya pasó según nuestra regla, lo deshabilitamos
                            const isFull = slot.status === 'full' || isPast;

                            // Excepción: Si es EXACTAMENTE la hora que el usuario ya tiene reservada, 
                            // la dejamos habilitada aunque falte poco tiempo (para que no pierda su mesa si solo edita otra cosa)
                            const isCurrentUsersTime = slot.time === originalTime;
                            const isDisabled = isFull && !isCurrentUsersTime;

                            const isSelected = formData.time === slot.time;

                            return (
                                <button
                                    key={slot.time}
                                    disabled={isDisabled}
                                    onClick={() => handleChange('time', slot.time)}
                                    className={`py-3 text-sm font-bold rounded-xl border-2 transition-all ${isDisabled
                                        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
                                        : isSelected
                                            ? 'bg-forest-green text-white border-forest-green shadow-md'
                                            : 'bg-white text-forest-green border-sage-green/30 hover:border-forest-green hover:bg-sage-green/10'
                                        }`}
                                >
                                    {slot.time}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-4 bg-orange-50 text-orange-800 rounded-lg text-sm font-medium">
                        {t("modify_booking.no_tables_available")}
                    </div>
                )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button onClick={saveChanges} disabled={isSaving || !formData.time} className="flex-1 bg-forest-green text-white py-4 rounded-xl font-bold hover:bg-charcoal transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                    {isSaving ? t("modify_booking.saving") : t("modify_booking.save_changes_btn")}
                </button>
                <button onClick={onCancel} disabled={isSaving} className="flex-1 bg-white border-2 border-gray-200 text-charcoal py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
                    {t("modify_booking.btn_cancel")}
                </button>
            </div>
        </motion.div>
    );
};
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Users, MapPin, AlertCircle, Phone, Info } from 'lucide-react';
import { useModifyBooking } from '../../hooks/useModifyBooking';
import Calendar from '../Calendar';
import { getMinDate } from '../../utils/dateUtils.js';
import { TimeSlotSelector } from '../TimeSlotSelector';

const inputClasses = "w-full pl-10 pr-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green outline-none shadow-sm cursor-pointer";


// Reusable component for form fields
const FormField = ({ label, icon: Icon, children, className = "" }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-charcoal mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 z-10" pointerEvents="none" />}
            {children}
        </div>
    </div>
);

export const ModifyBookingForm = ({ booking, token, t, onCancel, onSuccess }) => {
    const { formData, availableTimes, isLoadingTimes, isSaving, error, handleChange, saveChanges } = useModifyBooking(booking, token, onSuccess);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
        };
        if (showCalendar) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showCalendar]);

    const originalTime = booking.start_time.substring(0, 5);
    const isBasicDataUnchanged =
        formData.date === booking.booking_date.split('T')[0] &&
        parseInt(formData.pax) === booking.guests &&
        formData.zone === (booking.confirmed_zone || 'Lounge');

    let timesToRender = [...availableTimes];
    if (isBasicDataUnchanged && !timesToRender.some(slot => slot.time === originalTime)) {
        timesToRender.push({ time: originalTime, status: 'available' });
        timesToRender.sort((a, b) => a.time.localeCompare(b.time));
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6">
            <h3 className="text-xl font-bold text-forest-green mb-6">{t("modify_booking.modify_title")}</h3>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-start font-medium border border-red-200">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    {t(`modify_booking.errors.${error}`, { defaultValue: error })}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                {/* 1. Pax */}
                <FormField label={t("modify_booking.guests_label")} icon={Users}>
                    <select value={formData.pax} onChange={(e) => handleChange('pax', e.target.value)} className={inputClasses}>
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1} {t("modify_booking.people")}</option>
                        ))}
                    </select>
                </FormField>

                {/* 2. Calendar */}
                <div ref={calendarRef}>
                    <FormField label={t("modify_booking.date_label")} icon={CalendarIcon}>
                        <div onClick={() => setShowCalendar(!showCalendar)} className={`${inputClasses} flex items-center`}>
                            {formData.date}
                        </div>
                        <AnimatePresence>
                            {showCalendar && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                                >
                                    <Calendar
                                        compact={true}
                                        selectedDate={formData.date}
                                        minDate={getMinDate()}
                                        onDateSelect={(date) => {
                                            const localDate = new Date(date);
                                            localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
                                            handleChange('date', localDate.toISOString().split('T')[0]);
                                            setShowCalendar(false);
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </FormField>
                </div>

                {/* 3. Zone */}
                <FormField label={t("modify_booking.zone_label")} icon={MapPin}>
                    <select value={formData.zone} onChange={(e) => handleChange('zone', e.target.value)} className={inputClasses}>
                        <option value="Lounge">{t("reservations.form.lounge", "Lounge")}</option>
                        <option value="Terrace">{t("reservations.form.terrace", "Terrace")}</option>
                    </select>
                </FormField>

                {/* 4. Phone */}
                <FormField label={t("reservations.form.phone")} icon={Phone}>
                    <input type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClasses} />
                </FormField>

                {/* 5. Allergies */}
                <FormField label={t("reservations.form.requests")} icon={Info} className="md:col-span-2">
                    <input type="text" value={formData.allergies} onChange={(e) => handleChange('allergies', e.target.value)} className={inputClasses} />
                </FormField>
            </div>

            {/* Time slots */}
            <div className="mb-8 p-5 bg-white rounded-xl border border-sage-green/20">
                <label className="block text-sm font-bold text-charcoal mb-4">{t("modify_booking.time_label")}</label>

                <TimeSlotSelector
                    availableTimes={timesToRender}
                    selectedDate={formData.date}
                    selectedTime={formData.time}
                    isLoadingTimes={isLoadingTimes}
                    originalTime={originalTime}
                    marginMinutes={60}
                    onTimeSelect={(time) => handleChange('time', time)}
                    t={t}
                />
            </div>

            {/* Buttons */}
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
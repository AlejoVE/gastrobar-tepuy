import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'

import { useManageBooking } from '../hooks/useManageBooking.js'
import { LoadingState, ErrorState, CancelledState } from '../components/manage-booking/BookingStates.jsx'
import { BookingHeader, BookingDetails } from '../components/manage-booking/BookingInfo'
import { BookingActions } from '../components/manage-booking/BookingActions'
import { ModifyBookingForm } from '../components/manage-booking/ModifyBookingForm' // Añadimos la importación
import { BookingSuccess } from '../components/reservation-steps/ReservationSteps'

export default function ManageBookingPage({ token, setCurrentPage }) {
    const { t } = useTranslation()
    const {
        appState, booking, isCancelled, showConfirm,
        setShowConfirm, isProcessing, executeCancel
    } = useManageBooking(token)

    // NUEVO: Estado para controlar si estamos en modo edición
    const [isModifying, setIsModifying] = useState(false)
    const [isModifySuccess, setIsModifySuccess] = useState(false)

    if (appState === 'loading') return <LoadingState t={t} />
    if (appState === 'error') return <ErrorState t={t} setCurrentPage={setCurrentPage} />
    if (isModifySuccess) {
        return <BookingSuccess setCurrentPage={setCurrentPage} t={t} modifyMessage={true} />
    }

    return (
        <div className="min-h-[70vh] bg-pure-white p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                {!isCancelled && (
                    <button onClick={() => setCurrentPage('home')} className="flex items-center text-forest-green mb-6 hover:opacity-80 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t("manage_booking.back_restaurant")}
                    </button>
                )}

                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    <BookingHeader booking={booking} isCancelled={isCancelled} t={t} />

                    <div className="p-6 sm:p-8">
                        <AnimatePresence mode="wait">
                            {isCancelled ? (
                                <CancelledState key="cancelled" t={t} setCurrentPage={setCurrentPage} />
                            ) : isModifying ? (
                                // NUEVO: Vista de Modificación
                                <motion.div key="modify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <ModifyBookingForm
                                        booking={booking}
                                        token={token}
                                        t={t}
                                        onCancel={() => setIsModifying(false)}
                                        onSuccess={() => setIsModifySuccess(true)}
                                    />
                                </motion.div>
                            ) : (
                                // Vista Normal de Detalles
                                <motion.div key="manage" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                    <BookingDetails booking={booking} t={t} />
                                    <BookingActions
                                        booking={booking}
                                        t={t}
                                        showConfirm={showConfirm}
                                        setShowConfirm={setShowConfirm}
                                        isProcessing={isProcessing}
                                        executeCancel={executeCancel}
                                        // Pasamos la función para activar el modo edición
                                        onModifyClick={() => setIsModifying(true)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
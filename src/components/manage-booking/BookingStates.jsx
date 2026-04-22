import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'

export const LoadingState = ({ t }) => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sage-green font-medium">{t("manage_booking.loading")}</p>
    </div>
)

export const ErrorState = ({ t, setCurrentPage }) => (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border-t-4 border-red-500">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-50" />
            <h1 className="text-2xl font-serif text-charcoal mb-2">{t("manage_booking.error_title")}</h1>
            <p className="text-gray-600 mb-6 text-sm">{t("manage_booking.error_desc")}</p>
            <button onClick={() => setCurrentPage('home')} className="w-full bg-forest-green text-white py-2.5 rounded-lg font-medium hover:opacity-90">
                {t("manage_booking.back_home")}
            </button>
        </div>
    </div>
)

export const CancelledState = ({ t, setCurrentPage }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
        <CheckCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-8">{t("manage_booking.cancel_success_desc")}</p>
        <button onClick={() => setCurrentPage('home')} className="bg-charcoal text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition">
            {t("manage_booking.back_home")}
        </button>
    </motion.div>
)
import { motion } from 'framer-motion'

export const BookingActions = ({ booking, t, showConfirm, setShowConfirm, isProcessing, executeCancel, onModifyClick }) => {
    // 1. Limite de modificaciones
    if (booking.modification_count >= 1) {
        return (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 text-sm mt-6">
                <strong>{t("manage_booking.limit_title")}</strong> {t("manage_booking.limit_desc")}
            </div>
        )
    }

    // 2. Confirmación de Cancelación
    if (showConfirm) {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 p-5 rounded-xl border border-red-100 mt-6">
                <h3 className="text-red-800 font-semibold mb-2">{t("manage_booking.cancel_confirm_title")}</h3>
                <p className="text-red-600 text-sm mb-4">{t("manage_booking.cancel_confirm_desc")}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={executeCancel} disabled={isProcessing} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50">
                        {isProcessing ? t("manage_booking.cancelling") : t("manage_booking.btn_yes_cancel")}
                    </button>
                    <button onClick={() => setShowConfirm(false)} disabled={isProcessing} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition">
                        {t("manage_booking.btn_no_keep")}
                    </button>
                </div>
            </motion.div>
        )
    }

    // 3. Botones por defecto
    return (
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
            <button onClick={onModifyClick} className="flex-1 bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition shadow-md">
                {t("manage_booking.modify_btn")}
            </button>
            <button onClick={() => setShowConfirm(true)} className="flex-1 bg-white border border-red-200 text-red-500 py-3 rounded-lg font-medium hover:bg-red-50 transition">
                {t("manage_booking.cancel_btn")}
            </button>
        </div>
    )
}
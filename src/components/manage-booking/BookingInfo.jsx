import { Calendar, Clock, Users } from 'lucide-react'

export const BookingHeader = ({ booking, isCancelled, t }) => (
    <div className={`p-6 text-white transition-colors duration-500 ${isCancelled ? 'bg-red-500' : 'bg-forest-green'}`}>
        <h1 className="text-2xl font-serif">{isCancelled ? t("manage_booking.cancel_success_title") : t("manage_booking.title")}</h1>
        <p className="opacity-90 mt-1 text-sm tracking-widest">{t("manage_booking.ref")}: #{booking.reservation_id}</p>
    </div>
)

export const BookingDetails = ({ booking, t }) => (
    <>
        <h2 className="text-xl font-serif text-charcoal mb-6">{t("manage_booking.hello")}, {booking.customer_name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <InfoBox icon={<Calendar />} label={t("manage_booking.date")} value={booking.booking_date.substring(0, 10)} />
            <InfoBox icon={<Clock />} label={t("manage_booking.time")} value={booking.start_time.substring(0, 5)} />
            <InfoBox icon={<Users />} label={t("manage_booking.table")} value={`${booking.guests} ${t("manage_booking.pax")}`} />
        </div>
    </>
)

const InfoBox = ({ icon, label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3 border border-gray-100">
        <div className="text-sage-green w-5 h-5">{icon}</div>
        <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{label}</p>
            <p className="font-medium text-charcoal text-sm">{value}</p>
        </div>
    </div>
)
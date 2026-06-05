import { isTimeSlotPast } from '../utils/dateUtils';

export const TimeSlotSelector = ({
    availableTimes,      // Array of times [{time: ‘6:00 PM’, status: ‘available’}, ...]
    selectedDate,        // The date to determine whether it has already passed
    selectedTime,        // The time that the user has clicked
    isLoadingTimes,      // Spinner boolean
    onTimeSelect,        // Generic function to handle time selection
    t,                   // Translator
    originalTime = null, // (Optional) Only for modifying reservations
    marginMinutes = 30   // Safety margin (30 for new, 60 for modification)
}) => {

    if (isLoadingTimes) {
        return (
            <div className="flex items-center text-forest-green font-medium">
                <div className="w-5 h-5 border-2 border-forest-green border-t-transparent rounded-full animate-spin mr-3"></div>
                {t("modify_booking.loading_times") || t("reservations.messages.loading")}
            </div>
        );
    }

    if (!availableTimes || availableTimes.length === 0) {
        return (
            <div className="p-4 bg-orange-50 text-orange-800 rounded-lg text-sm font-medium">
                {t("modify_booking.no_tables_available")}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {availableTimes.map((slot) => {
                // 1. We'll figure out if it's already happened using the margin provided by props
                const isPast = isTimeSlotPast(selectedDate, slot.time, marginMinutes);
                const isFull = slot.status === 'full' || isPast;

                // 2. If we were given an originalTime (Modification), we protect it. If not (New reservation), this will be false.
                const isCurrentUsersTime = originalTime && slot.time === originalTime;

                // 3. Evaluate if it should be blocked
                const isDisabled = isFull && !isCurrentUsersTime;

                // 4. We check to see if it is selected
                const isSelected = selectedTime === slot.time;

                return (
                    <button
                        key={slot.time}
                        disabled={isDisabled}
                        onClick={() => onTimeSelect(slot.time)}
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
    );
};
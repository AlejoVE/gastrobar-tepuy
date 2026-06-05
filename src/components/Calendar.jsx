"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Calendar = ({ selectedDate, onDateSelect, minDate, compact = false }) => {
  const { t } = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Dynamic sizes in the 'compact' prop
  const containerClass = compact ? "max-w-xs w-full mx-auto p-4" : "max-w-md w-full mx-auto";
  const titleClass = compact ? "text-lg font-bold text-forest-green capitalize" : "text-xl font-semibold text-forest-green capitalize";
  const btnClass = compact ? "h-9 w-9 text-sm" : "h-12 w-12";
  const dayHeaderClass = compact ? "h-8 text-xs" : "h-10 text-sm";
  const gapClass = compact ? "gap-0.5" : "gap-1";


  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Minimum allowed date
  const effectiveMinDate = minDate ? new Date(minDate) : new Date()
  effectiveMinDate.setHours(0, 0, 0, 0)

  const normalizedSelectedDate = selectedDate ? new Date(selectedDate) : null;
  if (normalizedSelectedDate) {
    normalizedSelectedDate.setHours(0, 0, 0, 0);
  }

  const monthNames = t("calendar.months", { returnObjects: true })
  const dayNames = t("calendar.days", { returnObjects: true })

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (date >= effectiveMinDate) onDateSelect(date)
  }

  return (
    // ✨ Usamos containerClass en lugar de clases fijas
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-warm-cream rounded-lg transition-colors">
          <ChevronLeft size={20} className="text-forest-green" />
        </button>
        {/* ✨ Usamos titleClass */}
        <h3 className={titleClass}>
          {Array.isArray(monthNames) && monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-warm-cream rounded-lg transition-colors">
          <ChevronRight size={20} className="text-forest-green" />
        </button>
      </div>

      {/* ✨ Usamos gapClass en la grilla */}
      <div className={`grid grid-cols-7 ${gapClass} mb-2`}>
        {Array.isArray(dayNames) && dayNames.map((day, index) => (
          // ✨ Usamos dayHeaderClass
          <div key={index} className={`${dayHeaderClass} flex items-center justify-center`}>
            <span className="text-sm font-sans font-medium text-sage-green">{day}</span>
          </div>
        ))}
      </div>

      {/* ✨ Usamos gapClass en la grilla principal */}
      <div className={`grid grid-cols-7 ${gapClass}`}>
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          // ✨ Los espacios en blanco también deben usar btnClass para mantener la proporción
          <div key={`empty-${i}`} className={btnClass}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          date.setHours(0, 0, 0, 0);

          const isSelected = normalizedSelectedDate && date.getTime() === normalizedSelectedDate.getTime();
          const isAvailable = date >= effectiveMinDate;
          const isActualToday = date.getTime() === today.getTime();

          return (
            <motion.button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={!isAvailable}
              // ✨ Añadimos flex, items-center y justify-center para centrar el número, y usamos btnClass
              className={`${btnClass} rounded-lg font-sans font-medium transition-all duration-200 flex items-center justify-center
                ${isSelected
                  ? "bg-forest-green text-white shadow-lg border-transparent"
                  : isAvailable
                    ? "hover:bg-forest-green/20 text-charcoal bg-white"
                    : "text-gray-300 cursor-not-allowed bg-gray-50 opacity-60"
                }
                ${isActualToday && !isSelected ? "border-2 border-natural-wood" : "border border-sage-green/20"}
              `}
            >
              {day}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-sage-green/20 flex flex-wrap gap-4 text-sm text-charcoal/80">
        <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-forest-green rounded"></div><span>{t("calendar.selected")}</span></div>
        <div className="flex items-center space-x-2"><div className="w-4 h-4 border-2 border-natural-wood rounded"></div><span>{t("calendar.today")}</span></div>
        <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-gray-200 opacity-60 rounded"></div><span>{t("calendar.unavailable")}</span></div>
      </div>
    </div>
  )
}

export default Calendar
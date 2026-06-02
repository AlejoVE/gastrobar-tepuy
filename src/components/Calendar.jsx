"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Calendar = ({ selectedDate, onDateSelect, minDate, compact = false }) => {
  const { t } = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Tamaños dinámicos basados en la prop 'compact'
  const containerClass = compact ? "max-w-xs w-full mx-auto p-4" : "max-w-md w-full mx-auto";
  const titleClass = compact ? "text-lg font-bold text-forest-green capitalize" : "text-xl font-semibold text-forest-green capitalize";
  const btnClass = compact ? "h-9 w-9 text-sm" : "h-12 w-12";
  const dayHeaderClass = compact ? "h-8 text-xs" : "h-10 text-sm";
  const gapClass = compact ? "gap-0.5" : "gap-1";

  // "today" real para efectos visuales
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Fecha mínima real permitida
  const effectiveMinDate = minDate ? new Date(minDate) : new Date()
  effectiveMinDate.setHours(0, 0, 0, 0)

  // ✨ LA SOLUCIÓN: Normalizamos la fecha seleccionada sin importar si viene como String o Date
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
    <div className="max-w-md mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-warm-cream rounded-lg transition-colors">
          <ChevronLeft size={20} className="text-forest-green" />
        </button>
        <h3 className="font-sans text-xl font-semibold text-forest-green capitalize">
          {Array.isArray(monthNames) && monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-warm-cream rounded-lg transition-colors">
          <ChevronRight size={20} className="text-forest-green" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {Array.isArray(dayNames) && dayNames.map((day, index) => (
          <div key={index} className="h-10 flex items-center justify-center">
            <span className="text-sm font-sans font-medium text-sage-green">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          date.setHours(0, 0, 0, 0);

          const isSelected = normalizedSelectedDate && date.getTime() === normalizedSelectedDate.getTime();
          // Disponibilidad basada en la fecha mínima calculada
          const isAvailable = date >= effectiveMinDate;
          // Identificador para pintar el borde del día real actual
          const isActualToday = date.getTime() === today.getTime();

          return (
            <motion.button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={!isAvailable}
              className={`h-12 w-12 rounded-lg font-sans font-medium transition-all duration-200 
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
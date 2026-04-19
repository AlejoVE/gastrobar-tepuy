"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Calendar = ({ selectedDate, onDateSelect }) => {
  const { t } = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

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
    if (date >= today) onDateSelect(date)
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-warm-cream rounded-lg">
          <ChevronLeft size={20} className="text-forest-green" />
        </button>
        <h3 className="font-sans text-xl font-semibold text-forest-green capitalize">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-warm-cream rounded-lg">
          <ChevronRight size={20} className="text-forest-green" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
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
          const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
          const isAvailable = date >= today;

          return (
            <motion.button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={!isAvailable}
              className={`h-12 w-12 rounded-lg font-sans font-medium transition-colors ${isSelected ? "bg-forest-green text-white shadow-lg" : isAvailable ? "hover:bg-forest-green/20 text-charcoal bg-white border border-sage-green/20" : "text-gray-300 cursor-not-allowed bg-gray-50"
                }`}
            >
              {day}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-sage-green/20 flex flex-wrap gap-4 text-sm text-charcoal/80">
        <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-forest-green rounded"></div><span>{t("calendar.selected")}</span></div>
        <div className="flex items-center space-x-2"><div className="w-4 h-4 border-2 border-natural-wood rounded"></div><span>{t("calendar.today")}</span></div>
        <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-gray-200 rounded"></div><span>{t("calendar.unavailable")}</span></div>
      </div>
    </div>
  )
}

export default Calendar
"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Calendar = ({ selectedDate, onDateSelect }) => {
  const { t, i18n } = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthNames = {
    es: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    fr: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
  }

  const dayNames = {
    es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  }

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  const isDateAvailable = (date) => {
    return date >= today
  }

  const isDateSelected = (date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (isDateAvailable(date)) {
      onDateSelect(date)
    }
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isAvailable = isDateAvailable(date)
      const isSelected = isDateSelected(date)
      const isToday = date.toDateString() === today.toDateString()

      days.push(
        <motion.button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={!isAvailable}
          className={`h-12 w-12 rounded-lg font-sans font-medium transition-colors ${isSelected
            ? "bg-forest-green text-white shadow-lg"
            : isAvailable
              ? "hover:bg-forest-green/20 hover:text-forest-green text-charcoal bg-white border border-sage-green/20"
              : "text-gray-300 cursor-not-allowed bg-gray-50"
            } ${isToday && !isSelected ? "ring-2 ring-natural-wood" : ""}`}
          whileHover={isAvailable ? { scale: 1.05 } : {}}
          whileTap={isAvailable ? { scale: 0.95 } : {}}
        >
          {day}
        </motion.button>,
      )
    }

    return days
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-warm-cream rounded-lg transition-colors"
          aria-label={t("calendar.previousMonth")}
        >
          <ChevronLeft size={20} />
        </button>

        <h3 className="font-sans text-xl font-semibold text-forest-green">
          {monthNames[i18n.language]?.[currentMonth.getMonth()] || monthNames.en[currentMonth.getMonth()]}{" "}
          {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-warm-cream rounded-lg transition-colors"
          aria-label={t("calendar.nextMonth")}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {(dayNames[i18n.language] || dayNames.en).map((day, index) => (
          <div key={index} className="h-10 flex items-center justify-center">
            <span className="text-sm font-sans font-medium text-gray-600">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      {/* Legend */}
      <div className="mt-6 space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-forest-green rounded"></div>
          <span>{t("calendar.selected")}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-natural-wood rounded"></div>
          <span>{t("calendar.today")}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>{t("calendar.unavailable")}</span>
        </div>
        {/* <p className="text-xs text-gray-500 mt-2">{t("calendar.closedMondays")}</p> */}
      </div>
    </div>
  )
}

export default Calendar

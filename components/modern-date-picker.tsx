"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ModernDatePickerProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}

export function ModernDatePicker({ selectedDate, onDateSelect, minDate, maxDate }: ModernDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: (Date | null)[] = []

    // Add empty slots for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return isSameDay(date, today)
  }

  const isDisabled = (date: Date | null) => {
    if (!date) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (date: Date | null) => {
    if (date && !isDisabled(date)) {
      onDateSelect(date)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h3 className="text-base font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate)
          const isTodayDate = isToday(date)
          const disabled = isDisabled(date)

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all duration-200
                ${!date ? 'invisible' : ''}
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'}
                ${isSelected ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' : ''}
                ${isTodayDate && !isSelected ? 'border border-primary/50 text-primary' : ''}
                ${!isSelected && !isTodayDate && date ? 'text-foreground' : ''}
              `}
            >
              {date?.getDate()}
            </button>
          )
        })}
      </div>

      {/* Quick select today */}
      {!isSameDay(selectedDate, new Date()) && (
        <button
          onClick={() => onDateSelect(new Date())}
          className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          Today
        </button>
      )}
    </div>
  )
}

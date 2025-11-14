import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function AnimatedDatePicker({ name, value, onChange, label, icon, borderColor = 'teal', minDate = null, referenceDates = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value || '')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const inputRef = useRef(null)
  const calendarRef = useRef(null)

  useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setCurrentMonth(new Date(value))
    } else {
      // If no value, show current month
      setCurrentMonth(new Date())
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const handleDateSelect = (date) => {
    if (!date) return
    
    const formattedDate = date.toISOString().split('T')[0]
    setSelectedDate(formattedDate)
    onChange({ target: { name, value: formattedDate } })
    setIsOpen(false)
  }

  const isDateDisabled = (date) => {
    if (!date) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dateTime = new Date(date).setHours(0, 0, 0, 0)
    
    // Disable dates before today
    if (dateTime < today.getTime()) return true
    
    // Disable dates before or equal to minDate
    if (minDate) {
      const minDateTime = new Date(minDate).setHours(0, 0, 0, 0)
      return dateTime <= minDateTime
    }
    
    return false
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select date'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isTomorrow = (date) => {
    if (!date) return false
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date.toDateString() === tomorrow.toDateString()
  }

  const isReferenceDate = (date) => {
    if (!date || !referenceDates || referenceDates.length === 0) return null
    const dateStr = date.toISOString().split('T')[0]
    return referenceDates.find(ref => ref.date === dateStr)
  }

  const isSelected = (date) => {
    if (!date || !selectedDate) return false
    return date.toISOString().split('T')[0] === selectedDate
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const borderColors = {
    teal: 'border-teal-500 focus:ring-teal-500/20',
    orange: 'border-orange-500 focus:ring-orange-500/20',
    red: 'border-red-500 focus:ring-red-500/20'
  }

  const buttonColors = {
    teal: 'bg-teal-500 hover:bg-teal-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    red: 'bg-red-500 hover:bg-red-600'
  }

  return (
    <div className="relative">
      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
        {icon && <i className={`${icon} mr-2`}></i>}
        {label}
      </label>
      
      <div
        ref={inputRef}
        onClick={() => {
          // Reset to current month when opening if no date selected
          if (!isOpen && !selectedDate) {
            setCurrentMonth(new Date())
          } else if (!isOpen && selectedDate) {
            setCurrentMonth(new Date(selectedDate))
          }
          setIsOpen(!isOpen)
        }}
        className={`w-full px-4 py-3 rounded-lg border-2 ${borderColors[borderColor]} bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white cursor-pointer transition-all hover:border-${borderColor}-400 flex items-center justify-between`}
      >
        <span className={selectedDate ? '' : 'text-slate-400'}>
          {formatDisplayDate(selectedDate)}
        </span>
        <motion.i 
          className="fas fa-calendar-alt text-slate-500"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        ></motion.i>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ 
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute z-50 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-80"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                <i className="fas fa-chevron-left text-slate-600 dark:text-slate-300"></i>
              </motion.button>
              
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
              >
                <i className="fas fa-chevron-right text-slate-600 dark:text-slate-300"></i>
              </motion.button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const disabled = !date || isDateDisabled(date)
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      ...(isToday(date) && !isSelected(date) && !isReferenceDate(date) ? {
                        boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 8px rgba(59, 130, 246, 0)']
                      } : {})
                    }}
                    transition={{ 
                      delay: index * 0.01,
                      boxShadow: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }
                    }}
                    whileHover={date && !disabled ? { scale: 1.1 } : {}}
                    whileTap={date && !disabled ? { scale: 0.95 } : {}}
                    onClick={() => handleDateSelect(date)}
                    disabled={disabled}
                    className={`
                      h-10 rounded-lg text-sm font-medium transition-all relative
                      ${!date ? 'invisible' : ''}
                      ${disabled && date
                        ? 'bg-slate-200 dark:bg-gray-800 text-slate-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                        : isSelected(date) 
                          ? `${buttonColors[borderColor]} text-white shadow-lg` 
                          : isReferenceDate(date)
                            ? (() => {
                                const ref = isReferenceDate(date)
                                const colors = {
                                  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-2 border-teal-400 dark:border-teal-600',
                                  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-2 border-orange-400 dark:border-orange-600',
                                  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-400 dark:border-red-600'
                                }
                                return colors[ref.color] || colors.teal
                              })()
                            : isToday(date)
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-500 font-bold'
                              : isTomorrow(date)
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700'
                                : 'bg-slate-50 dark:bg-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {date?.getDate()}
                    {isToday(date) && !isSelected(date) && !isReferenceDate(date) && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                    )}
                    {isReferenceDate(date) && !isSelected(date) && (
                      <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"></span>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Today Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDateSelect(new Date())}
              className={`w-full mt-4 py-2 ${buttonColors[borderColor]} text-white rounded-lg font-semibold transition-all shadow-lg`}
            >
              <i className="fas fa-calendar-day mr-2"></i>
              Select Today ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

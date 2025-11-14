import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function CustomSelect({ name, value, onChange, options, label, icon, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || '')
  const selectRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target) && 
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue) => {
    setSelectedValue(optionValue)
    onChange({ target: { name, value: optionValue } })
    setIsOpen(false)
  }

  const getSelectedLabel = () => {
    const selected = options.find(opt => opt.value === selectedValue)
    return selected ? selected.label : placeholder
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
          {icon && <i className={`${icon} mr-2`}></i>}
          {label}
        </label>
      )}
      
      <div
        ref={selectRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-w-[200px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white cursor-pointer transition-all hover:border-teal-500 hover:shadow-lg flex items-center justify-between ${
          isOpen ? 'border-teal-500 shadow-lg ring-2 ring-teal-500/20' : ''
        }`}
      >
        <span className={`flex-1 truncate ${selectedValue ? 'font-medium' : 'text-slate-400'}`}>
          {getSelectedLabel()}
        </span>
        <motion.i 
          className="fas fa-chevron-down text-teal-500 ml-2 flex-shrink-0"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        ></motion.i>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute z-[100] mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-96 overflow-y-auto scrollbar-hide"
          >
            {options.length === 0 ? (
              <div className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option, index) => {
              const isSelected = selectedValue === option.value
              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(option.value)}
                  className={`px-5 py-3.5 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold'
                      : 'hover:bg-teal-50 dark:hover:bg-teal-900/20 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {isSelected && (
                    <motion.i 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="fas fa-check text-white"
                    ></motion.i>
                  )}
                </motion.div>
              )
            }))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

import { motion, AnimatePresence } from 'motion/react'

export default function CustomAlert({ isOpen, onClose, title, message, type = 'warning', icon }) {
  if (!isOpen) return null

  const typeStyles = {
    warning: {
      gradient: 'from-orange-500 to-amber-600',
      icon: icon || 'fa-exclamation-triangle',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-500',
      buttonBg: 'bg-orange-500 hover:bg-orange-600'
    },
    error: {
      gradient: 'from-red-500 to-rose-600',
      icon: icon || 'fa-times-circle',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-500',
      buttonBg: 'bg-red-500 hover:bg-red-600'
    },
    success: {
      gradient: 'from-green-500 to-emerald-600',
      icon: icon || 'fa-check-circle',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-500',
      buttonBg: 'bg-green-500 hover:bg-green-600'
    },
    info: {
      gradient: 'from-blue-500 to-indigo-600',
      icon: icon || 'fa-info-circle',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      buttonBg: 'bg-blue-500 hover:bg-blue-600'
    }
  }

  const style = typeStyles[type]

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${style.gradient} p-6 text-white`}>
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className={`w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center`}
              >
                <i className={`fas ${style.icon} text-3xl text-white`}></i>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{title}</h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`w-full py-3 ${style.buttonBg} text-white font-bold rounded-xl shadow-lg transition-all`}
            >
              Got it!
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

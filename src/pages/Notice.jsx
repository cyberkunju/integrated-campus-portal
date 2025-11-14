import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'

export default function Notice() {
  const navigate = useNavigate()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const user = api.getCurrentUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchNotices = async () => {
      try {
        const result = await api.getNotices()
        if (result.success) {
          setNotices(result.data || [])
        }
      } catch (error) {
        console.error('Error fetching notices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  const categories = {
    general: { label: 'General', icon: 'fa-info-circle', color: 'purple' },
    academic: { label: 'Academic', icon: 'fa-graduation-cap', color: 'blue' },
    event: { label: 'Event', icon: 'fa-calendar-alt', color: 'green' },
    exam: { label: 'Exam', icon: 'fa-file-alt', color: 'orange' },
    holiday: { label: 'Holiday', icon: 'fa-umbrella-beach', color: 'teal' },
    sports: { label: 'Sports', icon: 'fa-futbol', color: 'red' }
  }

  const getCategoryIcon = (category) => {
    return categories[category]?.icon || 'fa-info-circle'
  }

  const getCategoryColor = (category) => {
    const color = categories[category]?.color || 'purple'
    return `bg-${color}-500/20 text-${color}-500`
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
      normal: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      high: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
      urgent: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
    }
    return colors[priority] || colors.normal
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-slate-800 dark:text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen pb-24 px-4 py-6 max-w-5xl mx-auto"
      >
      {/* Top Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Notice Board</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-slate-700 dark:text-slate-300 font-medium">{user?.full_name || 'Student'}</span>
          {user?.profile_image ? (
            <img 
              src={user.profile_image} 
              alt={user.full_name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              {user?.full_name?.charAt(0) || 'S'}
            </div>
          )}
        </div>
      </header>

      <p className="text-slate-600 dark:text-slate-400 mb-8">Stay updated with announcements</p>

      {/* Notices */}
      <div className="space-y-6">
        {notices.length === 0 ? (
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-lg text-center">
            <i className="fas fa-bullhorn text-6xl text-slate-400 mb-4"></i>
            <p className="text-slate-600 dark:text-slate-400 text-lg">No notices available at the moment.</p>
          </div>
        ) : (
          notices.map((notice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Notice Content */}
              <div className="p-6 w-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(notice.category)}`}>
                        <i className={`fas ${getCategoryIcon(notice.category)} text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{notice.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {notice.created_by && `Posted by ${notice.created_by} • `}
                          {new Date(notice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  {notice.priority && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(notice.category)}`}>
                    {categories[notice.category]?.label || notice.category}
                  </span>
                </div>

                {/* Content */}
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{notice.content}</p>
                
                {/* Pay Now Button for Fee Notices */}
                {notice.feeDetails && (
                  <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-600">
                    <button
                      onClick={() => navigate('/payments')}
                      className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
                    >
                      <i className="fas fa-credit-card text-xl"></i>
                      Pay Now - ₹{notice.feeDetails.amount}
                    </button>
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-3">
                      <i className="fas fa-info-circle mr-1"></i>
                      Click to proceed to payment page
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
      </motion.div>
      <Navigation />
    </>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'

export default function TeacherNotice() {
  const navigate = useNavigate()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const user = api.getCurrentUser()

  const categories = {
    general: { label: 'General', icon: 'fa-info-circle', color: 'purple' },
    academic: { label: 'Academic', icon: 'fa-graduation-cap', color: 'blue' },
    event: { label: 'Event', icon: 'fa-calendar-alt', color: 'green' },
    exam: { label: 'Exam', icon: 'fa-file-alt', color: 'orange' },
    holiday: { label: 'Holiday', icon: 'fa-umbrella-beach', color: 'teal' },
    sports: { label: 'Sports', icon: 'fa-futbol', color: 'red' }
  }

  useEffect(() => {
    if (!user || user.role !== 'staff') {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pb-24 px-4 py-6 max-w-7xl mx-auto"
    >
      {/* Top Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
          >
            <i className="fas fa-arrow-left text-slate-800 dark:text-white"></i>
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Notice Board</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-slate-700 dark:text-slate-300 font-medium">{user?.full_name}</span>
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <i className="fas fa-bullhorn text-lg"></i>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fas fa-bullhorn text-3xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Announcements & Notices</h2>
            <p className="text-teal-100">Stay updated with important information</p>
          </div>
        </div>
      </div>

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
              className={`bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                notice.image_url ? 'flex flex-col md:flex-row' : ''
              }`}
            >
              {/* Notice Content */}
              <div className={`p-6 ${notice.image_url ? 'md:flex-1' : 'w-full'}`}>
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
              </div>

              {/* Image (if exists) */}
              {notice.image_url && (
                <div className="md:w-80 md:flex-shrink-0">
                  <img
                    src={notice.image_url}
                    alt={notice.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

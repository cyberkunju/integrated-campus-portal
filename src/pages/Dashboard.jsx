import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notices, setNotices] = useState([])
  const user = api.getCurrentUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchStats = async () => {
      try {
        const result = await api.getDashboardStats(user.student_id)
        if (result.success) {
          setStats(result.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Load notices from localStorage
    const loadNotices = () => {
      const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
      // Get latest 3 notices
      setNotices(storedNotices.slice(0, 3))
    }
    
    loadNotices()
  }, [])

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
        className="min-h-screen pb-24 px-4 py-6 max-w-7xl mx-auto"
      >
      {/* Top Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg flex items-center gap-4">
            {user?.profile_image ? (
              <img 
                src={user.profile_image} 
                alt={user.full_name} 
                className="w-16 h-16 rounded-full object-cover border-4 border-indigo-500 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 text-2xl font-bold">
                {user?.full_name?.charAt(0) || 'S'}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                Welcome Back, {user?.full_name?.split(' ')[0] || 'Student'}!
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {user?.department && `${user.department} • Semester ${user.semester || 'N/A'}`}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Progress */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all cursor-pointer">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                Academic Progress
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36">
                  <svg className="transform -rotate-90" width="140" height="140">
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray="377"
                      strokeDashoffset="75"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">{stats?.gpa || '0.0'}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">GPA</span>
                  </div>
                </div>
                <p className="mt-4 text-center text-slate-600 dark:text-slate-400">
                  Great job! Keep up the excellent work.
                </p>
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all cursor-pointer">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                Upcoming Assignments
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">CS101: Final Project</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Due: May 15, 2024</p>
                  </div>
                  <a href="#" className="text-blue-500 text-sm hover:underline">View</a>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">ENG203: Essay on Modernism</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Due: May 20, 2024</p>
                  </div>
                  <a href="#" className="text-blue-500 text-sm hover:underline">View</a>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">MATH305: Problem Set 5</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Due: May 22, 2024</p>
                  </div>
                  <a href="#" className="text-blue-500 text-sm hover:underline">View</a>
                </div>
              </div>
            </div>
          </div>

          {/* College Announcements */}
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all cursor-pointer">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
              College Announcements
            </h3>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p> Library hours extended during finals week</p>
              <p> Summer course registration is now open</p>
              <p> Campus-wide power outage on May 25th from 1 AM to 5 AM</p>
            </div>
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Notifications</h3>
          
          {notices.length === 0 ? (
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg text-center">
              <i className="fas fa-bell-slash text-4xl text-slate-400 mb-3"></i>
              <p className="text-slate-600 dark:text-slate-400">No notifications yet</p>
            </div>
          ) : (
            notices.map((notice, index) => {
              // Category-based icons and colors (matching Notice Board)
              const categoryStyles = {
                general: { icon: 'fas fa-info-circle', bgColor: 'bg-purple-500', hoverColor: 'hover:bg-purple-500/10 dark:hover:bg-purple-500/20' },
                academic: { icon: 'fas fa-graduation-cap', bgColor: 'bg-blue-500', hoverColor: 'hover:bg-blue-500/10 dark:hover:bg-blue-500/20' },
                event: { icon: 'fas fa-calendar-alt', bgColor: 'bg-green-500', hoverColor: 'hover:bg-green-500/10 dark:hover:bg-green-500/20' },
                exam: { icon: 'fas fa-file-alt', bgColor: 'bg-orange-500', hoverColor: 'hover:bg-orange-500/10 dark:hover:bg-orange-500/20' },
                holiday: { icon: 'fas fa-umbrella-beach', bgColor: 'bg-teal-500', hoverColor: 'hover:bg-teal-500/10 dark:hover:bg-teal-500/20' },
                sports: { icon: 'fas fa-futbol', bgColor: 'bg-red-500', hoverColor: 'hover:bg-red-500/10 dark:hover:bg-red-500/20' }
              }
              
              // Get category style or default to general
              const style = categoryStyles[notice.category] || categoryStyles.general
              const iconClass = style.icon
              const bgColor = style.bgColor
              const hoverColor = style.hoverColor
              
              // Truncate content for preview
              const contentPreview = notice.content.length > 100 
                ? notice.content.substring(0, 100) + '...' 
                : notice.content
              
              return (
                <div 
                  key={index}
                  onClick={() => navigate('/notice')}
                  className={`bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg ${hoverColor} transition-all cursor-pointer`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white flex-shrink-0`}>
                      <i className={iconClass}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 dark:text-white mb-1 truncate">
                        {notice.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {contentPreview}
                      </p>
                    </div>
                    <i className="fas fa-chevron-right text-slate-400 flex-shrink-0"></i>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      </motion.div>
      <Navigation />
    </>
  )
}

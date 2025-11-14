import { motion } from 'motion/react'
import Navigation from '../components/Navigation'
import ThemeToggle from '../components/ThemeToggle'

export default function Analysis() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen pb-24 px-4 py-6 max-w-6xl mx-auto"
      >
      {/* Top Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Performance Analysis</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-slate-700 dark:text-slate-300 font-medium">Sarah Lee</span>
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            <i className="fas fa-user-circle text-2xl"></i>
          </div>
        </div>
      </header>

      <p className="text-slate-600 dark:text-slate-400 mb-8">Track your academic progress</p>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-all cursor-pointer">
          <div className="text-blue-500 mb-2">
            <i className="fas fa-chart-line text-3xl"></i>
          </div>
          <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current GPA</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">3.8</p>
        </div>

        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-green-500/10 dark:hover:bg-green-500/20 transition-all cursor-pointer">
          <div className="text-green-500 mb-2">
            <i className="fas fa-book text-3xl"></i>
          </div>
          <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Courses</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">5</p>
        </div>

        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-all cursor-pointer">
          <div className="text-purple-500 mb-2">
            <i className="fas fa-tasks text-3xl"></i>
          </div>
          <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Assignments</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">12</p>
        </div>

        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-all cursor-pointer">
          <div className="text-orange-500 mb-2">
            <i className="fas fa-trophy text-3xl"></i>
          </div>
          <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Rank</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">15</p>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">GPA Trend</h2>
        <div className="h-64 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <i className="fas fa-chart-area text-6xl mb-4"></i>
            <p>Chart visualization would go here</p>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Subject Performance</h2>
        <div className="space-y-4">
          {['Computer Science', 'Mathematics', 'English', 'Physics', 'Chemistry'].map((subject, index) => {
            const performance = [95, 88, 92, 85, 90][index]
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-800 dark:text-white">{subject}</span>
                  <span className="text-slate-600 dark:text-slate-400">{performance}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${performance}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      </motion.div>
      <Navigation />
    </>
  )
}

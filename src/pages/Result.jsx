import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'

export default function Result() {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const user = api.getCurrentUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchResults = async () => {
      try {
        const result = await api.getResults(user.student_id)
        if (result.success) {
          setResults(result.data || [])
        }
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const totalGPA = results.length > 0 
    ? (results.reduce((sum, r) => sum + parseFloat(r.grade_point || 0), 0) / results.length).toFixed(2)
    : '0.00'

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
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Academic Results</h1>
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

      {loading ? (
        <div className="text-center py-12">
          <div className="text-2xl text-slate-800 dark:text-white">Loading results...</div>
        </div>
      ) : (
        <>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Your semester performance</p>

      {/* GPA Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-indigo-100 mb-2">Overall GPA</p>
            <h2 className="text-6xl font-bold">{totalGPA}</h2>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 mb-2">Semester</p>
            <p className="text-2xl font-semibold">Spring 2024</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Course Results</h2>
        
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-all cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold">
                    {result.subject_code}
                  </span>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {result.subject_name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Marks</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{result.marks_obtained}/{result.total_marks}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Grade</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{result.grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
          Download Transcript
        </button>
      </div>
      </>
      )}
      </motion.div>
      <Navigation />
    </>
  )
}

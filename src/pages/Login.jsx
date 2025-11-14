import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const highlightRef = useRef(null)
  const selectorRef = useRef(null)

  useEffect(() => {
    moveHighlight(role)
  }, [role])

  const moveHighlight = (selectedRole) => {
    const label = document.querySelector(`label[data-role="${selectedRole}"]`)
    if (label && highlightRef.current) {
      const labelWidth = label.offsetWidth
      const labelLeft = label.offsetLeft
      highlightRef.current.style.width = `${labelWidth}px`
      highlightRef.current.style.transform = `translateX(${labelLeft}px)`
    }
  }

  const handleLabelHover = (hoveredRole) => {
    moveHighlight(hoveredRole)
  }

  const handleMouseLeave = () => {
    moveHighlight(role)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await api.login(username, password, role)
      if (result.success) {
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (result.user.role === 'staff') {
          navigate('/teacher/dashboard')
        } else {
          navigate('/dashboard')
        }
      } else {
        setError(result.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      {/* Theme Toggle - Top Right Corner */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="relative bg-white/25 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl w-full max-w-md p-10">
        <h2 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-slate-700 dark:text-slate-300 font-semibold">
              Username or Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-slate-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-800/70 transition-all"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-slate-700 dark:text-slate-300 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-slate-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-800/70 transition-all"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:transform-none"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <div 
            ref={selectorRef}
            onMouseLeave={handleMouseLeave}
            className="relative flex bg-gray-200/30 dark:bg-gray-700/30 rounded-full mt-6 mb-3 border border-gray-200/40 dark:border-gray-600/40 p-1"
          >
            <div
              ref={highlightRef}
              className="absolute top-1 left-0 h-[calc(100%-8px)] bg-blue-500 rounded-full shadow-lg transition-all duration-300 ease-out"
            />
            
            <input
              type="radio"
              id="role-student"
              name="role"
              value="student"
              checked={role === 'student'}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />
            <label
              htmlFor="role-student"
              data-role="student"
              onMouseEnter={() => handleLabelHover('student')}
              className={`flex-1 py-2 text-center font-semibold cursor-pointer relative z-10 transition-colors ${
                role === 'student' ? 'text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Student
            </label>

            <input
              type="radio"
              id="role-staff"
              name="role"
              value="staff"
              checked={role === 'staff'}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />
            <label
              htmlFor="role-staff"
              data-role="staff"
              onMouseEnter={() => handleLabelHover('staff')}
              className={`flex-1 py-2 text-center font-semibold cursor-pointer relative z-10 transition-colors ${
                role === 'staff' ? 'text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Staff
            </label>

            <input
              type="radio"
              id="role-admin"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={(e) => setRole(e.target.value)}
              className="hidden"
            />
            <label
              htmlFor="role-admin"
              data-role="admin"
              onMouseEnter={() => handleLabelHover('admin')}
              className={`flex-1 py-2 text-center font-semibold cursor-pointer relative z-10 transition-colors ${
                role === 'admin' ? 'text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Admin
            </label>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <p className="mb-2">
              <a href="#" className="text-blue-500 hover:underline font-semibold">
                Forgot Password?
              </a>
            </p>
            <p>
              Don't have an account?{' '}
              <a href="#" className="text-blue-500 hover:underline font-semibold">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

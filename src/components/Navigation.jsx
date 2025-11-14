import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import api from '../services/api'

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    api.logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-full shadow-lg p-2 border border-white/20 dark:border-slate-800">
        <Link
          to="/dashboard"
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-colors ${
            isActive('/dashboard')
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isActive('/dashboard') && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-[#137fec] rounded-full shadow-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
          </svg>
          <span className="text-sm relative z-10">Dashboard</span>
        </Link>

        <Link
          to="/subjects"
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-colors ${
            isActive('/subjects')
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isActive('/subjects') && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-[#137fec] rounded-full shadow-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"></path>
          </svg>
          <span className="text-sm relative z-10">Subjects</span>
        </Link>

        <Link
          to="/notice"
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-colors ${
            isActive('/notice')
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isActive('/notice') && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-[#137fec] rounded-full shadow-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
          </svg>
          <span className="text-sm relative z-10">Notice</span>
        </Link>

        <Link
          to="/result"
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-colors ${
            isActive('/result')
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isActive('/result') && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-[#137fec] rounded-full shadow-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
          </svg>
          <span className="text-sm relative z-10">Results</span>
        </Link>

        <Link 
          to="/payments"
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-colors ${
            isActive('/payments')
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isActive('/payments') && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-[#137fec] rounded-full shadow-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
          </svg>
          <span className="text-sm relative z-10">Payments</span>
        </Link>

        <Link 
          to="/analysis"
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-colors ${
            isActive('/analysis')
              ? 'text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isActive('/analysis') && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-[#137fec] rounded-full shadow-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.69l50.34-50.35a8,8,0,0,1,11.32,0L128,132.69,180.69,80H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8v40a8,8,0,0,1-16,0V91.31l-58.34,58.35a8,8,0,0,1-11.32,0L96,123.31l-56,56V200H224A8,8,0,0,1,232,208Z"></path>
          </svg>
          <span className="text-sm relative z-10">Analysis</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-slate-600 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M120,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h64a8,8,0,0,1,0,16H48V208h64A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path>
          </svg>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </nav>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'

export default function TeacherAttendance() {
  const navigate = useNavigate()
  const user = api.getCurrentUser()
  
  // Get teacher's department
  const teacherDepartment = user?.department || 'BCA'
  
  // Subject database by department
  const subjectDatabase = {
    'BCA': [
      { id: 1, code: 'BCA401', name: 'Linux Administration' },
      { id: 2, code: 'BCA201', name: 'Database Management Systems' },
      { id: 3, code: 'BCA301', name: 'Data Structure Using C++' },
      { id: 4, code: 'BCA501', name: 'Java Programming Using Linux' },
      { id: 5, code: 'BCA601', name: 'Cloud Computing' },
      { id: 6, code: 'BCA501', name: 'Computer Networks' }
    ],
    'BBA': [
      { id: 1, code: 'BBA301', name: 'Business Laws' },
      { id: 2, code: 'BBA302', name: 'Human Resource Management' },
      { id: 3, code: 'BBA303', name: 'Marketing Management' },
      { id: 4, code: 'BBA401', name: 'Financial Management' },
      { id: 5, code: 'BBA501', name: 'Operations Management' }
    ],
    'B.Com': [
      { id: 1, code: 'COM301', name: 'Corporate Accounting 1' },
      { id: 2, code: 'COM302', name: 'Financial Markets' },
      { id: 3, code: 'COM401', name: 'Corporate Accounting 2' },
      { id: 4, code: 'COM501', name: 'Cost Accounting 1' },
      { id: 5, code: 'COM601', name: 'Management Accounting' }
    ]
  }
  
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedCourse, setSelectedCourse] = useState(null)
  const [attendance, setAttendance] = useState({})
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/login')
      return
    }
    
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const result = await api.getStudents()
      if (result.success && result.data) {
        // Filter students by teacher's department
        const departmentStudents = result.data.filter(
          student => student.department === teacherDepartment
        )
        setAllStudents(departmentStudents)
        
        // Set courses for teacher's department
        const deptCourses = subjectDatabase[teacherDepartment] || []
        const coursesWithCount = deptCourses.map(course => ({
          ...course,
          students: departmentStudents.length
        }))
        setCourses(coursesWithCount)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseSelect = (course) => {
    setSelectedCourse(course)
    setStudents(allStudents)
    // Initialize attendance state for all students as present by default
    const initialAttendance = {}
    allStudents.forEach(student => {
      initialAttendance[student.student_id || student.id] = 'present'
    })
    setAttendance(initialAttendance)
  }

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleSubmit = () => {
    setShowConfirmModal(true)
  }

  const confirmSubmit = () => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowConfirmModal(false)
      setShowSuccessMessage(true)
      
      // Hide success message and reset after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
        setSelectedCourse(null)
        setAttendance({})
      }, 3000)
    }, 1500)
  }

  const getPresentCount = () => {
    return Object.values(attendance).filter(status => status === 'present').length
  }

  const getAbsentCount = () => {
    return Object.values(attendance).filter(status => status === 'absent').length
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
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
            onClick={() => selectedCourse ? setSelectedCourse(null) : navigate('/teacher/dashboard')}
            className="w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
          >
            <i className="fas fa-arrow-left text-slate-800 dark:text-white"></i>
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Attendance Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-slate-700 dark:text-slate-300 font-medium">{user?.full_name}</span>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
            <i className="fas fa-calendar-check text-lg"></i>
          </div>
        </div>
      </header>

      {/* Date Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-calendar-day text-3xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{getTodayDate()}</h2>
              <p className="text-orange-100">Mark attendance for your class</p>
            </div>
          </div>
          {selectedCourse && (
            <div className="text-right">
              <p className="text-sm text-orange-100">Selected Course</p>
              <p className="text-xl font-bold">{selectedCourse.name}</p>
              <p className="text-orange-100 text-sm">{selectedCourse.code}</p>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-6xl text-orange-500 mb-4"></i>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Loading students...</p>
          </div>
        </div>
      ) : !selectedCourse ? (
        /* Course Selection Grid */
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Select Your Course</h2>
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <i className="fas fa-book-open text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">No courses available</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">No students found in {teacherDepartment} department</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleCourseSelect(course)}
                className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <i className="fas fa-book text-2xl text-orange-500"></i>
                  </div>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
                    {course.students} Students
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{course.name}</h3>
                <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all">
                  Select Course
                </button>
              </motion.div>
            ))}
            </div>
          )}
        </div>
      ) : (
        /* Attendance Marking Interface */
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/90 font-medium">Total Students</p>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <p className="text-4xl font-bold">{students.length}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/90 font-medium">Present</p>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-check"></i>
                </div>
              </div>
              <p className="text-4xl font-bold">{getPresentCount()}</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/90 font-medium">Absent</p>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-times"></i>
                </div>
              </div>
              <p className="text-4xl font-bold">{getAbsentCount()}</p>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Student Attendance</h3>
            
            <div className="space-y-3">
              {students.map((student) => {
                const studentId = student.student_id || student.id
                const studentName = student.full_name || student.name
                const studentRoll = student.student_id || student.rollNo
                
                return (
                <motion.div
                  key={studentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    backgroundColor: attendance[studentId] === 'present' 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : attendance[studentId] === 'absent'
                      ? 'rgba(239, 68, 68, 0.1)'
                      : undefined
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    attendance[studentId] === 'present'
                      ? 'border-green-400 dark:border-green-500 bg-green-50/50 dark:bg-green-900/20'
                      : attendance[studentId] === 'absent'
                      ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/20'
                      : 'border-white/20 bg-white/50 dark:bg-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      {student.profile_image ? (
                        <img 
                          src={student.profile_image} 
                          alt={studentName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      {/* Status Badge */}
                      {attendance[studentId] === 'present' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-gray-800"
                        >
                          <i className="fas fa-check text-white text-xs"></i>
                        </motion.div>
                      )}
                      {attendance[studentId] === 'absent' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center border-2 border-white dark:border-gray-800"
                        >
                          <i className="fas fa-times text-white text-xs"></i>
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{studentName}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{studentRoll}</p>
                    </div>
                  </div>

                  {/* Attendance Toggle Buttons */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => handleAttendanceChange(studentId, 'present')}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                        attendance[studentId] === 'present'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/50 ring-2 ring-green-400'
                          : 'bg-white/50 dark:bg-gray-600/50 text-slate-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <motion.i 
                        className="fas fa-check"
                        animate={attendance[studentId] === 'present' ? {
                          scale: [1, 1.3, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      ></motion.i>
                      Present
                    </motion.button>
                    <motion.button
                      onClick={() => handleAttendanceChange(studentId, 'absent')}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                        attendance[studentId] === 'absent'
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl shadow-red-500/50 ring-2 ring-red-400'
                          : 'bg-white/50 dark:bg-gray-600/50 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <motion.i 
                        className="fas fa-times"
                        animate={attendance[studentId] === 'absent' ? {
                          scale: [1, 1.3, 1],
                          rotate: [0, 180, 360]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      ></motion.i>
                      Absent
                    </motion.button>
                  </div>
                </motion.div>
              )})}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Confirm Attendance
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-circle text-3xl text-orange-500"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Confirm Attendance</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Are you sure you want to submit attendance for {selectedCourse?.code}?
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-slate-600 dark:text-slate-400">Total Students:</span>
                <span className="font-bold text-slate-800 dark:text-white">{students.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-green-600 dark:text-green-400">Present:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{getPresentCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 dark:text-red-400">Absent:</span>
                <span className="font-bold text-red-600 dark:text-red-400">{getAbsentCount()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Confirm
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-5xl text-green-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Attendance Submitted!</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Attendance has been successfully recorded for {selectedCourse?.code}
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

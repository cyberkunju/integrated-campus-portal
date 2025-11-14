import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../../components/ThemeToggle'
import CustomAlert from '../../components/CustomAlert'
import CustomSelect from '../../components/CustomSelect'
import api from '../../services/api'

export default function AdminCourses() {
  const navigate = useNavigate()
  const user = api.getCurrentUser()
  
  const [courses, setCourses] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  
  // Alert state
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  })

  // Form state
  const [courseForm, setCourseForm] = useState({
    courseCode: '',
    courseName: '',
    department: 'BCA',
    credits: '3',
    description: ''
  })

  const departments = [
    { value: 'BCA', label: 'BCA' },
    { value: 'BBA', label: 'BBA' },
    { value: 'B.Com', label: 'B.Com' },
    { value: 'BSc Physics', label: 'BSc Physics' },
    { value: 'BCS', label: 'BCS' }
  ]

  const creditOptions = [
    { value: '1', label: '1 Credit' },
    { value: '2', label: '2 Credits' },
    { value: '3', label: '3 Credits' },
    { value: '4', label: '4 Credits' },
    { value: '5', label: '5 Credits' },
    { value: '6', label: '6 Credits' }
  ]

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    loadCourses()
  }, [])

  const loadCourses = () => {
    // Load from localStorage
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]')
    setCourses(storedCourses)
  }

  const showAlert = (title, message, type = 'warning') => {
    setAlertConfig({ isOpen: true, title, message, type })
  }

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourseForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAddCourse = () => {
    setEditingCourse(null)
    setCourseForm({
      courseCode: '',
      courseName: '',
      department: 'BCA',
      credits: '3',
      description: ''
    })
    setShowAddModal(true)
  }

  const handleEditCourse = (course) => {
    setEditingCourse(course)
    setCourseForm(course)
    setShowAddModal(true)
  }

  const handleSaveCourse = () => {
    // Validation
    if (!courseForm.courseCode || !courseForm.courseName) {
      showAlert('Missing Information', 'Please fill in Course Code and Course Name.', 'warning')
      return
    }

    // Check for duplicate course code
    const duplicateCode = courses.find(c => 
      c.courseCode.toLowerCase() === courseForm.courseCode.toLowerCase() && 
      (!editingCourse || c.courseCode !== editingCourse.courseCode)
    )

    if (duplicateCode) {
      showAlert(
        'Duplicate Course Code',
        `A course with code "${courseForm.courseCode}" already exists in the system.\n\nExisting Course: ${duplicateCode.courseName}\n\nPlease use a different course code.`,
        'error'
      )
      return
    }

    // Check for duplicate course name
    const duplicateName = courses.find(c => 
      c.courseName.toLowerCase() === courseForm.courseName.toLowerCase() && 
      (!editingCourse || c.courseName !== editingCourse.courseName)
    )

    if (duplicateName) {
      showAlert(
        'Duplicate Course Name',
        `A course with the name "${courseForm.courseName}" already exists in the system.\n\nExisting Code: ${duplicateName.courseCode}\n\nPlease use a different course name.`,
        'error'
      )
      return
    }

    let updatedCourses
    if (editingCourse) {
      // Update existing course
      updatedCourses = courses.map(c => 
        c.courseCode === editingCourse.courseCode ? { ...courseForm, id: c.id } : c
      )
      showAlert(
        'Course Updated',
        `${courseForm.courseCode} - ${courseForm.courseName} has been updated successfully!`,
        'success'
      )
    } else {
      // Add new course
      const newCourse = {
        ...courseForm,
        id: Date.now()
      }
      updatedCourses = [...courses, newCourse]
      showAlert(
        'Course Added',
        `${courseForm.courseCode} - ${courseForm.courseName} has been added to the course catalog!`,
        'success'
      )
    }

    localStorage.setItem('courses', JSON.stringify(updatedCourses))
    setCourses(updatedCourses)
    setShowAddModal(false)
  }

  const handleDeleteCourse = (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this course?\n\n${course.courseCode} - ${course.courseName}\n\nThis action cannot be undone.`
    )

    if (confirmed) {
      const updatedCourses = courses.filter(c => c.id !== course.id)
      localStorage.setItem('courses', JSON.stringify(updatedCourses))
      setCourses(updatedCourses)
      showAlert(
        'Course Deleted',
        `${course.courseCode} - ${course.courseName} has been removed from the catalog.`,
        'success'
      )
    }
  }

  const handleLogout = () => {
    api.logout()
    navigate('/login')
  }

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || course.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

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
            onClick={() => navigate('/admin/dashboard')}
            className="w-10 h-10 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
          >
            <i className="fas fa-arrow-left text-slate-800 dark:text-white"></i>
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Course Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-slate-700 dark:text-slate-300 font-medium">{user?.full_name}</span>
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
            <i className="fas fa-user-shield text-xl"></i>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-book text-3xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Course Catalog</h2>
              <p className="text-purple-100">Manage all courses and curriculum</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">{courses.length}</p>
            <p className="text-purple-100">Total Courses</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>
        
        <CustomSelect
          name="filterDepartment"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          options={[{ value: 'all', label: 'All Departments' }, ...departments]}
          placeholder="Filter by Department"
        />

        <button
          onClick={handleAddCourse}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all whitespace-nowrap"
        >
          <i className="fas fa-plus mr-2"></i>
          Add New Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-book-open text-6xl text-slate-400 mb-4"></i>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {searchTerm || filterDepartment !== 'all' 
                ? 'No courses found matching your filters.' 
                : 'No courses in the catalog yet. Click "Add New Course" to get started!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-500/20 dark:bg-purple-900/30">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-700 dark:text-slate-300 font-bold">Course Code</th>
                  <th className="px-6 py-4 text-left text-slate-700 dark:text-slate-300 font-bold">Course Name</th>
                  <th className="px-6 py-4 text-left text-slate-700 dark:text-slate-300 font-bold">Department</th>
                  <th className="px-6 py-4 text-left text-slate-700 dark:text-slate-300 font-bold">Credits</th>
                  <th className="px-6 py-4 text-center text-slate-700 dark:text-slate-300 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-all"
                  >
                    <td className="px-6 py-4 text-slate-800 dark:text-white font-mono font-bold">{course.courseCode}</td>
                    <td className="px-6 py-4 text-slate-800 dark:text-white font-semibold">{course.courseName}</td>
                    <td className="px-6 py-4 text-slate-800 dark:text-white">{course.department}</td>
                    <td className="px-6 py-4 text-slate-800 dark:text-white">{course.credits}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Course Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <i className="fas fa-book text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold">
                      {editingCourse ? 'Edit Course' : 'Add New Course'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Course Code and Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Course Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="courseCode"
                      value={courseForm.courseCode}
                      onChange={handleInputChange}
                      placeholder="e.g., CS101"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="courseName"
                      value={courseForm.courseName}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Computer Science"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Department and Credits */}
                <div className="grid grid-cols-2 gap-4">
                  <CustomSelect
                    name="department"
                    value={courseForm.department}
                    onChange={handleInputChange}
                    options={departments}
                    label={<>Department <span className="text-red-500">*</span></>}
                    placeholder="Select Department"
                  />

                  <CustomSelect
                    name="credits"
                    value={courseForm.credits}
                    onChange={handleInputChange}
                    options={creditOptions}
                    label={<>Credits <span className="text-red-500">*</span></>}
                    placeholder="Select Credits"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                    Course Description
                  </label>
                  <textarea
                    name="description"
                    value={courseForm.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Brief description of the course content and objectives..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-800 dark:text-white font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCourse}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    <i className="fas fa-save mr-2"></i>
                    {editingCourse ? 'Update Course' : 'Save Course'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </motion.div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ThemeToggle from '../../components/ThemeToggle'
import ImageCropper from '../../components/ImageCropper'
import AnimatedDatePicker from '../../components/AnimatedDatePicker'
import CustomSelect from '../../components/CustomSelect'
import api from '../../services/api'

export default function AdminStudents() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = api.getCurrentUser()
  
  // Get filter parameters from URL
  const urlYear = searchParams.get('year')
  const urlDepartment = searchParams.get('department')
  const [showAddForm, setShowAddForm] = useState(false)
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  
  // Form data
  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    username: '',
    email: '',
    password: '',
    department: 'BCA',
    semester: '1',
    year: new Date().getFullYear(),
    phone: '',
    date_of_birth: '',
    address: ''
  })

  const departments = ['BCA', 'BBA', 'B.Com']
  const semesters = ['1', '2', '3', '4', '5', '6']
  
  // Convert to options format for CustomSelect
  const departmentOptions = departments.map(dept => ({ value: dept, label: dept }))
  const semesterOptions = semesters.map(sem => ({ value: sem, label: `Semester ${sem}` }))

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' })
    }, 3000)
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    const response = await api.getStudents()
    if (response.success) {
      setStudents(response.students)
      filterStudents(response.students)
    }
    setLoading(false)
  }
  
  const filterStudents = (studentList) => {
    let filtered = studentList
    
    if (urlYear) {
      // Extract year number from "1st Year", "2nd Year", etc.
      const yearNum = parseInt(urlYear.match(/\d+/)[0])
      filtered = filtered.filter(s => s.year === yearNum)
    }
    
    if (urlDepartment) {
      filtered = filtered.filter(s => s.department === urlDepartment)
    }
    
    setFilteredStudents(filtered)
  }
  
  useEffect(() => {
    filterStudents(students)
  }, [urlYear, urlDepartment, students])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageCropped = (blob) => {
    setSelectedImage(blob)
    setImagePreview(URL.createObjectURL(blob))
    setShowCropper(false)
  }

  const handleEdit = (student) => {
    setIsEditMode(true)
    setEditingStudent(student) // Store original student data including original student_id
    setFormData({
      student_id: student.student_id,
      full_name: student.full_name,
      username: student.username || '',
      email: student.email || '',
      password: '',
      department: student.department,
      semester: student.semester,
      year: student.year || new Date().getFullYear(),
      phone: student.phone || '',
      date_of_birth: student.date_of_birth || '',
      address: student.address || ''
    })
    if (student.profile_image) {
      setImagePreview(student.profile_image)
    }
    setShowAddForm(true)
  }

  const handleDelete = (studentId) => {
    setStudentToDelete(studentId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    setLoading(true)
    setShowDeleteModal(false)
    
    const response = await api.deleteStudent(studentToDelete)
    
    if (response.success) {
      showToast('Student deleted successfully!', 'success')
      fetchStudents()
    } else {
      showToast(response.error || 'Failed to delete student', 'error')
    }
    setLoading(false)
    setStudentToDelete(null)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setStudentToDelete(null)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditingStudent(null)
    setShowAddForm(false)
    setFormData({
      student_id: '',
      full_name: '',
      username: '',
      email: '',
      password: '',
      department: 'BCA',
      semester: '1',
      year: new Date().getFullYear(),
      phone: '',
      date_of_birth: '',
      address: ''
    })
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    let profileImageUrl = isEditMode ? (imagePreview || null) : null
    
    // Upload image if selected
    if (selectedImage) {
      console.log('Selected image:', selectedImage)
      console.log('Is Blob?', selectedImage instanceof Blob)
      console.log('Image type:', selectedImage.type)
      console.log('Image size:', selectedImage.size)
      
      {/* Validate that we have a valid blob */}
      if (!selectedImage || !(selectedImage instanceof Blob)) {
        showToast('Invalid image data. Please try uploading again.', 'error')
        setLoading(false)
        return
      }
      
      setUploading(true)
      const uploadResponse = await api.uploadImage(selectedImage)
      setUploading(false)
      
      console.log('Upload response:', uploadResponse)
      
      if (uploadResponse.success) {
        profileImageUrl = uploadResponse.image_url
      } else {
        showToast('Failed to upload image: ' + (uploadResponse.error || 'Unknown error'), 'error')
        setLoading(false)
        return
      }
    }
    
    // Add profile image URL to form data
    const submitData = { ...formData }
    if (profileImageUrl) {
      submitData.profile_image = profileImageUrl
    }
    
    console.log('Submitting student data:', submitData)
    const response = isEditMode 
      ? await api.updateStudent(editingStudent.student_id, submitData) // Use original student_id to find record
      : await api.addStudent(submitData)
    console.log(isEditMode ? 'Update student response:' : 'Add student response:', response)
    
    if (response.success) {
      showToast(isEditMode ? 'Student updated successfully!' : 'Student added successfully!', 'success')
      setShowAddForm(false)
      setIsEditMode(false)
      setEditingStudent(null)
      setFormData({
        student_id: '',
        full_name: '',
        username: '',
        email: '',
        password: '',
        department: 'BCA',
        semester: '1',
        year: new Date().getFullYear(),
        phone: '',
        date_of_birth: '',
        address: ''
      })
      setSelectedImage(null)
      setImagePreview(null)
      // Refresh the students list
      fetchStudents()
    } else {
      const errorMsg = response.error || response.message || (isEditMode ? 'Failed to update student' : 'Failed to add student')
      showToast(errorMsg, 'error')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    api.logout()
    navigate('/login')
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
            onClick={() => navigate('/admin/dashboard')}
            className="w-10 h-10 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
          >
            <i className="fas fa-arrow-left text-slate-800 dark:text-white"></i>
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Manage Students</h1>
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

      {/* Add Student Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg flex items-center gap-2 transition-all"
        >
          <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showAddForm ? 'Cancel' : 'Add New Student'}
        </button>
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-6"
        >
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="flex items-center gap-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <i className="fas fa-user text-4xl text-gray-500 dark:text-gray-400"></i>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                  Profile Photo (Optional)
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCropper(true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm"
                  >
                    <i className="fas fa-camera mr-2"></i>
                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setSelectedImage(null)
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Image will be auto-cropped to circular format
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student ID */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleInputChange}
                placeholder="e.g., S2025109"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-700/70 transition-all"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-700/70 transition-all"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="e.g., john.doe"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-700/70 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="student@university.edu"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-700/70 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-700/70 transition-all"
              />
            </div>

            {/* Department */}
            <CustomSelect
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              options={departmentOptions}
              label={<>Department <span className="text-red-500">*</span></>}
              placeholder="Select department"
              icon="fas fa-building"
            />

            {/* Semester */}
            <CustomSelect
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              options={semesterOptions}
              label={<>Semester <span className="text-red-500">*</span></>}
              placeholder="Select semester"
              icon="fas fa-calendar-alt"
            />

            {/* Year */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="2020"
                max="2030"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-700/70 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-700/70 transition-all"
              />
            </div>

            {/* Date of Birth */}
            <AnimatedDatePicker
              label="Date of Birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
            />

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/70 dark:focus:bg-gray-700/70 transition-all"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={uploading || loading}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Uploading Image...
                  </>
                ) : loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {isEditMode ? 'Updating Student...' : 'Adding Student...'}
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {isEditMode ? 'Update Student' : 'Add Student'}
                  </>
                )}
              </button>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </button>
              )}
            </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Students List */}
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {urlYear || urlDepartment ? 'Filtered Students' : 'All Students'}
          </h2>
          {(urlYear || urlDepartment) && (
            <div className="flex items-center gap-2">
              {urlYear && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg font-semibold text-sm">
                  {urlYear}
                </span>
              )}
              {urlDepartment && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg font-semibold text-sm">
                  {urlDepartment}
                </span>
              )}
              <button
                onClick={() => navigate('/admin/students')}
                className="px-3 py-1 bg-slate-500/20 text-slate-600 dark:text-slate-400 rounded-lg font-semibold text-sm hover:bg-slate-500/30"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-slate-800 dark:text-white">Loading...</div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-users text-6xl text-slate-400 mb-4"></i>
            <p className="text-slate-600 dark:text-slate-400">
              {urlYear || urlDepartment ? 'No students found matching the filters.' : 'No students found. Add your first student!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-600">
                  <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Student ID</th>
                  <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Department</th>
                  <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Year</th>
                  <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Semester</th>
                  <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index} className="border-b border-slate-200 dark:border-slate-700 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all">
                    <td className="px-4 py-3 text-slate-800 dark:text-white">{student.student_id}</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-white">{student.full_name}</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-white">{student.department}</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-white">Year {student.year}</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-white">Sem {student.semester}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleEdit(student)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mr-2 transition-all"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(student.student_id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {showCropper && (
        <ImageCropper
          onImageCropped={handleImageCropped}
          onCancel={() => setShowCropper(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-red-200 dark:border-red-900"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <i className="fas fa-exclamation-triangle text-3xl text-red-600 dark:text-red-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                Delete Student
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Are you sure you want to delete this student? This action cannot be undone and will permanently remove all student data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-800 dark:text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 max-w-md ${
            toast.type === 'success' 
              ? 'bg-green-500/90 border-green-400 text-white' 
              : 'bg-red-500/90 border-red-400 text-white'
          }`}
        >
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            toast.type === 'success' 
              ? 'bg-white/20' 
              : 'bg-white/20'
          }`}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl`}></i>
          </div>
          <p className="font-semibold flex-1">{toast.message}</p>
          <button
            onClick={() => setToast({ show: false, message: '', type: '' })}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

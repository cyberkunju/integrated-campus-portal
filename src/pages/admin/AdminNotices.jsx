import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../../components/ThemeToggle'
import api from '../../services/api'

export default function AdminNotices() {
  const navigate = useNavigate()
  const user = api.getCurrentUser()
  
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    category: 'general'
  })

  const priorities = [
    { value: 'low', label: 'Low', color: 'blue' },
    { value: 'normal', label: 'Normal', color: 'green' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' }
  ]

  const categories = [
    { value: 'general', label: 'General', icon: 'fa-info-circle' },
    { value: 'academic', label: 'Academic', icon: 'fa-graduation-cap' },
    { value: 'event', label: 'Event', icon: 'fa-calendar-alt' },
    { value: 'exam', label: 'Exam', icon: 'fa-file-alt' },
    { value: 'holiday', label: 'Holiday', icon: 'fa-umbrella-beach' },
    { value: 'sports', label: 'Sports', icon: 'fa-futbol' }
  ]

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    setLoading(true)
    const response = await api.getNotices()
    if (response.success) {
      setNotices(response.data || [])
    }
    setLoading(false)
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' })
    }, 3000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error')
        return
      }
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = null

    // Upload image if selected
    if (selectedImage) {
      setUploading(true)
      const uploadResponse = await api.uploadImage(selectedImage)
      setUploading(false)

      if (uploadResponse.success) {
        imageUrl = uploadResponse.image_url
      } else {
        showToast('Failed to upload image: ' + (uploadResponse.error || 'Unknown error'), 'error')
        setLoading(false)
        return
      }
    }

    // Create notice data
    const noticeData = {
      ...formData,
      image_url: imageUrl,
      created_by: user.full_name,
      created_at: new Date().toISOString()
    }

    // Save to localStorage (mock backend)
    const existingNotices = JSON.parse(localStorage.getItem('notices') || '[]')
    const updatedNotices = [noticeData, ...existingNotices]
    localStorage.setItem('notices', JSON.stringify(updatedNotices))
    
    setNotices(updatedNotices)
    showToast('Notice posted successfully!', 'success')
    setShowAddModal(false)
    resetForm()
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      category: 'general'
    })
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleDelete = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      const updatedNotices = notices.filter((_, index) => index !== noticeId)
      localStorage.setItem('notices', JSON.stringify(updatedNotices))
      setNotices(updatedNotices)
      showToast('Notice deleted successfully!', 'success')
    }
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

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.icon : 'fa-info-circle'
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Post Notices</h1>
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
      <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-bullhorn text-3xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Notice Management</h2>
              <p className="text-red-100">Create and manage announcements</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">{notices.length}</p>
            <p className="text-red-100">Total Notices</p>
          </div>
        </div>
      </div>

      {/* Add Notice Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-semibold shadow-lg flex items-center gap-2 transition-all"
        >
          <i className="fas fa-plus"></i>
          Create New Notice
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-6">
        {loading && notices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl text-slate-800 dark:text-white">Loading...</div>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-lg text-center">
            <i className="fas fa-bullhorn text-6xl text-slate-400 mb-4"></i>
            <p className="text-slate-600 dark:text-slate-400 text-lg">No notices posted yet. Create your first notice!</p>
          </div>
        ) : (
          notices.map((notice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden ${
                notice.image_url ? 'flex flex-col md:flex-row' : ''
              }`}
            >
              {/* Notice Content */}
              <div className={`p-6 ${notice.image_url ? 'md:flex-1' : 'w-full'}`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(notice.priority).replace('text-', 'bg-').replace('/20', '/30')}`}>
                        <i className={`fas ${getCategoryIcon(notice.category)} text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{notice.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Posted by {notice.created_by} • {new Date(notice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg transition-all"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(notice.priority)}`}>
                    {notice.priority.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                    {categories.find(c => c.value === notice.category)?.label || notice.category}
                  </span>
                </div>

                {/* Content */}
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{notice.content}</p>
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

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          {/* Backdrop */}
          <div 
            className="absolute inset-0"
            onClick={() => {
              setShowAddModal(false)
              resetForm()
            }}
          ></div>
          
          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto z-10 scrollbar-hide"
          >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create New Notice</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="w-10 h-10 rounded-full bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
                >
                  <i className="fas fa-times text-slate-800 dark:text-white"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter notice title"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-all"
                    >
                      {priorities.map(pri => (
                        <option key={pri.value} value={pri.value}>{pri.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Enter notice content or description"
                    required
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-all"
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                    Event Poster / Image (Optional)
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <label className="block w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-500 dark:hover:border-red-500 transition-all cursor-pointer bg-white/50 dark:bg-gray-700/50">
                      <div className="text-center">
                        <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-2"></i>
                        <p className="text-slate-600 dark:text-slate-400">Click to upload image</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Max size: 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || loading}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Uploading Image...
                      </>
                    ) : loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Posting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Post Notice
                      </>
                    )}
                  </button>
                </div>
              </form>
          </div>
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
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
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

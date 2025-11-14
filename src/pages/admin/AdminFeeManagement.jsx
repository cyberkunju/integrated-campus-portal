import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../../components/ThemeToggle'
import AnimatedDatePicker from '../../components/AnimatedDatePicker'
import CustomAlert from '../../components/CustomAlert'
import CustomSelect from '../../components/CustomSelect'
import api from '../../services/api'

export default function AdminFeeManagement() {
  const navigate = useNavigate()
  const user = api.getCurrentUser()
  
  const [activeTab, setActiveTab] = useState('pending') // 'pending' or 'send'
  const [loading, setLoading] = useState(false)
  const [selectedFeeFilter, setSelectedFeeFilter] = useState('all')
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all')
  
  // Custom alert state
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  })

  const showAlert = (title, message, type = 'warning') => {
    setAlertConfig({ isOpen: true, title, message, type })
  }

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false })
  }
  
  // Fee notice form data
  const [feeNotice, setFeeNotice] = useState({
    department: 'BCA',
    semester: '1',
    feeType: 'semester',
    amount: '15000',
    lastDateNormal: '',
    lastDateFine: '',
    fineAmount: '500',
    lastDateSuperFine: '',
    superFineAmount: '1000',
    description: ''
  })

  // Mock pending students data - comprehensive list
  const [allPendingStudents] = useState([
    // BCA Students
    { id: 1, name: 'Aarav Sharma', rollNo: '2024001', department: 'BCA', semester: 5, year: 3, feeType: 'Semester Fee', amount: 18000, dueDate: '2025-12-15', fineAmount: 500, superFineAmount: 1000 },
    { id: 2, name: 'Vivaan Patel', rollNo: '2024002', department: 'BCA', semester: 5, year: 3, feeType: 'Semester Fee', amount: 18000, dueDate: '2025-12-15', fineAmount: 500, superFineAmount: 1000 },
    { id: 3, name: 'Aditya Kumar', rollNo: '2023015', department: 'BCA', semester: 3, year: 2, feeType: 'Exam Fee', amount: 800, dueDate: '2025-12-10', fineAmount: 200, superFineAmount: 400 },
    { id: 4, name: 'Arjun Singh', rollNo: '2023016', department: 'BCA', semester: 3, year: 2, feeType: 'Exam Fee', amount: 800, dueDate: '2025-12-10', fineAmount: 200, superFineAmount: 400 },
    { id: 5, name: 'Sai Reddy', rollNo: '2024025', department: 'BCA', semester: 1, year: 1, feeType: 'Annual Day Fund', amount: 500, dueDate: '2025-12-20', fineAmount: 100, superFineAmount: 200 },
    
    // BBA Students
    { id: 6, name: 'Diya Patel', rollNo: '2023045', department: 'BBA', semester: 3, year: 2, feeType: 'Semester Fee', amount: 16000, dueDate: '2025-12-18', fineAmount: 500, superFineAmount: 1000 },
    { id: 7, name: 'Ananya Gupta', rollNo: '2023046', department: 'BBA', semester: 3, year: 2, feeType: 'Semester Fee', amount: 16000, dueDate: '2025-12-18', fineAmount: 500, superFineAmount: 1000 },
    { id: 8, name: 'Ishaan Verma', rollNo: '2024050', department: 'BBA', semester: 1, year: 1, feeType: 'Exam Fee', amount: 800, dueDate: '2025-12-12', fineAmount: 200, superFineAmount: 400 },
    
    // B.Com Students
    { id: 9, name: 'Arjun Kumar', rollNo: '2022078', department: 'B.Com', semester: 5, year: 3, feeType: 'Semester Fee', amount: 12000, dueDate: '2025-12-20', fineAmount: 400, superFineAmount: 800 },
    { id: 10, name: 'Priya Sharma', rollNo: '2022079', department: 'B.Com', semester: 5, year: 3, feeType: 'Semester Fee', amount: 12000, dueDate: '2025-12-20', fineAmount: 400, superFineAmount: 800 },
    { id: 11, name: 'Rohan Mehta', rollNo: '2023090', department: 'B.Com', semester: 3, year: 2, feeType: 'Sports Fund', amount: 300, dueDate: '2025-12-25', fineAmount: 50, superFineAmount: 100 },
    
    // BSc Physics Students
    { id: 12, name: 'Kavya Nair', rollNo: '2023101', department: 'BSc Physics', semester: 3, year: 2, feeType: 'Semester Fee', amount: 15000, dueDate: '2025-12-22', fineAmount: 500, superFineAmount: 1000 },
    { id: 13, name: 'Aditya Rao', rollNo: '2024110', department: 'BSc Physics', semester: 1, year: 1, feeType: 'Lab Fee', amount: 2000, dueDate: '2025-12-15', fineAmount: 300, superFineAmount: 600 }
  ])

  const departmentOptions = [
    { value: 'BCA', label: 'BCA' },
    { value: 'BBA', label: 'BBA' },
    { value: 'B.Com', label: 'B.Com' },
    { value: 'BSc Physics', label: 'BSc Physics' },
    { value: 'BCS', label: 'BCS' }
  ]
  
  const semesterOptions = [
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' }
  ]
  
  const feeTypes = [
    { value: 'semester', label: 'Semester Fee' },
    { value: 'exam', label: 'Exam Fee (₹800)' },
    { value: 'other', label: 'Other Fee/Collection' }
  ]

  // Semester fee amounts by course
  const semesterFees = {
    'BCA': { odd: '18000', even: '15000' },
    'BBA': { odd: '16000', even: '14000' },
    'B.Com': { odd: '12000', even: '10000' },
    'BSc Physics': { odd: '15000', even: '13000' },
    'BCS': { odd: '20000', even: '18000' }
  }

  // Get unique fee types from pending students
  const uniqueFeeTypes = ['all', ...new Set(allPendingStudents.map(s => s.feeType))]
  const uniqueDepartments = ['all', ...new Set(allPendingStudents.map(s => s.department))]

  // Filter pending students
  const filteredPendingStudents = allPendingStudents.filter(student => {
    const feeMatch = selectedFeeFilter === 'all' || student.feeType === selectedFeeFilter
    const deptMatch = selectedDeptFilter === 'all' || student.department === selectedDeptFilter
    return feeMatch && deptMatch
  })

  // Group by fee type for statistics
  const feeTypeStats = {}
  allPendingStudents.forEach(student => {
    if (!feeTypeStats[student.feeType]) {
      feeTypeStats[student.feeType] = { count: 0, totalAmount: 0 }
    }
    feeTypeStats[student.feeType].count++
    feeTypeStats[student.feeType].totalAmount += student.amount
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
  }, [])

  useEffect(() => {
    // Auto-set amount based on fee type and department
    if (feeNotice.feeType === 'semester') {
      const isOddSem = parseInt(feeNotice.semester) % 2 !== 0
      const amount = isOddSem 
        ? semesterFees[feeNotice.department].odd 
        : semesterFees[feeNotice.department].even
      setFeeNotice(prev => ({ ...prev, amount }))
    } else if (feeNotice.feeType === 'exam') {
      setFeeNotice(prev => ({ ...prev, amount: '800' }))
    }
  }, [feeNotice.feeType, feeNotice.department, feeNotice.semester])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Check if it's a date field
    if ((name === 'lastDateNormal' || name === 'lastDateFine' || name === 'lastDateSuperFine') && value) {
      const selectedDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)
      
      // Prevent selecting past dates
      if (selectedDate < today) {
        showAlert(
          'Cannot Select Past Date',
          'Please select today or a future date for the payment deadline.',
          'warning'
        )
        return
      }
    }
    
    // Validate date order
    if (name === 'lastDateFine' && feeNotice.lastDateNormal && value) {
      if (new Date(value) <= new Date(feeNotice.lastDateNormal)) {
        showAlert(
          'Invalid Date Order',
          `Last Date (With Fine) must be AFTER the Last Date (No Fine).\n\nPlease select a date that comes after ${new Date(feeNotice.lastDateNormal).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
          'warning'
        )
        return
      }
    }
    
    if (name === 'lastDateSuperFine' && feeNotice.lastDateFine && value) {
      if (new Date(value) <= new Date(feeNotice.lastDateFine)) {
        showAlert(
          'Invalid Date Order',
          `Final Date (Super Fine) must be AFTER the Last Date (With Fine).\n\nPlease select a date that comes after ${new Date(feeNotice.lastDateFine).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
          'warning'
        )
        return
      }
    }
    
    setFeeNotice(prev => ({ ...prev, [name]: value }))
  }

  const handleSendNotice = async () => {
    // Validation
    if (!feeNotice.lastDateNormal || !feeNotice.lastDateFine || !feeNotice.lastDateSuperFine) {
      alert('⚠️ Please fill all deadline dates!')
      return
    }

    const feeTypeName = feeNotice.feeType === 'semester' 
      ? `Semester ${feeNotice.semester} Fee` 
      : feeNotice.feeType === 'exam' 
        ? 'Exam Fee' 
        : 'Other Fee/Collection'

    const confirmed = window.confirm(
      `📢 Send Fee Notice?\n\n` +
      `Fee Type: ${feeTypeName}\n` +
      `Department: ${feeNotice.department}\n` +
      `Amount: ₹${feeNotice.amount}\n\n` +
      `This will be sent to all students in ${feeNotice.department} - Semester ${feeNotice.semester}\n\n` +
      `Continue?`
    )

    if (!confirmed) return

    setLoading(true)
    
    // Create comprehensive fee notice
    const notice = {
      title: `💰 ${feeTypeName} Payment Notice - ${feeNotice.department}`,
      content: `Dear Students of ${feeNotice.department} - Semester ${feeNotice.semester},

This is an official notice regarding the upcoming ${feeTypeName} payment.

📋 FEE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Fee Type: ${feeTypeName}
• Amount: ₹${feeNotice.amount}
• Department: ${feeNotice.department}
• Semester: ${feeNotice.semester}

📅 PAYMENT DEADLINES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Last Date (No Fine): ${new Date(feeNotice.lastDateNormal).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

⚠️ Last Date (With Fine): ${new Date(feeNotice.lastDateFine).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
   Fine Amount: ₹${feeNotice.fineAmount}

🚨 Final Date (Super Fine): ${new Date(feeNotice.lastDateSuperFine).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
   Super Fine Amount: ₹${feeNotice.superFineAmount}

${feeNotice.description ? `\n📝 ADDITIONAL INFORMATION:\n${feeNotice.description}\n` : ''}

💳 PAYMENT METHODS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You can make the payment through:
• QR Code (UPI)
• Debit/Credit Card
• Net Banking

Visit the "Payments" section in your student portal to complete the payment.

⚠️ IMPORTANT: Please make the payment before the deadline to avoid fine charges. Late payments will attract additional charges as mentioned above.

For any queries, please contact the Accounts Department.

Thank you for your cooperation.

Issued by: ${user.full_name}
Date: ${new Date().toLocaleDateString('en-IN')}`,
      category: 'academic',
      priority: 'high',
      created_by: user.full_name,
      created_at: new Date().toISOString(),
      feeDetails: {
        ...feeNotice,
        targetDepartment: feeNotice.department,
        targetSemester: feeNotice.semester,
        feeTypeName: feeTypeName
      }
    }

    // Save to localStorage (notices) - for Notice Board
    const existingNotices = JSON.parse(localStorage.getItem('notices') || '[]')
    localStorage.setItem('notices', JSON.stringify([notice, ...existingNotices]))

    // Save to localStorage (fee payments) - for Payment Page
    const existingPayments = JSON.parse(localStorage.getItem('feePayments') || '[]')
    const paymentNotice = {
      ...notice,
      status: 'pending',
      targetDepartment: feeNotice.department,
      targetSemester: feeNotice.semester
    }
    localStorage.setItem('feePayments', JSON.stringify([paymentNotice, ...existingPayments]))

    setLoading(false)
    
    alert(
      `✅ Fee Notice Sent Successfully!\n\n` +
      `📢 Notice posted to:\n` +
      `• Notice Board (All students can view)\n` +
      `• Payment Section (${feeNotice.department} - Sem ${feeNotice.semester})\n\n` +
      `Students can now see the fee details and make payments through QR Code.`
    )
    
    // Reset form
    setFeeNotice({
      department: 'BCA',
      semester: '1',
      feeType: 'semester',
      amount: '15000',
      lastDateNormal: '',
      lastDateFine: '',
      fineAmount: '500',
      lastDateSuperFine: '',
      superFineAmount: '1000',
      description: ''
    })
  }

  const sendReminderToPending = (student) => {
    const today = new Date()
    const dueDate = new Date(student.dueDate)
    const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
    
    const reminder = {
      title: `⚠️ Fee Payment Reminder - ${student.feeType}`,
      content: `Dear ${student.name} (${student.rollNo}),

This is a personal reminder that your ${student.feeType} payment is PENDING.

📋 Fee Details:
• Amount: ₹${student.amount}
• Department: ${student.department}
• Semester: ${student.semester}

📅 Payment Deadlines:
• Last Date (No Fine): ${new Date(student.dueDate).toLocaleDateString()} ${daysRemaining > 0 ? `(${daysRemaining} days remaining)` : '(OVERDUE)'}
• With Fine (₹${student.fineAmount}): After ${new Date(student.dueDate).toLocaleDateString()}
• With Super Fine (₹${student.superFineAmount}): Final deadline

⚠️ IMPORTANT: Please make the payment immediately to avoid additional fine charges.

You can pay through the Payments section using QR Code, UPI, or Card.

Thank you.`,
      category: 'academic',
      priority: 'urgent',
      created_by: user.full_name,
      created_at: new Date().toISOString(),
      targetStudent: student.rollNo,
      feeDetails: {
        feeType: student.feeType,
        amount: student.amount,
        dueDate: student.dueDate,
        fineAmount: student.fineAmount,
        superFineAmount: student.superFineAmount
      }
    }

    // Save to notices
    const existingNotices = JSON.parse(localStorage.getItem('notices') || '[]')
    localStorage.setItem('notices', JSON.stringify([reminder, ...existingNotices]))

    // Also add to student's payment page
    const existingPayments = JSON.parse(localStorage.getItem('feePayments') || '[]')
    const paymentNotice = {
      ...reminder,
      status: 'pending',
      student_id: student.rollNo
    }
    localStorage.setItem('feePayments', JSON.stringify([paymentNotice, ...existingPayments]))

    alert(`✅ Personal reminder sent to ${student.name}!\n\nThe notice has been added to:\n• Notice Board\n• Payment Section`)
  }

  const sendBulkReminders = () => {
    if (filteredPendingStudents.length === 0) {
      alert('No students to send reminders to!')
      return
    }

    const confirmed = window.confirm(
      `Send payment reminders to ${filteredPendingStudents.length} student(s)?\n\n` +
      `Filter: ${selectedFeeFilter === 'all' ? 'All Fees' : selectedFeeFilter}\n` +
      `Department: ${selectedDeptFilter === 'all' ? 'All Departments' : selectedDeptFilter}`
    )

    if (!confirmed) return

    filteredPendingStudents.forEach(student => {
      sendReminderToPending(student)
    })

    alert(`✅ Bulk reminders sent to ${filteredPendingStudents.length} student(s)!`)
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Fee Management</h1>
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
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-dollar-sign text-3xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Fee Management System</h2>
              <p className="text-teal-100">Track pending payments and send fee notices</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">{allPendingStudents.length}</p>
            <p className="text-teal-100">Total Pending Payments</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
              : 'bg-white/30 dark:bg-gray-800/30 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
          }`}
        >
          <i className="fas fa-exclamation-circle mr-2"></i>
          Pending Students List
        </button>
        <button
          onClick={() => setActiveTab('send')}
          className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
            activeTab === 'send'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
              : 'bg-white/30 dark:bg-gray-800/30 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
          }`}
        >
          <i className="fas fa-paper-plane mr-2"></i>
          Send Fee Notice
        </button>
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        /* Pending Students List */
        <motion.div 
          key="pending"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Students with Pending Payments</h2>
            {filteredPendingStudents.length > 0 && (
              <button
                onClick={sendBulkReminders}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg transition-all"
              >
                <i className="fas fa-bell mr-2"></i>
                Send Bulk Reminders ({filteredPendingStudents.length})
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <CustomSelect
              name="feeTypeFilter"
              value={selectedFeeFilter}
              onChange={(e) => setSelectedFeeFilter(e.target.value)}
              options={uniqueFeeTypes.map(type => ({
                value: type,
                label: type === 'all' ? 'All Fee Types' : type
              }))}
              label="Filter by Fee Type"
              placeholder="Select Fee Type"
            />

            <CustomSelect
              name="departmentFilter"
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              options={uniqueDepartments.map(dept => ({
                value: dept,
                label: dept === 'all' ? 'All Departments' : dept
              }))}
              label="Filter by Department"
              placeholder="Select Department"
            />
          </div>

          {/* Results Count */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300">
              <i className="fas fa-filter mr-2"></i>
              Showing <span className="font-bold text-blue-600 dark:text-blue-400">{filteredPendingStudents.length}</span> student(s)
              {selectedFeeFilter !== 'all' && ` with ${selectedFeeFilter}`}
              {selectedDeptFilter !== 'all' && ` from ${selectedDeptFilter}`}
            </p>
          </div>
          
          {filteredPendingStudents.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
              <p className="text-slate-600 dark:text-slate-400 text-lg">No pending payments found with current filters!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-600">
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Roll No</th>
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Department</th>
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Year/Sem</th>
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Fee Type</th>
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Due Date</th>
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Fine</th>
                    <th className="px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPendingStudents.map((student) => {
                    const today = new Date()
                    const dueDate = new Date(student.dueDate)
                    const isOverdue = today > dueDate
                    
                    return (
                      <tr key={student.id} className={`border-b border-slate-200 dark:border-slate-700 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all ${isOverdue ? 'bg-red-100/50 dark:bg-red-900/20' : ''}`}>
                        <td className="px-4 py-3 text-slate-800 dark:text-white font-mono text-sm">{student.rollNo}</td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white font-semibold">{student.name}</td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white">{student.department}</td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white">Y{student.year}/S{student.semester}</td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white">{student.feeType}</td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white font-bold">₹{student.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white">
                          {new Date(student.dueDate).toLocaleDateString()}
                          {isOverdue && <span className="ml-2 text-red-500 font-bold">⚠️ OVERDUE</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-800 dark:text-white text-sm">
                          ₹{student.fineAmount} / ₹{student.superFineAmount}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => sendReminderToPending(student)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap"
                          >
                            <i className="fas fa-bell mr-2"></i>
                            Send Alert
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      ) : (
        /* Send Fee Notice */
        <motion.div 
          key="send"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create and Send Fee Notice</h2>
          
          <div className="space-y-6">
            {/* Department and Semester */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                <i className="fas fa-university mr-2 text-purple-500"></i>
                Course Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  name="department"
                  value={feeNotice.department}
                  onChange={handleInputChange}
                  options={departmentOptions}
                  label={<>Department <span className="text-red-500">*</span></>}
                  placeholder="Select Department"
                />

                <CustomSelect
                  name="semester"
                  value={feeNotice.semester}
                  onChange={handleInputChange}
                  options={semesterOptions}
                  label={<>Semester <span className="text-red-500">*</span></>}
                  placeholder="Select Semester"
                />
              </div>
            </motion.div>

            {/* Fee Type and Amount */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                <i className="fas fa-money-bill-wave mr-2 text-teal-500"></i>
                Fee Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  name="feeType"
                  value={feeNotice.feeType}
                  onChange={handleInputChange}
                  options={feeTypes}
                  label={<>Fee Type <span className="text-red-500">*</span></>}
                  placeholder="Select Fee Type"
                />

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={feeNotice.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Deadlines */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
                Payment Deadlines
              </h3>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AnimatedDatePicker
                    name="lastDateNormal"
                    value={feeNotice.lastDateNormal}
                    onChange={handleInputChange}
                    label={<><span className="text-red-500">*</span> Last Date (No Fine)</>}
                    icon="fas fa-check-circle text-green-500"
                    borderColor="teal"
                    referenceDates={[]}
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <AnimatedDatePicker
                      name="lastDateFine"
                      value={feeNotice.lastDateFine}
                      onChange={handleInputChange}
                      label={<><span className="text-red-500">*</span> Last Date (With Fine)</>}
                      icon="fas fa-exclamation-triangle text-orange-500"
                      borderColor="orange"
                      minDate={feeNotice.lastDateNormal}
                      referenceDates={feeNotice.lastDateNormal ? [
                        { date: feeNotice.lastDateNormal, color: 'teal', label: 'No Fine' }
                      ] : []}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Fine Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="fineAmount"
                      value={feeNotice.fineAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AnimatedDatePicker
                      name="lastDateSuperFine"
                      value={feeNotice.lastDateSuperFine}
                      onChange={handleInputChange}
                      label={<><span className="text-red-500">*</span> Final Date (Super Fine)</>}
                      icon="fas fa-ban text-red-500"
                      borderColor="red"
                      minDate={feeNotice.lastDateFine}
                      referenceDates={[
                        ...(feeNotice.lastDateNormal ? [{ date: feeNotice.lastDateNormal, color: 'teal', label: 'No Fine' }] : []),
                        ...(feeNotice.lastDateFine ? [{ date: feeNotice.lastDateFine, color: 'orange', label: 'With Fine' }] : [])
                      ]}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Super Fine Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="superFineAmount"
                      value={feeNotice.superFineAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Additional Description */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                <i className="fas fa-info-circle mr-2 text-amber-500"></i>
                Additional Information (Optional)
              </h3>
              <textarea
                name="description"
                value={feeNotice.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Add any additional information or instructions for students..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
              ></textarea>
            </motion.div>

            {/* Send Button */}
            <button
              onClick={handleSendNotice}
              disabled={loading || !feeNotice.lastDateNormal || !feeNotice.lastDateFine || !feeNotice.lastDateSuperFine}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Fee Notice to Students
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Custom Alert Modal */}
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

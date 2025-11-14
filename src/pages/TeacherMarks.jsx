import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import CustomSelect from '../components/CustomSelect'
import SemesterMarksForm from '../components/SemesterMarksForm'
import api from '../services/api'

export default function TeacherMarks() {
  const navigate = useNavigate()
  const user = api.getCurrentUser()
  const [showModal, setShowModal] = useState(false)
  const [examType, setExamType] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [maxMarks, setMaxMarks] = useState(40)
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/login')
      return
    }
    
    // Load students from teacher's department
    loadStudents()
    
    // Load submissions from localStorage
    const savedSubmissions = localStorage.getItem('teacherMarksSubmissions')
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions))
    }
  }, [])

  const loadStudents = () => {
    // Mock students - replace with API call
    const mockStudents = [
      { id: 1, name: 'Aarav Sharma', rollNo: '2024001', semester: 5 },
      { id: 2, name: 'Vivaan Patel', rollNo: '2024002', semester: 5 },
      { id: 3, name: 'Aditya Kumar', rollNo: '2023015', semester: 3 },
    ]
    setStudents(mockStudents)
  }

  const examTypes = [
    { value: 'class_test', label: 'Class Test' },
    { value: 'internal_1', label: '1st Internal Exam' },
    { value: 'internal_2', label: '2nd Internal Exam' },
    { value: 'semester', label: 'Semester Exam' }
  ]

  // Subject database by department and semester (from api.js)
  const subjectDatabase = {
    'BCA': {
      1: [
        { value: 'BCA101', label: 'Programming Fundamentals' },
        { value: 'BCA102', label: 'Digital Electronics' },
        { value: 'BCA103', label: 'Mathematics I' },
        { value: 'BCA104', label: 'English Communication' },
        { value: 'BCA105', label: 'Computer Organization' }
      ],
      2: [
        { value: 'BCA201', label: 'Data Structures Fundamentals' },
        { value: 'BCA202', label: 'Computer Architecture' },
        { value: 'BCA203', label: 'Mathematics II' },
        { value: 'BCA204', label: 'Object Oriented Programming' },
        { value: 'BCA205', label: 'Software Lab II' }
      ],
      3: [
        { value: 'BCA301', label: 'Data Structures' },
        { value: 'BCA302', label: 'Database Management Systems' },
        { value: 'BCA303', label: 'Operating Systems' },
        { value: 'BCA304', label: 'Web Technologies' },
        { value: 'BCA305', label: 'Software Engineering' }
      ],
      4: [
        { value: 'BCA401', label: 'Computer Networks Fundamentals' },
        { value: 'BCA402', label: 'Python Programming' },
        { value: 'BCA403', label: 'Software Testing' },
        { value: 'BCA404', label: 'Web Development' },
        { value: 'BCA405', label: 'Software Lab IV' }
      ],
      5: [
        { value: 'BCA501', label: 'Computer Networks' },
        { value: 'BCA502', label: 'IT and Environment' },
        { value: 'BCA503', label: 'Java Programming Using Linux' },
        { value: 'BCA504', label: 'Open Course' },
        { value: 'BCA505', label: 'Mini Project' },
        { value: 'BCA506', label: 'Software Lab V' }
      ],
      6: [
        { value: 'BCA601', label: 'Artificial Intelligence' },
        { value: 'BCA602', label: 'Cyber Security' },
        { value: 'BCA603', label: 'Cloud Computing' },
        { value: 'BCA604', label: 'Mobile Application Development' },
        { value: 'BCA605', label: 'Project Work' }
      ]
    },
    'BBA': {
      1: [
        { value: 'BBA101', label: 'Business Accounting' },
        { value: 'BBA102', label: 'Business Mathematics' },
        { value: 'BBA103', label: 'Principles of Management' },
        { value: 'BBA104', label: 'Business Statistics' },
        { value: 'BBA105', label: 'Global Business Environment' }
      ],
      2: [
        { value: 'BBA201', label: 'Business Communication' },
        { value: 'BBA202', label: 'Cost Accounting' },
        { value: 'BBA203', label: 'Mathematics for Management' },
        { value: 'BBA204', label: 'Statistics for Management' },
        { value: 'BBA205', label: 'English' }
      ],
      3: [
        { value: 'BBA301', label: 'Business Laws' },
        { value: 'BBA302', label: 'Human Resource Management' },
        { value: 'BBA303', label: 'Marketing Management' },
        { value: 'BBA304', label: 'Research Methodology' },
        { value: 'BBA305', label: 'Corporate Accounting' }
      ],
      4: [
        { value: 'BBA401', label: 'Informatics for Management' },
        { value: 'BBA402', label: 'Corporate Law' },
        { value: 'BBA403', label: 'Financial Management' },
        { value: 'BBA404', label: 'Managerial Economics' },
        { value: 'BBA405', label: 'Entrepreneurship' }
      ],
      5: [
        { value: 'BBA501', label: 'Industrial Relations' },
        { value: 'BBA502', label: 'Intellectual Property Rights' },
        { value: 'BBA503', label: 'Operations Management' },
        { value: 'BBA504', label: 'Environment Science' },
        { value: 'BBA505', label: 'Capital Market' },
        { value: 'BBA506', label: 'Organisational Behaviour' }
      ],
      6: [
        { value: 'BBA601', label: 'Advertising and Salesmanship' },
        { value: 'BBA602', label: 'Communication Skills' },
        { value: 'BBA603', label: 'Investment Management' },
        { value: 'BBA604', label: 'Strategic Management' },
        { value: 'BBA605', label: 'Banking Management' }
      ]
    },
    'B.Com': {
      1: [
        { value: 'COM101', label: 'Corporate Regulations' },
        { value: 'COM102', label: 'Business Studies' },
        { value: 'COM103', label: 'Financial Accounting 1' },
        { value: 'COM104', label: 'Banking and Insurance' },
        { value: 'COM105', label: 'English' }
      ],
      2: [
        { value: 'COM201', label: 'Business Management' },
        { value: 'COM202', label: 'Business Regulatory Framework' },
        { value: 'COM203', label: 'Financial Accounting 2' },
        { value: 'COM204', label: 'Business Decisions' },
        { value: 'COM205', label: 'Quantitative Techniques' }
      ],
      3: [
        { value: 'COM301', label: 'Corporate Accounting 1' },
        { value: 'COM302', label: 'Financial Markets' },
        { value: 'COM303', label: 'Marketing Management' },
        { value: 'COM304', label: 'Quantitative Techniques 1' },
        { value: 'COM305', label: 'Goods and Services Tax' }
      ],
      4: [
        { value: 'COM401', label: 'Corporate Accounting 2' },
        { value: 'COM402', label: 'Entrepreneurship Development' },
        { value: 'COM403', label: 'Financial Services' },
        { value: 'COM404', label: 'Quantitative Techniques 2' },
        { value: 'COM405', label: 'Information Technology' }
      ],
      5: [
        { value: 'COM501', label: 'Cost Accounting 1' },
        { value: 'COM502', label: 'Brand Management' },
        { value: 'COM503', label: 'Computer Fundamentals' },
        { value: 'COM504', label: 'E-Commerce' },
        { value: 'COM505', label: 'Environment Management' },
        { value: 'COM506', label: 'Programming in C' }
      ],
      6: [
        { value: 'COM601', label: 'Cost Accounting 2' },
        { value: 'COM602', label: 'Management Accounting' },
        { value: 'COM603', label: 'Advertisement and Sales' },
        { value: 'COM604', label: 'Auditing and Assurance' },
        { value: 'COM605', label: 'Income Tax' }
      ]
    }
  }

  const semesterOptions = [
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' }
  ]

  // Get teacher's department (from user object)
  // Map department names to database keys
  const departmentMap = {
    'Computer Science': 'BCA',
    'Business Administration': 'BBA',
    'Commerce': 'B.Com',
    'BCA': 'BCA',
    'BBA': 'BBA',
    'B.Com': 'B.Com'
  }
  const teacherDepartment = departmentMap[user?.department] || 'BCA'

  // Update available subjects when semester changes
  useEffect(() => {
    if (selectedSemester && teacherDepartment) {
      const semesterNum = parseInt(selectedSemester)
      const deptData = subjectDatabase[teacherDepartment]
      const subjects = deptData ? (deptData[semesterNum] || []) : []
      setAvailableSubjects(subjects)
    }
  }, [selectedSemester, teacherDepartment])

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleExamTypeChange = (e) => {
    const type = e.target.value
    setExamType(type)
    
    // Set default max marks based on exam type
    if (type === 'class_test' || type === 'internal_1') {
      setMaxMarks(40)
    } else if (type === 'internal_2') {
      setMaxMarks(80)
    }
  }

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: value
    }))
  }

  const handleSubmit = () => {
    // Save marks to localStorage or API
    const subjectLabel = availableSubjects.find(s => s.value === selectedSubject)?.label || selectedSubject
    const examLabel = examTypes.find(e => e.value === examType)?.label || examType
    
    const marksData = {
      id: Date.now(),
      examType,
      examLabel,
      subject: selectedSubject,
      subjectLabel,
      semester: selectedSemester,
      maxMarks,
      marks,
      studentCount: Object.keys(marks).length,
      submittedBy: user.full_name,
      submittedAt: new Date().toISOString()
    }
    
    console.log('Submitting marks:', marksData)
    
    // Add to submissions history
    setSubmissions(prev => {
      const updated = [marksData, ...prev]
      // Save to localStorage
      localStorage.setItem('teacherMarksSubmissions', JSON.stringify(updated))
      return updated
    })
    
    alert('✅ Marks submitted successfully!')
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setExamType('')
    setSelectedSemester('')
    setSelectedSubject('')
    setMaxMarks(40)
    setMarks({})
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
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Marks Management</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-slate-700 dark:text-slate-300 font-medium">{user?.full_name}</span>
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
              <i className="fas fa-user-tie text-xl"></i>
            </div>
          </div>
        </header>

        <p className="text-slate-600 dark:text-slate-400 mb-8">Enter test and exam marks for students</p>

        {/* Add Marks Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fas fa-pen text-4xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Add Marks</h2>
                <p className="text-green-100">Enter test and exam marks</p>
              </div>
            </div>
            <button
              onClick={handleOpenModal}
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Open
            </button>
          </div>
        </div>

        {/* Recent Marks History */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Recent Submissions</h2>
          
          {submissions.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No marks submitted yet</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                        {submission.examLabel}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        <i className="fas fa-book mr-2"></i>
                        {submission.subjectLabel} - Semester {submission.semester}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                        <i className="fas fa-users mr-2"></i>
                        {submission.studentCount} students • Max Marks: {submission.maxMarks}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(submission.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full my-8 shadow-2xl min-h-[600px] max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center p-8 pb-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add Marks</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-8 pb-8">

            {/* Step 1: Select Exam Type */}
            {!examType && (
              <div className="space-y-6">
                <CustomSelect
                  name="examType"
                  value={examType}
                  onChange={handleExamTypeChange}
                  options={examTypes}
                  label="Select Exam Type"
                  placeholder="Choose exam type"
                />
              </div>
            )}

            {/* Step 2: Select Semester */}
            {examType && !selectedSemester && (
              <div className="space-y-6">
                <button
                  onClick={() => setExamType('')}
                  className="text-indigo-500 hover:text-indigo-600 mb-4"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back
                </button>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-4">
                  <p className="text-slate-800 dark:text-white font-semibold">
                    {examTypes.find(e => e.value === examType)?.label}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Department: {teacherDepartment}</p>
                </div>

                <CustomSelect
                  name="semester"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  options={semesterOptions}
                  label="Select Semester"
                  placeholder="Choose semester"
                />

                <button
                  onClick={() => selectedSemester && setSelectedSemester(selectedSemester)}
                  disabled={!selectedSemester}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 3: Select Subject and Configure */}
            {examType && selectedSemester && !selectedSubject && (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedSemester('')}
                  className="text-indigo-500 hover:text-indigo-600 mb-4"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back
                </button>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-4">
                  <p className="text-slate-800 dark:text-white font-semibold">
                    {examTypes.find(e => e.value === examType)?.label} - Semester {selectedSemester}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Department: {teacherDepartment}</p>
                </div>

                <CustomSelect
                  name="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  options={availableSubjects}
                  label="Select Subject"
                  placeholder="Choose subject"
                />

                {examType !== 'semester' && (
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Maximum Marks
                    </label>
                    <input
                      type="number"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                )}

                <button
                  onClick={() => selectedSubject && setSelectedSubject(selectedSubject)}
                  disabled={!selectedSubject}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 3: Enter Marks */}
            {examType && selectedSubject && examType !== 'semester' && (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedSubject('')}
                  className="text-indigo-500 hover:text-indigo-600 mb-4"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back
                </button>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-4">
                  <p className="text-slate-800 dark:text-white font-semibold">
                    {examTypes.find(e => e.value === examType)?.label} - {availableSubjects.find(s => s.value === selectedSubject)?.label}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Maximum Marks: {maxMarks}</p>
                </div>

                <div className="space-y-3">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-white">{student.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{student.rollNo}</p>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={marks[student.id] || ''}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          placeholder={`/ ${maxMarks}`}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all"
                >
                  <i className="fas fa-check mr-2"></i>
                  Submit Marks
                </button>
              </div>
            )}

            {/* Semester Marks - Complex Form */}
            {examType === 'semester' && selectedSubject && !selectedStudent && (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedSubject('')}
                  className="text-indigo-500 hover:text-indigo-600 mb-4"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back
                </button>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-4">
                  <p className="text-slate-800 dark:text-white font-semibold">
                    Semester Exam - {availableSubjects.find(s => s.value === selectedSubject)?.label}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Select a student to enter marks</p>
                </div>

                <div className="space-y-3">
                  {students.map(student => (
                    <div 
                      key={student.id} 
                      onClick={() => setSelectedStudent(student)}
                      className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-white">{student.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{student.rollNo} - Semester {student.semester}</p>
                      </div>
                      <i className="fas fa-chevron-right text-slate-400"></i>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Semester Marks Entry Form */}
            {examType === 'semester' && selectedStudent && (
              <SemesterMarksForm
                student={selectedStudent}
                onSubmit={(data) => {
                  console.log('Semester marks:', data)
                  // Save to localStorage or API
                  localStorage.setItem(`semester_marks_${selectedStudent.id}`, JSON.stringify(data))
                  alert('✅ Semester marks submitted successfully!')
                  setShowModal(false)
                  resetForm()
                  setSelectedStudent(null)
                }}
                onBack={() => setSelectedStudent(null)}
              />
            )}
            </div>
          </motion.div>
        </div>
      )}

    </>
  )
}

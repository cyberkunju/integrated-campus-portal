import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'

export default function Subjects() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const user = api.getCurrentUser()

  // Subject database by department and semester
  const subjectDatabase = {
    'BCA': {
      1: [
        { code: 'BCA101', name: 'Programming Fundamentals', credits: 4, teacher: 'Dr. Rajesh Kumar' },
        { code: 'BCA102', name: 'Digital Electronics', credits: 4, teacher: 'Prof. Anita Desai' },
        { code: 'BCA103', name: 'Mathematics I', credits: 4, teacher: 'Dr. Suresh Patel' },
        { code: 'BCA104', name: 'English Communication', credits: 3, teacher: 'Ms. Priya Sharma' },
        { code: 'BCA105', name: 'Computer Organization', credits: 4, teacher: 'Dr. Amit Singh' }
      ],
      2: [
        { code: 'BCA201', name: 'Data Structures Fundamentals', credits: 4, teacher: 'Dr. Rajesh Kumar' },
        { code: 'BCA202', name: 'Computer Architecture', credits: 4, teacher: 'Prof. Vikram Mehta' },
        { code: 'BCA203', name: 'Mathematics II', credits: 4, teacher: 'Dr. Suresh Patel' },
        { code: 'BCA204', name: 'Object Oriented Programming', credits: 4, teacher: 'Ms. Neha Gupta' },
        { code: 'BCA205', name: 'Software Lab II', credits: 2, teacher: 'Mr. Karan Joshi' }
      ],
      3: [
        { code: 'BCA301', name: 'Data Structures', credits: 4, teacher: 'Dr. Rajesh Kumar' },
        { code: 'BCA302', name: 'Database Management Systems', credits: 4, teacher: 'Prof. Anita Desai' },
        { code: 'BCA303', name: 'Operating Systems', credits: 4, teacher: 'Dr. Amit Singh' },
        { code: 'BCA304', name: 'Web Technologies', credits: 4, teacher: 'Ms. Priya Sharma' },
        { code: 'BCA305', name: 'Software Engineering', credits: 4, teacher: 'Dr. Vikram Mehta' }
      ],
      4: [
        { code: 'BCA401', name: 'Computer Networks Fundamentals', credits: 4, teacher: 'Dr. Amit Singh' },
        { code: 'BCA402', name: 'Python Programming', credits: 4, teacher: 'Ms. Neha Gupta' },
        { code: 'BCA403', name: 'Software Testing', credits: 3, teacher: 'Mr. Karan Joshi' },
        { code: 'BCA404', name: 'Web Development', credits: 4, teacher: 'Ms. Priya Sharma' },
        { code: 'BCA405', name: 'Software Lab IV', credits: 2, teacher: 'Mr. Karan Joshi' }
      ],
      5: [
        { code: 'BCA501', name: 'Computer Networks', credits: 4, teacher: 'Dr. Amit Singh' },
        { code: 'BCA502', name: 'IT and Environment', credits: 3, teacher: 'Prof. Anita Desai' },
        { code: 'BCA503', name: 'Java Programming Using Linux', credits: 4, teacher: 'Dr. Rajesh Kumar' },
        { code: 'BCA504', name: 'Open Course', credits: 3, teacher: 'Various Faculty' },
        { code: 'BCA505', name: 'Mini Project', credits: 4, teacher: 'Project Guide' },
        { code: 'BCA506', name: 'Software Lab V', credits: 2, teacher: 'Mr. Karan Joshi' }
      ],
      6: [
        { code: 'BCA601', name: 'Artificial Intelligence', credits: 4, teacher: 'Dr. Rajesh Kumar' },
        { code: 'BCA602', name: 'Cyber Security', credits: 4, teacher: 'Dr. Amit Singh' },
        { code: 'BCA603', name: 'Cloud Computing', credits: 4, teacher: 'Prof. Vikram Mehta' },
        { code: 'BCA604', name: 'Mobile Application Development', credits: 4, teacher: 'Ms. Neha Gupta' },
        { code: 'BCA605', name: 'Project Work', credits: 6, teacher: 'Project Guide' }
      ]
    },
    'BBA': {
      1: [
        { code: 'BBA101', name: 'Business Accounting', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'BBA102', name: 'Business Mathematics', credits: 4, teacher: 'Dr. Kavita Nair' },
        { code: 'BBA103', name: 'Principles of Management', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'BBA104', name: 'Business Statistics', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'BBA105', name: 'Global Business Environment', credits: 3, teacher: 'Dr. Arun Malhotra' }
      ],
      2: [
        { code: 'BBA201', name: 'Business Communication', credits: 3, teacher: 'Ms. Priya Sharma' },
        { code: 'BBA202', name: 'Cost Accounting', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'BBA203', name: 'Mathematics for Management', credits: 4, teacher: 'Dr. Kavita Nair' },
        { code: 'BBA204', name: 'Statistics for Management', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'BBA205', name: 'English', credits: 3, teacher: 'Ms. Priya Sharma' }
      ],
      3: [
        { code: 'BBA301', name: 'Business Laws', credits: 4, teacher: 'Dr. Arun Malhotra' },
        { code: 'BBA302', name: 'Human Resource Management', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'BBA303', name: 'Marketing Management', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'BBA304', name: 'Research Methodology', credits: 3, teacher: 'Dr. Kavita Nair' },
        { code: 'BBA305', name: 'Corporate Accounting', credits: 4, teacher: 'Prof. Ramesh Iyer' }
      ],
      4: [
        { code: 'BBA401', name: 'Informatics for Management', credits: 4, teacher: 'Ms. Neha Gupta' },
        { code: 'BBA402', name: 'Corporate Law', credits: 4, teacher: 'Dr. Arun Malhotra' },
        { code: 'BBA403', name: 'Financial Management', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'BBA404', name: 'Managerial Economics', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'BBA405', name: 'Entrepreneurship', credits: 3, teacher: 'Prof. Meera Reddy' }
      ],
      5: [
        { code: 'BBA501', name: 'Industrial Relations', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'BBA502', name: 'Intellectual Property Rights', credits: 3, teacher: 'Dr. Arun Malhotra' },
        { code: 'BBA503', name: 'Operations Management', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'BBA504', name: 'Environment Science', credits: 3, teacher: 'Dr. Kavita Nair' },
        { code: 'BBA505', name: 'Capital Market', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'BBA506', name: 'Organisational Behaviour', credits: 4, teacher: 'Dr. Sunil Kapoor' }
      ],
      6: [
        { code: 'BBA601', name: 'Advertising and Salesmanship', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'BBA602', name: 'Communication Skills', credits: 3, teacher: 'Ms. Priya Sharma' },
        { code: 'BBA603', name: 'Investment Management', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'BBA604', name: 'Strategic Management', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'BBA605', name: 'Banking Management', credits: 4, teacher: 'Prof. Ramesh Iyer' }
      ]
    },
    'B.Com': {
      1: [
        { code: 'COM101', name: 'Corporate Regulations', credits: 4, teacher: 'Dr. Arun Malhotra' },
        { code: 'COM102', name: 'Business Studies', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'COM103', name: 'Financial Accounting 1', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'COM104', name: 'Banking and Insurance', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'COM105', name: 'English', credits: 3, teacher: 'Ms. Priya Sharma' }
      ],
      2: [
        { code: 'COM201', name: 'Business Management', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'COM202', name: 'Business Regulatory Framework', credits: 4, teacher: 'Dr. Arun Malhotra' },
        { code: 'COM203', name: 'Financial Accounting 2', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'COM204', name: 'Business Decisions', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'COM205', name: 'Quantitative Techniques', credits: 4, teacher: 'Dr. Kavita Nair' }
      ],
      3: [
        { code: 'COM301', name: 'Corporate Accounting 1', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'COM302', name: 'Financial Markets', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'COM303', name: 'Marketing Management', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'COM304', name: 'Quantitative Techniques 1', credits: 4, teacher: 'Dr. Kavita Nair' },
        { code: 'COM305', name: 'Goods and Services Tax', credits: 4, teacher: 'Dr. Arun Malhotra' }
      ],
      4: [
        { code: 'COM401', name: 'Corporate Accounting 2', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'COM402', name: 'Entrepreneurship Development', credits: 4, teacher: 'Dr. Sunil Kapoor' },
        { code: 'COM403', name: 'Financial Services', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'COM404', name: 'Quantitative Techniques 2', credits: 4, teacher: 'Dr. Kavita Nair' },
        { code: 'COM405', name: 'Information Technology', credits: 4, teacher: 'Ms. Neha Gupta' }
      ],
      5: [
        { code: 'COM501', name: 'Cost Accounting 1', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'COM502', name: 'Brand Management', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'COM503', name: 'Computer Fundamentals', credits: 4, teacher: 'Ms. Neha Gupta' },
        { code: 'COM504', name: 'E-Commerce', credits: 3, teacher: 'Dr. Sunil Kapoor' },
        { code: 'COM505', name: 'Environment Management', credits: 3, teacher: 'Dr. Kavita Nair' },
        { code: 'COM506', name: 'Programming in C', credits: 4, teacher: 'Mr. Karan Joshi' }
      ],
      6: [
        { code: 'COM601', name: 'Cost Accounting 2', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'COM602', name: 'Management Accounting', credits: 4, teacher: 'Prof. Ramesh Iyer' },
        { code: 'COM603', name: 'Advertisement and Sales', credits: 4, teacher: 'Prof. Meera Reddy' },
        { code: 'COM604', name: 'Auditing and Assurance', credits: 4, teacher: 'Dr. Arun Malhotra' },
        { code: 'COM605', name: 'Income Tax', credits: 4, teacher: 'Dr. Arun Malhotra' }
      ]
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Get subjects based on student's department and semester
    const studentDept = user.department || 'BCA'
    const studentSem = parseInt(user.semester) || 1
    
    const deptSubjects = subjectDatabase[studentDept]
    if (deptSubjects && deptSubjects[studentSem]) {
      setSubjects(deptSubjects[studentSem])
    }
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-slate-800 dark:text-white">Loading...</div>
      </div>
    )
  }

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
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Subjects</h1>
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

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Semester {user?.semester || '1'} - {user?.department || 'BCA'}</h2>
            <p className="text-indigo-100">Current semester courses</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{subjects.length}</p>
            <p className="text-indigo-100 text-sm">Subjects</p>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-book-open text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
          <p className="text-slate-600 dark:text-slate-400 text-lg">No subjects found for your semester</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <i className="fas fa-book text-2xl text-indigo-500"></i>
                </div>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold">
                  {subject.credits} Credits
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                {subject.name}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                {subject.code}
              </p>
              <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                <i className="fas fa-user-tie mr-2"></i>
                {subject.teacher}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </motion.div>
      <Navigation />
    </>
  )
}

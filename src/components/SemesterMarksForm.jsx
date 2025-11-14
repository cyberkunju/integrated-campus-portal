import { useState } from 'react'
import { getGradeAndGP, calculateCP, calculateTotal, getResult, calculateSemesterTotals } from '../utils/gradeCalculator'

export default function SemesterMarksForm({ student, onSubmit, onBack }) {
  const [subjects, setSubjects] = useState([
    { 
      courseCode: '', 
      courseName: '', 
      credit: 4, 
      esaMarks: '', 
      esaMax: 80, 
      isaMarks: '', 
      isaMax: 20,
      total: 0,
      grade: '',
      gp: 0,
      cp: 0,
      result: ''
    }
  ])

  const addSubject = () => {
    setSubjects([...subjects, {
      courseCode: '',
      courseName: '',
      credit: 4,
      esaMarks: '',
      esaMax: 80,
      isaMarks: '',
      isaMax: 20,
      total: 0,
      grade: '',
      gp: 0,
      cp: 0,
      result: ''
    }])
  }

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index))
    }
  }

  const updateSubject = (index, field, value) => {
    const updated = [...subjects]
    updated[index][field] = value
    
    // Auto-calculate when marks change
    if (field === 'esaMarks' || field === 'isaMarks' || field === 'credit') {
      const esa = parseInt(updated[index].esaMarks) || 0
      const isa = parseInt(updated[index].isaMarks) || 0
      const total = esa + isa
      
      updated[index].total = total
      
      const { grade, gp } = getGradeAndGP(total)
      updated[index].grade = grade
      updated[index].gp = gp
      updated[index].cp = calculateCP(parseInt(updated[index].credit) || 0, gp)
      updated[index].result = getResult(total)
    }
    
    setSubjects(updated)
  }

  const handleSubmit = () => {
    const totals = calculateSemesterTotals(subjects)
    
    const semesterData = {
      student: student,
      subjects: subjects,
      totals: totals,
      submittedAt: new Date().toISOString()
    }
    
    onSubmit(semesterData)
  }

  const totals = calculateSemesterTotals(subjects)

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-indigo-500 hover:text-indigo-600 mb-4"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        Back
      </button>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg">
          Semester Marks Entry
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Student: {student.name} ({student.rollNo})
        </p>
      </div>

      {/* Subjects Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="p-2 text-left">Course Code</th>
              <th className="p-2 text-left">Course</th>
              <th className="p-2 text-center">Credit</th>
              <th className="p-2 text-center" colSpan="2">External (ESA)</th>
              <th className="p-2 text-center" colSpan="2">Internal (ISA)</th>
              <th className="p-2 text-center">Total</th>
              <th className="p-2 text-center">MAX</th>
              <th className="p-2 text-center">Grade</th>
              <th className="p-2 text-center">GP</th>
              <th className="p-2 text-center">CP</th>
              <th className="p-2 text-center">Result</th>
              <th className="p-2"></th>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs">
              <th className="p-1"></th>
              <th className="p-1"></th>
              <th className="p-1"></th>
              <th className="p-1">ESA</th>
              <th className="p-1">MAX</th>
              <th className="p-1">ISA</th>
              <th className="p-1">MAX</th>
              <th className="p-1"></th>
              <th className="p-1"></th>
              <th className="p-1"></th>
              <th className="p-1"></th>
              <th className="p-1"></th>
              <th className="p-1"></th>
              <th className="p-1"></th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={index} className="border-b border-slate-200 dark:border-slate-700">
                <td className="p-2">
                  <input
                    type="text"
                    value={subject.courseCode}
                    onChange={(e) => updateSubject(index, 'courseCode', e.target.value)}
                    placeholder="Code"
                    className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={subject.courseName}
                    onChange={(e) => updateSubject(index, 'courseName', e.target.value)}
                    placeholder="Course Name"
                    className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={subject.credit}
                    onChange={(e) => updateSubject(index, 'credit', e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={subject.esaMarks}
                    onChange={(e) => updateSubject(index, 'esaMarks', e.target.value)}
                    max={subject.esaMax}
                    placeholder="0"
                    className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm text-center"
                  />
                </td>
                <td className="p-2 text-center text-slate-600 dark:text-slate-400">{subject.esaMax}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={subject.isaMarks}
                    onChange={(e) => updateSubject(index, 'isaMarks', e.target.value)}
                    max={subject.isaMax}
                    placeholder="0"
                    className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm text-center"
                  />
                </td>
                <td className="p-2 text-center text-slate-600 dark:text-slate-400">{subject.isaMax}</td>
                <td className="p-2 text-center font-bold text-slate-800 dark:text-white">{subject.total}</td>
                <td className="p-2 text-center text-slate-600 dark:text-slate-400">100</td>
                <td className="p-2 text-center font-bold text-indigo-600 dark:text-indigo-400">{subject.grade}</td>
                <td className="p-2 text-center font-bold text-slate-800 dark:text-white">{subject.gp}</td>
                <td className="p-2 text-center font-bold text-slate-800 dark:text-white">{subject.cp}</td>
                <td className={`p-2 text-center font-bold ${subject.result === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                  {subject.result}
                </td>
                <td className="p-2">
                  {subjects.length > 1 && (
                    <button
                      onClick={() => removeSubject(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
              <td className="p-2" colSpan="2">SEMESTER RESULT</td>
              <td className="p-2 text-center">{totals.totalCredits}</td>
              <td className="p-2 text-center" colSpan="4">SCPA: {totals.scpa}</td>
              <td className="p-2 text-center">{totals.totalMarks}</td>
              <td className="p-2 text-center">{totals.totalMaxMarks}</td>
              <td className="p-2 text-center text-indigo-600 dark:text-indigo-400">{totals.overallGrade}</td>
              <td className="p-2"></td>
              <td className="p-2 text-center">{totals.totalCP}</td>
              <td className={`p-2 text-center ${totals.overallResult === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                {totals.overallResult}
              </td>
              <td className="p-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex gap-4">
        <button
          onClick={addSubject}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Subject
        </button>

        <button
          onClick={handleSubmit}
          disabled={subjects.some(s => !s.courseCode || !s.courseName)}
          className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
        >
          <i className="fas fa-check mr-2"></i>
          Submit Semester Marks
        </button>
      </div>
    </div>
  )
}

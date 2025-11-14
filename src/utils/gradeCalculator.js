// Grade Calculator Utility
// Calculates GP, CP, and SCPA based on university grading system

// Grade Point mapping based on total marks (out of 100)
export const getGradeAndGP = (totalMarks) => {
  if (totalMarks >= 90) return { grade: 'A+', gp: 9 }
  if (totalMarks >= 80) return { grade: 'A', gp: 8 }
  if (totalMarks >= 70) return { grade: 'B+', gp: 7 }
  if (totalMarks >= 60) return { grade: 'B', gp: 6 }
  if (totalMarks >= 50) return { grade: 'C', gp: 5 }
  if (totalMarks >= 40) return { grade: 'D', gp: 4 }
  return { grade: 'F', gp: 0 }
}

// Calculate Credit Points (CP = Credit * GP)
export const calculateCP = (credit, gp) => {
  return credit * gp
}

// Calculate SCPA (Semester Credit Point Average)
// SCPA = Total CP / Total Credits
export const calculateSCPA = (subjects) => {
  const totalCredits = subjects.reduce((sum, sub) => sum + parseInt(sub.credit || 0), 0)
  const totalCP = subjects.reduce((sum, sub) => sum + parseInt(sub.cp || 0), 0)
  
  if (totalCredits === 0) return 0
  
  return (totalCP / totalCredits).toFixed(2)
}

// Calculate total marks (ESA + ISA)
export const calculateTotal = (esa, isa) => {
  return parseInt(esa || 0) + parseInt(isa || 0)
}

// Determine result status
export const getResult = (totalMarks) => {
  return totalMarks >= 40 ? 'Passed' : 'Failed'
}

// Calculate semester totals
export const calculateSemesterTotals = (subjects) => {
  const totalMarks = subjects.reduce((sum, sub) => sum + parseInt(sub.total || 0), 0)
  const totalMaxMarks = subjects.reduce((sum, sub) => sum + 100, 0) // Each subject out of 100
  const totalCredits = subjects.reduce((sum, sub) => sum + parseInt(sub.credit || 0), 0)
  const totalCP = subjects.reduce((sum, sub) => sum + parseInt(sub.cp || 0), 0)
  const scpa = calculateSCPA(subjects)
  
  // Overall grade based on SCPA
  let overallGrade = 'F'
  if (scpa >= 9) overallGrade = 'A+'
  else if (scpa >= 8) overallGrade = 'A'
  else if (scpa >= 7) overallGrade = 'B+'
  else if (scpa >= 6) overallGrade = 'B'
  else if (scpa >= 5) overallGrade = 'C'
  else if (scpa >= 4) overallGrade = 'D'
  
  const overallResult = subjects.every(sub => getResult(sub.total) === 'Passed') ? 'Passed' : 'Failed'
  
  return {
    totalMarks,
    totalMaxMarks,
    totalCredits,
    totalCP,
    scpa,
    overallGrade,
    overallResult
  }
}

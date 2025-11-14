# Grade Calculation System

## Complete Grading System Documentation

This document explains the complete grade calculation system used in the Student Portal.

## Overview

The Student Portal uses a **4.0 GPA scale** with letter grades. The system calculates:
- **GP (Grade Point)**: Individual subject grade
- **CP (Credit Point)**: GP × Credit Hours
- **GPA (Grade Point Average)**: Semester average
- **CGPA (Cumulative GPA)**: Overall average

## Grading Scale

### Letter Grades and Grade Points

| Marks Range | Letter Grade | Grade Point (GP) | Description |
|-------------|--------------|------------------|-------------|
| 90-100 | A+ | 4.00 | Outstanding |
| 85-89 | A | 3.75 | Excellent |
| 80-84 | A- | 3.50 | Very Good |
| 75-79 | B+ | 3.25 | Good |
| 70-74 | B | 3.00 | Above Average |
| 65-69 | B- | 2.75 | Average |
| 60-64 | C+ | 2.50 | Below Average |
| 55-59 | C | 2.25 | Satisfactory |
| 50-54 | C- | 2.00 | Pass |
| 0-49 | F | 0.00 | Fail |

## Calculation Formulas

### 1. Total Marks

```
Total Marks = Internal Marks + External Marks
```

**Components**:
- **Internal Marks**: Maximum 30 marks (assignments, quizzes, mid-term)
- **External Marks**: Maximum 70 marks (final examination)
- **Total**: Maximum 100 marks

**Example**:
```
Internal: 25/30
External: 65/70
Total: 90/100
```

### 2. Grade Point (GP)

```javascript
function calculateGradePoint(totalMarks) {
  if (totalMarks >= 90) return 4.00;
  if (totalMarks >= 85) return 3.75;
  if (totalMarks >= 80) return 3.50;
  if (totalMarks >= 75) return 3.25;
  if (totalMarks >= 70) return 3.00;
  if (totalMarks >= 65) return 2.75;
  if (totalMarks >= 60) return 2.50;
  if (totalMarks >= 55) return 2.25;
  if (totalMarks >= 50) return 2.00;
  return 0.00;
}
```

### 3. Letter Grade

```javascript
function getLetterGrade(totalMarks) {
  if (totalMarks >= 90) return 'A+';
  if (totalMarks >= 85) return 'A';
  if (totalMarks >= 80) return 'A-';
  if (totalMarks >= 75) return 'B+';
  if (totalMarks >= 70) return 'B';
  if (totalMarks >= 65) return 'B-';
  if (totalMarks >= 60) return 'C+';
  if (totalMarks >= 55) return 'C';
  if (totalMarks >= 50) return 'C-';
  return 'F';
}
```

### 4. Credit Point (CP)

```
CP = GP × Credit Hours
```

**Example**:
```
Subject: Programming Fundamentals
Credit Hours: 3
Grade Point: 4.00
Credit Point: 4.00 × 3 = 12.00
```

### 5. Semester GPA

```
GPA = Total CP / Total Credit Hours
```

**Example**:
```
Subject 1: GP=4.00, Credits=3, CP=12.00
Subject 2: GP=3.75, Credits=3, CP=11.25
Subject 3: GP=3.50, Credits=4, CP=14.00
Subject 4: GP=4.00, Credits=3, CP=12.00
Subject 5: GP=3.75, Credits=2, CP=7.50
Subject 6: GP=3.50, Credits=3, CP=10.50

Total CP: 67.25
Total Credits: 18
GPA: 67.25 / 18 = 3.74
```

### 6. Cumulative GPA (CGPA)

```
CGPA = Total CP (All Semesters) / Total Credit Hours (All Semesters)
```

**Example**:
```
Semester 1: GPA=3.50, Credits=18, CP=63.00
Semester 2: GPA=3.75, Credits=18, CP=67.50
Semester 3: GPA=3.74, Credits=18, CP=67.32

Total CP: 197.82
Total Credits: 54
CGPA: 197.82 / 54 = 3.66
```

## Implementation

### Frontend Calculation (JavaScript)

**File**: `src/utils/gradeCalculator.js`

```javascript
/**
 * Calculate grade point from total marks
 * @param {number} totalMarks - Total marks (0-100)
 * @returns {number} Grade point (0.00-4.00)
 */
export const calculateGradePoint = (totalMarks) => {
  if (totalMarks >= 90) return 4.00;
  if (totalMarks >= 85) return 3.75;
  if (totalMarks >= 80) return 3.50;
  if (totalMarks >= 75) return 3.25;
  if (totalMarks >= 70) return 3.00;
  if (totalMarks >= 65) return 2.75;
  if (totalMarks >= 60) return 2.50;
  if (totalMarks >= 55) return 2.25;
  if (totalMarks >= 50) return 2.00;
  return 0.00;
};

/**
 * Get letter grade from total marks
 * @param {number} totalMarks - Total marks (0-100)
 * @returns {string} Letter grade (A+, A, B+, etc.)
 */
export const getLetterGrade = (totalMarks) => {
  if (totalMarks >= 90) return 'A+';
  if (totalMarks >= 85) return 'A';
  if (totalMarks >= 80) return 'A-';
  if (totalMarks >= 75) return 'B+';
  if (totalMarks >= 70) return 'B';
  if (totalMarks >= 65) return 'B-';
  if (totalMarks >= 60) return 'C+';
  if (totalMarks >= 55) return 'C';
  if (totalMarks >= 50) return 'C-';
  return 'F';
};

/**
 * Calculate credit point
 * @param {number} gradePoint - Grade point (0.00-4.00)
 * @param {number} creditHours - Credit hours
 * @returns {number} Credit point
 */
export const calculateCreditPoint = (gradePoint, creditHours) => {
  return gradePoint * creditHours;
};

/**
 * Calculate GPA for a semester
 * @param {Array} marks - Array of mark objects with gradePoint and creditHours
 * @returns {number} GPA (0.00-4.00)
 */
export const calculateGPA = (marks) => {
  if (!marks || marks.length === 0) return 0;
  
  let totalCP = 0;
  let totalCredits = 0;
  
  marks.forEach(mark => {
    const cp = calculateCreditPoint(mark.gradePoint, mark.creditHours);
    totalCP += cp;
    totalCredits += mark.creditHours;
  });
  
  return totalCredits > 0 ? (totalCP / totalCredits).toFixed(2) : 0;
};

/**
 * Calculate CGPA across multiple semesters
 * @param {Array} semesters - Array of semester objects with marks
 * @returns {number} CGPA (0.00-4.00)
 */
export const calculateCGPA = (semesters) => {
  if (!semesters || semesters.length === 0) return 0;
  
  let totalCP = 0;
  let totalCredits = 0;
  
  semesters.forEach(semester => {
    semester.marks.forEach(mark => {
      const cp = calculateCreditPoint(mark.gradePoint, mark.creditHours);
      totalCP += cp;
      totalCredits += mark.creditHours;
    });
  });
  
  return totalCredits > 0 ? (totalCP / totalCredits).toFixed(2) : 0;
};

/**
 * Calculate SCPA (Semester Credit Point Average) - Alternative name for GPA
 * @param {Array} marks - Array of mark objects
 * @returns {number} SCPA (0.00-4.00)
 */
export const calculateSCPA = (marks) => {
  return calculateGPA(marks);
};

/**
 * Get grade description
 * @param {string} letterGrade - Letter grade
 * @returns {string} Grade description
 */
export const getGradeDescription = (letterGrade) => {
  const descriptions = {
    'A+': 'Outstanding',
    'A': 'Excellent',
    'A-': 'Very Good',
    'B+': 'Good',
    'B': 'Above Average',
    'B-': 'Average',
    'C+': 'Below Average',
    'C': 'Satisfactory',
    'C-': 'Pass',
    'F': 'Fail'
  };
  return descriptions[letterGrade] || 'Unknown';
};

/**
 * Check if student passed
 * @param {number} totalMarks - Total marks
 * @returns {boolean} True if passed
 */
export const isPassed = (totalMarks) => {
  return totalMarks >= 50;
};

/**
 * Calculate complete grade information
 * @param {number} internalMarks - Internal marks (0-30)
 * @param {number} externalMarks - External marks (0-70)
 * @param {number} creditHours - Credit hours
 * @returns {object} Complete grade information
 */
export const calculateCompleteGrade = (internalMarks, externalMarks, creditHours) => {
  const totalMarks = internalMarks + externalMarks;
  const gradePoint = calculateGradePoint(totalMarks);
  const letterGrade = getLetterGrade(totalMarks);
  const creditPoint = calculateCreditPoint(gradePoint, creditHours);
  const passed = isPassed(totalMarks);
  const description = getGradeDescription(letterGrade);
  
  return {
    internalMarks,
    externalMarks,
    totalMarks,
    gradePoint,
    letterGrade,
    creditHours,
    creditPoint,
    passed,
    description
  };
};
```

### Backend Calculation (PHP)

**File**: `backend/includes/grade_calculator.php`

```php
<?php
/**
 * Calculate grade point from total marks
 */
function calculateGradePoint($totalMarks) {
    if ($totalMarks >= 90) return 4.00;
    if ($totalMarks >= 85) return 3.75;
    if ($totalMarks >= 80) return 3.50;
    if ($totalMarks >= 75) return 3.25;
    if ($totalMarks >= 70) return 3.00;
    if ($totalMarks >= 65) return 2.75;
    if ($totalMarks >= 60) return 2.50;
    if ($totalMarks >= 55) return 2.25;
    if ($totalMarks >= 50) return 2.00;
    return 0.00;
}

/**
 * Get letter grade from total marks
 */
function getLetterGrade($totalMarks) {
    if ($totalMarks >= 90) return 'A+';
    if ($totalMarks >= 85) return 'A';
    if ($totalMarks >= 80) return 'A-';
    if ($totalMarks >= 75) return 'B+';
    if ($totalMarks >= 70) return 'B';
    if ($totalMarks >= 65) return 'B-';
    if ($totalMarks >= 60) return 'C+';
    if ($totalMarks >= 55) return 'C';
    if ($totalMarks >= 50) return 'C-';
    return 'F';
}

/**
 * Calculate credit point
 */
function calculateCreditPoint($gradePoint, $creditHours) {
    return $gradePoint * $creditHours;
}

/**
 * Calculate GPA for marks array
 */
function calculateGPA($marks) {
    if (empty($marks)) return 0;
    
    $totalCP = 0;
    $totalCredits = 0;
    
    foreach ($marks as $mark) {
        $cp = calculateCreditPoint($mark['grade_point'], $mark['credit_hours']);
        $totalCP += $cp;
        $totalCredits += $mark['credit_hours'];
    }
    
    return $totalCredits > 0 ? round($totalCP / $totalCredits, 2) : 0;
}

/**
 * Calculate complete grade information
 */
function calculateCompleteGrade($internalMarks, $externalMarks, $creditHours) {
    $totalMarks = $internalMarks + $externalMarks;
    $gradePoint = calculateGradePoint($totalMarks);
    $letterGrade = getLetterGrade($totalMarks);
    $creditPoint = calculateCreditPoint($gradePoint, $creditHours);
    
    return [
        'internal_marks' => $internalMarks,
        'external_marks' => $externalMarks,
        'total_marks' => $totalMarks,
        'grade_point' => $gradePoint,
        'letter_grade' => $letterGrade,
        'credit_hours' => $creditHours,
        'credit_point' => $creditPoint,
        'passed' => $totalMarks >= 50
    ];
}
?>
```

## Usage Examples

### Example 1: Calculate Single Subject Grade

```javascript
import { calculateCompleteGrade } from './utils/gradeCalculator';

const result = calculateCompleteGrade(25, 65, 3);
console.log(result);
// Output:
// {
//   internalMarks: 25,
//   externalMarks: 65,
//   totalMarks: 90,
//   gradePoint: 4.00,
//   letterGrade: 'A+',
//   creditHours: 3,
//   creditPoint: 12.00,
//   passed: true,
//   description: 'Outstanding'
// }
```

### Example 2: Calculate Semester GPA

```javascript
import { calculateGPA } from './utils/gradeCalculator';

const semesterMarks = [
  { gradePoint: 4.00, creditHours: 3 },
  { gradePoint: 3.75, creditHours: 3 },
  { gradePoint: 3.50, creditHours: 4 },
  { gradePoint: 4.00, creditHours: 3 },
  { gradePoint: 3.75, creditHours: 2 },
  { gradePoint: 3.50, creditHours: 3 }
];

const gpa = calculateGPA(semesterMarks);
console.log(`Semester GPA: ${gpa}`); // Output: 3.74
```

### Example 3: Calculate CGPA

```javascript
import { calculateCGPA } from './utils/gradeCalculator';

const allSemesters = [
  {
    semester: 1,
    marks: [
      { gradePoint: 3.50, creditHours: 3 },
      { gradePoint: 3.75, creditHours: 3 },
      // ... more marks
    ]
  },
  {
    semester: 2,
    marks: [
      { gradePoint: 3.75, creditHours: 3 },
      { gradePoint: 4.00, creditHours: 3 },
      // ... more marks
    ]
  }
];

const cgpa = calculateCGPA(allSemesters);
console.log(`CGPA: ${cgpa}`); // Output: 3.66
```

## Validation Rules

### Input Validation

```javascript
/**
 * Validate marks input
 */
export const validateMarks = (internal, external) => {
  const errors = [];
  
  if (internal < 0 || internal > 30) {
    errors.push('Internal marks must be between 0 and 30');
  }
  
  if (external < 0 || external > 70) {
    errors.push('External marks must be between 0 and 70');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

### Credit Hours Validation

```javascript
/**
 * Validate credit hours
 */
export const validateCreditHours = (credits) => {
  return credits >= 1 && credits <= 4;
};
```

## Display Formatting

### Format GPA Display

```javascript
/**
 * Format GPA for display
 */
export const formatGPA = (gpa) => {
  return parseFloat(gpa).toFixed(2);
};
```

### Color Coding by Grade

```javascript
/**
 * Get color class for grade
 */
export const getGradeColor = (letterGrade) => {
  const colors = {
    'A+': 'text-green-500',
    'A': 'text-green-400',
    'A-': 'text-blue-500',
    'B+': 'text-blue-400',
    'B': 'text-yellow-500',
    'B-': 'text-yellow-400',
    'C+': 'text-orange-500',
    'C': 'text-orange-400',
    'C-': 'text-red-400',
    'F': 'text-red-500'
  };
  return colors[letterGrade] || 'text-gray-500';
};
```

## Academic Standards

### Minimum Requirements

- **Pass Mark**: 50/100
- **Minimum GPA**: 2.00 to pass semester
- **Minimum CGPA**: 2.00 for graduation
- **Maximum Attempts**: 3 attempts per subject

### Academic Standing

| CGPA Range | Standing |
|------------|----------|
| 3.75 - 4.00 | Dean's List |
| 3.50 - 3.74 | High Honors |
| 3.00 - 3.49 | Honors |
| 2.50 - 2.99 | Good Standing |
| 2.00 - 2.49 | Satisfactory |
| Below 2.00 | Academic Probation |

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025

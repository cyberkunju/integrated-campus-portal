# Database Schema

## Complete Database Structure

This document provides the complete MySQL database schema for the Student Portal system.

## Database Overview

**Database Name**: `studentportal`  
**Character Set**: `utf8mb4`  
**Collation**: `utf8mb4_unicode_ci`  
**Total Tables**: 11

## Entity Relationship Overview

```
users (1) ──────────── (1) students
users (1) ──────────── (1) teachers
users (1) ──────────── (1) admins

students (1) ────────── (*) marks
students (1) ────────── (*) attendance
students (1) ────────── (*) payments

subjects (1) ────────── (*) marks
semesters (1) ───────── (*) marks

fees (1) ──────────────── (*) payments

sessions (1) ───────── (*) students
sessions (1) ───────── (*) marks
sessions (1) ───────── (*) attendance
```

## Table Definitions

### 1. users

**Purpose**: Core authentication and user management

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key, auto-increment
- `username`: Unique login identifier
- `password`: Hashed password (bcrypt)
- `email`: User email address
- `role`: User type (student/teacher/admin)
- `status`: Account status
- `created_at`: Account creation timestamp
- `updated_at`: Last modification timestamp
- `last_login`: Last successful login

### 2. students

**Purpose**: Student-specific information

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    enrollment_date DATE NOT NULL,
    session_id INT NOT NULL,
    semester INT NOT NULL,
    department VARCHAR(100),
    program VARCHAR(100),
    batch_year INT,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(15),
    guardian_email VARCHAR(100),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    
    INDEX idx_student_id (student_id),
    INDEX idx_user_id (user_id),
    INDEX idx_session (session_id),
    INDEX idx_semester (semester),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `user_id`: Foreign key to users table
- `student_id`: Unique student identifier (e.g., STU001)
- `first_name`, `last_name`: Student name
- `date_of_birth`: Birth date
- `gender`: Student gender
- `phone`: Contact number
- `address`: Residential address
- `enrollment_date`: Date of admission
- `session_id`: Academic session
- `semester`: Current semester (1-8)
- `department`: Department name
- `program`: Program/course name
- `batch_year`: Year of admission
- `guardian_name`: Parent/guardian name
- `guardian_phone`: Guardian contact
- `guardian_email`: Guardian email
- `profile_image`: Profile photo path

### 3. teachers

**Purpose**: Teacher-specific information

```sql
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    teacher_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    joining_date DATE NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    experience_years INT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_user_id (user_id),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `user_id`: Foreign key to users table
- `teacher_id`: Unique teacher identifier (e.g., TCH001)
- `first_name`, `last_name`: Teacher name
- `date_of_birth`: Birth date
- `gender`: Teacher gender
- `phone`: Contact number
- `address`: Residential address
- `joining_date`: Date of joining
- `department`: Department name
- `designation`: Job title (Professor, Lecturer, etc.)
- `qualification`: Educational qualifications
- `specialization`: Area of expertise
- `experience_years`: Years of teaching experience
- `profile_image`: Profile photo path

### 4. admins

**Purpose**: Administrator-specific information

```sql
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    admin_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    designation VARCHAR(100),
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_admin_id (admin_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `user_id`: Foreign key to users table
- `admin_id`: Unique admin identifier (e.g., ADM001)
- `first_name`, `last_name`: Admin name
- `phone`: Contact number
- `designation`: Job title
- `permissions`: JSON array of permissions

### 5. subjects

**Purpose**: Course/subject information

```sql
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credit_hours INT NOT NULL,
    department VARCHAR(100),
    semester INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_subject_code (subject_code),
    INDEX idx_semester (semester),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `subject_code`: Unique subject code (e.g., CS101)
- `subject_name`: Subject name
- `credit_hours`: Credit hours (1-4)
- `department`: Department offering the subject
- `semester`: Semester level (1-8)
- `description`: Subject description
- `is_active`: Active status

### 6. marks

**Purpose**: Student marks/grades storage

```sql
CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    session_id INT NOT NULL,
    semester INT NOT NULL,
    internal_marks DECIMAL(5,2),
    external_marks DECIMAL(5,2),
    total_marks DECIMAL(5,2),
    grade_point DECIMAL(3,2),
    letter_grade VARCHAR(2),
    remarks TEXT,
    entered_by INT,
    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (entered_by) REFERENCES users(id),
    
    UNIQUE KEY unique_student_subject_session (student_id, subject_id, session_id, semester),
    
    INDEX idx_student (student_id),
    INDEX idx_subject (subject_id),
    INDEX idx_session (session_id),
    INDEX idx_semester (semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `student_id`: Foreign key to students
- `subject_id`: Foreign key to subjects
- `session_id`: Academic session
- `semester`: Semester number
- `internal_marks`: Internal assessment marks (0-30)
- `external_marks`: External exam marks (0-70)
- `total_marks`: Total marks (0-100)
- `grade_point`: GP (0.00-4.00)
- `letter_grade`: Letter grade (A+, A, B+, etc.)
- `remarks`: Additional comments
- `entered_by`: Teacher who entered marks
- `entered_at`: Entry timestamp

### 7. attendance

**Purpose**: Student attendance tracking

```sql
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    session_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    remarks TEXT,
    marked_by INT NOT NULL,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (marked_by) REFERENCES users(id),
    
    UNIQUE KEY unique_attendance (student_id, subject_id, attendance_date),
    
    INDEX idx_student (student_id),
    INDEX idx_subject (subject_id),
    INDEX idx_date (attendance_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `student_id`: Foreign key to students
- `subject_id`: Foreign key to subjects
- `session_id`: Academic session
- `attendance_date`: Date of attendance
- `status`: Attendance status
- `remarks`: Additional notes
- `marked_by`: Teacher who marked attendance
- `marked_at`: Marking timestamp

### 8. fees

**Purpose**: Fee structure definition

```sql
CREATE TABLE fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fee_type VARCHAR(50) NOT NULL,
    fee_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    semester INT,
    department VARCHAR(100),
    program VARCHAR(100),
    session_id INT NOT NULL,
    due_date DATE NOT NULL,
    late_fine_per_day DECIMAL(10,2) DEFAULT 0,
    max_late_fine DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    
    INDEX idx_fee_type (fee_type),
    INDEX idx_semester (semester),
    INDEX idx_session (session_id),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `fee_type`: Type (tuition, exam, library, etc.)
- `fee_name`: Fee description
- `amount`: Fee amount
- `semester`: Applicable semester
- `department`: Applicable department
- `program`: Applicable program
- `session_id`: Academic session
- `due_date`: Payment deadline
- `late_fine_per_day`: Daily late fee
- `max_late_fine`: Maximum late fee
- `description`: Additional details
- `is_active`: Active status

### 9. payments

**Purpose**: Student payment records

```sql
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    fee_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    late_fine DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'card', 'online', 'cheque', 'other') NOT NULL,
    transaction_id VARCHAR(100),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
    remarks TEXT,
    processed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_id) REFERENCES fees(id),
    FOREIGN KEY (processed_by) REFERENCES users(id),
    
    INDEX idx_student (student_id),
    INDEX idx_fee (fee_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_receipt (receipt_number),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `student_id`: Foreign key to students
- `fee_id`: Foreign key to fees
- `amount_paid`: Base fee amount
- `late_fine`: Late payment fine
- `total_amount`: Total paid amount
- `payment_date`: Date of payment
- `payment_method`: Payment mode
- `transaction_id`: External transaction reference
- `receipt_number`: Unique receipt number
- `status`: Payment status
- `remarks`: Additional notes
- `processed_by`: Admin who processed payment

### 10. semesters

**Purpose**: Semester configuration

```sql
CREATE TABLE semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    semester_number INT NOT NULL,
    semester_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    session_id INT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    
    UNIQUE KEY unique_semester_session (semester_number, session_id),
    
    INDEX idx_semester_number (semester_number),
    INDEX idx_session (session_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `semester_number`: Semester number (1-8)
- `semester_name`: Semester name (e.g., "Fall 2024")
- `start_date`: Semester start date
- `end_date`: Semester end date
- `session_id`: Academic session
- `is_active`: Currently active semester

### 11. sessions

**Purpose**: Academic session/year management

```sql
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_name VARCHAR(50) UNIQUE NOT NULL,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_session_name (session_name),
    INDEX idx_active (is_active),
    INDEX idx_years (start_year, end_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields**:
- `id`: Primary key
- `session_name`: Session name (e.g., "2024-2025")
- `start_year`: Starting year
- `end_year`: Ending year
- `start_date`: Session start date
- `end_date`: Session end date
- `is_active`: Currently active session

## Indexes and Performance

### Primary Indexes
- All tables have AUTO_INCREMENT primary keys
- Unique constraints on identifier fields

### Secondary Indexes
- Foreign key columns
- Frequently queried columns
- Composite indexes for common queries

### Query Optimization Examples

```sql
-- Efficient student marks query
SELECT m.*, s.subject_name, s.credit_hours
FROM marks m
INNER JOIN subjects s ON m.subject_id = s.id
WHERE m.student_id = ? AND m.semester = ?
ORDER BY s.subject_code;

-- Attendance percentage calculation
SELECT 
    student_id,
    COUNT(*) as total_classes,
    SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
    (SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as attendance_percentage
FROM attendance
WHERE student_id = ? AND session_id = ?
GROUP BY student_id;
```

## Database Initialization

### Create Database

```sql
CREATE DATABASE IF NOT EXISTS studentportal 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE studentportal;
```

### Complete Schema Script

See `database/schema.sql` for the complete initialization script.

### Sample Data

See `database/sample_data.sql` for test data.

## Backup and Maintenance

### Backup Command

```bash
mysqldump -u root -p studentportal > backup_$(date +%Y%m%d).sql
```

### Restore Command

```bash
mysql -u root -p studentportal < backup_20241114.sql
```

### Maintenance Tasks

```sql
-- Optimize tables
OPTIMIZE TABLE users, students, marks, attendance;

-- Analyze tables
ANALYZE TABLE users, students, marks, attendance;

-- Check table integrity
CHECK TABLE users, students, marks, attendance;
```

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025

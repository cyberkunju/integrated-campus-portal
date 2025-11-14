# Design Document

## Overview

This design document outlines the technical implementation for completing the Student Portal Backend API. The system will replace mock data in the frontend with real database operations through RESTful PHP endpoints. The design follows the existing architecture pattern established in the authentication endpoints and maintains consistency with the current database schema.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 5173)
│   (Vite Dev)    │
└────────┬────────┘
         │ HTTP/JSON
         │ JWT Token in Headers
         ▼
┌─────────────────┐
│   PHP Backend   │ (Port 8000/80)
│   Apache/XAMPP  │
├─────────────────┤
│ • CORS Handler  │
│ • JWT Validator │
│ • API Routes    │
│ • Controllers   │
│ • Helpers       │
└────────┬────────┘
         │ PDO
         ▼
┌─────────────────┐
│ MySQL Database  │ (Port 3306)
│  11 Tables      │
└─────────────────┘
```

### Directory Structure

```
backend/
├── api/
│   ├── auth/
│   │   ├── login.php          [EXISTS]
│   │   ├── logout.php         [EXISTS]
│   │   └── verify.php         [EXISTS]
│   ├── student/
│   │   ├── get_marks.php      [NEW]
│   │   ├── get_attendance.php [NEW]
│   │   ├── get_fees.php       [NEW]
│   │   ├── get_payments.php   [NEW]
│   │   └── get_profile.php    [NEW]
│   ├── teacher/
│   │   ├── mark_attendance.php    [NEW]
│   │   ├── enter_marks.php        [NEW]
│   │   ├── update_marks.php       [NEW]
│   │   ├── get_students.php       [NEW]
│   │   └── get_attendance_report.php [NEW]
│   ├── admin/
│   │   ├── students/
│   │   │   ├── create.php     [NEW]
│   │   │   ├── update.php     [NEW]
│   │   │   ├── delete.php     [NEW]
│   │   │   └── list.php       [NEW]
│   │   ├── teachers/
│   │   │   ├── create.php     [NEW]
│   │   │   ├── update.php     [NEW]
│   │   │   ├── delete.php     [NEW]
│   │   │   └── list.php       [NEW]
│   │   ├── fees/
│   │   │   ├── create.php     [NEW]
│   │   │   ├── update.php     [NEW]
│   │   │   ├── delete.php     [NEW]
│   │   │   └── list.php       [NEW]
│   │   ├── subjects/
│   │   │   ├── create.php     [NEW]
│   │   │   ├── update.php     [NEW]
│   │   │   ├── delete.php     [NEW]
│   │   │   └── list.php       [NEW]
│   │   ├── payments/
│   │   │   ├── process.php    [NEW]
│   │   │   └── list.php       [NEW]
│   │   └── notices/
│   │       ├── create.php     [NEW]
│   │       ├── update.php     [NEW]
│   │       ├── delete.php     [NEW]
│   │       └── list.php       [NEW]
│   ├── notices/
│   │   └── get_all.php        [NEW]
│   └── upload/
│       └── upload_image.php   [NEW]
├── config/
│   ├── database.php           [EXISTS]
│   └── jwt.php                [EXISTS]
├── includes/
│   ├── cors.php               [NEW]
│   ├── auth.php               [NEW]
│   ├── validation.php         [NEW]
│   ├── grade_calculator.php   [NEW]
│   └── helpers.php            [NEW]
└── uploads/
    ├── profiles/              [NEW]
    └── documents/             [NEW]
```

## Components and Interfaces

### 1. Authentication Middleware

**File**: `backend/includes/auth.php`

**Purpose**: Validate JWT tokens and extract user information for all protected endpoints.

**Functions**:
```php
function verifyAuth(): array|false
// Returns user data from JWT or false if invalid
// Checks Authorization header
// Validates token signature and expiration
// Returns: ['user_id' => int, 'username' => string, 'role' => string]

function requireRole(string $role): void
// Ensures current user has required role
// Calls verifyAuth() internally
// Exits with 403 if role doesn't match

function requireRoles(array $roles): void
// Ensures current user has one of the required roles
// Exits with 403 if no role matches
```

**Usage Pattern**:
```php
require_once '../../includes/auth.php';

$user = verifyAuth();
if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

requireRole('student'); // Only students can access
```

### 2. CORS Handler

**File**: `backend/includes/cors.php`

**Purpose**: Handle Cross-Origin Resource Sharing for frontend-backend communication.

**Implementation**:
```php
// Allow requests from frontend
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

### 3. Validation Helper

**File**: `backend/includes/validation.php`

**Purpose**: Centralized input validation functions.

**Functions**:
```php
function validateRequired(array $fields, object $data): array
// Validates required fields are present
// Returns array of missing fields

function validateEmail(string $email): bool
// Validates email format

function validatePhone(string $phone): bool
// Validates phone number format

function validateDate(string $date): bool
// Validates date format (YYYY-MM-DD)

function validateSemester(int $semester): bool
// Validates semester is between 1 and 6

function validateMarks(float $marks, float $max): bool
// Validates marks are within valid range

function sanitizeInput(string $input): string
// Sanitizes user input to prevent XSS
```

### 4. Grade Calculator

**File**: `backend/includes/grade_calculator.php`

**Purpose**: Calculate grades, GP, CP, GPA, and CGPA based on marks.

**Functions**:
```php
function calculateGrade(float $totalMarks): array
// Input: Total marks (0-100)
// Returns: ['grade_point' => float, 'letter_grade' => string]
// Scale:
//   90-100: A+ (4.00)
//   85-89:  A  (3.75)
//   80-84:  A- (3.50)
//   75-79:  B+ (3.25)
//   70-74:  B  (3.00)
//   65-69:  B- (2.75)
//   60-64:  C+ (2.50)
//   55-59:  C  (2.25)
//   50-54:  C- (2.00)
//   45-49:  D  (1.75)
//   40-44:  E  (1.50)
//   <40:    F  (0.00)

function calculateGPA(array $marks, array $subjects): float
// Input: Array of marks with grade_points, array of subjects with credit_hours
// Returns: GPA for semester
// Formula: Σ(GP × Credits) / Σ(Credits)

function calculateCGPA(array $semesterGPAs, array $semesterCredits): float
// Input: Array of semester GPAs, array of total credits per semester
// Returns: Cumulative GPA
// Formula: Σ(GPA × Credits) / Σ(Credits)

function calculateCP(float $gradePoint, int $creditHours): float
// Input: Grade point, credit hours
// Returns: Credit points (GP × Credits)
```

### 5. Helper Functions

**File**: `backend/includes/helpers.php`

**Purpose**: Common utility functions used across endpoints.

**Functions**:
```php
function generateUniqueId(string $prefix): string
// Generates unique ID with prefix (e.g., STU2024001)

function generateReceiptNumber(): string
// Generates unique receipt number (e.g., RCP20241114001)

function getActiveSession(PDO $db): array|false
// Returns currently active academic session

function getStudentIdFromUserId(int $userId, PDO $db): int|false
// Gets student.id from user.id

function getTeacherIdFromUserId(int $userId, PDO $db): int|false
// Gets teacher.id from user.id

function sendJsonResponse(int $statusCode, array $data): void
// Sends JSON response with status code

function logError(string $message, array $context = []): void
// Logs error to error log file
```

## Data Models

### Request/Response Formats

#### Student Marks Response
```json
{
  "success": true,
  "data": {
    "marks": [
      {
        "id": 1,
        "subject_code": "BCA501",
        "subject_name": "Computer Networks",
        "credit_hours": 4,
        "internal_marks": 25.00,
        "external_marks": 65.00,
        "total_marks": 90.00,
        "grade_point": 4.00,
        "letter_grade": "A+",
        "credit_points": 16.00
      }
    ],
    "summary": {
      "total_subjects": 6,
      "total_credits": 20,
      "total_credit_points": 72.50,
      "gpa": 3.625,
      "cgpa": 3.54
    }
  }
}
```

#### Teacher Mark Attendance Request
```json
{
  "subject_id": 1,
  "attendance_date": "2024-11-14",
  "attendance": [
    {
      "student_id": 1,
      "status": "present"
    },
    {
      "student_id": 2,
      "status": "absent"
    }
  ]
}
```

#### Admin Create Student Request
```json
{
  "username": "student123",
  "password": "password123",
  "email": "student123@university.edu",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "2005-05-15",
  "gender": "male",
  "phone": "1234567890",
  "address": "123 Main St",
  "enrollment_date": "2024-07-01",
  "semester": 1,
  "department": "BCA",
  "program": "Bachelor of Computer Applications",
  "batch_year": 2024,
  "guardian_name": "Jane Doe",
  "guardian_phone": "0987654321",
  "guardian_email": "jane.doe@email.com"
}
```

### Database Query Patterns

#### Get Student Marks with Subjects
```sql
SELECT 
    m.id,
    m.internal_marks,
    m.external_marks,
    m.total_marks,
    m.grade_point,
    m.letter_grade,
    s.subject_code,
    s.subject_name,
    s.credit_hours,
    (m.grade_point * s.credit_hours) as credit_points
FROM marks m
JOIN subjects s ON m.subject_id = s.id
WHERE m.student_id = :student_id 
  AND m.semester = :semester
  AND m.session_id = :session_id
ORDER BY s.subject_code
```

#### Get Attendance with Percentage
```sql
SELECT 
    s.subject_code,
    s.subject_name,
    COUNT(*) as total_classes,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
    ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as percentage
FROM attendance a
JOIN subjects s ON a.subject_id = s.id
WHERE a.student_id = :student_id
  AND a.session_id = :session_id
GROUP BY s.id, s.subject_code, s.subject_name
ORDER BY s.subject_code
```

#### Get Applicable Fees for Student
```sql
SELECT 
    f.id,
    f.fee_type,
    f.fee_name,
    f.amount,
    f.due_date,
    f.late_fine_per_day,
    f.max_late_fine,
    f.description,
    CASE 
        WHEN CURDATE() > f.due_date 
        THEN LEAST(DATEDIFF(CURDATE(), f.due_date) * f.late_fine_per_day, f.max_late_fine)
        ELSE 0 
    END as current_late_fine,
    p.id as payment_id,
    p.status as payment_status
FROM fees f
LEFT JOIN payments p ON f.id = p.fee_id AND p.student_id = :student_id
WHERE f.session_id = :session_id
  AND (f.semester IS NULL OR f.semester = :semester)
  AND (f.department IS NULL OR f.department = :department)
  AND f.is_active = 1
ORDER BY f.due_date
```

## Error Handling

### Error Response Format

All errors follow consistent JSON format:
```json
{
  "success": false,
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {} // Optional additional details
}
```

### HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input/validation error
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource (e.g., username exists)
- **500 Internal Server Error**: Server/database error

### Error Handling Pattern

```php
try {
    // Database operations
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'not_found',
            'message' => 'Resource not found'
        ]);
        exit();
    }
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $result
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'database_error',
        'message' => 'An error occurred while processing your request'
    ]);
}
```

## Testing Strategy

### Unit Testing Approach

**Test Categories**:
1. **Authentication Tests**: Verify JWT generation and validation
2. **Validation Tests**: Test input validation functions
3. **Grade Calculation Tests**: Verify grade calculation accuracy
4. **Database Query Tests**: Test SQL queries with sample data

### Manual Testing Checklist

**For Each Endpoint**:
- [ ] Test with valid data
- [ ] Test with missing required fields
- [ ] Test with invalid data types
- [ ] Test with invalid JWT token
- [ ] Test with wrong user role
- [ ] Test with non-existent resources
- [ ] Test database constraint violations
- [ ] Verify response format matches specification

### Integration Testing

**Test Scenarios**:
1. **Student Flow**: Login → View marks → View attendance → View fees → Make payment
2. **Teacher Flow**: Login → View students → Mark attendance → Enter marks
3. **Admin Flow**: Login → Create student → Create fee → Process payment → View reports

### Testing Tools

- **Postman/Insomnia**: API endpoint testing
- **MySQL Workbench**: Database query testing
- **Browser DevTools**: Frontend-backend integration testing
- **PHP Error Logs**: Server-side error tracking

## Security Considerations

### Input Validation

1. **Sanitize all inputs**: Use `htmlspecialchars()` for output, prepared statements for SQL
2. **Validate data types**: Ensure integers are integers, dates are valid dates
3. **Validate ranges**: Marks 0-100, semester 1-6, etc.
4. **Validate formats**: Email, phone, date formats

### SQL Injection Prevention

```php
// ALWAYS use prepared statements
$stmt = $db->prepare("SELECT * FROM users WHERE username = :username");
$stmt->bindParam(':username', $username, PDO::PARAM_STR);
$stmt->execute();

// NEVER concatenate user input
// BAD: $query = "SELECT * FROM users WHERE username = '$username'";
```

### Password Security

```php
// Hash passwords with bcrypt
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Verify passwords
if (password_verify($inputPassword, $hashedPassword)) {
    // Password correct
}
```

### JWT Security

1. **Use strong secret key**: Minimum 32 characters, random
2. **Set appropriate expiration**: 24 hours for regular users
3. **Validate on every request**: Check signature and expiration
4. **Don't store sensitive data**: Only user_id, username, role

### File Upload Security

1. **Validate file type**: Check MIME type and extension
2. **Limit file size**: Maximum 5MB for images
3. **Generate unique filenames**: Prevent overwrites and path traversal
4. **Store outside web root**: Or use .htaccess to prevent direct access
5. **Scan for malware**: If possible, integrate virus scanning

```php
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
$max_size = 5 * 1024 * 1024; // 5MB

if (!in_array($_FILES['file']['type'], $allowed_types)) {
    // Reject file
}

if ($_FILES['file']['size'] > $max_size) {
    // Reject file
}

$filename = uniqid() . '_' . time() . '.' . $extension;
```

## Performance Optimization

### Database Optimization

1. **Use indexes**: Already defined in schema.sql
2. **Limit result sets**: Use LIMIT and OFFSET for pagination
3. **Avoid N+1 queries**: Use JOINs instead of multiple queries
4. **Cache frequently accessed data**: Active session, subject lists

### Query Optimization Examples

```php
// Good: Single query with JOIN
$query = "SELECT s.*, u.email FROM students s 
          JOIN users u ON s.user_id = u.id 
          WHERE s.department = :dept";

// Bad: Multiple queries
$students = $db->query("SELECT * FROM students WHERE department = '$dept'");
foreach ($students as $student) {
    $user = $db->query("SELECT email FROM users WHERE id = {$student['user_id']}");
}
```

### Response Optimization

1. **Return only needed fields**: Don't SELECT *
2. **Paginate large result sets**: Default 20 items per page
3. **Compress responses**: Enable gzip compression
4. **Cache static data**: Subject lists, fee structures

## API Endpoint Specifications

### Student Endpoints

#### GET /api/student/get_marks.php
- **Auth**: Required (student role)
- **Query Params**: `semester` (optional, defaults to current)
- **Response**: Marks array with GPA/CGPA summary
- **Requirements**: 1.1, 7.1-7.5

#### GET /api/student/get_attendance.php
- **Auth**: Required (student role)
- **Query Params**: `semester` (optional)
- **Response**: Attendance records with percentage by subject
- **Requirements**: 1.2

#### GET /api/student/get_fees.php
- **Auth**: Required (student role)
- **Response**: Applicable fees with late fine calculations
- **Requirements**: 1.3

#### GET /api/student/get_payments.php
- **Auth**: Required (student role)
- **Response**: Payment history with receipts
- **Requirements**: 1.4

#### GET /api/student/get_profile.php
- **Auth**: Required (student role)
- **Response**: Student profile with user details
- **Requirements**: 1.5

### Teacher Endpoints

#### POST /api/teacher/mark_attendance.php
- **Auth**: Required (teacher role)
- **Body**: `{ subject_id, attendance_date, attendance: [{student_id, status}] }`
- **Response**: Success message with count of records created
- **Requirements**: 2.1

#### POST /api/teacher/enter_marks.php
- **Auth**: Required (teacher role)
- **Body**: `{ student_id, subject_id, internal_marks, external_marks }`
- **Response**: Created marks with calculated grades
- **Requirements**: 2.2, 7.1-7.3

#### PUT /api/teacher/update_marks.php
- **Auth**: Required (teacher role)
- **Body**: `{ marks_id, internal_marks, external_marks }`
- **Response**: Updated marks with recalculated grades
- **Requirements**: 2.4, 7.1-7.3

#### GET /api/teacher/get_students.php
- **Auth**: Required (teacher role)
- **Query Params**: `department`, `semester` (optional filters)
- **Response**: Student list with basic info
- **Requirements**: 2.3

#### GET /api/teacher/get_attendance_report.php
- **Auth**: Required (teacher role)
- **Query Params**: `subject_id`, `start_date`, `end_date`
- **Response**: Attendance statistics by student
- **Requirements**: 2.5, 10.1

### Admin Endpoints

#### POST /api/admin/students/create.php
- **Auth**: Required (admin role)
- **Body**: Student data (see Data Models section)
- **Response**: Created student with generated student_id
- **Requirements**: 3.1

#### PUT /api/admin/students/update.php
- **Auth**: Required (admin role)
- **Body**: Student data with id
- **Response**: Updated student data
- **Requirements**: 3.1

#### DELETE /api/admin/students/delete.php
- **Auth**: Required (admin role)
- **Body**: `{ student_id }`
- **Response**: Success message
- **Requirements**: 3.1

#### GET /api/admin/students/list.php
- **Auth**: Required (admin role)
- **Query Params**: `page`, `limit`, `search`, `department`, `semester`
- **Response**: Paginated student list
- **Requirements**: 3.1

#### POST /api/admin/teachers/create.php
- **Auth**: Required (admin role)
- **Body**: Teacher data
- **Response**: Created teacher with generated teacher_id
- **Requirements**: 3.2

#### POST /api/admin/fees/create.php
- **Auth**: Required (admin role)
- **Body**: Fee structure data
- **Response**: Created fee record
- **Requirements**: 3.3

#### POST /api/admin/payments/process.php
- **Auth**: Required (admin role)
- **Body**: `{ student_id, fee_id, amount_paid, payment_method }`
- **Response**: Payment record with generated receipt_number
- **Requirements**: 3.4

#### POST /api/admin/subjects/create.php
- **Auth**: Required (admin role)
- **Body**: Subject data
- **Response**: Created subject
- **Requirements**: 3.5

### Notice Endpoints

#### GET /api/notices/get_all.php
- **Auth**: Required (any role)
- **Response**: Notices filtered by user role
- **Requirements**: 8.2

#### POST /api/admin/notices/create.php
- **Auth**: Required (admin role)
- **Body**: `{ title, content, target_role, expiry_date }`
- **Response**: Created notice
- **Requirements**: 8.1

### Upload Endpoints

#### POST /api/upload/upload_image.php
- **Auth**: Required (any role)
- **Body**: FormData with image file
- **Response**: `{ success, file_path }`
- **Requirements**: 5.1-5.5

## Implementation Priority

### Phase 1: Core Student Features (High Priority)
1. Student marks endpoint
2. Student attendance endpoint
3. Grade calculation helper
4. Authentication middleware

### Phase 2: Teacher Features (High Priority)
1. Mark attendance endpoint
2. Enter marks endpoint
3. Get students endpoint
4. Update marks endpoint

### Phase 3: Admin User Management (Medium Priority)
1. Create student endpoint
2. Create teacher endpoint
3. List students endpoint
4. List teachers endpoint

### Phase 4: Admin Fee Management (Medium Priority)
1. Create fee endpoint
2. Process payment endpoint
3. Get fees endpoint
4. Get payments endpoint

### Phase 5: Additional Features (Low Priority)
1. Notice system endpoints
2. File upload endpoint
3. Reporting endpoints
4. Subject management endpoints

## Migration from Mock Data

### Frontend Changes Required

1. **Update API base URL** in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
// or 'http://localhost/studentportal-api/api' for XAMPP
```

2. **Remove mock data logic** from API service methods

3. **Add JWT token to requests**:
```javascript
const token = localStorage.getItem('token');
const response = await fetch(url, {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

4. **Update login to store JWT token**:
```javascript
const data = await response.json();
if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
}
```

5. **Handle API errors consistently**:
```javascript
if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
}
```

## Deployment Considerations

### Development Environment
- XAMPP with Apache and MySQL
- PHP 8.x
- MySQL 8.0
- Frontend on Vite dev server (port 5173)
- Backend on Apache (port 80 or 8000)

### Production Environment
- Shared hosting or VPS with PHP support
- MySQL database
- SSL certificate for HTTPS
- Frontend built and served from same domain or CDN
- Environment-specific configuration files

### Configuration Management
- Use environment variables for sensitive data
- Separate config files for dev/prod
- Never commit passwords or secret keys to version control

---

**Design Version**: 1.0  
**Last Updated**: November 14, 2025  
**Status**: Ready for Implementation

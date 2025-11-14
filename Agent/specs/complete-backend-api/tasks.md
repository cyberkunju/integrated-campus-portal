# Implementation Plan

- [ ] 1. Set up core infrastructure and helper files
  - Create CORS handler for frontend-backend communication
  - Create authentication middleware for JWT validation
  - Create validation helper functions for input sanitization
  - Create grade calculator helper for GP/CP/GPA/CGPA calculations
  - Create general helper functions for common operations
  - _Requirements: 4.1, 4.2, 6.1, 7.1-7.5_

- [ ] 2. Implement student API endpoints
  - [ ] 2.1 Create get_marks.php endpoint to retrieve student marks with GPA/CGPA
    - Query marks table joined with subjects table
    - Calculate GPA using grade calculator helper
    - Calculate CGPA across all semesters
    - Return marks array with summary statistics
    - _Requirements: 1.1, 7.1-7.5_
  
  - [ ] 2.2 Create get_attendance.php endpoint to retrieve attendance records
    - Query attendance table joined with subjects table
    - Calculate attendance percentage per subject
    - Group results by subject
    - Return attendance array with percentage calculations
    - _Requirements: 1.2_
  
  - [ ] 2.3 Create get_fees.php endpoint to retrieve applicable fees
    - Query fees table filtered by student's semester and department
    - Calculate current late fines based on due dates
    - Left join with payments table to show payment status
    - Return fees array with late fine calculations
    - _Requirements: 1.3_
  
  - [ ] 2.4 Create get_payments.php endpoint to retrieve payment history
    - Query payments table joined with fees table
    - Filter by student_id
    - Order by payment_date descending
    - Return payment history with receipt numbers
    - _Requirements: 1.4_
  
  - [ ] 2.5 Create get_profile.php endpoint to retrieve student profile
    - Query students table joined with users table
    - Return complete student profile information
    - Include guardian details and enrollment information
    - _Requirements: 1.5_

- [ ] 3. Implement teacher API endpoints
  - [ ] 3.1 Create mark_attendance.php endpoint for bulk attendance marking
    - Validate subject_id and attendance_date
    - Validate attendance array with student_id and status
    - Insert multiple attendance records in transaction
    - Handle duplicate attendance for same date (update instead of insert)
    - Return success message with count of records created
    - _Requirements: 2.1_
  
  - [ ] 3.2 Create enter_marks.php endpoint for entering student marks
    - Validate student_id, subject_id, internal_marks, external_marks
    - Calculate total_marks as sum of internal and external
    - Use grade calculator to determine grade_point and letter_grade
    - Insert marks record with calculated values
    - Return created marks with all calculated fields
    - _Requirements: 2.2, 7.1-7.3_
  
  - [ ] 3.3 Create update_marks.php endpoint for updating existing marks
    - Validate marks_id exists
    - Validate new internal_marks and external_marks
    - Recalculate total_marks, grade_point, and letter_grade
    - Update marks record with new values
    - Return updated marks with recalculated fields
    - _Requirements: 2.4, 7.1-7.3_
  
  - [ ] 3.4 Create get_students.php endpoint to retrieve student list
    - Query students table with optional filters (department, semester)
    - Join with users table for email
    - Support search by name or student_id
    - Return paginated student list
    - _Requirements: 2.3_
  
  - [ ] 3.5 Create get_attendance_report.php endpoint for attendance statistics
    - Query attendance table filtered by subject_id and date range
    - Group by student_id
    - Calculate present_count, absent_count, and percentage
    - Return attendance report with statistics
    - _Requirements: 2.5, 10.1_

- [ ] 4. Implement admin student management endpoints
  - [ ] 4.1 Create admin/students/create.php endpoint
    - Validate all required student fields
    - Check username and email uniqueness
    - Hash password using password_hash
    - Generate unique student_id
    - Insert into users table first
    - Insert into students table with user_id
    - Use database transaction for atomicity
    - Return created student with generated IDs
    - _Requirements: 3.1, 6.1-6.5_
  
  - [ ] 4.2 Create admin/students/update.php endpoint
    - Validate student_id exists
    - Validate updated fields
    - Update users table if email or username changed
    - Update students table with new information
    - Use transaction for atomicity
    - Return updated student data
    - _Requirements: 3.1, 6.1-6.5_
  
  - [ ] 4.3 Create admin/students/delete.php endpoint
    - Validate student_id exists
    - Delete from users table (cascade deletes student record)
    - Return success message
    - _Requirements: 3.1_
  
  - [ ] 4.4 Create admin/students/list.php endpoint
    - Query students table joined with users table
    - Support pagination with page and limit parameters
    - Support search by name, student_id, or email
    - Support filters by department, semester, status
    - Return paginated student list with total count
    - _Requirements: 3.1_

- [ ] 5. Implement admin teacher management endpoints
  - [ ] 5.1 Create admin/teachers/create.php endpoint
    - Validate all required teacher fields
    - Check username and email uniqueness
    - Hash password using password_hash
    - Generate unique teacher_id
    - Insert into users table with role='teacher'
    - Insert into teachers table with user_id
    - Use database transaction
    - Return created teacher with generated IDs
    - _Requirements: 3.2, 6.1-6.5_
  
  - [ ] 5.2 Create admin/teachers/update.php endpoint
    - Validate teacher_id exists
    - Update users and teachers tables
    - Use transaction for atomicity
    - Return updated teacher data
    - _Requirements: 3.2_
  
  - [ ] 5.3 Create admin/teachers/delete.php endpoint
    - Validate teacher_id exists
    - Delete from users table (cascade delete)
    - Return success message
    - _Requirements: 3.2_
  
  - [ ] 5.4 Create admin/teachers/list.php endpoint
    - Query teachers table joined with users table
    - Support pagination and search
    - Support filter by department
    - Return paginated teacher list
    - _Requirements: 3.2_

- [ ] 6. Implement admin fee management endpoints
  - [ ] 6.1 Create admin/fees/create.php endpoint
    - Validate fee_type, fee_name, amount, due_date
    - Validate semester (1-6) if provided
    - Insert fee record into fees table
    - Return created fee with id
    - _Requirements: 3.3_
  
  - [ ] 6.2 Create admin/fees/update.php endpoint
    - Validate fee_id exists
    - Update fee record with new values
    - Return updated fee data
    - _Requirements: 3.3_
  
  - [ ] 6.3 Create admin/fees/delete.php endpoint
    - Validate fee_id exists
    - Soft delete by setting is_active to false
    - Return success message
    - _Requirements: 3.3_
  
  - [ ] 6.4 Create admin/fees/list.php endpoint
    - Query fees table with filters
    - Support filter by semester, department, session
    - Return fee list ordered by due_date
    - _Requirements: 3.3_

- [ ] 7. Implement admin payment processing endpoints
  - [ ] 7.1 Create admin/payments/process.php endpoint
    - Validate student_id and fee_id exist
    - Calculate late_fine based on current date and due_date
    - Calculate total_amount as amount_paid plus late_fine
    - Generate unique receipt_number
    - Insert payment record with status='completed'
    - Return payment record with receipt_number
    - _Requirements: 3.4_
  
  - [ ] 7.2 Create admin/payments/list.php endpoint
    - Query payments table joined with students and fees
    - Support filter by student_id, date range, status
    - Support pagination
    - Return payment list with student and fee details
    - _Requirements: 3.4_

- [ ] 8. Implement admin subject management endpoints
  - [ ] 8.1 Create admin/subjects/create.php endpoint
    - Validate subject_code uniqueness
    - Validate semester (1-6)
    - Validate credit_hours is positive integer
    - Insert subject record
    - Return created subject
    - _Requirements: 3.5_
  
  - [ ] 8.2 Create admin/subjects/update.php endpoint
    - Validate subject_id exists
    - Update subject record
    - Return updated subject
    - _Requirements: 3.5_
  
  - [ ] 8.3 Create admin/subjects/delete.php endpoint
    - Validate subject_id exists
    - Soft delete by setting is_active to false
    - Return success message
    - _Requirements: 3.5_
  
  - [ ] 8.4 Create admin/subjects/list.php endpoint
    - Query subjects table
    - Support filter by semester, department
    - Return subject list ordered by subject_code
    - _Requirements: 3.5_

- [ ] 9. Implement notice system endpoints
  - [ ] 9.1 Create notices/get_all.php endpoint for all users
    - Query notices table filtered by user's role
    - Filter by expiry_date (only show non-expired)
    - Filter by is_active = true
    - Order by created_at descending
    - Return notice list
    - _Requirements: 8.2_
  
  - [ ] 9.2 Create admin/notices/create.php endpoint
    - Validate title and content are not empty
    - Validate target_role is valid (student, teacher, all)
    - Insert notice record with created_at timestamp
    - Return created notice
    - _Requirements: 8.1_
  
  - [ ] 9.3 Create admin/notices/update.php endpoint
    - Validate notice_id exists
    - Update notice record
    - Set updated_at timestamp
    - Return updated notice
    - _Requirements: 8.4_
  
  - [ ] 9.4 Create admin/notices/delete.php endpoint
    - Validate notice_id exists
    - Soft delete by setting is_active to false
    - Return success message
    - _Requirements: 8.5_

- [ ] 10. Implement file upload endpoint
  - [ ] 10.1 Create upload/upload_image.php endpoint
    - Validate file is uploaded via POST
    - Validate file type is image (jpeg, png, gif)
    - Validate file size is under 5MB
    - Generate unique filename with timestamp
    - Create uploads/profiles directory if not exists
    - Move uploaded file to uploads/profiles
    - Return file_path in JSON response
    - _Requirements: 5.1-5.5_

- [ ] 11. Update frontend to use real API endpoints
  - [ ] 11.1 Update src/services/api.js configuration
    - Set correct API_BASE_URL for backend
    - Remove all mock data logic from methods
    - Add JWT token to all request headers
    - Update login method to store JWT token
    - Add error handling for API responses
    - _Requirements: 4.1-4.5_
  
  - [ ] 11.2 Update student pages to use real API
    - Update Dashboard.jsx to call real API
    - Update Result.jsx to call get_marks.php
    - Update Subjects.jsx to call get_marks.php
    - Update Payments.jsx to call get_fees.php and get_payments.php
    - Update Analysis.jsx to call get_marks.php
    - _Requirements: 1.1-1.5_
  
  - [ ] 11.3 Update teacher pages to use real API
    - Update TeacherAttendance.jsx to call mark_attendance.php
    - Update TeacherMarks.jsx to call enter_marks.php
    - Update TeacherStudentList.jsx to call get_students.php
    - _Requirements: 2.1-2.5_
  
  - [ ] 11.4 Update admin pages to use real API
    - Update AdminStudents.jsx to call student CRUD endpoints
    - Update AdminTeachers.jsx to call teacher CRUD endpoints
    - Update AdminFeeManagement.jsx to call fee and payment endpoints
    - Update AdminCourses.jsx to call subject CRUD endpoints
    - Update AdminNotices.jsx to call notice CRUD endpoints
    - _Requirements: 3.1-3.5_

- [ ] 12. Create database seed data for testing
  - [ ] 12.1 Create seed script for sample users
    - Insert admin user with hashed password
    - Insert 3-5 teacher users with different departments
    - Insert 10-15 student users across different semesters
    - _Requirements: 3.1, 3.2_
  
  - [ ] 12.2 Create seed script for academic data
    - Insert subjects for all semesters and departments
    - Insert marks for students
    - Insert attendance records
    - Insert fee structures
    - Insert sample payments
    - _Requirements: 1.1-1.4, 3.3, 3.4_

- [ ] 13. Testing and validation
  - [ ] 13.1 Test authentication flow
    - Test login with valid credentials
    - Test login with invalid credentials
    - Test JWT token validation
    - Test role-based access control
    - _Requirements: 4.1-4.5_
  
  - [ ] 13.2 Test student endpoints
    - Test get_marks with valid student
    - Test get_attendance with valid student
    - Test get_fees with valid student
    - Test get_payments with valid student
    - Test unauthorized access attempts
    - _Requirements: 1.1-1.5_
  
  - [ ] 13.3 Test teacher endpoints
    - Test mark_attendance with valid data
    - Test enter_marks with valid data
    - Test update_marks with valid data
    - Test get_students with filters
    - Test unauthorized access attempts
    - _Requirements: 2.1-2.5_
  
  - [ ] 13.4 Test admin endpoints
    - Test create student with valid data
    - Test create teacher with valid data
    - Test create fee with valid data
    - Test process payment with valid data
    - Test all CRUD operations
    - Test unauthorized access attempts
    - _Requirements: 3.1-3.5_
  
  - [ ] 13.5 Test error handling
    - Test validation errors return 400
    - Test unauthorized returns 401
    - Test forbidden returns 403
    - Test not found returns 404
    - Test database errors return 500
    - _Requirements: 6.1-6.5_
  
  - [ ] 13.6 Test grade calculations
    - Test grade calculation for various mark ranges
    - Test GPA calculation with multiple subjects
    - Test CGPA calculation across semesters
    - Verify calculations match expected values
    - _Requirements: 7.1-7.5_

- [ ] 14. Documentation and deployment preparation
  - [ ] 14.1 Create API documentation
    - Document all endpoints with request/response examples
    - Document authentication requirements
    - Document error codes and messages
    - Create Postman collection for testing
  
  - [ ] 14.2 Update project README
    - Add backend setup instructions
    - Add API endpoint list
    - Add testing instructions
    - Add troubleshooting guide
  
  - [ ] 14.3 Prepare for deployment
    - Create production configuration file
    - Update CORS settings for production domain
    - Change JWT secret key for production
    - Create database backup script
    - Document deployment steps

# Critical Project Clarifications

## Important Implementation Details

This document clarifies critical aspects of the Student Portal that differ from typical implementations.

## 1. Dual Backend Architecture ⚠️

### The Setup

This project uses **TWO separate backend servers**:

**Backend 1: Node.js/Express Server**
- **Purpose**: Serves the React frontend application
- **Port**: 5173 (development)
- **Responsibilities**:
  - Serve static React files
  - Handle WebSocket connections for real-time updates
  - Proxy API requests to PHP backend

**Backend 2: PHP Server**
- **Purpose**: Complete API backend
- **Port**: 8000 (or 80 via XAMPP)
- **Responsibilities**:
  - All authentication logic
  - All database operations (CRUD)
  - File uploads and storage
  - Business logic processing

### Data Flow Example

When a student submits an assignment:
1. React app (served by Node.js) sends file to PHP API endpoint
2. PHP backend receives file, uses `move_uploaded_file()` to save to `/uploads`
3. PHP updates `assignment_submissions` table in MySQL
4. PHP may notify Node.js server OR Node.js polls database
5. Node.js WebSocket pushes "Submitted" update to teacher in real-time

### Why This Architecture?

- **Node.js**: Fast for serving frontend, excellent for WebSockets/real-time
- **PHP**: Mature, stable, easy database operations, XAMPP compatible
- **Separation**: Frontend concerns vs API concerns

## 2. Authentication: JWT Tokens (NOT Sessions) ⚠️

### Implementation

**Token Type**: Stateless JSON Web Tokens (JWT)

**Example Token**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoic3R1ZGVudCJ9.signature
```

**Flow**:
1. User logs in with credentials
2. PHP validates and generates JWT
3. JWT returned in JSON response: `{"token": "eyJhbG..."}`
4. Frontend stores token in `localStorage`
5. Every API request includes: `Authorization: Bearer <token>`
6. PHP validates JWT on each request

**NOT using**:
- ❌ Session cookies
- ❌ Server-side session storage
- ❌ PHP `$_SESSION`

## 3. File Storage: Local File System (NOT Cloud) ⚠️

### Storage Location

**All files stored on server's local file system**:
- Assignment files: `/uploads/assignments/`
- Profile photos: `/uploads/profiles/`
- Receipts: `/uploads/receipts/`

**Database stores**: File paths only (e.g., `/uploads/assignments/123/456_submission.pdf`)

**NOT using**:
- ❌ AWS S3
- ❌ Google Cloud Storage
- ❌ Azure Blob Storage

### File Upload Process

```php
// PHP handles file upload
$file = $_FILES['file'];
$upload_dir = '/uploads/assignments/';
$file_path = $upload_dir . $student_id . '_' . $file['name'];
move_uploaded_file($file['tmp_name'], $file_path);

// Store path in database
$stmt = $pdo->prepare("INSERT INTO assignment_submissions (file_path) VALUES (?)");
$stmt->execute([$file_path]);
```

## 4. Real-Time Updates: Polling (NOT WebSockets Yet) ⚠️

### Current Implementation

**Method**: Simple Polling

The teacher's assignment page automatically refreshes every 3-30 seconds:

```javascript
// Frontend polls every 30 seconds
setInterval(() => {
  fetchAssignmentStatus();
}, 30000);
```

### Future Enhancement

**Method**: WebSockets (mentioned in docs as "sophisticated way")

Would use Node.js server to push updates instantly:
```javascript
// When student submits
socket.emit('assignment_submitted', { assignmentId, studentId });
```

**Current Status**: Using polling for simplicity

## 5. Data Storage: Hybrid Approach ⚠️

### What Goes Where

**MySQL Database** (Permanent Data):
- ✅ Users (students, teachers, admins)
- ✅ Marks and grades
- ✅ Attendance records
- ✅ Payment records
- ✅ Assignment metadata
- ✅ Subject information

**localStorage** (Temporary/Prototype Data):
- ✅ Fee notices (for quick prototyping)
- ✅ Notifications
- ✅ UI preferences
- ✅ Cached user profile

**File System** (Binary Data):
- ✅ Uploaded assignment files
- ✅ Profile photos
- ✅ Generated receipts

### Why Hybrid?

- **Database**: Permanent, queryable, relational data
- **localStorage**: Fast prototyping, session-specific data
- **File System**: Binary files (can't store in database efficiently)

## 6. Password Reset: Admin-Only (NO Email Reset) ⚠️

### Current Implementation

**NO "Forgot Password" feature**

If a user forgets their password:
1. User contacts admin
2. Admin logs into admin panel
3. Admin resets user's password manually
4. Admin provides new password to user

**NOT implemented**:
- ❌ Email-based password reset
- ❌ "Forgot Password" link
- ❌ Password reset tokens
- ❌ Email verification

### Why?

- Simplifies initial implementation
- Reduces email infrastructure requirements
- Admin maintains full control

## 7. Admin Account: Single Super Admin ⚠️

### Bootstrap Process

**One and only one admin account**:
- Created during initial setup
- Hardcoded credentials set during deployment
- Username and password configured in admin panel setup

**NOT implemented**:
- ❌ Multiple admin accounts
- ❌ Admin registration page
- ❌ Admin role hierarchy
- ❌ Admin permissions system

### Access

Only one person can access admin panel with the single admin credentials.

## 8. Fee Payment: Three-Tier Deadline System ⚠️

### How It Works

**Three Payment Windows**:

1. **No Fine Period** (e.g., until Dec 15)
   - Pay ₹18,000 (base amount)
   - No penalty

2. **Fine Period** (e.g., Dec 16-22)
   - Pay ₹18,500 (base + ₹500 fine)
   - Moderate penalty

3. **Super Fine Period** (e.g., Dec 23-31)
   - Pay ₹19,000 (base + ₹1,000 fine)
   - Maximum penalty

**After Super Fine Date**:
- Fee remains unpaid in system
- Student faces principal directly
- No automatic lockout
- Manual intervention required

### Partial Payments

**NOT supported**:
- ❌ Cannot pay ₹10,000 of ₹18,000 fee
- ❌ Must pay full amount
- ❌ No installment system

## 9. Fee Notices: Sent Before Enrollment Closes ⚠️

### Timing

**Fee notices sent AFTER enrollment closes**:
- All students enrolled before fee notice
- No need to handle "new student after notice" scenario

**Edge Case NOT handled**:
- Student enrolled after fee notice sent
- Would require manual fee notice from admin

### Why?

- Simplifies implementation
- Matches real college workflow
- Reduces edge cases

## 10. Marks Modification: Restricted After Semester ⚠️

### Constraint

**Teachers CANNOT change marks after semester ends**

Once a semester is completed:
- Marks are locked
- No re-evaluation workflow
- No mark correction system

**If correction needed**:
- Manual database update by admin
- Or special admin override (not implemented)

### Why?

- Maintains academic integrity
- Prevents grade manipulation
- Simplifies system logic

## 11. Subject Database: Admin-Managed (NOT Hardcoded) ⚠️

### Clarification

**Subjects are in DATABASE, managed by admin**

Teachers can:
- ✅ View subjects
- ❌ Add/edit subjects

Admin can:
- ✅ Add new subjects
- ✅ Edit subject details
- ✅ Assign teachers to subjects
- ✅ Manage subject codes and credits

**NOT hardcoded** in frontend (despite some documentation suggesting this)

## 12. Teacher-Subject Assignment ⚠️

### How It Works

**During teacher creation**:
1. Admin adds new teacher
2. Admin fills teacher details
3. Admin selects subject(s) teacher will teach
4. System links teacher to subject in database
5. Subject automatically assigned to teacher's department

**Example**:
- Teacher: Prof. Sharma
- Subject: Computer Networks (BCA501)
- Department: BCA (derived from subject)
- Now Prof. Sharma appears as teacher for BCA501

## 13. Grade Calculation: Hardcoded Scale ⚠️

### Grading Scale

**Fixed in code** (not database-configurable):

```javascript
if (totalMarks >= 90) return { gp: 4.00, grade: 'A+' };
if (totalMarks >= 85) return { gp: 3.75, grade: 'A' };
if (totalMarks >= 80) return { gp: 3.50, grade: 'A-' };
// ... etc
```

**Admin CANNOT change**:
- ❌ Grade point values
- ❌ Grade boundaries
- ❌ Letter grades

**To change**: Must modify code and redeploy

## 14. Payment Gateway: Mock Implementation ⚠️

### Current Status

**NO real payment integration**

Payment flow:
1. Student clicks "Pay Now"
2. Sees payment modal with QR code/UPI
3. Clicks "Confirm Payment"
4. System marks as paid (no actual transaction)

**NOT integrated**:
- ❌ Razorpay
- ❌ Stripe
- ❌ PayPal
- ❌ Any real payment gateway

### Why?

- Project/prototype purpose
- Demonstrates workflow without payment complexity
- Can be integrated later

## 15. Semester System: 1-6 (Three Years) ⚠️

### Structure

**6 semesters = 3 years**:
- Year 1: Semesters 1-2
- Year 2: Semesters 3-4
- Year 3: Semesters 5-6

**NOT 8 semesters** (4 years) as some docs suggest

### Fee Structure

**Odd semesters cost more than even**:
- Semester 1, 3, 5: Higher fees (e.g., ₹18,000)
- Semester 2, 4, 6: Lower fees (e.g., ₹15,000)

## Summary Table

| Feature | Implementation | NOT Using |
|---------|---------------|-----------|
| Backend | Dual (Node.js + PHP) | Single backend |
| Auth | JWT tokens | Sessions |
| File Storage | Local file system | Cloud storage |
| Real-time | Polling | WebSockets (yet) |
| Data | Hybrid (DB + localStorage) | Database only |
| Password Reset | Admin manual | Email reset |
| Admin Accounts | Single super admin | Multiple admins |
| Payments | Mock/prototype | Real gateway |
| Subjects | Database (admin-managed) | Hardcoded |
| Semesters | 6 (3 years) | 8 (4 years) |

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025  
**Critical for**: Developers, AI assistants, system architects

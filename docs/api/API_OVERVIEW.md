# API Overview

## REST API Documentation

Complete API documentation for the Student Portal backend.

## Base URL

```
Development: http://localhost:8000/api
Production: https://yourdomain.com/api
```

## Authentication

### Method
Session-based authentication using cookies

### Headers

```http
Content-Type: application/json
Cookie: PHPSESSID=<session_id>
```

### Authentication Flow

```
1. POST /api/auth/login.php
   → Returns session cookie

2. Subsequent requests include cookie automatically

3. POST /api/auth/logout.php
   → Destroys session
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not authorized for resource |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation failed |
| 500 | Internal Server Error | Server error |

## API Endpoints Overview

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/login.php | User login | No |
| POST | /api/auth/logout.php | User logout | Yes |
| GET | /api/auth/verify.php | Verify session | Yes |
| POST | /api/auth/change-password.php | Change password | Yes |

### Student Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/student/profile.php | Get student profile | Student |
| PUT | /api/student/profile.php | Update profile | Student |
| GET | /api/student/marks.php | Get marks | Student |
| GET | /api/student/attendance.php | Get attendance | Student |
| GET | /api/student/fees.php | Get fee details | Student |
| GET | /api/student/payments.php | Get payment history | Student |
| GET | /api/student/receipt.php?id={payment_id} | Get receipt | Student |

### Teacher Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/teacher/profile.php | Get teacher profile | Teacher |
| GET | /api/teacher/students.php | Get student list | Teacher |
| POST | /api/teacher/attendance.php | Mark attendance | Teacher |
| GET | /api/teacher/attendance.php | Get attendance records | Teacher |
| POST | /api/teacher/marks.php | Enter marks | Teacher |
| GET | /api/teacher/marks.php | Get marks records | Teacher |
| GET | /api/teacher/subjects.php | Get assigned subjects | Teacher |

### Admin Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/admin/users.php | List all users | Admin |
| POST | /api/admin/users.php | Create user | Admin |
| PUT | /api/admin/users.php?id={user_id} | Update user | Admin |
| DELETE | /api/admin/users.php?id={user_id} | Delete user | Admin |
| GET | /api/admin/students.php | List students | Admin |
| POST | /api/admin/students.php | Create student | Admin |
| GET | /api/admin/teachers.php | List teachers | Admin |
| POST | /api/admin/teachers.php | Create teacher | Admin |
| GET | /api/admin/fees.php | List fees | Admin |
| POST | /api/admin/fees.php | Create fee | Admin |
| PUT | /api/admin/fees.php?id={fee_id} | Update fee | Admin |
| DELETE | /api/admin/fees.php?id={fee_id} | Delete fee | Admin |
| POST | /api/admin/payments.php | Process payment | Admin |
| GET | /api/admin/reports.php | Generate reports | Admin |

## Common Query Parameters

### Pagination

```
?page=1&limit=20
```

**Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 100,
    "items_per_page": 20
  }
}
```

### Filtering

```
?semester=3&department=CS
```

**Common Filters**:
- `semester`: Filter by semester
- `department`: Filter by department
- `session_id`: Filter by session
- `status`: Filter by status
- `date_from`: Start date (YYYY-MM-DD)
- `date_to`: End date (YYYY-MM-DD)

### Sorting

```
?sort_by=name&sort_order=asc
```

**Parameters**:
- `sort_by`: Field to sort by
- `sort_order`: `asc` or `desc` (default: asc)

### Search

```
?search=john
```

**Parameter**:
- `search`: Search term (searches across relevant fields)

## Request Examples

### Login Request

```http
POST /api/auth/login.php
Content-Type: application/json

{
  "username": "student1",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "student1",
      "email": "student1@example.com",
      "role": "student"
    },
    "profile": {
      "student_id": "STU001",
      "first_name": "John",
      "last_name": "Doe",
      "semester": 3
    }
  },
  "message": "Login successful"
}
```

### Get Student Marks

```http
GET /api/student/marks.php?semester=3
Cookie: PHPSESSID=abc123xyz
```

**Response**:
```json
{
  "success": true,
  "data": {
    "marks": [
      {
        "id": 1,
        "subject_code": "CS101",
        "subject_name": "Programming Fundamentals",
        "credit_hours": 3,
        "internal_marks": 25,
        "external_marks": 65,
        "total_marks": 90,
        "grade_point": 4.00,
        "letter_grade": "A+"
      }
    ],
    "summary": {
      "total_subjects": 6,
      "total_credits": 18,
      "gpa": 3.67,
      "cgpa": 3.54
    }
  }
}
```

### Mark Attendance

```http
POST /api/teacher/attendance.php
Content-Type: application/json
Cookie: PHPSESSID=abc123xyz

{
  "subject_id": 1,
  "attendance_date": "2024-11-14",
  "students": [
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

**Response**:
```json
{
  "success": true,
  "data": {
    "marked_count": 2,
    "date": "2024-11-14"
  },
  "message": "Attendance marked successfully"
}
```

## Error Handling

### Validation Errors

```json
{
  "success": false,
  "error": "validation_error",
  "message": "Validation failed",
  "errors": {
    "username": "Username is required",
    "password": "Password must be at least 8 characters"
  }
}
```

### Authentication Errors

```json
{
  "success": false,
  "error": "unauthorized",
  "message": "Please login to continue"
}
```

### Authorization Errors

```json
{
  "success": false,
  "error": "forbidden",
  "message": "You don't have permission to access this resource"
}
```

### Not Found Errors

```json
{
  "success": false,
  "error": "not_found",
  "message": "Resource not found"
}
```

### Server Errors

```json
{
  "success": false,
  "error": "server_error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

**Current Status**: Not implemented

**Future Implementation**:
- 100 requests per minute per IP
- 1000 requests per hour per user
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## CORS Configuration

```php
// backend/includes/cors.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
```

## API Versioning

**Current Version**: v1 (implicit)

**Future Versioning**:
```
/api/v1/student/marks.php
/api/v2/student/marks.php
```

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"password123"}' \
  -c cookies.txt

# Get marks (using saved cookies)
curl -X GET http://localhost:8000/api/student/marks.php \
  -b cookies.txt
```

### Using Postman

1. Import collection from `docs/api/postman_collection.json`
2. Set environment variables
3. Run requests

### Using JavaScript (Axios)

```javascript
// Login
const response = await axios.post('/api/auth/login.php', {
  username: 'student1',
  password: 'password123'
}, {
  withCredentials: true
});

// Get marks
const marks = await axios.get('/api/student/marks.php', {
  withCredentials: true
});
```

## API Best Practices

### Request Best Practices
1. Always include `Content-Type: application/json`
2. Use appropriate HTTP methods
3. Include authentication credentials
4. Validate input on client side
5. Handle errors gracefully

### Response Best Practices
1. Use consistent response format
2. Include appropriate status codes
3. Provide meaningful error messages
4. Return relevant data only
5. Use pagination for large datasets

## Security Considerations

### Input Validation
- Validate all input data
- Sanitize user input
- Use prepared statements
- Implement CSRF protection

### Authentication
- Use secure session configuration
- Implement session timeout
- Hash passwords with bcrypt
- Use HTTPS in production

### Authorization
- Check user roles on every request
- Implement resource-level permissions
- Log access attempts
- Rate limit sensitive endpoints

## API Documentation Tools

### Swagger/OpenAPI (Future)
- Interactive API documentation
- Request/response examples
- Try-it-out functionality

### Postman Collection
- Pre-configured requests
- Environment variables
- Test scripts

## Support

For detailed endpoint documentation:
- [Authentication Endpoints](./AUTH_ENDPOINTS.md)
- [Student Endpoints](./STUDENT_ENDPOINTS.md)
- [Teacher Endpoints](./TEACHER_ENDPOINTS.md)
- [Admin Endpoints](./ADMIN_ENDPOINTS.md)

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025

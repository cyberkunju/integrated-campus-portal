# Backend API

PHP-based REST API for Student Portal.

## Structure

```
backend/
├── api/
│   ├── auth/          # Authentication endpoints
│   ├── student/       # Student endpoints
│   ├── teacher/       # Teacher endpoints
│   └── admin/         # Admin endpoints
├── config/
│   ├── database.php   # Database connection
│   └── jwt.php        # JWT configuration
├── includes/
│   ├── auth.php       # Authentication helpers
│   └── cors.php       # CORS configuration
├── uploads/           # File storage
│   ├── assignments/
│   ├── profiles/
│   └── receipts/
└── index.php          # API entry point
```

## Setup

### 1. Configure Database

Edit `config/database.php`:
```php
private $host = "localhost";
private $db_name = "studentportal";
private $username = "root";
private $password = "";
```

### 2. Configure JWT Secret

Edit `config/jwt.php`:
```php
define('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production');
```

### 3. Set File Permissions

```bash
chmod 755 uploads/
chmod 755 uploads/assignments/
chmod 755 uploads/profiles/
chmod 755 uploads/receipts/
```

## Running

### With XAMPP

1. Copy `backend/` folder to `C:\xampp\htdocs\studentportal\backend`
2. Start Apache in XAMPP
3. Access at `http://localhost/studentportal/backend`

### With PHP Built-in Server

```bash
cd backend
php -S localhost:8000
```

## API Endpoints

### Authentication

- `POST /api/auth/login.php` - User login
- `POST /api/auth/logout.php` - User logout
- `GET /api/auth/verify.php` - Verify token

### Student

- `GET /api/student/profile.php` - Get student profile
- `GET /api/student/marks.php` - Get marks
- `GET /api/student/attendance.php` - Get attendance
- `GET /api/student/fees.php` - Get fee details

### Teacher

- `GET /api/teacher/students.php` - Get student list
- `POST /api/teacher/attendance.php` - Mark attendance
- `POST /api/teacher/marks.php` - Enter marks

### Admin

- `GET /api/admin/users.php` - List users
- `POST /api/admin/users.php` - Create user
- `PUT /api/admin/users.php` - Update user
- `DELETE /api/admin/users.php` - Delete user

## Testing

```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"password123"}'

# Test verify (replace TOKEN with actual token)
curl -X GET http://localhost:8000/api/auth/verify.php \
  -H "Authorization: Bearer TOKEN"
```

## Security

- All passwords are hashed with `password_hash()`
- JWT tokens for authentication
- CORS configured for allowed origins
- Prepared statements for SQL queries
- Input validation on all endpoints

## Development

See main documentation in `/docs` folder for complete API documentation.

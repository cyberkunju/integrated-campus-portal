# Dual Backend Architecture

## Understanding the Two-Server System

This project uses an **unconventional dual backend architecture** with two separate servers working together.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                    (Browser / Mobile)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND 1: Node.js/Express Server               │
│                     (Port 5173 / 3000)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  • Serves React Frontend Application                  │  │
│  │  • Handles WebSocket Connections                      │  │
│  │  • Real-time Updates (assignment submissions, etc.)   │  │
│  │  • Proxies API requests to PHP backend                │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Proxy / WebSocket Events
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                BACKEND 2: PHP Server                         │
│                  (Port 8000 / 80 via XAMPP)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  • All API Endpoints (REST)                           │  │
│  │  • Authentication (JWT generation/validation)         │  │
│  │  • Database Operations (MySQL via PDO)                │  │
│  │  • File Uploads (move_uploaded_file)                  │  │
│  │  • Business Logic Processing                          │  │
│  └───────────────────────┬───────────────────────────────┘  │
└────────────────────────┬─┴────────────────────────────────────┘
                         │
                         │ PDO/MySQLi
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                            │
│                      (Port 3306)                             │
│  • 11 Tables (users, students, marks, attendance, etc.)     │
└─────────────────────────────────────────────────────────────┘
```

## Why Two Backends?

### Node.js/Express Server

**Strengths**:
- Excellent for serving static files (React build)
- Native WebSocket support for real-time features
- Fast, non-blocking I/O
- Great for handling concurrent connections

**Responsibilities**:
1. **Serve React Application**: Delivers the frontend to browsers
2. **WebSocket Server**: Handles real-time updates
3. **Development Server**: Hot reload during development (Vite)

### PHP Server

**Strengths**:
- Mature, stable, battle-tested
- Excellent MySQL integration
- Easy file handling
- XAMPP compatibility (easy local setup)
- Familiar to many developers

**Responsibilities**:
1. **API Endpoints**: All REST API routes
2. **Authentication**: JWT generation and validation
3. **Database Operations**: All CRUD operations
4. **File Uploads**: Handle assignment files, profile photos
5. **Business Logic**: Grade calculations, fee calculations

## Data Flow Examples

### Example 1: Student Submits Assignment

```
1. Student clicks "Submit Assignment" in React app
   ↓
2. React sends POST request to PHP API
   POST http://localhost:8000/api/student/assignments/submit.php
   ↓
3. PHP receives file and data
   - Validates JWT token
   - Uses move_uploaded_file() to save to /uploads/assignments/
   - Updates assignment_submissions table in MySQL
   - Returns success response
   ↓
4. PHP notifies Node.js server (or Node.js polls database)
   ↓
5. Node.js WebSocket pushes update to teacher's browser
   "Student X submitted assignment Y"
   ↓
6. Teacher's page updates in real-time without refresh
```

### Example 2: Student Logs In

```
1. Student enters credentials in React login form
   ↓
2. React sends POST to PHP
   POST http://localhost:8000/api/auth/login.php
   Body: { username: "student1", password: "password123" }
   ↓
3. PHP validates credentials
   - Queries MySQL users table
   - Verifies password with password_verify()
   - Generates JWT token
   - Returns: { token: "eyJhbG...", user: {...} }
   ↓
4. React stores token in localStorage
   ↓
5. All subsequent API calls include token
   Authorization: Bearer eyJhbG...
```

### Example 3: Teacher Views Student List

```
1. Teacher navigates to Student List page in React
   ↓
2. React sends GET request to PHP
   GET http://localhost:8000/api/teacher/students.php?department=BCA&semester=5
   Headers: Authorization: Bearer <token>
   ↓
3. PHP processes request
   - Validates JWT token
   - Checks user role (must be 'teacher')
   - Queries MySQL for students matching filters
   - Returns JSON array of students
   ↓
4. React receives data and renders student list
```

## Communication Between Servers

### Method 1: HTTP Proxy (Current)

Node.js proxies API requests to PHP:

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
}
```

### Method 2: WebSocket Events (For Real-time)

PHP triggers events, Node.js broadcasts:

```php
// PHP: After student submits assignment
file_put_contents('events.json', json_encode([
  'type' => 'assignment_submitted',
  'data' => ['student_id' => 1, 'assignment_id' => 5]
]));
```

```javascript
// Node.js: Watches for events and broadcasts
fs.watch('events.json', () => {
  const event = JSON.parse(fs.readFileSync('events.json'));
  io.emit(event.type, event.data);
});
```

### Method 3: Database Polling (Simplest)

Node.js periodically checks database:

```javascript
// Node.js: Poll every 30 seconds
setInterval(async () => {
  const newSubmissions = await checkNewSubmissions();
  if (newSubmissions.length > 0) {
    io.emit('new_submissions', newSubmissions);
  }
}, 30000);
```

## File Structure

```
studentportal-main/
├── frontend/                    # Node.js serves this
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # PHP API
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.php
│   │   │   └── verify.php
│   │   ├── student/
│   │   │   ├── marks.php
│   │   │   ├── attendance.php
│   │   │   └── assignments.php
│   │   ├── teacher/
│   │   └── admin/
│   ├── config/
│   │   └── database.php
│   ├── includes/
│   │   ├── auth.php
│   │   └── functions.php
│   └── uploads/                 # File storage
│       ├── assignments/
│       ├── profiles/
│       └── receipts/
│
└── database/
    └── schema.sql
```

## Running Both Servers

### Development Mode

**Terminal 1: Start Node.js (Frontend)**
```bash
cd studentportal-main
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2: Start PHP (Backend)**
```bash
# Option 1: XAMPP
# Start Apache in XAMPP Control Panel
# PHP runs on http://localhost:80 or http://localhost:8000

# Option 2: PHP Built-in Server
cd backend
php -S localhost:8000
```

**Terminal 3: Start MySQL**
```bash
# XAMPP: Start MySQL in Control Panel
# Or: mysql.server start (Mac)
# Or: sudo service mysql start (Linux)
```

### Docker Mode

```bash
docker-compose up -d
# Starts all three services:
# - Node.js frontend (port 5173)
# - PHP backend (port 8000)
# - MySQL database (port 3306)
```

## Advantages of This Architecture

### 1. Separation of Concerns
- Frontend logic separate from API logic
- Easy to scale independently
- Clear boundaries between layers

### 2. Technology Strengths
- Use Node.js for what it's best at (serving files, WebSockets)
- Use PHP for what it's best at (database operations, file handling)

### 3. Development Flexibility
- Frontend developers work in Node.js/React
- Backend developers work in PHP
- Minimal conflicts

### 4. Deployment Options
- Can deploy frontend to CDN (Netlify, Vercel)
- Can deploy PHP to traditional hosting (cPanel, shared hosting)
- Or deploy both together

## Disadvantages and Considerations

### 1. Complexity
- Two servers to manage
- More configuration required
- More potential points of failure

### 2. Communication Overhead
- HTTP requests between servers
- Potential latency
- Need to handle server-to-server auth

### 3. Deployment Complexity
- Need to deploy two separate applications
- Need to configure CORS properly
- Need to manage two sets of environment variables

## Alternative: Single Backend

**If you want to simplify**, you could:

### Option A: Node.js Only
- Rewrite PHP endpoints in Node.js/Express
- Use Sequelize or Prisma for MySQL
- Use multer for file uploads
- Single server, single language

### Option B: PHP Only
- Remove Node.js server
- Serve React build from PHP
- Use PHP for everything
- Simpler but lose WebSocket benefits

## Security Considerations

### CORS Configuration

PHP must allow requests from Node.js:

```php
// backend/includes/cors.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
```

### JWT Validation

Both servers must use same JWT secret:

```php
// PHP: Generate JWT
$jwt = JWT::encode($payload, $secret_key, 'HS256');
```

```javascript
// Node.js: Validate JWT (if needed)
const decoded = jwt.verify(token, secret_key);
```

## Real-Time Updates Implementation

### Current: Polling

```javascript
// Frontend polls every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetchAssignmentStatus();
  }, 30000);
  return () => clearInterval(interval);
}, []);
```

### Future: WebSockets

```javascript
// Node.js WebSocket server
io.on('connection', (socket) => {
  socket.on('join_teacher_room', (teacherId) => {
    socket.join(`teacher_${teacherId}`);
  });
});

// When PHP detects submission, notify Node.js
// Node.js broadcasts to teacher's room
io.to(`teacher_${teacherId}`).emit('assignment_submitted', data);
```

## Conclusion

The dual backend architecture is **unconventional but functional** for this project. It leverages the strengths of both Node.js and PHP while maintaining clear separation between frontend serving and API logic.

**For production**, consider:
- Consolidating to single backend (Node.js recommended)
- Or fully embrace microservices with proper API gateway
- Implement proper WebSockets for real-time features
- Use Redis for session/cache management

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025

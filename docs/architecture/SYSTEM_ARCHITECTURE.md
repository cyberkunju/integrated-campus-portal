# System Architecture

## Complete System Design Overview

This document provides a comprehensive overview of the Student Portal system architecture, including all components, their interactions, and design decisions.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │      │
│  │   Browser    │  │   Browser    │  │   Browser    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Application (Vite)                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ Student  │  │ Teacher  │  │  Admin   │           │  │
│  │  │  Portal  │  │  Portal  │  │  Portal  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │                                                        │  │
│  │  Components │ Pages │ Services │ Utils │ Routing    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              PHP Backend (Apache)                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │   Auth   │  │ Business │  │   API    │           │  │
│  │  │  Module  │  │  Logic   │  │ Handlers │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │                                                        │  │
│  │  Authentication │ Validation │ Processing │ Response │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ PDO/MySQLi
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                MySQL Database                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │  Users   │  │  Marks   │  │   Fees   │           │  │
│  │  │  Table   │  │  Table   │  │  Table   │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │                                                        │  │
│  │  11 Tables │ Relationships │ Indexes │ Constraints   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## System Components

### 1. Client Layer

**Purpose**: User interface access point

**Components**:
- Web browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for desktop, tablet, mobile
- Progressive Web App capabilities (future)

**Technologies**:
- HTML5
- CSS3 (TailwindCSS)
- JavaScript (ES6+)

### 2. Presentation Layer (Frontend)

**Purpose**: User interface and user experience

**Framework**: React 18.3.1 with Vite 5.4.2

**Key Features**:
- Component-based architecture
- Virtual DOM for performance
- Client-side routing
- State management
- Responsive design

**Structure**:
```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Card.jsx
│   └── ...
├── pages/           # Page components
│   ├── student/
│   ├── teacher/
│   └── admin/
├── services/        # API communication
│   └── api.js
├── utils/           # Helper functions
│   ├── gradeCalculator.js
│   └── receiptGenerator.js
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

### 3. Application Layer (Backend)

**Purpose**: Business logic and data processing

**Language**: PHP 8.x

**Server**: Apache (via XAMPP)

**Structure**:
```
backend/
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── verify.php
│   ├── student/
│   │   ├── profile.php
│   │   ├── marks.php
│   │   ├── attendance.php
│   │   └── fees.php
│   ├── teacher/
│   │   ├── students.php
│   │   ├── attendance.php
│   │   └── marks.php
│   └── admin/
│       ├── users.php
│       ├── fees.php
│       └── reports.php
├── config/
│   └── database.php
├── includes/
│   ├── functions.php
│   ├── cors.php
│   └── auth.php
└── index.php
```

### 4. Data Layer (Database)

**Purpose**: Persistent data storage

**Database**: MySQL 8.0

**Tables** (11 total):
1. users
2. students
3. teachers
4. admins
5. marks
6. attendance
7. fees
8. payments
9. subjects
10. semesters
11. sessions

## Data Flow

### Authentication Flow

```
User Login Request
    │
    ▼
Frontend (Login.jsx)
    │
    ├─► Validate input
    │
    ▼
API Service (api.js)
    │
    ├─► POST /api/auth/login.php
    │
    ▼
Backend (login.php)
    │
    ├─► Validate credentials
    ├─► Check user role
    ├─► Generate session/token
    │
    ▼
Database Query
    │
    ├─► SELECT FROM users WHERE username=?
    │
    ▼
Response
    │
    ├─► Success: {user, token, role}
    ├─► Error: {error, message}
    │
    ▼
Frontend State Update
    │
    ├─► Store user data
    ├─► Store token
    ├─► Redirect to dashboard
```

### Data Retrieval Flow

```
User Request (e.g., View Marks)
    │
    ▼
Frontend Component (StudentMarks.jsx)
    │
    ├─► useEffect hook
    │
    ▼
API Service (api.js)
    │
    ├─► GET /api/student/marks.php
    ├─► Include auth token
    │
    ▼
Backend (marks.php)
    │
    ├─► Verify authentication
    ├─► Validate user role
    ├─► Process request
    │
    ▼
Database Query
    │
    ├─► SELECT marks.*, subjects.name
    ├─► FROM marks JOIN subjects
    ├─► WHERE student_id=?
    │
    ▼
Data Processing
    │
    ├─► Calculate GP/CP
    ├─► Format response
    │
    ▼
Response
    │
    ├─► JSON: {marks: [...], gpa: x.xx}
    │
    ▼
Frontend Rendering
    │
    ├─► Update state
    ├─► Render UI
    ├─► Display data
```

## Security Architecture

### Authentication

**Method**: Stateless JWT (JSON Web Tokens)

**Flow**:
1. User submits credentials
2. PHP backend validates against database
3. Server generates JWT token (format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
4. Token returned in JSON response
5. Frontend stores token in localStorage
6. Subsequent requests include token in Authorization header
7. Server validates JWT on each request

**Security Measures**:
- Password hashing (bcrypt/password_hash in PHP)
- JWT token with expiration
- HTTPS enforcement (production)
- Token refresh mechanism
- Stateless authentication (no server-side session storage)

### Authorization

**Role-Based Access Control (RBAC)**:

```
Roles:
├── Student
│   ├── View own marks
│   ├── View own attendance
│   ├── View own fees
│   └── Download receipts
├── Teacher
│   ├── View student list
│   ├── Mark attendance
│   ├── Enter marks
│   └── View reports
└── Admin
    ├── All teacher permissions
    ├── Manage users
    ├── Manage fees
    ├── Generate reports
    └── System configuration
```

**Implementation**:
```php
// Backend authorization check
function checkRole($required_role) {
    if ($_SESSION['role'] !== $required_role) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}
```

### Data Protection

**Input Validation**:
- Frontend: React form validation
- Backend: PHP filter functions
- Database: Prepared statements

**SQL Injection Prevention**:
```php
// Use PDO prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
```

**XSS Prevention**:
```php
// Sanitize output
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
```

## Scalability Considerations

### Horizontal Scaling

**Frontend**:
- Static file hosting on CDN
- Multiple frontend servers behind load balancer
- Client-side caching

**Backend**:
- Multiple PHP application servers
- Load balancer (Nginx/HAProxy)
- Session storage in Redis/Memcached

**Database**:
- Master-slave replication
- Read replicas for queries
- Write to master only

### Vertical Scaling

**Server Resources**:
- Increase CPU cores
- Add more RAM
- Faster storage (SSD)

**Database Optimization**:
- Query optimization
- Index optimization
- Connection pooling

### Caching Strategy

**Levels**:
1. **Browser Cache**: Static assets (CSS, JS, images)
2. **Application Cache**: Frequently accessed data
3. **Database Cache**: Query results
4. **CDN Cache**: Global content delivery

**Implementation**:
```php
// Simple PHP caching
$cache_file = 'cache/students_' . $class_id . '.json';
if (file_exists($cache_file) && (time() - filemtime($cache_file) < 3600)) {
    echo file_get_contents($cache_file);
} else {
    $data = fetchStudents($class_id);
    file_put_contents($cache_file, json_encode($data));
    echo json_encode($data);
}
```

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**: Load components on demand
2. **Lazy Loading**: Defer non-critical resources
3. **Minification**: Compress JS/CSS files
4. **Tree Shaking**: Remove unused code
5. **Image Optimization**: Compress and lazy load images

### Backend Optimization

1. **Query Optimization**: Use indexes, avoid N+1 queries
2. **Connection Pooling**: Reuse database connections
3. **Opcode Caching**: Enable OPcache
4. **Gzip Compression**: Compress responses
5. **Async Processing**: Queue heavy tasks

### Database Optimization

1. **Indexing**: Create indexes on frequently queried columns
2. **Query Optimization**: Use EXPLAIN to analyze queries
3. **Normalization**: Proper database design
4. **Partitioning**: Split large tables
5. **Regular Maintenance**: Optimize tables, update statistics

## Monitoring and Logging

### Application Monitoring

**Metrics to Track**:
- Response times
- Error rates
- User activity
- API usage
- Resource utilization

**Tools**:
- Custom logging system
- Error tracking (future: Sentry)
- Performance monitoring (future: New Relic)

### Logging Strategy

**Log Levels**:
1. **ERROR**: Application errors
2. **WARNING**: Potential issues
3. **INFO**: General information
4. **DEBUG**: Detailed debugging info

**Log Files**:
```
logs/
├── error.log       # Application errors
├── access.log      # API access logs
├── auth.log        # Authentication attempts
└── debug.log       # Debug information
```

## Disaster Recovery

### Backup Strategy

**Database Backups**:
- Daily full backups
- Hourly incremental backups
- Off-site backup storage
- Retention: 30 days

**Application Backups**:
- Version control (Git)
- Configuration backups
- User-uploaded files backup

### Recovery Procedures

1. **Database Recovery**:
   ```bash
   mysql -u root -p studentportal < backup.sql
   ```

2. **Application Recovery**:
   ```bash
   git checkout <commit-hash>
   npm install
   npm run build
   ```

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend Framework | React | 18.3.1 | UI components |
| Build Tool | Vite | 5.4.2 | Development & build |
| Styling | TailwindCSS | 3.4.1 | CSS framework |
| Routing | React Router | 6.26.2 | Client-side routing |
| HTTP Client | Axios | 1.7.7 | API requests |
| Backend Language | PHP | 8.x | Server-side logic |
| Web Server | Apache | 2.4.x | HTTP server |
| Database | MySQL | 8.0.x | Data storage |
| Containerization | Docker | Latest | Development environment |

## Future Enhancements

### Phase 2
- Real-time notifications (WebSockets)
- Advanced reporting (Charts/Graphs)
- Email integration
- SMS notifications

### Phase 3
- Mobile applications (React Native)
- Progressive Web App (PWA)
- Offline support
- Push notifications

### Phase 4
- AI-powered analytics
- Predictive performance analysis
- Automated report generation
- Integration with external systems

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025

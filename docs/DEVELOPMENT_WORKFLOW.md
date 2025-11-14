# Development Workflow

## Complete Development Guide

This guide covers the complete development workflow for the Student Portal project.

## Development Environment Setup

### 1. Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd studentportal-main

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### 2. Branch Strategy

**Main Branches**:
- `main`: Production-ready code
- `develop`: Development branch
- `staging`: Pre-production testing

**Feature Branches**:
```bash
# Create feature branch
git checkout -b feature/student-dashboard

# Create bugfix branch
git checkout -b bugfix/login-error

# Create hotfix branch
git checkout -b hotfix/security-patch
```

**Branch Naming Convention**:
- `feature/feature-name`: New features
- `bugfix/bug-description`: Bug fixes
- `hotfix/critical-fix`: Critical production fixes
- `refactor/component-name`: Code refactoring
- `docs/documentation-update`: Documentation changes

## Development Process

### 1. Pick a Task

```bash
# Update local repository
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/attendance-report
```

### 2. Develop Feature

#### Frontend Development

**Component Structure**:
```jsx
// src/components/AttendanceReport.jsx
import React, { useState, useEffect } from 'react';
import { getAttendance } from '../services/api';

const AttendanceReport = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const data = await getAttendance();
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="attendance-report">
      {/* Component JSX */}
    </div>
  );
};

export default AttendanceReport;
```

**Styling with Tailwind**:
```jsx
<div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
  <h2 className="text-2xl font-bold text-white mb-4">
    Attendance Report
  </h2>
  {/* Content */}
</div>
```

#### Backend Development

**API Endpoint Structure**:
```php
<?php
// backend/api/student/attendance.php
require_once '../../config/database.php';
require_once '../../includes/auth.php';

// Verify authentication
$user = verifyAuth();
if (!$user || $user['role'] !== 'student') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Get student ID
$student_id = getStudentId($user['id'], $db);

// Fetch attendance
$query = "SELECT a.*, s.subject_name 
          FROM attendance a
          JOIN subjects s ON a.subject_id = s.id
          WHERE a.student_id = :student_id
          ORDER BY a.attendance_date DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(':student_id', $student_id);
$stmt->execute();

$attendance = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return response
echo json_encode([
    'success' => true,
    'data' => $attendance
]);
?>
```

### 3. Test Your Changes

#### Manual Testing

```bash
# Start development server
npm run dev

# Test in browser
# - Navigate to feature
# - Test all functionality
# - Check console for errors
# - Test responsive design
```

#### Code Quality Checks

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 4. Commit Changes

**Commit Message Convention**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
git add .
git commit -m "feat(student): add attendance report component"

git commit -m "fix(auth): resolve login redirect issue

- Fixed redirect after successful login
- Added error handling for invalid credentials
- Updated session management

Closes #123"
```

### 5. Push and Create Pull Request

```bash
# Push to remote
git push origin feature/attendance-report

# Create pull request on GitHub
# - Add description
# - Link related issues
# - Request reviewers
# - Add labels
```

## Code Review Process

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive design checked

## Screenshots
(if applicable)

## Related Issues
Closes #123
```

### Review Checklist

**Code Quality**:
- [ ] Code follows project standards
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Comments for complex logic
- [ ] No hardcoded values

**Functionality**:
- [ ] Feature works as expected
- [ ] No breaking changes
- [ ] Edge cases handled
- [ ] Responsive design

**Performance**:
- [ ] No unnecessary re-renders
- [ ] Optimized queries
- [ ] Proper loading states
- [ ] Efficient algorithms

**Security**:
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Proper authentication checks

## Common Development Tasks

### Adding a New Page

1. **Create Page Component**:
```jsx
// src/pages/student/NewPage.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const NewPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1>New Page</h1>
        </main>
      </div>
    </div>
  );
};

export default NewPage;
```

2. **Add Route**:
```jsx
// src/App.jsx
import NewPage from './pages/student/NewPage';

// In Routes
<Route path="/student/new-page" element={<NewPage />} />
```

3. **Add Navigation Link**:
```jsx
// src/components/Sidebar.jsx
<Link to="/student/new-page">
  <Icon />
  New Page
</Link>
```

### Adding a New API Endpoint

1. **Create PHP File**:
```php
// backend/api/student/new-endpoint.php
<?php
require_once '../../config/database.php';
require_once '../../includes/auth.php';

// Verify auth
$user = verifyAuth();

// Handle request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GET logic
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POST logic
}
?>
```

2. **Add API Service**:
```javascript
// src/services/api.js
export const getNewData = async () => {
  const response = await axios.get('/api/student/new-endpoint.php');
  return response.data;
};
```

3. **Use in Component**:
```jsx
import { getNewData } from '../services/api';

const data = await getNewData();
```

### Adding a New Database Table

1. **Create Migration**:
```sql
-- database/migrations/add_new_table.sql
CREATE TABLE new_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

2. **Run Migration**:
```bash
mysql -u root -p studentportal < database/migrations/add_new_table.sql
```

3. **Update Schema Documentation**:
```markdown
// docs/database/SCHEMA.md
### new_table
...
```

## Debugging

### Frontend Debugging

**React DevTools**:
```bash
# Install React DevTools browser extension
# Inspect component state and props
```

**Console Debugging**:
```javascript
console.log('Debug:', variable);
console.table(arrayData);
console.error('Error:', error);
```

**Network Debugging**:
```javascript
// Check API calls in browser DevTools Network tab
// Verify request/response data
```

### Backend Debugging

**PHP Error Logging**:
```php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log to file
error_log("Debug: " . print_r($variable, true));
```

**Database Debugging**:
```php
// Print query
echo $query;

// Check PDO errors
print_r($stmt->errorInfo());
```

**Apache Logs**:
```bash
# Windows
tail -f C:\xampp\apache\logs\error.log

# Linux/Mac
tail -f /opt/lampp/logs/error_log
```

## Performance Optimization

### Frontend Optimization

**Code Splitting**:
```javascript
// Lazy load components
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));

<Suspense fallback={<Loading />}>
  <StudentDashboard />
</Suspense>
```

**Memoization**:
```javascript
// Memoize expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Memoize callbacks
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**Optimize Re-renders**:
```javascript
// Use React.memo for components
export default React.memo(Component);

// Optimize state updates
setState(prevState => ({
  ...prevState,
  newValue: value
}));
```

### Backend Optimization

**Query Optimization**:
```php
// Use indexes
CREATE INDEX idx_student_id ON marks(student_id);

// Limit results
SELECT * FROM students LIMIT 20 OFFSET 0;

// Use joins instead of multiple queries
SELECT s.*, u.email 
FROM students s 
JOIN users u ON s.user_id = u.id;
```

**Caching**:
```php
// Simple file-based caching
$cache_file = 'cache/data.json';
if (file_exists($cache_file) && (time() - filemtime($cache_file) < 3600)) {
    echo file_get_contents($cache_file);
    exit();
}
```

## Deployment Preparation

### Pre-deployment Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Build succeeds
- [ ] Performance tested
- [ ] Security audit completed
- [ ] Documentation updated

### Build for Production

```bash
# Build frontend
npm run build

# Test production build
npm run preview

# Verify build output
ls -la dist/
```

### Database Migration

```bash
# Backup production database
mysqldump -u root -p studentportal > backup.sql

# Run migrations
mysql -u root -p studentportal < migrations/latest.sql
```

## Troubleshooting

### Common Issues

**Issue**: Changes not reflecting
```bash
# Clear cache
rm -rf node_modules/.vite
npm run dev
```

**Issue**: Database connection failed
```php
// Check credentials in config/database.php
// Verify MySQL is running
```

**Issue**: CORS errors
```php
// Update CORS headers in includes/cors.php
header("Access-Control-Allow-Origin: http://localhost:5173");
```

## Best Practices

### Code Organization
- One component per file
- Group related files
- Use meaningful names
- Keep files small and focused

### State Management
- Use local state when possible
- Lift state up when needed
- Consider context for global state
- Avoid prop drilling

### Error Handling
- Always handle errors
- Provide user feedback
- Log errors for debugging
- Graceful degradation

### Documentation
- Comment complex logic
- Update docs with changes
- Write clear commit messages
- Document API changes

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025

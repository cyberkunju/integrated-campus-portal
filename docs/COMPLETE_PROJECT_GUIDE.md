# Complete Project Guide

## Student Portal - Everything You Need to Know

This is the master guide that provides a complete overview of the Student Portal project. Whether you're a developer, AI assistant, or stakeholder, this document will give you 100% understanding of the project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Design](#database-design)
5. [Features & Functionality](#features--functionality)
6. [Setup & Installation](#setup--installation)
7. [Development Guide](#development-guide)
8. [API Documentation](#api-documentation)
9. [Security & Authentication](#security--authentication)
10. [Deployment](#deployment)

---

## 1. Project Overview

### What is Student Portal?

A comprehensive web-based management system for educational institutions that provides role-based access to students, teachers, and administrators.

### Key Statistics

- **Frontend**: React 18.3.1 + Vite 5.4.2
- **Backend**: PHP 8.x + MySQL 8.0
- **Database Tables**: 11
- **User Roles**: 3 (Student, Teacher, Admin)
- **Components**: 8 reusable components
- **Pages**: 18 pages across all roles
- **API Endpoints**: 20+ endpoints

### Project Goals

1. **Digitize** academic administration
2. **Automate** grade calculations and reporting
3. **Provide** 24/7 access to academic information
4. **Reduce** manual paperwork
5. **Improve** transparency and communication

### Target Users

- **Students**: 500-5000 users
- **Teachers**: 50-500 users
- **Administrators**: 5-50 users

---

## 2. Technology Stack

### Frontend Technologies

```json
{
  "framework": "React 18.3.1",
  "buildTool": "Vite 5.4.2",
  "styling": "TailwindCSS 3.4.1",
  "routing": "React Router DOM 6.26.2",
  "httpClient": "Axios 1.7.7",
  "icons": "Lucide React 0.441.0",
  "pdfGeneration": "jsPDF 2.5.2",
  "dateHandling": "date-fns 4.1.0"
}
```

### Backend Technologies

```json
{
  "architecture": "Dual Backend",
  "frontend_server": "Node.js/Express (serves React, handles WebSockets)",
  "api_server": "PHP 8.x (all API endpoints, database operations)",
  "database": "MySQL 8.0",
  "server": "Apache 2.4.x (XAMPP) for PHP",
  "authentication": "JWT (JSON Web Tokens)",
  "apiStyle": "REST"
}
```

### Development Tools

```json
{
  "containerization": "Docker & Docker Compose",
  "localServer": "XAMPP",
  "versionControl": "Git",
  "packageManager": "npm"
}
```

### Design System

- **UI Style**: Glassmorphism
- **Color Scheme**: Purple/Blue/Indigo gradients
- **Dark Mode**: Supported
- **Responsive**: Mobile, Tablet, Desktop
- **Animations**: Smooth transitions

---

## 3. System Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │ (Client Layer)
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────┐
│    React    │ (Presentation Layer)
│  Frontend   │ - Components
│   (Vite)    │ - Pages
└──────┬──────┘ - Services
       │ REST API (JSON)
       ▼
┌─────────────┐
│     PHP     │ (Application Layer)
│   Backend   │ - Authentication
│  (Apache)   │ - Business Logic
└──────┬──────┘ - API Handlers
       │ PDO/MySQLi
       ▼
┌─────────────┐
│    MySQL    │ (Data Layer)
│  Database   │ - 11 Tables
└─────────────┘ - Relationships
```

### Component Architecture

**Frontend Structure**:
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Top navigation
│   ├── Sidebar.jsx     # Side navigation
│   ├── Card.jsx        # Card container
│   ├── Table.jsx       # Data table
│   ├── Modal.jsx       # Modal dialog
│   ├── Button.jsx      # Button component
│   ├── Input.jsx       # Form input
│   └── Loading.jsx     # Loading spinner
├── pages/              # Page components
│   ├── student/        # Student portal (6 pages)
│   ├── teacher/        # Teacher portal (6 pages)
│   └── admin/          # Admin portal (6 pages)
├── services/           # API services
│   └── api.js          # Axios configuration
├── utils/              # Utility functions
│   ├── gradeCalculator.js
│   └── receiptGenerator.js
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

**Backend Structure**:
```
backend/
├── api/
│   ├── auth/           # Authentication endpoints
│   ├── student/        # Student endpoints
│   ├── teacher/        # Teacher endpoints
│   └── admin/          # Admin endpoints
├── config/
│   └── database.php    # Database connection
├── includes/
│   ├── functions.php   # Helper functions
│   ├── cors.php        # CORS configuration
│   └── auth.php        # Auth middleware
└── index.php           # API entry point
```

---

## 4. Database Design

### Database Schema Overview

**11 Tables**:
1. `users` - Core authentication
2. `students` - Student information
3. `teachers` - Teacher information
4. `admins` - Administrator information
5. `subjects` - Course/subject data
6. `marks` - Student grades
7. `attendance` - Attendance records
8. `fees` - Fee structure
9. `payments` - Payment records
10. `semesters` - Semester configuration
11. `sessions` - Academic sessions

### Key Relationships

```
users (1) ──────── (1) students
users (1) ──────── (1) teachers
users (1) ──────── (1) admins

students (1) ──── (*) marks
students (1) ──── (*) attendance
students (1) ──── (*) payments

subjects (1) ──── (*) marks
fees (1) ──────── (*) payments
sessions (1) ──── (*) students
```

### Sample Data Structure

**User Record**:
```json
{
  "id": 1,
  "username": "student1",
  "email": "student1@example.com",
  "role": "student",
  "status": "active"
}
```

**Student Record**:
```json
{
  "id": 1,
  "user_id": 1,
  "student_id": "STU001",
  "first_name": "John",
  "last_name": "Doe",
  "semester": 3,
  "department": "Computer Science"
}
```

**Marks Record**:
```json
{
  "id": 1,
  "student_id": 1,
  "subject_id": 1,
  "internal_marks": 25,
  "external_marks": 65,
  "total_marks": 90,
  "grade_point": 4.00,
  "letter_grade": "A+"
}
```

---

## 5. Features & Functionality

### Student Portal Features

1. **Dashboard**
   - Overview of academic performance
   - Quick stats (GPA, attendance, fees)
   - Recent notifications

2. **View Marks**
   - Semester-wise marks display
   - GP/CP/GPA calculations
   - Subject-wise breakdown
   - Grade distribution

3. **View Attendance**
   - Subject-wise attendance
   - Attendance percentage
   - Date-wise records
   - Visual indicators

4. **Fee Management**
   - View fee structure
   - Payment history
   - Pending payments
   - Download receipts (PDF)

5. **Profile Management**
   - View personal information
   - Update contact details
   - Change password

### Teacher Portal Features

1. **Dashboard**
   - Overview of assigned classes
   - Quick actions
   - Recent activities

2. **Student List**
   - View all students
   - Filter by class/semester
   - Search functionality
   - Student details

3. **Mark Attendance**
   - Date-wise attendance marking
   - Bulk operations
   - Attendance reports
   - Edit previous records

4. **Enter Marks**
   - Subject-wise marks entry
   - Internal and external marks
   - Auto-calculation of GP/CP
   - Validation checks

5. **Reports**
   - Attendance reports
   - Performance reports
   - Class statistics

### Admin Portal Features

1. **Dashboard**
   - System overview
   - User statistics
   - Recent activities
   - Quick actions

2. **User Management**
   - Create/edit/delete users
   - Manage students
   - Manage teachers
   - Role assignment

3. **Fee Management**
   - Create fee structures
   - Set due dates
   - Configure late fines
   - Fee categories

4. **Payment Processing**
   - Record payments
   - Generate receipts
   - Payment history
   - Financial reports

5. **Reports & Analytics**
   - Academic reports
   - Financial reports
   - Attendance reports
   - Custom reports

---

## 6. Setup & Installation

### Quick Start (3 Steps)

```bash
# 1. Clone and install
git clone <repository-url>
cd studentportal-main
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start development
npm run dev
```

### Docker Setup (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Access applications
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# phpMyAdmin: http://localhost:8080
```

### Local Setup with XAMPP

1. **Install XAMPP**
   - Download from https://www.apachefriends.org/
   - Install Apache, MySQL, PHP

2. **Clone Project**
   ```bash
   cd C:\xampp\htdocs
   git clone <repository-url> studentportal
   ```

3. **Setup Database**
   - Start MySQL in XAMPP
   - Create database: `studentportal`
   - Import: `database/schema.sql`

4. **Configure Backend**
   - Edit `backend/config/database.php`
   - Set database credentials

5. **Start Services**
   - Start Apache and MySQL in XAMPP
   - Run `npm run dev` for frontend

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Application Settings
VITE_APP_NAME=Student Portal
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_MOCK_API=false
```

---

## 7. Development Guide

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop Feature**
   - Write code
   - Test locally
   - Follow code standards

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/new-feature
   ```

### Code Standards

**JavaScript/React**:
- Use functional components
- Use hooks (useState, useEffect)
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic

**PHP**:
- Use PDO for database
- Prepared statements only
- Validate all inputs
- Handle errors properly
- Follow PSR standards

**CSS/Tailwind**:
- Use Tailwind utility classes
- Follow design system
- Maintain consistency
- Responsive design first

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] API calls successful
- [ ] Error handling works
- [ ] Loading states shown
- [ ] Validation working
- [ ] No security issues

---

## 8. API Documentation

### Authentication

**Login** (JWT-based):
```http
POST /api/auth/login.php
Content-Type: application/json

{
  "username": "student1",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "profile": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Subsequent Requests**:
```http
GET /api/student/marks.php
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Logout**:
```http
POST /api/auth/logout.php

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Student Endpoints

**Get Marks**:
```http
GET /api/student/marks.php?semester=3

Response:
{
  "success": true,
  "data": {
    "marks": [...],
    "summary": {
      "gpa": 3.67,
      "cgpa": 3.54
    }
  }
}
```

**Get Attendance**:
```http
GET /api/student/attendance.php?semester=3

Response:
{
  "success": true,
  "data": {
    "attendance": [...],
    "summary": {
      "percentage": 85.5
    }
  }
}
```

### Teacher Endpoints

**Mark Attendance**:
```http
POST /api/teacher/attendance.php
Content-Type: application/json

{
  "subject_id": 1,
  "date": "2024-11-14",
  "students": [
    {"student_id": 1, "status": "present"},
    {"student_id": 2, "status": "absent"}
  ]
}
```

**Enter Marks**:
```http
POST /api/teacher/marks.php
Content-Type: application/json

{
  "student_id": 1,
  "subject_id": 1,
  "internal_marks": 25,
  "external_marks": 65
}
```

---

## 9. Security & Authentication

### Authentication Flow

1. User submits credentials
2. Server validates against database
3. Server creates session
4. Session ID stored in cookie
5. Subsequent requests include session
6. Server validates session on each request

### Security Measures

**Password Security**:
- Passwords hashed with bcrypt
- Minimum 8 characters
- Never stored in plain text

**SQL Injection Prevention**:
```php
// Always use prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
```

**XSS Prevention**:
```php
// Sanitize output
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
```

**CSRF Protection**:
- Session-based tokens
- Validate on state-changing operations

**Role-Based Access Control**:
```php
function checkRole($required_role) {
    if ($_SESSION['role'] !== $required_role) {
        http_response_code(403);
        exit();
    }
}
```

---

## 10. Deployment

### Pre-Deployment Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Build succeeds
- [ ] Security audit done
- [ ] Backup created
- [ ] Documentation updated

### Build for Production

```bash
# Build frontend
npm run build

# Output in dist/ folder
ls -la dist/
```

### Database Migration

```bash
# Backup production database
mysqldump -u root -p studentportal > backup.sql

# Run migrations
mysql -u root -p studentportal < migrations/latest.sql
```

### Deployment Steps

1. **Prepare Server**
   - Install Apache, PHP, MySQL
   - Configure virtual host
   - Set up SSL certificate

2. **Deploy Backend**
   - Upload PHP files
   - Configure database connection
   - Set file permissions

3. **Deploy Frontend**
   - Build production bundle
   - Upload to server
   - Configure web server

4. **Verify Deployment**
   - Test all features
   - Check API endpoints
   - Monitor error logs

---

## Quick Reference

### Default Credentials (Development)

**Student**:
- Username: `student1`
- Password: `password123`

**Teacher**:
- Username: `teacher1`
- Password: `password123`

**Admin**:
- Username: `admin1`
- Password: `password123`

### Important URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- phpMyAdmin: http://localhost/phpmyadmin
- Documentation: `/docs` folder

### Key Files

- Frontend Entry: `src/main.jsx`
- Main App: `src/App.jsx`
- API Service: `src/services/api.js`
- Database Config: `backend/config/database.php`
- Database Schema: `database/schema.sql`

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code

# Docker
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs

# Database
mysql -u root -p         # Access MySQL CLI
mysqldump > backup.sql   # Backup database
mysql < backup.sql       # Restore database
```

---

## Support & Resources

### Documentation Files

- [Project Overview](./PROJECT_OVERVIEW.md)
- [Setup Guide](./setup/SETUP_GUIDE.md)
- [System Architecture](./architecture/SYSTEM_ARCHITECTURE.md)
- [Database Schema](./database/SCHEMA.md)
- [API Documentation](./api/API_OVERVIEW.md)
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md)
- [Grade Calculation](./features/GRADE_CALCULATION.md)

### Getting Help

- Check documentation in `/docs` folder
- Review code comments
- Check GitHub issues
- Contact development team

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025  
**Maintained By**: Development Team

**This document provides 100% understanding of the Student Portal project.**

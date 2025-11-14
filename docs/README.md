# Student Portal - Complete Documentation

## 🎯 New Here? Start Here!

**👉 [START_HERE.md](./START_HERE.md) - Your guided entry point to all documentation**

This file provides a structured learning path with reading order, time estimates, and role-specific guides.

---

## 📚 Documentation Index

Welcome to the Student Portal comprehensive documentation. This guide contains everything you need to understand, develop, deploy, and maintain this project.

## ⚠️ IMPORTANT: Read This First

**Before diving into the documentation, read these critical files**:
1. [CRITICAL_CLARIFICATIONS.md](./CRITICAL_CLARIFICATIONS.md) - **MUST READ** - Key implementation details that differ from typical projects
2. [Dual Backend Architecture](./architecture/DUAL_BACKEND_ARCHITECTURE.md) - Understanding the Node.js + PHP system

## Quick Navigation

### Getting Started
- [Complete Project Guide](./COMPLETE_PROJECT_GUIDE.md) - **START HERE** - Master guide with 100% understanding
- [Project Overview](./PROJECT_OVERVIEW.md) - High-level project description and goals
- [Setup Guide](./setup/SETUP_GUIDE.md) - Installation and configuration
- [Docker Setup](./setup/DOCKER_SETUP.md) - Docker development environment
- [Local Setup](./setup/LOCAL_SETUP.md) - Local development without Docker

### Architecture
- [System Architecture](./architecture/SYSTEM_ARCHITECTURE.md) - Overall system design
- [Frontend Architecture](./architecture/FRONTEND_ARCHITECTURE.md) - React application structure
- [Backend Architecture](./architecture/BACKEND_ARCHITECTURE.md) - PHP API design
- [Authentication Flow](./architecture/AUTHENTICATION.md) - Login and security

### Database
- [Database Schema](./database/SCHEMA.md) - Complete database structure
- [ER Diagram](./database/ER_DIAGRAM.md) - Entity relationships
- [Sample Data](./database/SAMPLE_DATA.md) - Test data for development

### API Documentation
- [API Overview](./api/API_OVERVIEW.md) - REST API introduction
- [Authentication Endpoints](./api/AUTH_ENDPOINTS.md) - Login/logout APIs
- [Student Endpoints](./api/STUDENT_ENDPOINTS.md) - Student-specific APIs
- [Teacher Endpoints](./api/TEACHER_ENDPOINTS.md) - Teacher-specific APIs
- [Admin Endpoints](./api/ADMIN_ENDPOINTS.md) - Admin-specific APIs

### Components
- [Component Library](./components/COMPONENT_LIBRARY.md) - Reusable UI components
- [Page Components](./components/PAGE_COMPONENTS.md) - Page-level components
- [Styling Guide](./components/STYLING_GUIDE.md) - Design system and themes

### Features
- [Student Features](./features/STUDENT_FEATURES.md) - Student portal capabilities
- [Teacher Features](./features/TEACHER_FEATURES.md) - Teacher portal capabilities
- [Admin Features](./features/ADMIN_FEATURES.md) - Admin portal capabilities
- [Grade Calculation](./features/GRADE_CALCULATION.md) - GP/CP/SCPA system
- [Fee Management](./features/FEE_MANAGEMENT.md) - Payment processing
- [Receipt Generation](./features/RECEIPT_GENERATION.md) - PDF receipts

### Development
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md) - How to develop features
- [Code Standards](./CODE_STANDARDS.md) - Coding conventions
- [Testing Guide](./TESTING_GUIDE.md) - Testing strategies
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment

### Troubleshooting
- [Common Issues](./TROUBLESHOOTING.md) - FAQ and solutions
- [Debug Guide](./DEBUG_GUIDE.md) - Debugging techniques

## Project Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.2
- **Styling**: TailwindCSS 3.4.1
- **Routing**: React Router DOM 6.26.2
- **Icons**: Lucide React 0.441.0
- **PDF Generation**: jsPDF 2.5.2
- **HTTP Client**: Axios 1.7.7

### Backend
- **Architecture**: Dual Backend System
- **Frontend Server**: Node.js/Express (serves React, WebSockets)
- **API Server**: PHP 8.x (all API endpoints, database operations)
- **Database**: MySQL 8.x (via XAMPP)
- **Server**: Apache (via XAMPP) for PHP

### Development Tools
- **Containerization**: Docker & Docker Compose
- **Local Server**: XAMPP (Apache + MySQL)
- **Version Control**: Git

## Key Features

### Multi-Role System
- **Student Portal**: View marks, attendance, fees, download receipts
- **Teacher Portal**: Mark attendance, enter marks, view student lists
- **Admin Portal**: Manage fees, students, teachers, generate reports

### Academic Management
- Grade calculation (GP, CP, SCPA)
- Semester-based marks entry
- Attendance tracking
- Academic reports

### Financial Management
- Fee structure management
- Payment processing (mock)
- Receipt generation (PDF)
- Fine calculation for late payments

### Design Features
- Glassmorphism UI design
- Dark mode support
- Responsive layout
- Animated transitions

## Quick Start

### Frontend Only (Quick Test)
```bash
# Clone repository
git clone <repository-url>
cd studentportal-main

# Install dependencies
npm install

# Start development server (Node.js serves React)
npm run dev
# Access at http://localhost:5173
```

### Full Stack (Frontend + Backend)
```bash
# Terminal 1: Start Frontend (Node.js)
npm run dev

# Terminal 2: Start Backend (PHP via XAMPP)
# Open XAMPP Control Panel
# Start Apache and MySQL

# Terminal 3: Setup Database
mysql -u root -p < database/schema.sql
```

### Docker Setup (All-in-One)
```bash
docker-compose up -d
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# phpMyAdmin: http://localhost:8080
```

## Support

For detailed information on any topic, navigate to the specific documentation file listed above.

## Version

Current Version: 1.0.0
Last Updated: November 2025

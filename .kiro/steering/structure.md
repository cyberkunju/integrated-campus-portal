# Project Structure

## Root Organization

```
studentportal-main/
├── backend/           # PHP REST API
├── database/          # SQL schemas and migrations
├── docs/              # Complete documentation
├── docker/            # Docker configuration files
├── public/            # Static assets
├── src/               # React frontend source
├── .kiro/             # Kiro AI assistant configuration
└── [config files]     # Build and tooling configs
```

## Frontend Structure (`src/`)

```
src/
├── components/        # Reusable React components
├── pages/             # Page-level components (routes)
│   ├── admin/         # Admin-specific pages
│   ├── Dashboard.jsx  # Student dashboard
│   ├── Login.jsx      # Authentication page
│   └── [other pages]  # Student/teacher pages
├── services/          # API service layer
│   └── api.js         # Axios instance, auth helpers
├── utils/             # Utility functions
├── App.jsx            # Main app component with routing
├── main.jsx           # React entry point
└── index.css          # Global styles (Tailwind imports)
```

## Backend Structure (`backend/`)

```
backend/
├── api/               # REST API endpoints
│   ├── auth/          # Authentication (login, verify, logout)
│   ├── student/       # Student endpoints (marks, attendance, fees)
│   ├── teacher/       # Teacher endpoints (students, marks, attendance)
│   └── admin/         # Admin endpoints (users, fees, reports)
├── config/            # Configuration files
│   ├── database.php   # PDO database connection
│   └── jwt.php        # JWT secret and helpers
├── includes/          # Shared PHP code
│   ├── auth.php       # Authentication middleware
│   ├── cors.php       # CORS headers
│   └── functions.php  # Utility functions
├── uploads/           # File storage (local filesystem)
│   ├── assignments/   # Student assignment files
│   ├── profiles/      # Profile photos
│   └── receipts/      # Generated PDF receipts
└── index.php          # API entry point
```

## Database Structure (`database/`)

```
database/
├── migrations/        # Database migration scripts
├── seeds/             # Seed data for development
├── schema.sql         # Complete database schema
└── README.md          # Database documentation
```

## Documentation Structure (`docs/`)

```
docs/
├── api/               # API endpoint documentation
├── architecture/      # System architecture docs
├── database/          # Database schema and design
├── features/          # Feature-specific documentation
├── setup/             # Installation and setup guides
├── START_HERE.md      # Entry point for new developers
├── COMPLETE_PROJECT_GUIDE.md  # Master guide
└── CRITICAL_CLARIFICATIONS.md # Important implementation details
```

## Key Conventions

### File Naming
- React components: PascalCase (e.g., `Dashboard.jsx`, `AdminStudents.jsx`)
- PHP files: lowercase with underscores (e.g., `login.php`, `database.php`)
- Config files: lowercase with dots (e.g., `vite.config.js`, `docker-compose.yml`)

### Routing Patterns
- Student routes: `/dashboard`, `/notice`, `/payments`, `/subjects`, `/result`, `/analysis`
- Admin routes: `/admin/dashboard`, `/admin/students`, `/admin/teachers`, etc.
- Teacher routes: `/teacher/dashboard`, `/teacher/attendance`, `/teacher/students`, etc.
- API routes: `/api/{role}/{resource}.php` (e.g., `/api/student/marks.php`)

### Component Organization
- Page components in `src/pages/`
- Reusable components in `src/components/`
- Role-specific pages in subdirectories (e.g., `src/pages/admin/`)
- Protected routes use `ProtectedRoute` wrapper with `allowedRoles` prop

### API Service Layer
- All API calls go through `src/services/api.js`
- JWT token stored in localStorage
- Token automatically included in request headers
- Authentication helpers: `isAuthenticated()`, `getCurrentUser()`, `logout()`

### Database Tables
11 core tables: users, sessions, students, teachers, admins, subjects, semesters, marks, attendance, fees, payments

### File Uploads
- Stored in `backend/uploads/` subdirectories
- Database stores file paths only (not binary data)
- PHP uses `move_uploaded_file()` for handling uploads

# Technology Stack

## Frontend

- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.0.7
- **Routing**: React Router DOM 7.9.4
- **Styling**: TailwindCSS 3.4.17
- **Animations**: Motion 11.15.0
- **PDF Generation**: jsPDF 3.0.3
- **Image Processing**: html2canvas 1.4.1, react-image-crop 11.0.10
- **UI Library**: liquid-glass-react 1.1.1

## Backend (Dual Architecture)

### Backend 1: Node.js/Express
- **Purpose**: Serves React frontend, handles WebSockets
- **Port**: 3000 (development), 5173 (Vite default)
- **Responsibilities**: Static file serving, real-time updates, API proxying

### Backend 2: PHP
- **Purpose**: Complete REST API backend
- **Port**: 8000 (or 80 via XAMPP)
- **Responsibilities**: Authentication (JWT), database operations, file uploads, business logic
- **Database**: MySQL 8.0 via PDO

## Development Tools

- **Docker**: docker-compose.yml for containerized development
- **XAMPP**: Alternative local development (Apache + MySQL + PHP)
- **PostCSS**: 8.4.49 with Autoprefixer 10.4.20

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Start PHP backend (XAMPP)
# Start Apache in XAMPP Control Panel

# Start PHP backend (built-in server)
cd backend
php -S localhost:8000

# Start all services with Docker
docker-compose up -d
```

### Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Database
```bash
# Import schema
mysql -u root -p studentportal < database/schema.sql

# Access phpMyAdmin (Docker)
# http://localhost:8080
```

## Configuration Files

- `vite.config.js`: Vite dev server config (port 3000, HMR, CORS)
- `tailwind.config.js`: TailwindCSS config (dark mode, primary color #137fec)
- `postcss.config.js`: PostCSS with Tailwind and Autoprefixer
- `docker-compose.yml`: Multi-container setup (frontend, backend, database, phpMyAdmin)
- `backend/config/database.php`: MySQL connection settings
- `backend/config/jwt.php`: JWT secret key configuration

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:8000/api)
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database credentials

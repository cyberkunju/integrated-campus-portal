# Local Setup Guide with XAMPP

## Complete Local Development Setup

This guide covers setting up the Student Portal locally using XAMPP for backend services.

## Prerequisites

### 1. Install XAMPP

#### Windows
1. Download XAMPP: https://www.apachefriends.org/download.html
2. Run installer (xampp-windows-x64-8.2.12-0-VS16-installer.exe)
3. Install to `C:\xampp` (default)
4. Components to install:
   - ✅ Apache
   - ✅ MySQL
   - ✅ PHP
   - ✅ phpMyAdmin
   - ❌ Others (optional)

#### macOS
1. Download XAMPP for macOS
2. Open DMG file
3. Drag XAMPP to Applications
4. Run XAMPP from Applications

#### Linux
```bash
# Download
wget https://www.apachefriends.org/xampp-files/8.2.12/xampp-linux-x64-8.2.12-0-installer.run

# Make executable
chmod +x xampp-linux-x64-8.2.12-0-installer.run

# Install
sudo ./xampp-linux-x64-8.2.12-0-installer.run
```

### 2. Install Node.js

Download and install from: https://nodejs.org/
- Recommended: LTS version (v18.x or higher)

Verify installation:
```bash
node --version
npm --version
```

## XAMPP Configuration

### 1. Start XAMPP Services

#### Windows
1. Open XAMPP Control Panel
2. Start Apache (Port 80)
3. Start MySQL (Port 3306)
4. Verify green status indicators

#### macOS/Linux
```bash
sudo /opt/lampp/lampp start
```

### 2. Verify XAMPP Installation

Open browser and navigate to:
- Apache: http://localhost
- phpMyAdmin: http://localhost/phpmyadmin

### 3. Configure PHP

Edit `C:\xampp\php\php.ini` (Windows) or `/opt/lampp/etc/php.ini` (Linux/Mac):

```ini
; Enable required extensions
extension=mysqli
extension=pdo_mysql
extension=mbstring
extension=openssl

; Set timezone
date.timezone = Asia/Kolkata

; Increase limits
upload_max_filesize = 64M
post_max_size = 64M
max_execution_time = 300
memory_limit = 256M

; Error reporting (development)
display_errors = On
error_reporting = E_ALL
```

Restart Apache after changes.

### 4. Configure MySQL

Access phpMyAdmin: http://localhost/phpmyadmin

**Default Credentials**:
- Username: `root`
- Password: (empty)

**Security Setup** (Recommended):
```sql
-- Set root password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
```

## Project Setup

### 1. Clone Repository

```bash
cd C:\xampp\htdocs  # Windows
# or
cd /opt/lampp/htdocs  # Linux/Mac

git clone <repository-url> studentportal
cd studentportal
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
copy .env.example .env  # Windows
# or
cp .env.example .env  # Linux/Mac
```

Edit `.env`:
```env
VITE_API_URL=http://localhost/studentportal/backend/api
VITE_API_TIMEOUT=10000
VITE_MOCK_API=false
```

### 3. Backend Setup

Create backend directory structure:

```bash
mkdir backend
cd backend
mkdir api config includes
```

Create `backend/config/database.php`:

```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "studentportal";
    private $username = "root";
    private $password = "";  // Your MySQL password
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
```

### 4. Database Setup

#### Create Database

Access phpMyAdmin or MySQL CLI:

```sql
CREATE DATABASE studentportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE studentportal;
```

#### Import Schema

```bash
# Using phpMyAdmin
# 1. Select 'studentportal' database
# 2. Click 'Import' tab
# 3. Choose 'database/schema.sql'
# 4. Click 'Go'

# Using MySQL CLI
mysql -u root -p studentportal < database/schema.sql
```

### 5. Configure Apache Virtual Host (Optional)

Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName studentportal.local
    DocumentRoot "C:/xampp/htdocs/studentportal"
    <Directory "C:/xampp/htdocs/studentportal">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Edit `C:\Windows\System32\drivers\etc\hosts` (as Administrator):

```
127.0.0.1 studentportal.local
```

Restart Apache.

## Running the Application

### 1. Start XAMPP Services

```bash
# Windows: Use XAMPP Control Panel
# Linux/Mac:
sudo /opt/lampp/lampp start
```

### 2. Start Frontend Development Server

```bash
cd C:\xampp\htdocs\studentportal
npm run dev
```

### 3. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost/studentportal/backend/api
- **phpMyAdmin**: http://localhost/phpmyadmin

## Development Workflow

### Frontend Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

1. Edit PHP files in `backend/` directory
2. Changes are immediately reflected (no restart needed)
3. Check Apache error logs for issues:
   - Windows: `C:\xampp\apache\logs\error.log`
   - Linux/Mac: `/opt/lampp/logs/error_log`

### Database Management

Use phpMyAdmin for:
- Creating/modifying tables
- Running SQL queries
- Importing/exporting data
- User management

## File Structure

```
C:\xampp\htdocs\studentportal\
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   ├── student/
│   │   ├── teacher/
│   │   └── admin/
│   ├── config/
│   │   └── database.php
│   ├── includes/
│   │   ├── functions.php
│   │   └── cors.php
│   └── index.php
├── database/
│   ├── schema.sql
│   └── sample_data.sql
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
├── .env
├── package.json
└── vite.config.js
```

## Common XAMPP Issues

### Issue 1: Port 80 Already in Use

**Error**: Apache won't start

**Solution**:
```bash
# Windows: Check what's using port 80
netstat -ano | findstr :80

# Stop IIS if running
net stop was /y

# Or change Apache port in httpd.conf
Listen 8080
```

### Issue 2: MySQL Won't Start

**Error**: MySQL service fails

**Solution**:
```bash
# Check port 3306
netstat -ano | findstr :3306

# Stop conflicting service
# Or change MySQL port in my.ini
port=3307
```

### Issue 3: Permission Denied

**Error**: Can't write to htdocs

**Solution**:
```bash
# Windows: Run XAMPP as Administrator
# Linux/Mac:
sudo chmod -R 755 /opt/lampp/htdocs/studentportal
sudo chown -R $USER:$USER /opt/lampp/htdocs/studentportal
```

### Issue 4: PHP Extensions Not Loading

**Error**: Call to undefined function mysqli_connect()

**Solution**:
1. Open `php.ini`
2. Uncomment extension line:
   ```ini
   extension=mysqli
   ```
3. Restart Apache

### Issue 5: Database Connection Failed

**Error**: SQLSTATE[HY000] [1045] Access denied

**Solution**:
```php
// Check credentials in database.php
private $username = "root";
private $password = "";  // Use your actual password

// Or reset MySQL root password
// In phpMyAdmin, run:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
```

## Performance Optimization

### 1. Enable OPcache

Edit `php.ini`:
```ini
[opcache]
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
```

### 2. Configure MySQL

Edit `my.ini` or `my.cnf`:
```ini
[mysqld]
innodb_buffer_pool_size=256M
max_connections=100
query_cache_size=32M
```

### 3. Enable Gzip Compression

Edit `.htaccess` in project root:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

## Testing

### Test Backend API

```bash
# Test database connection
curl http://localhost/studentportal/backend/api/test.php

# Test authentication
curl -X POST http://localhost/studentportal/backend/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"password123"}'
```

### Test Frontend

```bash
# Run development server
npm run dev

# Open browser to http://localhost:5173
# Test login with sample credentials
```

## Backup and Restore

### Backup Database

```bash
# Using mysqldump
mysqldump -u root -p studentportal > backup.sql

# Using phpMyAdmin
# 1. Select database
# 2. Click 'Export'
# 3. Choose format (SQL)
# 4. Click 'Go'
```

### Restore Database

```bash
# Using MySQL CLI
mysql -u root -p studentportal < backup.sql

# Using phpMyAdmin
# 1. Select database
# 2. Click 'Import'
# 3. Choose file
# 4. Click 'Go'
```

## Security Checklist

- [ ] Set MySQL root password
- [ ] Disable directory listing
- [ ] Enable HTTPS (for production)
- [ ] Validate all user inputs
- [ ] Use prepared statements
- [ ] Implement CSRF protection
- [ ] Set secure session cookies
- [ ] Regular backups
- [ ] Keep XAMPP updated

## Next Steps

1. Review [Backend Architecture](../architecture/BACKEND_ARCHITECTURE.md)
2. Set up [Database Schema](../database/SCHEMA.md)
3. Configure [API Endpoints](../api/API_OVERVIEW.md)
4. Start [Development Workflow](../DEVELOPMENT_WORKFLOW.md)

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025

# Docker Setup Guide

## Complete Docker Development Environment

This guide explains how to set up the Student Portal using Docker for a consistent development environment.

## Overview

The Docker setup includes:
- **Frontend**: React app with Vite (Port 5173)
- **Backend**: PHP with Apache (Port 8000)
- **Database**: MySQL 8.0 (Port 3306)
- **phpMyAdmin**: Database management UI (Port 8080)

## Prerequisites

### Install Docker

#### Windows
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and restart computer
3. Enable WSL 2 if prompted
4. Verify installation:
```bash
docker --version
docker-compose --version
```

#### macOS
1. Download Docker Desktop for Mac
2. Install and start Docker
3. Verify installation:
```bash
docker --version
docker-compose --version
```

#### Linux
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

## Docker Configuration Files

### 1. Create docker-compose.yml

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  # Frontend - React with Vite
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: studentportal_frontend
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000/api
      - CHOKIDAR_USEPOLLING=true
    depends_on:
      - backend
    networks:
      - studentportal_network
    command: npm run dev -- --host

  # Backend - PHP with Apache
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: studentportal_backend
    ports:
      - "8000:80"
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - database
    networks:
      - studentportal_network
    environment:
      - DB_HOST=database
      - DB_NAME=studentportal
      - DB_USER=root
      - DB_PASSWORD=root

  # Database - MySQL
  database:
    image: mysql:8.0
    container_name: studentportal_db
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: studentportal
      MYSQL_USER: student
      MYSQL_PASSWORD: student123
    volumes:
      - db_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - studentportal_network
    command: --default-authentication-plugin=mysql_native_password

  # phpMyAdmin - Database Management
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: studentportal_phpmyadmin
    ports:
      - "8080:80"
    environment:
      PMA_HOST: database
      PMA_PORT: 3306
      PMA_USER: root
      PMA_PASSWORD: root
    depends_on:
      - database
    networks:
      - studentportal_network

networks:
  studentportal_network:
    driver: bridge

volumes:
  db_data:
```

### 2. Create Dockerfile.frontend

Create `Dockerfile.frontend` in project root:

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]
```

### 3. Create Dockerfile.backend

Create `Dockerfile.backend` in project root:

```dockerfile
FROM php:8.2-apache

# Install PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy Apache configuration
COPY ./docker/apache.conf /etc/apache2/sites-available/000-default.conf

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
```

### 4. Create Apache Configuration

Create `docker/apache.conf`:

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

### 5. Create .dockerignore

Create `.dockerignore` in project root:

```
node_modules
npm-debug.log
dist
.git
.gitignore
.env
.DS_Store
*.md
docs
```

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd studentportal-main
```

### 2. Create Backend Directory

```bash
mkdir backend
```

### 3. Build and Start Containers

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Verify Services

Check if all containers are running:

```bash
docker-compose ps
```

Expected output:
```
NAME                        STATUS    PORTS
studentportal_frontend      Up        0.0.0.0:5173->5173/tcp
studentportal_backend       Up        0.0.0.0:8000->80/tcp
studentportal_db            Up        0.0.0.0:3306->3306/tcp
studentportal_phpmyadmin    Up        0.0.0.0:8080->80/tcp
```

### 5. Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080
  - Username: `root`
  - Password: `root`

## Docker Commands

### Basic Operations

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service_name]

# View running containers
docker-compose ps

# Stop and remove containers, networks, volumes
docker-compose down -v
```

### Container Management

```bash
# Execute command in container
docker-compose exec frontend sh
docker-compose exec backend bash
docker-compose exec database mysql -u root -p

# View container logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database

# Rebuild specific service
docker-compose build frontend
docker-compose up -d frontend
```

### Database Operations

```bash
# Access MySQL CLI
docker-compose exec database mysql -u root -proot studentportal

# Import SQL file
docker-compose exec -T database mysql -u root -proot studentportal < backup.sql

# Export database
docker-compose exec database mysqldump -u root -proot studentportal > backup.sql

# Reset database
docker-compose down -v
docker-compose up -d
```

### Development Workflow

```bash
# Install new npm package
docker-compose exec frontend npm install <package-name>

# Run npm scripts
docker-compose exec frontend npm run build
docker-compose exec frontend npm run lint

# Clear node_modules and reinstall
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install
```

## Integration with XAMPP

You can run Docker for the frontend while using XAMPP for backend:

### Option 1: Docker Frontend + XAMPP Backend

```yaml
# Modified docker-compose.yml (frontend only)
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: studentportal_frontend
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:80/studentportal/api
    command: npm run dev -- --host
```

**XAMPP Setup**:
1. Start Apache and MySQL in XAMPP
2. Place backend files in `C:\xampp\htdocs\studentportal`
3. Access at `http://localhost/studentportal`

### Option 2: Full Docker (Recommended)

Use complete Docker setup for consistency across team members.

## Troubleshooting

### Port Conflicts

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Change port in docker-compose.yml
ports:
  - "5174:5173"  # Use different host port
```

### Container Won't Start

**Error**: Container exits immediately

**Solution**:
```bash
# Check logs
docker-compose logs [service_name]

# Rebuild container
docker-compose build --no-cache [service_name]
docker-compose up -d [service_name]
```

### Database Connection Failed

**Error**: `Can't connect to MySQL server`

**Solution**:
```bash
# Wait for database to be ready
docker-compose exec database mysqladmin ping -h localhost -u root -proot

# Check database logs
docker-compose logs database

# Restart database
docker-compose restart database
```

### File Permission Issues

**Error**: `Permission denied`

**Solution**:
```bash
# Fix permissions (Linux/Mac)
sudo chown -R $USER:$USER .

# Windows: Run Docker Desktop as Administrator
```

### Hot Reload Not Working

**Error**: Changes not reflected

**Solution**:
```yaml
# Add to frontend service in docker-compose.yml
environment:
  - CHOKIDAR_USEPOLLING=true
```

## Performance Optimization

### 1. Use Volume Mounts Efficiently

```yaml
volumes:
  - .:/app
  - /app/node_modules  # Prevent node_modules sync
```

### 2. Limit Resource Usage

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

### 3. Use BuildKit

```bash
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker-compose build
```

## Production Deployment

For production, use separate configuration:

```bash
# Create docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

See [Deployment Guide](../DEPLOYMENT_GUIDE.md) for details.

## Next Steps

1. Set up database schema: [Database Schema](../database/SCHEMA.md)
2. Configure backend API: [Backend Architecture](../architecture/BACKEND_ARCHITECTURE.md)
3. Start development: [Development Workflow](../DEVELOPMENT_WORKFLOW.md)

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025

# Database

MySQL database schemas, migrations, and seed data for Student Portal.

## Quick Setup

### Using MySQL CLI

```bash
mysql -u root -p < schema.sql
```

### Using phpMyAdmin

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Click "Import" tab
3. Choose `schema.sql` file
4. Click "Go"

### Using Docker

```bash
docker-compose up -d
# Database is automatically created with schema
```

## Structure

```
database/
├── schema.sql          # Complete database schema (11 tables)
├── migrations/         # Database migrations
├── seeds/              # Sample/test data
└── README.md           # This file
```

## Tables

1. **users** - Core authentication (students, teachers, admins)
2. **students** - Student-specific information
3. **teachers** - Teacher-specific information
4. **admins** - Administrator information
5. **subjects** - Course/subject data
6. **marks** - Student grades and marks
7. **attendance** - Attendance records
8. **fees** - Fee structure
9. **payments** - Payment records
10. **semesters** - Semester configuration
11. **sessions** - Academic sessions/years

## Database Configuration

### For Backend (PHP)

Edit `backend/config/database.php`:

```php
private $host = "localhost";
private $db_name = "studentportal";
private $username = "root";
private $password = "";
```

### For Docker

Database credentials are in `docker-compose.yml`:

```yaml
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: studentportal
MYSQL_USER: student
MYSQL_PASSWORD: student123
```

## Migrations

Migrations are located in `migrations/` folder. Run them in order:

```bash
mysql -u root -p studentportal < migrations/001_create_users_table.sql
mysql -u root -p studentportal < migrations/002_create_students_table.sql
# ... etc
```

## Seed Data

Test data is in `seeds/` folder:

```bash
mysql -u root -p studentportal < seeds/test_data.sql
```

## Backup

```bash
# Backup database
mysqldump -u root -p studentportal > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u root -p studentportal < backup_20241114.sql
```

## Maintenance

```bash
# Optimize tables
mysql -u root -p -e "OPTIMIZE TABLE users, students, marks, attendance;" studentportal

# Check table integrity
mysql -u root -p -e "CHECK TABLE users, students, marks, attendance;" studentportal
```

## Documentation

See [Database Schema Documentation](../docs/database/SCHEMA.md) for complete details.

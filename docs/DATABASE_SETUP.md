# Database Setup Guide

## 1. MySQL Installation (if not installed)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql
```

## 2. Database Creation

```sql
# Login to MySQL
mysql -u root -p

# Create Database and User
CREATE DATABASE parcel_delivery;

CREATE USER 'parcel_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON parcel_delivery.* TO 'parcel_user'@'localhost';
FLUSH PRIVILEGES;

# Switch to the new database
USE parcel_delivery;

# Create Tables
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'driver', 'customer') NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    vehicle_number VARCHAR(50),
    license_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE parcels (
    id VARCHAR(50) PRIMARY KEY,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    status ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'delivered') NOT NULL,
    location VARCHAR(255),
    assigned_driver_id INT,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_driver_id) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_driver (assigned_driver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE driver_locations (
    driver_id INT PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(id),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# Create Default Admin User
INSERT INTO users (username, password, role, full_name) 
VALUES ('admin', '$2y$10$YourHashedPasswordHere', 'admin', 'System Admin');
```

## 3. Database Configuration

1. Create configuration file:
```bash
cp config.example.php config.php
```

2. Edit configuration:
```php
// config.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'parcel_delivery');
define('DB_USER', 'parcel_user');
define('DB_PASS', 'your_secure_password');
```

## 4. Database Backup Script

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/var/backups/parcel_delivery"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/parcel_delivery_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
mysqldump -u parcel_user -p parcel_delivery > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete
```

## 5. Database Maintenance

```sql
# Optimize Tables
OPTIMIZE TABLE users, parcels, driver_locations;

# Analyze Tables
ANALYZE TABLE users, parcels, driver_locations;

# Check and Repair Tables
CHECK TABLE users, parcels, driver_locations;
REPAIR TABLE users, parcels, driver_locations;
```

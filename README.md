# Parcel Delivery PWA

A Progressive Web Application for managing parcel deliveries with customer, driver, and admin roles.

## Features

### Customer Features
- Create delivery requests
- Track parcels
- View delivery history

### Driver Features
- View assigned deliveries
- Real-time location tracking
- Update delivery status
- Manage pickups and deliveries

### Admin Features
- Dashboard with delivery statistics
- Assign drivers to parcels
- Monitor all deliveries
- Manage users and drivers

## Server Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache web server
- Composer (PHP package manager)
- Node.js (for frontend development)

## Installation

### Backend Setup

1. Create MySQL database:
```sql
CREATE DATABASE parcel_delivery;
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON parcel_delivery.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

2. Install PHP dependencies:
```bash
cd /var/www/html/parcel-delivery
composer require firebase/php-jwt
```

3. Configure database:
```bash
# Edit config.php with your database credentials
cp config.example.php config.php
nano config.php
```

4. Set proper permissions:
```bash
sudo chown -R www-data:www-data /var/www/html/parcel-delivery
sudo chmod -R 755 /var/www/html/parcel-delivery
sudo chmod 640 /var/www/html/parcel-delivery/api/config.php
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Configure API endpoint:
```bash
# Edit src/config.js
const API_BASE_URL = 'https://your-domain.com/api';
```

3. Build frontend:
```bash
npm run build
```

4. Deploy frontend files:
```bash
cp -r dist/* /var/www/html/parcel-delivery/
```

## Apache Configuration

1. Enable required modules:
```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

2. Configure virtual host:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html/parcel-delivery
    
    <Directory /var/www/html/parcel-delivery>
        AllowOverride All
        Require all granted
        
        # Handle frontend routes
        FallbackResource /index.html
    </Directory>
    
    <Directory /var/www/html/parcel-delivery/api>
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ $1.php [L]
    </Directory>
</VirtualHost>
```

## Project Structure

```
parcel-delivery/
├── api/                    # Backend PHP files
│   ├── .htaccess          # Apache configuration
│   ├── config.php         # Database configuration
│   ├── auth.php           # Authentication endpoints
│   ├── parcels.php        # Parcel management
│   ├── driver.php         # Driver operations
│   ├── admin.php          # Admin operations
│   └── auth_middleware.php # JWT authentication
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── pages/            # Page components
│   └── App.jsx           # Main component
├── public/                # Static files
├── vendor/                # Composer dependencies
├── composer.json          # PHP dependencies
└── package.json           # Node.js dependencies
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "role": "customer" | "driver",
  "full_name": "string",
  "phone": "string",
  "vehicle_number": "string" (required for drivers),
  "license_number": "string" (required for drivers)
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "token": "jwt_token",
  "role": "customer" | "driver" | "admin"
}
```

### Parcels

#### Create Parcel
```http
POST /api/parcels
Authorization: Bearer <token>
Content-Type: application/json

{
  "sender": "string",
  "recipient": "string",
  "pickup_address": "string",
  "delivery_address": "string"
}
```

#### Get All Parcels
```http
GET /api/parcels
Authorization: Bearer <token>
```

#### Get Parcel by ID
```http
GET /api/parcels/{id}
Authorization: Bearer <token>
```

### Driver Operations

#### Get Assignments
```http
GET /api/driver/assignments
Authorization: Bearer <token>
```

#### Update Location
```http
POST /api/driver/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": "string",
  "longitude": "string"
}
```

#### Update Parcel Status
```http
PUT /api/driver/parcel/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "picked_up" | "in_transit" | "delivered",
  "location": "string"
}
```

### Admin Operations

#### Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

#### Get Drivers
```http
GET /api/admin/drivers
Authorization: Bearer <token>
```

#### Assign Driver
```http
POST /api/admin/assign-driver
Authorization: Bearer <token>
Content-Type: application/json

{
  "parcel_id": "string",
  "driver_id": "number"
}
```

## Development

### Backend Development
```bash
# Edit PHP files in api/
# Test API endpoints using Postman or similar tool
```

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Default Accounts

### Admin Account
- Username: admin
- Password: admin123

## Security Considerations

1. File Permissions:
   - config.php should be readable only by web server
   - Upload directories should have proper permissions

2. SSL/TLS:
```bash
sudo certbot --apache -d your-domain.com
```

3. Database Security:
   - Use prepared statements (implemented)
   - Minimal database user privileges
   - Regular backups

4. API Security:
   - JWT authentication (implemented)
   - Rate limiting
   - Input validation
   - CORS configuration

## Troubleshooting

1. Check Apache error logs:
```bash
sudo tail -f /var/log/apache2/error.log
```

2. Check PHP error logs:
```bash
sudo tail -f /var/log/php/error.log
```

3. Common Issues:
   - Permission denied: Check file ownership and permissions
   - 404 Not Found: Check .htaccess and Apache configuration
   - 500 Server Error: Check PHP error logs
   - CORS issues: Verify .htaccess configuration

## License

MIT

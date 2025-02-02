# LAMP Deployment Instructions

1. **Server Requirements**
   - Apache web server
   - PHP 7.4 or higher
   - MySQL 5.7 or higher
   - Composer (PHP package manager)

2. **Database Setup**
   ```sql
   CREATE DATABASE parcel_delivery;
   CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON parcel_delivery.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Installation Steps**

   a. Install PHP dependencies:
   ```bash
   composer require firebase/php-jwt
   ```

   b. Update configuration:
   - Edit `config.php` with your database credentials
   - Change JWT_SECRET to a secure key

   c. File structure on LAMP server:
   ```
   /var/www/html/parcel-delivery/
   ├── api/
   │   ├── .htaccess
   │   ├── config.php
   │   ├── auth.php
   │   ├── parcels.php
   │   ├── driver.php
   │   └── admin.php
   ├── vendor/
   └── dist/  # Frontend build files
   ```

4. **Frontend Deployment**

   a. Update API base URL in frontend code:
   ```javascript
   // src/config.js
   export const API_BASE_URL = 'https://your-domain.com/api';
   ```

   b. Build frontend:
   ```bash
   npm run build
   ```

   c. Copy build files:
   ```bash
   cp -r dist/* /var/www/html/parcel-delivery/
   ```

5. **Apache Configuration**

   a. Enable required modules:
   ```bash
   sudo a2enmod rewrite
   sudo a2enmod headers
   sudo systemctl restart apache2
   ```

   b. Configure virtual host:
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

6. **Security Setup**

   a. Set proper file permissions:
   ```bash
   sudo chown -R www-data:www-data /var/www/html/parcel-delivery
   sudo chmod -R 755 /var/www/html/parcel-delivery
   ```

   b. Secure configuration files:
   ```bash
   sudo chmod 640 /var/www/html/parcel-delivery/api/config.php
   ```

7. **SSL Setup**
   ```bash
   sudo certbot --apache -d your-domain.com
   ```

8. **Testing**
   - Test API endpoints: `https://your-domain.com/api/auth/login`
   - Test frontend: `https://your-domain.com`

9. **Maintenance**
   - Monitor Apache error logs: `/var/log/apache2/error.log`
   - Monitor PHP error logs: `/var/log/php/error.log`
   - Regular database backups
   - Keep PHP dependencies updated

Remember to:
- Replace placeholder credentials
- Set up proper SSL certificate
- Implement proper error logging
- Set up database backups
- Configure firewall rules

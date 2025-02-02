# Security Implementation Guide

## 1. Server Security

### Apache Configuration
```apache
# /etc/apache2/sites-available/parcel-delivery.conf

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/html/parcel-delivery

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem

    # Security Headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Content-Security-Policy "default-src 'self'"

    # PHP Configuration
    <FilesMatch \.php$>
        SetHandler application/x-httpd-php
    </FilesMatch>

    # Directory Security
    <Directory /var/www/html/parcel-delivery>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Protect Configuration Files
    <FilesMatch "^\.">
        Order allow,deny
        Deny from all
    </FilesMatch>

    # Protect Sensitive Files
    <FilesMatch "(config\.php|composer\.json|composer\.lock)$">
        Order allow,deny
        Deny from all
    </FilesMatch>
</VirtualHost>
```

### PHP Security Configuration
```ini
# php.ini security settings

# Disable dangerous functions
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_multi_exec,parse_ini_file,show_source

# Hide PHP version
expose_php = Off

# Session security
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = "Strict"
session.use_strict_mode = 1

# Error handling
display_errors = Off
log_errors = On
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
```

## 2. Authentication Security

### JWT Implementation
```php
// auth_middleware.php

function generateJWT($user) {
    $issuedAt = time();
    $expire = $issuedAt + (60 * 60 * 24); // 24 hours

    $payload = [
        'iat' => $issuedAt,
        'exp' => $expire,
        'id' => $user['id'],
        'role' => $user['role']
    ];

    return JWT::encode($payload, JWT_SECRET, 'HS256');
}

function verifyJWT($token) {
    try {
        $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
        
        // Check token expiration
        if ($decoded->exp < time()) {
            throw new Exception('Token expired');
        }
        
        return (array) $decoded;
    } catch (Exception $e) {
        throw new Exception('Invalid token');
    }
}
```

### Password Security
```php
// Password hashing
function hashPassword($password) {
    return password_hash($password, PASSWORD_ARGON2ID, [
        'memory_cost' => 65536,
        'time_cost' => 4,
        'threads' => 3
    ]);
}

// Password validation
function validatePassword($password) {
    if (strlen($password) < 12) {
        throw new Exception('Password too short');
    }
    
    if (!preg_match('/[A-Z]/', $password)) {
        throw new Exception('Password must contain uppercase letters');
    }
    
    if (!preg_match('/[a-z]/', $password)) {
        throw new Exception('Password must contain lowercase letters');
    }
    
    if (!preg_match('/[0-9]/', $password)) {
        throw new Exception('Password must contain numbers');
    }
    
    if (!preg_match('/[^A-Za-z0-9]/', $password)) {
        throw new Exception('Password must contain special characters');
    }
}
```

## 3. SQL Injection Prevention

### Database Wrapper
```php
// db_wrapper.php

class Database {
    private $conn;
    
    public function __construct() {
        $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $this->conn->set_charset("utf8mb4");
    }
    
    public function prepare($query) {
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception($this->conn->error);
        }
        return $stmt;
    }
    
    public function escape($string) {
        return $this->conn->real_escape_string($string);
    }
}
```

## 4. Rate Limiting

```php
// rate_limit.php

class RateLimit {
    private $redis;
    
    public function __construct() {
        $this->redis = new Redis();
        $this->redis->connect('127.0.0.1', 6379);
    }
    
    public function checkLimit($ip, $endpoint, $limit = 60, $window = 60) {
        $key = "rate:{$ip}:{$endpoint}";
        $current = $this->redis->incr($key);
        
        if ($current === 1) {
            $this->redis->expire($key, $window);
        }
        
        if ($current > $limit) {
            throw new Exception('Rate limit exceeded');
        }
        
        return true;
    }
}
```

## 5. File Upload Security

```php
// upload_security.php

function secureFileUpload($file, $allowedTypes = ['image/jpeg', 'image/png']) {
    // Check file size
    if ($file['size'] > 5000000) { // 5MB limit
        throw new Exception('File too large');
    }
    
    // Check MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception('Invalid file type');
    }
    
    // Generate secure filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFilename = bin2hex(random_bytes(16)) . '.' . $extension;
    
    return $newFilename;
}
```

## 6. Regular Security Maintenance

### Security Checklist Script
```bash
#!/bin/bash
# security_check.sh

# Check file permissions
find /var/www/html/parcel-delivery -type f -exec chmod 644 {} \;
find /var/www/html/parcel-delivery -type d -exec chmod 755 {} \;
chmod 640 /var/www/html/parcel-delivery/config.php

# Check SSL certificate expiration
certbot certificates

# Check for PHP security updates
apt list --upgradable | grep php

# Check Apache security modules
apache2ctl -M | grep security

# Check error logs for suspicious activity
tail -n 1000 /var/log/apache2/error.log | grep -i "attack\|hack\|sql injection"
```

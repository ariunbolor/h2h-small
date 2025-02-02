<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'parcel_delivery');

// JWT configuration
define('JWT_SECRET', 'your-secret-key');

// Connect to database
function getDBConnection() {
    // Enable mysqli error reporting
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    try {
        error_log("Attempting to connect to database at " . DB_HOST);
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        error_log("Database connection established");
        return $conn;
    } catch (mysqli_sql_exception $e) {
        error_log("Database connection failed: " . $e->getMessage());
        throw $e;
    }
}

// Initialize database tables
$sql = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    full_name VARCHAR(255),
    phone VARCHAR(50),
    vehicle_number VARCHAR(50),
    license_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parcels (
    id VARCHAR(50) PRIMARY KEY,
    sender VARCHAR(255),
    recipient VARCHAR(255),
    status VARCHAR(50),
    location VARCHAR(255),
    assigned_driver_id INT,
    pickup_address TEXT,
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_driver_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS driver_locations (
    driver_id INT PRIMARY KEY,
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(id)
);
";

$conn = getDBConnection();
$conn->multi_query($sql);
$conn->close();
?>

<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'api_errors.log');

// Log test access
error_log("Test endpoint accessed at " . date('Y-m-d H:i:s'));

// Set proper headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    error_log("Step 1: Starting test.php execution");
    
    // Include configuration file
    error_log("Step 2: Attempting to include config.php");
    if (!file_exists('config.php')) {
        throw new Exception("config.php not found in " . __DIR__);
    }
    require_once 'config.php';
    error_log("Step 3: Successfully included config.php");
    
    // Test database connection
    error_log("Step 4: Attempting database connection");
    try {
        $conn = getDBConnection();
        if (!$conn) {
            throw new Exception("Connection returned null");
        }
        error_log("Step 5: Database connection successful");
    } catch (mysqli_sql_exception $e) {
        throw new Exception("Database connection failed: " . $e->getMessage());
    }
    
    // Check tables
    $tables = array();
    $result = $conn->query("SHOW TABLES");
    
    if (!$result) {
        throw new Exception("Failed to query tables: " . $conn->error);
    }
    
    while ($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'API is working',
        'database' => 'connected',
        'tables' => $tables,
        'php_version' => PHP_VERSION,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    // Log the error details
    error_log("Error in test.php: " . $e->getMessage());
    error_log("File: " . $e->getFile() . " Line: " . $e->getLine());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    // Return detailed error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

// Close connection if exists
if (isset($conn)) {
    $conn->close();
}
?>

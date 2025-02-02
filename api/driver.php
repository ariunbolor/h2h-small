<?php
require_once 'config.php';
require_once 'auth_middleware.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();
$user = authenticateRequest();

// Check if user is a driver
if ($user['role'] !== 'driver') {
    http_response_code(403);
    echo json_encode(['error' => 'Driver access required']);
    exit;
}

$path = trim($_SERVER['PATH_INFO'] ?? '/', '/');

switch ($method) {
    case 'GET':
        if ($path === 'assignments') {
            $stmt = $conn->prepare("
                SELECT * FROM parcels 
                WHERE assigned_driver_id = ? 
                AND status != 'delivered'
            ");
            $stmt->bind_param("i", $user['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $parcels = [];
            while ($row = $result->fetch_assoc()) {
                $parcels[] = $row;
            }
            echo json_encode($parcels);
        }
        break;

    case 'POST':
        if ($path === 'location') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $conn->prepare("
                INSERT INTO driver_locations (driver_id, latitude, longitude) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                latitude = VALUES(latitude), 
                longitude = VALUES(longitude),
                last_updated = CURRENT_TIMESTAMP
            ");
            $stmt->bind_param("iss", 
                $user['id'],
                $data['latitude'],
                $data['longitude']
            );

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Failed to update location']);
            }
        }
        break;

    case 'PUT':
        if (strpos($path, 'parcel/') === 0) {
            $parcel_id = substr($path, 7);
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $conn->prepare("
                UPDATE parcels 
                SET status = ?, location = ? 
                WHERE id = ? AND assigned_driver_id = ?
            ");
            $stmt->bind_param("sssi", 
                $data['status'],
                $data['location'],
                $parcel_id,
                $user['id']
            );

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Failed to update parcel']);
            }
        }
        break;
}

$conn->close();
?>

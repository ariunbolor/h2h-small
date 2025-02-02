<?php
require_once 'config.php';
require_once 'auth_middleware.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();
$user = authenticateRequest();

// Check if user is admin
if ($user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Admin access required']);
    exit;
}

$path = trim($_SERVER['PATH_INFO'] ?? '/', '/');

switch ($method) {
    case 'GET':
        if ($path === 'stats') {
            $stats = [
                'total' => $conn->query("SELECT COUNT(*) as count FROM parcels")->fetch_assoc()['count'],
                'pending' => $conn->query("SELECT COUNT(*) as count FROM parcels WHERE status = 'pending'")->fetch_assoc()['count'],
                'delivered' => $conn->query("SELECT COUNT(*) as count FROM parcels WHERE status = 'delivered'")->fetch_assoc()['count']
            ];
            echo json_encode($stats);
        }
        elseif ($path === 'drivers') {
            $result = $conn->query("
                SELECT id, username, full_name, phone, vehicle_number 
                FROM users WHERE role = 'driver'
            ");
            
            $drivers = [];
            while ($row = $result->fetch_assoc()) {
                $drivers[] = $row;
            }
            echo json_encode($drivers);
        }
        break;

    case 'POST':
        if ($path === 'assign-driver') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $conn->prepare("
                UPDATE parcels 
                SET assigned_driver_id = ?, status = 'assigned' 
                WHERE id = ?
            ");
            $stmt->bind_param("is", 
                $data['driver_id'],
                $data['parcel_id']
            );

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Failed to assign driver']);
            }
        }
        break;
}

$conn->close();
?>

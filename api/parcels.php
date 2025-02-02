<?php
require_once 'config.php';
require_once 'auth_middleware.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();
$user = authenticateRequest();

switch ($method) {
    case 'GET':
        $path = trim($_SERVER['PATH_INFO'] ?? '/', '/');
        
        if ($path) {
            // Get single parcel
            $stmt = $conn->prepare("SELECT * FROM parcels WHERE id = ?");
            $stmt->bind_param("s", $path);
            $stmt->execute();
            $result = $stmt->get_result();
            $parcel = $result->fetch_assoc();
            
            if ($parcel) {
                echo json_encode($parcel);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Parcel not found']);
            }
        } else {
            // Get all parcels
            $result = $conn->query("SELECT * FROM parcels");
            $parcels = [];
            while ($row = $result->fetch_assoc()) {
                $parcels[] = $row;
            }
            echo json_encode($parcels);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = substr(str_shuffle(MD5(microtime())), 0, 10);
        
        $stmt = $conn->prepare("INSERT INTO parcels (id, sender, recipient, status, pickup_address, delivery_address) VALUES (?, ?, ?, 'pending', ?, ?)");
        $stmt->bind_param("sssss", 
            $id,
            $data['sender'],
            $data['recipient'],
            $data['pickup_address'],
            $data['delivery_address']
        );

        if ($stmt->execute()) {
            echo json_encode(['id' => $id]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Failed to create parcel']);
        }
        break;
}

$conn->close();
?>

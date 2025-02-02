<?php
require_once 'config.php';
require_once 'vendor/autoload.php'; // You'll need to install JWT via Composer
use \Firebase\JWT\JWT;

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $path = trim($_SERVER['PATH_INFO'] ?? '/', '/');

        if ($path === 'login') {
            $username = $data['username'];
            $password = $data['password'];

            $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();

            if ($user && password_verify($password, $user['password'])) {
                $token = JWT::encode([
                    'id' => $user['id'],
                    'role' => $user['role']
                ], JWT_SECRET, 'HS256');

                echo json_encode(['token' => $token, 'role' => $user['role']]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        } 
        elseif ($path === 'register') {
            $username = $data['username'];
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            $role = $data['role'];
            $full_name = $data['full_name'];
            $phone = $data['phone'];
            $vehicle_number = $data['vehicle_number'] ?? null;
            $license_number = $data['license_number'] ?? null;

            $stmt = $conn->prepare("INSERT INTO users (username, password, role, full_name, phone, vehicle_number, license_number) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssss", $username, $password, $role, $full_name, $phone, $vehicle_number, $license_number);

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Registration failed']);
            }
        }
        break;
}

$conn->close();
?>

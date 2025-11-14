<?php
/**
 * Login Endpoint
 * 
 * Handles user authentication and JWT token generation
 */

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->username) || empty($data->password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'validation_error',
        'message' => 'Username and password are required'
    ]);
    exit();
}

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'server_error',
        'message' => 'Database connection failed'
    ]);
    exit();
}

// Query user
$query = "SELECT id, username, password, email, role, status FROM users WHERE username = :username LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':username', $data->username);
$stmt->execute();

$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'invalid_credentials',
        'message' => 'Invalid username or password'
    ]);
    exit();
}

// Verify password
if (!password_verify($data->password, $user['password'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'invalid_credentials',
        'message' => 'Invalid username or password'
    ]);
    exit();
}

// Check if user is active
if ($user['status'] !== 'active') {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'account_inactive',
        'message' => 'Your account is inactive. Please contact administrator.'
    ]);
    exit();
}

// Generate JWT token
$token_payload = [
    'user_id' => $user['id'],
    'username' => $user['username'],
    'role' => $user['role']
];

$token = generateJWT($token_payload);

// Update last login
$update_query = "UPDATE users SET last_login = NOW() WHERE id = :id";
$update_stmt = $db->prepare($update_query);
$update_stmt->bindParam(':id', $user['id']);
$update_stmt->execute();

// Remove password from response
unset($user['password']);

// Send response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'data' => [
        'user' => $user,
        'token' => $token
    ]
]);
?>

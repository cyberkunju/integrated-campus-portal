<?php
/**
 * Verify Token Endpoint
 * 
 * Verifies JWT token and returns user information
 */

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/auth.php';

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Verify authentication
$user = verifyAuth();

if (!$user) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'unauthorized',
        'message' => 'Invalid or expired token'
    ]);
    exit();
}

// Send response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Token is valid',
    'data' => [
        'user' => $user
    ]
]);
?>

<?php
/**
 * Logout Endpoint
 * 
 * Handles user logout (JWT is stateless, so this is mainly for logging)
 */

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/auth.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
        'message' => 'Not authenticated'
    ]);
    exit();
}

// Log logout (optional - add to database if needed)
// For JWT, client just needs to delete the token

// Send response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
?>

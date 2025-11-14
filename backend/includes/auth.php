<?php
/**
 * Authentication Helper Functions
 */

require_once __DIR__ . '/../config/jwt.php';

/**
 * Get JWT token from Authorization header
 * 
 * @return string|null Token or null if not found
 */
function getBearerToken() {
    $headers = getallheaders();
    
    if (isset($headers['Authorization'])) {
        $matches = [];
        if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    
    return null;
}

/**
 * Verify user authentication
 * 
 * @return array|false User data or false if not authenticated
 */
function verifyAuth() {
    $token = getBearerToken();
    
    if (!$token) {
        return false;
    }
    
    $payload = verifyJWT($token);
    
    if (!$payload) {
        return false;
    }
    
    return $payload;
}

/**
 * Check if user has required role
 * 
 * @param string $required_role Required role (student, teacher, admin)
 * @return bool True if user has role, false otherwise
 */
function checkRole($required_role) {
    $user = verifyAuth();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized', 'message' => 'Please login to continue']);
        exit();
    }
    
    if ($user['role'] !== $required_role) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden', 'message' => 'You do not have permission to access this resource']);
        exit();
    }
    
    return true;
}

/**
 * Send JSON response
 * 
 * @param array $data Response data
 * @param int $status_code HTTP status code
 */
function sendResponse($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data);
    exit();
}

/**
 * Send error response
 * 
 * @param string $message Error message
 * @param int $status_code HTTP status code
 */
function sendError($message, $status_code = 400) {
    http_response_code($status_code);
    echo json_encode([
        'success' => false,
        'error' => true,
        'message' => $message
    ]);
    exit();
}
?>

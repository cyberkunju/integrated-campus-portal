<?php
/**
 * Backend API Entry Point
 * 
 * This file serves as the main entry point for the PHP backend API
 */

require_once __DIR__ . '/includes/cors.php';

// API Information
$api_info = [
    'name' => 'Student Portal API',
    'version' => '1.0.0',
    'status' => 'active',
    'endpoints' => [
        'auth' => '/api/auth/',
        'student' => '/api/student/',
        'teacher' => '/api/teacher/',
        'admin' => '/api/admin/'
    ],
    'documentation' => '/docs',
    'message' => 'API is running. Please use specific endpoints.'
];

http_response_code(200);
echo json_encode($api_info, JSON_PRETTY_PRINT);
?>

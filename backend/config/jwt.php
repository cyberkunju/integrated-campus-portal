<?php
/**
 * JWT Configuration
 * 
 * Configuration for JSON Web Token authentication
 */

// JWT Secret Key - CHANGE THIS IN PRODUCTION
define('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production');

// JWT Algorithm
define('JWT_ALGORITHM', 'HS256');

// JWT Expiration time (in seconds)
define('JWT_EXPIRY', 86400); // 24 hours

// JWT Issuer
define('JWT_ISSUER', 'studentportal');

/**
 * Generate JWT Token
 * 
 * @param array $payload Data to encode in token
 * @return string JWT token
 */
function generateJWT($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => JWT_ALGORITHM]);
    
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $payload['iss'] = JWT_ISSUER;
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET_KEY, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

/**
 * Verify and decode JWT Token
 * 
 * @param string $token JWT token to verify
 * @return array|false Decoded payload or false on failure
 */
function verifyJWT($token) {
    $tokenParts = explode('.', $token);
    
    if (count($tokenParts) !== 3) {
        return false;
    }
    
    $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
    $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
    $signatureProvided = $tokenParts[2];
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET_KEY, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    if ($base64UrlSignature !== $signatureProvided) {
        return false;
    }
    
    $payloadData = json_decode($payload, true);
    
    // Check expiration
    if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
        return false;
    }
    
    return $payloadData;
}
?>

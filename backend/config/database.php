<?php
/**
 * Database Configuration
 * 
 * Handles MySQL database connection using PDO
 */

class Database {
    // Database credentials
    private $host = "localhost";
    private $db_name = "studentportal";
    private $username = "root";
    private $password = "";
    private $charset = "utf8mb4";
    
    public $conn;

    /**
     * Get database connection
     * 
     * @return PDO|null Database connection or null on failure
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            return null;
        }

        return $this->conn;
    }

    /**
     * Close database connection
     */
    public function closeConnection() {
        $this->conn = null;
    }
}
?>

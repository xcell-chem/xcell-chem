<?php

// log_visit.php
// Add your comments here.

<?php
// log_visit.php
$host = 'localhost';
$user = 'shinyfla_user';
$password = 'Smile_247!';
$db = 'shinyflakedb'; // Your database name

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => true, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the user's IP address
$user_ip = $_SERVER['REMOTE_ADDR'];

// Get the current time
$visit_time = date('Y-m-d H:i:s');

// Get the referral code from the URL parameter, if present
$refcode = isset($_GET['referral']) ? $_GET['referral'] : 'N/A';

// Generate a unique affiliate ID
$affiliateID = $affiliateID = bin2hex(random_bytes(16));

// Prepare and bind the statement
$sql = "INSERT INTO visit_logs (id, ip_address, visit_time, referral_code) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $affiliateID, $user_ip, $visit_time, $refcode);

// Execute the statement
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Visit logged successfully!']);
} else {
    echo json_encode(['error' => true, 'message' => 'Error: ' . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();
?>

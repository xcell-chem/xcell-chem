<?php

// submit_affiliate.php
// Add your comments here.

<?php
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

// Get the email and parent_id from the POST request
$email = $_POST['email'];
$parent_id = $_POST['parent_id'];

// Check if email already exists
$sql = "SELECT * FROM affiliates WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Email already exists
    $existingAffiliate = $result->fetch_assoc();
    $affiliateID = $existingAffiliate['affiliate_id'];
    $affiliateLink = "http://shinyflake.co.uk/?ID=" . $affiliateID;
    echo json_encode(['error' => true, 'message' => 'Email already exists. Your affiliate link is: ' . $affiliateLink]);
} else {
    // Insert new affiliate
    $affiliateID = uniqid(); // Generate a unique affiliate ID
    $sql = "INSERT INTO affiliates (email, affiliate_id, parent_id) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $email, $affiliateID, $parent_id);

    if ($stmt->execute()) {
        $affiliateLink = "http://shinyflake.co.uk/?ID=" . $affiliateID;
        echo json_encode(['error' => false, 'affiliateID' => $affiliateID, 'affiliateLink' => $affiliateLink]);
    } else {
        echo json_encode(['error' => true, 'message' => 'Failed to register affiliate.']);
    }
}

$stmt->close();
$conn->close();
?>

<?php

// insert_sales.php
// Add your comments here.

<?php
// Database connection details
$host = 'localhost';
$db = 'shinyflakedb'; // Your database name
$username = 'shinyfla_user';
$password = 'Smile_247!';

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$db", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the JSON input sent from the client
    $input = json_decode(file_get_contents('php://input'), true);

    // Prepare the SQL statement to insert the sale data into the database
    $stmt = $pdo->prepare("INSERT INTO Sales (sales_ID, basket, total, referral) VALUES (?, ?, ?, ?)");
    
    // Execute the SQL statement
    $stmt->execute([
        $input['sales_ID'],    // Unique sales ID
        $input['basket'],      // Cart data (items, variants, quantities, etc.)
        $input['total'],       // Total amount of the sale
        $input['referral']     // Referral code (if any)
    ]);
    
    // Return a success response
    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    // Return an error response
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

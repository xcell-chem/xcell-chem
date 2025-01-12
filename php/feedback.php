<?php

// feedback.php
// Add your comments here.

<?php
// Database connection details
$host = 'localhost';
$db = 'shinyflakedb'; // Your database name
$user = 'shinyfla_user'; // Your database user
$password = 'Smile_247!'; // Your database password

// Create a new PDO instance
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Sanitize and retrieve form inputs
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $message = htmlspecialchars($_POST['message']);

        // Basic validation: ensure email is valid and message is not empty
        if (!empty($message) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Prepare the SQL statement to insert data
            $stmt = $pdo->prepare("INSERT INTO feedback (email, message) VALUES (:email, :message)");
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':message', $message);

            // Execute the statement and check if the insertion was successful
            if ($stmt->execute()) {
                echo "<script>alert('Thank you for your feedback!'); window.location.href = 'feedback.html';</script>";
            } else {
                echo "<script>alert('Failed to send feedback. Please try again later.'); window.location.href = 'feedback.html';</script>";
            }
        } else {
            echo "<script>alert('Please provide a valid email and message.'); window.location.href = 'feedback.html';</script>";
        }
    } else {
        echo "<script>alert('Invalid request.'); window.location.href = 'feedback.html';</script>";
    }
} catch (PDOException $e) {
    // Handle connection error
    echo "Database connection failed: " . $e->getMessage();
}
?>

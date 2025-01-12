<?php

// save_css.php
// Add your comments here.

<?php
// Check if CSS content is received via POST
if (isset($_POST['cssContent'])) {
    // Get the CSS content from the POST request
    $cssContent = $_POST['cssContent'];

    // Path to save the CSS file (ensure this is writeable by the server)
    $cssFilePath = 'main.css';

    // Attempt to write the CSS content to the file
    if (file_put_contents($cssFilePath, $cssContent)) {
        echo 'CSS file saved successfully!';
    } else {
        echo 'Error saving the CSS file.';
    }
} else {
    echo 'No CSS content received.';
}
?>

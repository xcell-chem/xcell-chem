// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello from the API!');
});

// Example API route (POST request)
app.post('/update-listing', (req, res) => {
    const { title, description, price } = req.body;

    // Simulate saving the data to a database or server file
    if (!title || !description || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Normally, you'd save this data to your database or filesystem
    console.log(`Received data: ${title}, ${description}, ${price}`);

    // Respond with success
    res.status(200).json({ message: 'Listing updated successfully!' });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

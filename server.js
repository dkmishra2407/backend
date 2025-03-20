const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const dbconfig = require('./dbconfig/dbconfig');
const routes = require('./routes/UserRoutes');



dbconfig;

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enable CORS properly
app.use(express.json()); // Parse JSON requests
app.use('/', routes); // Register routes

app.get('/', (req, res) => {
    console.log("Enter to Devansh's Crud App");
    res.send("Welcome to Devansh's CRUD App");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000"); // Fixed incorrect port message
});


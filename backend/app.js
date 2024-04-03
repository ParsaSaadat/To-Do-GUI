// Import necessary modules
import express from "express";
import "dotenv/config.js"; // Load environment variables

import API from './routes/API/tasks.js';

// Create an Express app
const app = express();

// access control allow origin 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
})
// Parse URL-encoded and JSON request bodies
app.use(express.json());

// Set up routes
app.use(API)

// Define the port to listen on
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.clear();
  console.log(`Server is running at: http://localhost:${PORT}`);
});

// Import the necessary modules
import express from "express";
import API from "../../controllers/API/tasksApiControllers.js";
// Create an Express Router
const Router = express.Router();

// Define a DELETE route for deleting a task
Router.get("/tasks/", API.getAllTasks);
Router.get("/tasks/:id", API.getTask)
Router.post("/tasks/" , API.postTask)
Router.delete("/tasks/:id", API.deleteTask)
Router.put("/tasks/:id", API.putTask)
// Export the router
export default Router;

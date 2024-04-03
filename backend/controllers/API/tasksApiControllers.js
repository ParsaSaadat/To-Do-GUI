import DB from "../../models/script/db.js";

// Api  class for application
export default class API {
  static getAllTasks(req, res) {
    let limit = 4,
      page = 1,
      search = '',
      finished = undefined;
    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.search) {
      search = req.query.search;
    }
    if (req.query.finished === "true" || req.query.finished === "false") {
      finished = req.query.finished === "true" ? true : false;
    }
    try {
      let data = DB.getAll();
      data = data.filter((item) => item.title.includes(search));
      if (finished !== undefined) {
        data = data.filter((item) => item.completed === finished);
      }
      const totalTasks = data.length;
      const start = (page - 1) * limit;
      data = data.slice(start, start + limit);

      res.json({
        data,
        totalTasks,
        success: true,
        status: 200,
        message: "Get all tasks successfully",
      });
    } catch (e) {
      res.status(500).send("Server Error : " + e.message);
    }
  }
  static getTask(req, res) {
    const id = parseInt(req.params.id);
    if (id) {
      try {
        const task = DB.getById(id);
        if (task) {
          res.status(200).json({
            data: task,
            success: true,
            status: 200,
            message: "Get task successfully",
          });
        } else {
          res.status(404).json({
            data: null,
            success: false,
            status: 404,
            message: "Task not found",
          }); // Task not found
        }
      } catch (e) {
        res.status(500).json({
          data: null,
          success: false,
          status: 500,
          message: "Server Error : " + e.message,
        }); // Server error
      }
    }
  }

  static deleteTask(req, res) {
    const id = parseInt(req.params.id);
    // Check if an ID is provided
    if (id) {
      try {
        // Get the task by ID
        const task = DB.getById(id);

        // If the task exists, delete it
        if (task) {
          DB.delete(id);
          res.status(200).json({
            data: null,
            success: true,
            status: 200,
            message: "Delete task successfully",
          }); // Success response
        } else {
          res.status(404).json({
            data: null,
            success: false,
            status: 404,
            message: "Task not found",
          }); // Task not found
        }
      } catch (e) {
        res.status(400).json({
          data: null,
          success: false,
          status: 400,
          message: "Bad request",
        }); // Bad request
      }
    } else {
      res.status(500).json({
        data: null,
        success: false,
        status: 500,
        message: "Server Error : " + e.message,
      }); // Server Error
    }
  }

  static putTask(req, res) {
    const id = parseInt(req.params.id);
    const title = req.body.title;
    const completed = req.body.completed;
    // Check if both title and ID are provided
    if (title && id) {
      if (title.length < 3) {
        return res.status(400).json({
          data: null,
          success: false,
          status: 400,
          message: "Please provide valid data for the title",
        });
      }
      const taskCheck = DB.getByTitle(title);
      if (taskCheck && taskCheck.id != id) {
        return res.status(409).json({
          data: null,
          success: false,
          status: 409,
          message: "Task already exists",
        });
      }
      try {
        // Get the task by ID
        const task = DB.getById(id);
        // If the task exists, update its title
        if (task) {
          DB.edit(id, title, completed);
          res.status(200).json({
            data: null,
            success: true,
            status: 200,
            message: "Update task successfully",
          }); // Success response
        } else {
          res.status(404).json({
            data: null,
            success: false,
            status: 404,
            message: "Task not found",
          }); // Task not found
        }
      } catch (e) {
        res.status(500).json({
          data: null,
          success: false,
          status: 500,
          message: "Server Error : " + e.message,
        }); // Handle other errors
      }
    } else {
      res.status(400).json({
        data: null,
        success: false,
        status: 400,
        message: "Bad request",
      }); // Bad request
    }
  }

  static postTask(req, res) {
    const title = req.body.title;
    const completed = req.body.completed;
    if (title || title.length < 3) {
      if (DB.getByTitle(title)) {
        return res.status(409).json({
          data: null,
          success: false,
          status: 409,
          message: "Task already exists",
        });
      }
      try {
        // Create a new task in the database
        const { data } = DB.create(title, completed);
        res.status(201).json({
          data: data,
          success: true,
          status: 200,
          message: "Create task successfully",
        });
      } catch (e) {
        // Handle errors by rendering an error page
        res.status(500).json({
          data: null,
          success: false,
          status: 500,
          message: "Server Error : " + e.message,
        });
      }
    } else {
      res.status(400).json({
        data: null,
        success: false,
        status: 400,
        message: "Bad request",
      });
    }
  }
}

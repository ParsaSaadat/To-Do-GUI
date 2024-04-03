// Import necessary modules
import fs from "fs";
import getDate from "./date.js";

// A utility class for managing a simple database

export default class DB {
  // Check if the database file exists
  static existsDB() {
    if (fs.existsSync(process.env.DB)) {
      return true;
    } else {
      DB.createDB();
      return false;
    }
  }

  // Create the database file if it doesn't exist
  static createDB() {
    if (!DB.existsDB()) {
      throw new Error("You do not have a database; I created one for you");
    } else {
      try {
        fs.createWriteStream(process.env.DB);
        return { ok: true, message: "Database created" };
      } catch (e) {
        throw new Error("I cannot create the database");
      }
    }
  }

  // Write data to the database
  static write(data) {
    try {
      fs.writeFileSync(process.env.DB, JSON.stringify(data, null, "    "));
    } catch (e) {
      throw new Error("An error occurred while writing to the database");
    }
  }

  // Read data from the database
  static read() {
    try {
      if (DB.existsDB()) {
        return JSON.parse(fs.readFileSync(process.env.DB, "utf-8"));
      }
    } catch (e) {
      DB.write([]);
      throw new Error(
        "I cannot read the database or the data is not in JSON format; please try again"
      );
    }
  }

  // Get a task by its title
  static getByTitle(title) {
    if (!title || typeof title !== "string") {
      throw new Error("Title must be a string");
    }
    if (DB.existsDB()) {
      const data = DB.read();
      if (data.length > 0) {
        const finder = data.find((item) => item.title === title);
        return finder ? finder : false;
      }
    } else {
      DB.createDB();
      throw new Error("You do not have a database");
    }
  }

  // Get a task by its ID
  static getById(id) {
    if (!id || typeof Number(id) !== "number") {
      throw new Error("Please provide a valid ID (a number)");
    }
    if (DB.existsDB()) {
      const data = DB.read();
      if (data.length > 0) {
        const finder = data.find((item) => item.id === id);
        return finder ? finder : false;
      }
    } else {
      DB.createDB();
      return false;
    }
  }
  // Get all tsks metthod
  static getAll() {
    if (DB.existsDB()) {
      const data = DB.read();
      return data;
    } else {
      DB.createDB();
      throw new Error("You do not have a database");
    }
  }
  // Create a new task
  static create(title, completed = false) {
    // Validate the title
    if (!title || typeof title !== "string" || title.length < 3) {
      throw new Error("Please provide a title with at least 3 characters");
    }

    // Check if the database exists
    if (!DB.existsDB()) {
      throw new Error("You do not have a database; please try again");
    }

    // Check if a task with the same title already exists
    if (DB.getByTitle(title)) {
      throw new Error(
        "Please provide a new title; a task with this title already exists"
      );
    }

    // Read existing data from the database
    let data = DB.read();

    // Generate a unique ID for the new task
    let id;
    if (data.length === 0) {
      id = 1;
    } else {
      id = data[data.length - 1].id + 1;
    }

    // Create the new task object
    let task = {
      id: id,
      title: title,
      completed: JSON.parse(completed),
      date: {
        month: getDate.getMonth(),
        year: getDate.getYear(),
        day: {
          day: getDate.getDay(),
          hour: getDate.getHour(),
          min: getDate.getMin(),
        },
      },
    };

    // Add the new task to the data array
    data.push(task);

    // Write updated data back to the database
    DB.write(data);

    return { ok: true, message: "Task created", data: task };
  }

  // Edit an existing task
  static edit(id, title, completed) {
    // Validate the provided ID \\
    if (!id) {
      throw new Error("Please provide an ID for the task");
    }

    // Validate the provided title
    if (title && title.length < 3) {
      throw new Error("Please provide valid data for the title");
    }

    // Check if the database exists
    if (!DB.existsDB()) {
      throw new Error("You do not have a database");
    }

    // Check if a task with the given ID exists
    if (!DB.getById(Number(id))) {
      throw new Error("Please provide valid data for the task");
    }

    // Read existing data from the database
    let data = DB.read();

    // Find the task with the specified ID
    const task = data.find((item) => item.id === Number(id));

    // Update task properties
    if (title) {
      // Check if the new title is unique
      const check = DB.getByTitle(title);
      if (check && check.title !== title) {
        throw new Error(
          "Please provide a new title; a task with this title already exists"
        );
      }
    }
    if (completed === true) {
      task.completed = true;
    } else if (completed === false) {
      task.completed = false;
    }
    task.title = title ? title : task.title;
    task.date.month = getDate.getMonth();
    task.date.year = getDate.getYear();
    task.date.day.day = getDate.getDay();
    task.date.day.hour = getDate.getHour();
    task.date.day.min = getDate.getMin();

    // Write updated data back to the database
    DB.write(data);
  }

  // Delete a task by its ID
  static delete(id) {
    // Validate the provided ID
    if (!id) {
      throw new Error("Please provide an ID for the task");
    }

    // Check if the database exists
    else if (!DB.existsDB()) {
      throw new Error("You do not have a database");
    }

    // Check if a task with the given ID exists
    else if (!DB.getById(id)) {
      throw new Error("Please provide valid data for the task");
    }

    // Read existing data from the database
    let data = DB.read();

    // Find the index of the task with the specified ID
    const index = data.findIndex((item) => item.id === id);

    if (index !== -1) {
      // Remove the task from the data array
      data.splice(index, 1);
      DB.write(data);
      return { ok: true, message: "Task deleted" };
    } else {
      throw new Error("Task not found");
    }
  }
}

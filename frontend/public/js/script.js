// Get references to the list and the edit input div
const list = document.querySelector("#list");
const task404 = document.querySelector("#task404");
const form = document.querySelector(".form");
const addBtn = document.querySelector(".btn-add");
const titleINT = document.querySelector(".title-input");
const completedBox = document.querySelector(".checkCompleted");
const completedStatus = document.querySelector("#CommpletedStatus");
const inProgressStatus = document.querySelector("#inProgressStatus");
const allStatus = document.querySelector("#allStatus");
const pageLabel = document.querySelector("#pageLabel");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const pageControllers = document.querySelector("#pageControllers");

let totalTask,
  totalPage,
  currentPage = 1,
  limit = 3,
  search = "",
  finished = undefined;
// Function to get the current month name
function getMonth() {
  let date = new Date();
  let monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  monthName = monthName[date.getMonth()];
  return monthName; // Returns the month name
}

// Function to get the current day of the week
function getDay() {
  let date = new Date();

  let weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  weekday = weekday[date.getDay()];
  return weekday; // Returns the day of the week
}

// Function to add a new task
async function add() {
  const title = titleINT.value; // Get the task title from an input field
  const completed = completedBox.checked; // Get the completion status from a checkbox
  if (title.length < 3) {
    alert("Please provide a title with at least 3 characters"); // Display an alert if the title is too short
    return;
  }

  try {
    const res = await axios.post("http://localhost:3000/tasks", {
      title,
      completed,
    }); // Send a POST request to the server
    if (res.data.success == true) {
      task404.style.display = "none";
      list.style.display = "block";
      const date = new Date();
      let str = `
      <li class="tasks" data-id="${res.data.data.id}">
        <h3>${title}</h3> <!-- Task title -->
        <span class="badge">${
          completed ? "Completed" : "In Progress"
        }</span> <!-- Task status --> 
        <p>${date.getFullYear()}/${getMonth()}/${getDay()}</p> <!-- Task date -->
        <button class="btn-toggle">Toggle</button> <!-- Toggle button -->
        <button class="btn-edit">Edit</button> <!-- Edit button -->
        <button class="btn-delete">Delete</button> <!-- Delete button -->
      </li>`;
      list.innerHTML += str; // Append the new task to the list
    } else {
      alert(res.data.message);
    }
  } catch (e) {
    alert(e.response.data.message); // Display an error message if the request fails
  }
}
// Event listener for the "Add" button
addBtn.addEventListener("click", add);

titleINT.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    add();
  }
});

// Event listener for clicks within the list
list.addEventListener("click", async (event) => {
  const target = event.target;
  const id = parseInt(target.parentElement.dataset.id);

  // Handle button clicks based on their class
  if (target.classList.contains("btn-toggle")) {
    const title = target.parentElement.querySelector("h3").textContent;
    try {
      // Send a PUT request to toggle the item's completion status
      let completed = null;
      let str = "";
      const resTask = await axios.get(`http://localhost:3000/tasks/${id}`);
      const badge = target.parentElement.querySelector(".badge");
      if (resTask.data.success === true) {
        if (resTask.data.data.completed === false) {
          completed = true;
          str = "Completed";
        } else {
          completed = false;
          str = "In Progress";
        }
      }
      const res = await axios.put(`http://localhost:3000/tasks/${id}`, {
        title,
        completed,
      });
      if (res.data.success === true) {
        badge.innerHTML = str;
      }
    } catch (e) {
      alert(e.response.data.message);
    }
  } else if (target.classList.contains("btn-delete")) {
    if (confirm("Are you sure?")) {
      try {
        // Send a DELETE request to remove the item
        const res = await axios.delete(`http://localhost:3000/tasks/${id}`);
        if (res.data.success === true) {
          target.parentElement.remove();
        }
        if (list.textContent < 1) {
          list.style.display = "none";
          task404.style.display = "block";
        }
      } catch (e) {
        alert(e.response.data.message);
      }
    }
  } else if (target.classList.contains("btn-edit")) {
    // Get the current title and prompt the user for a new title
    const title = target.parentElement.querySelector("h3").textContent;
    const answer = prompt("Enter a title", title);

    if (answer && answer.length > 3) {
      try {
        // Send a PUT request to edit the item's title
        const res = await axios.put(`http://localhost:3000/tasks/${id}`, {
          title: answer,
        });
        if (res.data.success === true) {
          const titleElement = target.parentElement.querySelector("h3");
          titleElement.innerHTML = answer;
        }
      } catch (e) {
        alert(e.response.data.message);
      }
    } else {
      alert("Please enter a valid title (at least 3 characters)");
    }
  }
});

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadedTasks();
});

nextButton.addEventListener("click", () => {
  currentPage++;
  loadedTasks()
})

prevButton.addEventListener("click", () => {
  currentPage--;
  loadedTasks()
})

allStatus.addEventListener("click", () => {
  currentPage = 1;
  finished = undefined;
  loadedTasks()
})

completedStatus.addEventListener("click", () => {
  currentPage = 1
  finished = true
  loadedTasks()
})

inProgressStatus.addEventListener("click", () => {
  currentPage = 1
  finished = false
  loadedTasks()
})
async function loadedTasks() {
  try {
    // Send a GET request to retrieve all tasks from the server
    const { data } = await axios.get(
      `http://localhost:3000/tasks/?limit=${limit}&page=${currentPage}&finished=${finished}&search=${search}`
    );

    if (data.data.length) {
      // If there are tasks, display the list
      list.style.display = "block";
      let str = "";

      // Iterate through each task and create an <li> element
      for (let item of data.data) {
        str += `
        <li class="tasks" data-id="${item.id}">
          <h3>${item.title}</h3> <!-- Task title -->
          <span class="badge">${
            item.completed ? "Completed" : "In Progress"
          }</span> <!-- Task status --> 
          <p>${item.date.year}/${item.date.month}/${
          item.date.day.day
        }</p> <!-- Task date -->
          <button class="btn-toggle">Toggle</button> <!-- Toggle button -->
          <button class="btn-edit">Edit</button> <!-- Edit button -->
          <button class="btn-delete">Delete</button> <!-- Delete button -->
        </li>`;
      }

      // Update the list content with the generated <li> elements
      list.innerHTML = str;
    } else {
      // If no tasks are available, display a message
      task404.style.display = "block";
    }

    totalTask = data.totalTasks;
    if (totalTask > limit) {
      pageControllers.style.display = "flex";
      totalPage = Math.ceil(totalTask / limit);
      prevButton.disabled = nextButton.disabled = false
      if(currentPage === 1){
        prevButton.disabled = true
      }else if(currentPage === totalPage){
        nextButton.disabled = true
      }

      pageLabel.innerHTML = `page ${currentPage} of ${totalPage}`
    } else {
      pageControllers.style.display = 'none'
      totalPage = 1;
    }
  } catch (e) {
    // Display an error message if the request fails
    alert(e.response.data.message);
  }
}

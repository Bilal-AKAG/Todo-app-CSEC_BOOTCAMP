const customSelect = document.querySelector(".custom-select");
const selectButton = document.querySelector(".select-button");
const Span = document.querySelector(".btn-s");
const ul = document.querySelector(".options");
const options = document.querySelectorAll(".option");
const image_arrow = document.querySelector(".img-arrow");
const plus_btn = document.querySelector(".plus-btn");
const popel = document.querySelector(".pop-element");
const pop_wrapper = document.querySelector(".pop-wrapper");
const cancel = document.querySelector(".btn-white");
const searchInput = document.querySelector('input[type="search"]'); 
const toggle = ["images/arrowdown.svg", "images/arrowup.svg"];
let length = toggle.length;
let pointer = 1;

selectButton.addEventListener("click", () => {
  ul.classList.toggle("open");
  if (pointer > length - 1 || pointer < 0) {
    pointer = 0;
  }
  image_arrow.src = toggle[pointer];
  pointer += 1;
});

options.forEach((option) => {
  option.addEventListener("click", (event) => {
    Span.textContent = event.target.textContent;
    ul.classList.remove("open");
    image_arrow.src = "images/arrowdown.svg";
    pointer -= 1;
    updateTodo();
  });
});

document.addEventListener("click", (event) => {
  if (!customSelect.contains(event.target)) {
    ul.classList.remove("open");
  }
});

// darkmode feature
let darkmode = localStorage.getItem("darkmode");
const theme_switch = document.querySelector(".theme");

const enableDarkmode = () => {
  document.body.classList.add("dark-mode");
  localStorage.setItem("darkmode", "active");
};
const disableDarkmode = () => {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("darkmode", null);
};
if (darkmode === "active") enableDarkmode();

theme_switch.addEventListener("click", (e) => {
  darkmode = localStorage.getItem("darkmode");
  darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});

plus_btn.addEventListener("click", (event) => {
  pop_wrapper.classList.add("wrap");
});
cancel.addEventListener("click", (e) => {
  pop_wrapper.classList.remove("wrap");
});
pop_wrapper.addEventListener("click", (e) => {
  if (e.target == pop_wrapper) {
    pop_wrapper.classList.remove("wrap");
  }
});

// task logic
const apply = document.querySelector(".apply");
const input = document.querySelector(".src-input");
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; 
const image = document.querySelector(".image-container");

const todoAdd = () => {
  let todoText = input.value.trim();
  if (todoText) {
    tasks.push({ text: todoText, completed: false });
    input.value = "";
    updateTodo();
  }
  todoText = "";
};
const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTodo();
};
const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateTodo();
};
const editTask = (index) => {
  const editable = document.querySelector(".src-input");
  editable.value = tasks[index].text;
  pop_wrapper.classList.add("wrap");
  tasks.splice(index, 1);
  updateTodo();
};
let updateTodo = () => {
  const todoList = document.querySelector(".task-list");
  todoList.innerHTML = "";
  const spantext = Span.textContent.toLowerCase();
  let filtered_task = [];
  let tasksToRender = tasks; // Initially, render all tasks

  switch (spantext) {
    case "complete":
      filtered_task = tasks.filter((task) => task.completed === true);
      break;
    case "incomplete":
      filtered_task = tasks.filter((task) => task.completed === false);
      break;
    case "all":
      filtered_task = tasks;
      break;
    default:
      filtered_task = tasks;
      break;
  }

  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    tasksToRender = filtered_task.filter((task) =>
      task.text.toLowerCase().includes(searchTerm)
    );
  } else {
    tasksToRender = filtered_task;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  if (tasksToRender.length !== 0) {
    image.style.display = "none";
  } else {
    image.style.display = "flex";
    image.style.justifyContent = "center";
  }

  tasksToRender.forEach((filterdtask, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <div class="task-item">
                <div class="task-element ${
                  filterdtask.completed ? "completed" : ""
                }">
                    <label class="custom-checkbox">
                        <input type="checkbox" ${
                          filterdtask.completed ? "checked" : ""
                        }/>
                        <span class="checkmark"></span>
                    </label>
                    <p>${filterdtask.text}</p>
                </div>

                <div class="icons">
                    <svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" class="svg-b" onClick="editTask(${tasks.indexOf(
                      filterdtask
                    )})" id="green" fill="#e8eaed">
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" id="red" class="svg-b" onClick="deleteTask(${tasks.indexOf(
                      filterdtask
                    )})" fill="#e8eaed">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                </div>
            </div>
        `;
    listItem.addEventListener("change", () => {
      toggleTaskComplete(tasks.indexOf(filterdtask));
    });
    todoList.append(listItem);
  });
};

apply.addEventListener("click", (e) => {
  e.preventDefault();
  pop_wrapper.classList.remove("wrap");
  todoAdd();
});
searchInput.addEventListener("input", () => {
  updateTodo();
});

updateTodo();

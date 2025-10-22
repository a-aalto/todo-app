let numberOfTasks = 0;
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", function () {

    // load previously made tasks from localstorage if there are any
    loadTasks();

    // event listener for form submission
    const form = document.getElementById("inputForm");
    form.addEventListener("submit", addNewTask);

    // event listener for filtering between All, Active and Completed
    const filterRadios = document.querySelectorAll('input[name="filter"]');

    for (let i = 0; i < filterRadios.length; i++) {
        const filterRadio = filterRadios[i];

        filterRadio.addEventListener("change", function () {
            currentFilter = this.value;
            filterTasks(this);
        });


    }



});

function addNewTask(event) {

    event.preventDefault();

    // create variables for the various elements
    const input = document.getElementById("input");
    const taskList = document.getElementById("task-list");
    const text = input.value.trim();
    const counterElement = document.getElementById("counter");

    if (text !== "") {

        // create task element with the user input
        const newListItem = createTaskElement(text);

        // add the task to the list-element ("ul")
        addTaskToList(taskList, newListItem);

        // increment the number of tasks by one when user has created a task
        numberOfTasks += 1;

        // add the number of tasks to the element displaying the total number of tasks
        counterElement.innerHTML = numberOfTasks;
        updateTaskFooterVisibility();

        // update the view based on the filter selected (all, active, completed)
        const selectedFilter = document.querySelector(`input[name="filter"][value="${currentFilter}"]`);
        filterTasks(selectedFilter);

        // save task to localstorage
        saveTasks();

        // reset input field
        input.value = "";
    }
}

function createTaskElement(text) {

    // create elements for the task
    const newListItem = document.createElement("li");
    const newDiv = document.createElement("div");
    const newCheckbox = document.createElement("input");
    const newLabel = document.createElement("label");
    const removeButton = document.createElement("button");

    // add css and types to elements
    newListItem.classList.add("list-group-item", "text-start", "new-list-item");
    newDiv.classList.add("form-check", "d-flex");
    newCheckbox.classList.add("me-3", "form-check-input", "align-middle");
    newLabel.classList.add("form-check-label");
    newCheckbox.type = "checkbox";

    // add css to the remove button
    removeButton.type = "button";
    removeButton.ariaLabel = "remove";
    //removeButton.classList.add("btn", "btn-outline-danger", "d-none");
    removeButton.classList.add("btn", "btn-outline-danger", "py-0", "ms-auto", "btn-sm");
    removeButton.style.visibility = "hidden";
    removeButton.innerHTML = '<span class="align-bottom fw-bold">x</span>';

    // add user input to the task element
    //newLabel.textContent = text;
    newLabel.innerHTML = `<span class="align-middle">${text}</span>`;

    // when user hovers on a task div, the remove button visible
    newDiv.addEventListener("mouseenter", function () {
        removeButton.style.visibility = "visible";
    });
    newDiv.addEventListener("mouseleave", function () {
        removeButton.style.visibility = "hidden";
    });

    markTaskCompleted(newLabel, newCheckbox);

    // append elements structurally
    newListItem.appendChild(newDiv);
    newDiv.appendChild(newCheckbox);
    newDiv.appendChild(newLabel);
    newDiv.appendChild(removeButton);

    removeTask(removeButton, newListItem, newCheckbox);

    return newListItem;

}

function addTaskToList(taskList, newListItem) {

    // add the newListItem ("li") to the tasklist ("ul")
    taskList.appendChild(newListItem);
}

function updateTaskFooterVisibility() {

    const taskList = document.getElementById("task-list");
    const listFooter = document.getElementById("list-footer");

    // if there's no tasks, there's no list footer -> return nothing
    if (!listFooter) return;

    const totalTasks = taskList.children.length;

    // if there's tasks created, show list footer
    if (totalTasks > 0) {
        listFooter.classList.remove("d-none");
    }
    else {
        listFooter.classList.add("d-none");
    }
}

function markTaskCompleted(label, checkbox) {

    // change event on the checkbox and increment/decrement for the number of tasks (that is displayed on the list footer)
    checkbox.addEventListener("change", function () {
        if (this.checked) {
            label.classList.add("text-secondary");
            numberOfTasks -= 1;
        }
        else {
            label.classList.remove("text-secondary");
            numberOfTasks += 1;
        }

        updateNumberOfTasksLeft();

        // save task to localstorage
        saveTasks();

        // update the view based on the filter selected (all, active, completed)
        const selectedFilter = document.querySelector(`input[name="filter"][value="${currentFilter}"]`);
        filterTasks(selectedFilter);
    });

}
function updateNumberOfTasksLeft() {

    const counterElement = document.getElementById("counter");

    // add the number of tasks to the counterElement
    counterElement.innerHTML = numberOfTasks;

}

function removeTask(removeButton, newListItem, newCheckbox) {

    // if user click the remove-button, remove that list item (li) from the list (ul)
    removeButton.addEventListener("click", function () {
        newListItem.remove();

        // if the user has not checked the checkbox, decrement number of tasks by 1
        if (!newCheckbox.checked) {
            numberOfTasks -= 1;
        }

        // making sure the number of tasks won't go below zero
        if (numberOfTasks < 0) {
            numberOfTasks = 0;
        }

        // update the number of tasks left that is diplayed on the list footer
        updateNumberOfTasksLeft();

        // make the list footer visible / invisible, depending if there's remaining tasks in the list
        updateTaskFooterVisibility();

        // save task to localstorage
        saveTasks();

        // update the view based on the filter selected (all, active, completed)
        const selectedFilter = document.querySelector(`input[name="filter"][value="${currentFilter}"]`);
        filterTasks(selectedFilter);
    });

}

function filterTasks(selectedFilter) {

    const tasks = getAllTasks();

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const checkbox = task.querySelector('input[type="checkbox"]');
        const isChecked = checkbox.checked;

        task.classList.remove("d-none");

        if (selectedFilter.value === "completed" && !isChecked) {
            task.classList.add("d-none");
        }
        else if (selectedFilter.value === "active" && isChecked) {
            task.classList.add("d-none");
        }

    }
    saveTasks();


}

function getAllTasks() {

    const tasks = document.querySelectorAll(".new-list-item");

    return tasks
}

// save tasks to localstorage
function saveTasks() {

    const tasks = getAllTasks();
    const taskData = [];
    const selectedFilter = currentFilter;

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const checkbox = task.querySelector('input[type="checkbox"]');
        const label = task.querySelector("label");

        taskData.push({
            text: label.textContent,
            completed: checkbox.checked
        });
    }

    localStorage.setItem("tasks", JSON.stringify(taskData));
    localStorage.setItem("selectedFilter", selectedFilter);
}

// load tasks to localstorage
function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks"));
    let savedFilter = localStorage.getItem("selectedFilter");

    // if there's no saved tasks to be loaded, quit
    if (!savedTasks || savedTasks.length === 0) {
        return;
    }

    const taskList = document.getElementById("task-list");
    const counterElement = document.getElementById("counter");

    // reset the number of tasks before adding the list elements (loaded from localstorage)
    numberOfTasks = 0;

    for (let i = 0; i < savedTasks.length; i++) {
        const taskData = savedTasks[i];

        // create new list item based on the saved information
        const newListItem = createTaskElement(taskData.text);
        const checkbox = newListItem.querySelector('input[type="checkbox"]');
        const label = newListItem.querySelector("label");

        // if task was done, mark it done for the new list item and change the text color
        if (taskData.completed) {
            checkbox.checked = true;
            label.classList.add("text-secondary");
        }
        else {
            numberOfTasks += 1; // if the task wasn't done, increment the number of tasks value
        }

        // add the task (li) to the list (ul)
        addTaskToList(taskList, newListItem);
    }

    // update the counter
    counterElement.innerHTML = numberOfTasks;

    // update the task footer visibility if there are tasks
    updateTaskFooterVisibility();

    currentFilter = savedFilter;

    // update the view based on the filter selected (all, active, completed)
    const selectedFilter = document.querySelector(`input[name="filter"][value="${currentFilter}"]`);

    if (selectedFilter !== null) {
        selectedFilter.checked = true;
    }

    filterTasks(selectedFilter);


}

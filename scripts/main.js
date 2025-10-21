let numberOfTasks = 0;

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("inputForm");
    form.addEventListener("submit", addNewTask);

});

function addNewTask(event) {

    event.preventDefault();

    // create variables for the various elements
    const input = document.getElementById("input");
    const taskList = document.getElementById("task-list");
    const text = input.value.trim();
    const counterElement = document.getElementById("counter");
    const listFooter = document.getElementById("list-footer");

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
    newListItem.classList.add("list-group-item", "text-start");
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

    // on hover
    newDiv.addEventListener("mouseover", function () {
        removeButton.style.visibility = "visible";
    });
    newDiv.addEventListener("mouseout", function () {
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

    if (!listFooter) return;

    const totalTasks = taskList.children.length;

    if (totalTasks > 0) {
        listFooter.classList.remove("d-none");
    }
    else {
        listFooter.classList.add("d-none");
    }
}

function markTaskCompleted(label, checkbox) {

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
    });

}
function updateNumberOfTasksLeft() {
    const counterElement = document.getElementById("counter");
    counterElement.innerHTML = numberOfTasks;

}

function removeTask(removeButton, newListItem, newCheckbox) {

    removeButton.addEventListener("click", function () {
        newListItem.remove();

        if (!newCheckbox.checked) {
            numberOfTasks -= 1;
        }

        if (numberOfTasks < 0) {
            numberOfTasks = 0;
        }


        updateNumberOfTasksLeft();
        updateTaskFooterVisibility();
    });

}

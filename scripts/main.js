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
        addTaskToList(taskList,newListItem);

        // increment the number of tasks by one when user has created a task
        numberOfTasks += 1;

        // add the number of tasks to the element displaying the total number of tasks
        counterElement.innerHTML = numberOfTasks;
        updateTaskFooterVisibility(numberOfTasks, listFooter);

        // reset input field
        input.value = "";
    }
}

function createTaskElement(text) {
    // create elements for the task
    const newListElement = document.createElement("li");
    const newDiv = document.createElement("div");
    const newInputButton = document.createElement("input");
    const newLabel = document.createElement("label");

    // add css and types to elements
    newListElement.classList.add("list-group-item", "text-start");
    newDiv.classList.add("form-check");
    newInputButton.classList.add("me-3", "form-check-input");
    newLabel.classList.add("form-check-label");
    newInputButton.type = "checkbox";

    // add user input to the task element
    newLabel.textContent = text;

    // append elements structurally
    newListElement.appendChild(newDiv);
    newDiv.appendChild(newInputButton);
    newDiv.appendChild(newLabel);

    return newListElement;

}
function addTaskToList(taskList, newListElement) {

    // add the newListElement ("li") to the tasklist ("ul")
    taskList.appendChild(newListElement);
}
function updateTaskFooterVisibility(numberOfTasks, listFooter) {

    // update the visibility of listfooter-element depending if there's tasks on the list or not
    if (numberOfTasks > 0) {
        listFooter.classList.remove("d-none");
    }
    else {
        listFooter.classList.add("d-none");
    }
}
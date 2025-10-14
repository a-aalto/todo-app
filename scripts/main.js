document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("inputForm");
    form.addEventListener("submit", getInput);
});

function getInput(event) {
    event.preventDefault();

    let input = document.getElementById("input");
    let taskList = document.getElementById("task-list");
    let text = input.value.trim();

    if (text !== "") {
        let newTask = document.createElement("li");
        newTask.textContent = text;
        newTask.classList.add("list-group-item", "text-start");
        taskList.appendChild(newTask);
        input.value = "";
    }


}
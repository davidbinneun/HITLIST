/*
WEBSITE START
*/

let tasks = {"my-todo":[{}]};
fetchTasks();
refreshCounter();

/*
EVENT LISTENERS
*/

// pressing on add button
document.getElementById("add-button").addEventListener("click", function() {
    if (document.getElementById("text-input").value === "") // no input
        alert("Please enter text")
    else
        addTask()
});

// pressing on sort button
document.getElementById("sort-button").addEventListener("click", function() {sortTasks()});

// pressing on delete button for task
document.body.addEventListener('click', function (event) {
    if (event.target.className === 'delete-button') {
        let todoContainer = event.target.parentNode;

        let createdAt;
        for (let i = 0; i < todoContainer.childNodes.length; i++) {
            if (todoContainer.childNodes[i].className == "todo-created-at") {
              createdAt = todoContainer.childNodes[i].innerText;
              console.log(createdAt);
              deleteTask(createdAt);
              break;
            }   
        }
    }
}, false);

function deleteTask(createdAt){
    for (let i = 0; i < tasks["my-todo"].length; i++){
        if (tasks["my-todo"][i]["createdAt"] === createdAt){
            console.log("createdAt" + tasks["my-todo"][i]["createdAt"]);
            tasks["my-todo"].splice(i,1);
            putTasks(tasks);
        }
    }
}

class Task{
    constructor(priority, text){
        this.priority = priority;
        this.createdAt = getSQLDate(new Date());
        this.text = text;
    }
}

async function addTask(){
        if (JSON.stringify(tasks) == '{"my-todo":[{}]}')
            tasks["my-todo"] = [];

        tasks["my-todo"].push(new Task(
            document.getElementById("priority-selector").value,
            document.getElementById("text-input").value),);

        document.getElementById("text-input").value = "";
        refreshCounter();
        putTasks(tasks);
}

function sortTasks(){
    if (JSON.stringify(tasks) !== '{"my-todo":[{}]}')
        tasks["my-todo"].sort((a, b) => (a["priority"] > b["priority"]) ? -1 : 1);
    localTasks(tasks);
}

async function putTasks(tasks){
    await fetch("https://api.jsonbin.io/v3/b/6011936f3126bb747e9fd00f",{method:"put",headers: {"Content-Type": "application/json",},body: JSON.stringify(tasks)});
    localTasks(tasks);
}

async function fetchTasks(){
    let viewSection = document.getElementById("view-section");
    while(viewSection.firstChild){
        viewSection.removeChild(viewSection.firstChild);
    }

    let response = await fetch('https://api.jsonbin.io/v3/b/6011936f3126bb747e9fd00f/latest');
    let jsonResponse = await response.json(); 
    let recordResponse = jsonResponse["record"];
    tasks = recordResponse;

    if (JSON.stringify(tasks) !== '{"my-todo":[{}]}'){
        for(task of tasks["my-todo"]){
            let todoContainer = document.createElement('div');
            todoContainer.classList.add('todo-container');
    
            let todoPriority = document.createElement('div');
            todoPriority.classList.add('todo-priority');
            todoPriority.append(task["priority"]);
    
            let todoCreatedAt = document.createElement('div');
            todoCreatedAt.classList.add('todo-created-at');
            todoCreatedAt.append(task["createdAt"]);
    
            let todoText = document.createElement('div');
            todoText.classList.add('todo-text');
            todoText.append(task["text"]);
            
    
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.append("X");
            
            if (task["priority"] === '3') todoPriority.classList.add('yellow-text');
            if (task["priority"] === '4') todoPriority.classList.add('orange-text');
            if (task["priority"] === '5') todoPriority.classList.add('red-text');
            
            todoContainer.append(todoText);
            todoContainer.append(todoPriority);
            todoContainer.append(todoCreatedAt);
            todoContainer.append(deleteButton);
            
    
            viewSection.append(todoContainer);
        }
    }
    refreshCounter();
}

function localTasks(tasks){
    let viewSection = document.getElementById("view-section");
    while(viewSection.firstChild){
        viewSection.removeChild(viewSection.firstChild);
    }
    for(task of tasks["my-todo"]){
        let todoContainer = document.createElement('div');
        todoContainer.classList.add('todo-container');

        let todoPriority = document.createElement('div');
        todoPriority.classList.add('todo-priority');
        todoPriority.append(task["priority"]);

        let todoCreatedAt = document.createElement('div');
        todoCreatedAt.classList.add('todo-created-at');
        todoCreatedAt.append(task["createdAt"]);

        let todoText = document.createElement('div');
        todoText.classList.add('todo-text');
        todoText.append(task["text"]);
        

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.append("X");
        
        if (task["priority"] === '3') todoPriority.classList.add('yellow-text');
        if (task["priority"] === '4') todoPriority.classList.add('orange-text');
        if (task["priority"] === '5') todoPriority.classList.add('red-text');
        
        todoContainer.append(todoText);
        todoContainer.append(todoPriority);
        todoContainer.append(todoCreatedAt);
        todoContainer.append(deleteButton);
        

        viewSection.append(todoContainer);
    }
    refreshCounter();
}



function refreshCounter(){
    counter = document.getElementById("counter");
    counter.innerText = "";
    if (JSON.stringify(tasks) === '{"my-todo":[{}]}')
        counter.append('0');
    else
        counter.append(tasks["my-todo"].length);
}

function getSQLDate(date){
    return date.getFullYear() + "-" +
     addZero(date.getMonth() + 1) + "-" +
     addZero(date.getDate()) + " " +
     addZero(date.getHours()) + ":" +
     addZero(date.getMinutes()) + ":" +
     addZero(date.getSeconds());

    function addZero(number){
        if (number < 10)
            return "0" + number;
        else
            return number;
    }
}
const lsKey = 'todo-items';
const taskInput = document.querySelector('#task-input');
const editInput = document.querySelector('#edit-input');
const addNewTaskBtn = document.querySelector('.btn-addTask');
const editTaskBtn = document.querySelector('.btn-saveChanges');
const taskItemsWrapper = document.querySelector('.task-wrap');
const addTaskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
// const editTaskModal = new bootstrap.Modal(document.getElementById('editModal'));
const removeAllBtn = document.querySelector('.btn-removeAll');

window.onload = function(){
  if(localStorage.getItem(lsKey)){
      JSON.parse(localStorage.getItem(lsKey)).forEach(({value, id, marked}) => {
          render(value, id, marked)
      })
  }
};

addNewTaskBtn.addEventListener('click', addTask);
removeAllBtn.addEventListener('click', removeAllTasks);
taskItemsWrapper.addEventListener('click', function(e){
    if(e.target.classList.contains('todo-item') || e.target.classList.contains('text-wrap')){
        let currentId;
        if(!e.target.getAttribute('data-id')){
            currentId = e.target.parentNode.getAttribute('data-id');
            e.target.parentNode.classList.toggle('active');
            // Убрать атрибут disabled у кнопки Remove
            e.target.parentNode.querySelector('.btn-removeTask').toggleAttribute('disabled');
        } else{
            currentId = e.target.getAttribute('data-id');
            e.target.classList.toggle('active');
            // Убрать атрибут disabled у кнопки Remove
            e.target.querySelector('.btn-removeTask').toggleAttribute('disabled');
        }
        const todoArr = getListArr();
        todoArr[currentId].marked = !todoArr[currentId].marked;
        localStorage.setItem(lsKey, JSON.stringify(todoArr));
    }
    if(e.target.classList.contains('btn-removeTask')){
        const todoArr = getListArr();
        const currentItem = e.target.parentNode.parentNode;
        const currentItemId = currentItem.getAttribute('data-id');
        todoArr.splice(currentItemId, 1);
        currentItem.remove();
        todoArr.forEach((todoItem, index) => {
            todoItem.id = index;
        });
        document.querySelectorAll('.todo-item').forEach((element, index) => {
            element.setAttribute('data-id', `${index}`);
        })
        localStorage.setItem(lsKey, JSON.stringify(todoArr));
    }
    if(e.target.classList.contains('btn-edit')){

        const todoItemElement = e.target.parentNode.parentNode;
        const currentId = todoItemElement.getAttribute('data-id');
        const currentTaskText = todoItemElement.querySelector('.text-wrap').textContent;
        const editModal = document.querySelector('#editModal');
        currentEditableItem(currentId, currentTaskText);
        editModal.querySelector('input').value = currentTaskText;
    }
});

editInput.addEventListener('input', function (){
    const currentInputValue = this.value;
    const lsValue = JSON.parse(localStorage.getItem('currentEditableItem'));
    // const newObj =
    // localStorage.setItem('currentEditableItem', );
})

function currentEditableItem(id, value){
    return localStorage.setItem('currentEditableItem', JSON.stringify({id, value}))
}

function addTask(){
    let todoArr = [];
    const inputValue = taskInput.value;
    const taskObject = {
        marked: false
    };
    if(localStorage.getItem(lsKey)){
        todoArr = JSON.parse(localStorage.getItem(lsKey));
        taskObject.id = todoArr.length;
        taskObject.value = inputValue;
        render(inputValue, taskObject.id);
        todoArr.push(taskObject);
        localStorage.setItem(lsKey, JSON.stringify(todoArr));
        addTaskModal.hide();
    }
    else{
        taskObject.id = 0;
        taskObject.value = inputValue;
        todoArr.push(taskObject);
        localStorage.setItem(lsKey, JSON.stringify(todoArr));

        const div = document.createElement('div');
        div.className = 'col todo-item';
        div.innerText = inputValue;
        render(inputValue, taskObject.id);
        addTaskModal.hide();
    }
    taskInput.value = '';
}

function render(task, id, marked = false){
    let todoNormalElement = `<div class="col-md-12 todo-item" data-id='${id}'>
            <div class="text-wrap">${task}</div>
            <div class="btn-wrap">
<!--                <button type="button" class="btn btn-default btn-edit" data-bs-toggle="modal" data-bs-target="#editModal"></button>-->
                <button disabled class="btn btn-danger btn-removeTask">Remove</button>
            </div>
        </div>`;
    let todoMarkedElement = `<div class="col-md-12 todo-item active" data-id='${id}'>
            <div class="text-wrap">${task}</div>
            <div class="btn-wrap">
<!--                <button type="button" class="btn btn-default btn-edit" data-bs-toggle="modal" data-bs-target="#editModal"></button>-->
                <button class="btn btn-danger btn-removeTask">Remove</button>
            </div>
        </div>`;
    marked ? taskItemsWrapper.innerHTML += todoMarkedElement : taskItemsWrapper.innerHTML += todoNormalElement;
}

function getListArr(){
    return JSON.parse(localStorage.getItem(lsKey));
}

function removeAllTasks(){
    console.log('remove All')
    localStorage.removeItem(lsKey);
    taskItemsWrapper.innerHTML = '';
}


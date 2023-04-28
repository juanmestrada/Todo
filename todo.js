document.addEventListener("DOMContentLoaded", function() {
    const todoContainter = document.querySelector(".container");
    const todoList = document.getElementById("todoList");
    const modal = document.querySelector(".modal");
    const todoForm = document.getElementById("todoForm");
    const textInput = document.getElementById("task");


    // toggle modal
    function toggleModal(){
      modal.classList.toggle("show");
  
      if ( modal.classList.contains('show') ){
        modal.style.display = "block";
        textInput.focus();
      } else{
        modal.style.display = "none";
        todoForm.reset();
      }
    }
  
    // create todos from form submit or localstorage, depending on isType passed
    function createTodo(isType, todo){
      // create element
      const newTodo = document.createElement("li");
  
      const removeBtn = document.createElement("button");
      removeBtn.innerText = "X";
      
      // new or retrieved todo
      if(isType === "submit"){
        // new todo
  
        // get id of last todo or set initial id 
        const todoId = savedTodos[savedTodos.length - 1] === undefined ? 1 :  savedTodos[savedTodos.length - 1].id + 1;
  
        // innertext from form
        newTodo.innerText = textInput.value;
  
        todoForm.reset();
  
        // default isCompleted = false
        newTodo.isCompleted = false;
  
        // save new todo to localStorage
        savedTodos.push({ id: todoId, task: newTodo.innerText, isCompleted: false });
        newTodo.setAttribute('data-id', todoId);
        
        localStorage.setItem("todos", JSON.stringify(savedTodos));
  
      } else if(isType === "retrieve"){
        // retrieved todo from localstorage
  
        // innertext from localstorage
        newTodo.innerText = todo.task;
        
        // set id of retrieved todo
        newTodo.setAttribute('data-id', todo.id);
  
        // style for completed todo
        if (todo.isCompleted) {
          newTodo.style.textDecoration = "line-through";
        }
      }
  
      todoList.appendChild(newTodo);
      newTodo.appendChild(removeBtn);
    }
  
    
    // retrieve todos from localStorage
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  
    for (let i = 0; i < savedTodos.length; i++) {
     
      createTodo("retrieve", savedTodos[i]);
      
    }
  
    // form submit
    todoForm.addEventListener("submit", function(e) {
      e.preventDefault();
  
      // create todo, isType = submit
      createTodo("submit");
  
      // hide modal
      toggleModal()
    });
  
    todoContainter.addEventListener("click", function(e) {
      const clickedItem = e.target;
      const clickedItemParent = clickedItem.parentElement;
      const todoId = clickedItem.getAttribute("data-id"); 
      const targetTagToLowerCase = clickedItem.tagName.toLowerCase();
  
      // click functions
      if (targetTagToLowerCase === "li") {
        // update todo.isCompleted status
        for (let i = 0; i < savedTodos.length; i++) {
          let tempId = parseInt(todoId);
  
          if (savedTodos[i].id === tempId) {
           
            if (!savedTodos[i].isCompleted) {
              clickedItem.style.textDecoration = "line-through";
              savedTodos[i].isCompleted = true;
            } else {
              clickedItem.style.textDecoration = "none";
              savedTodos[i].isCompleted = false;
            }
  
            localStorage.setItem("todos", JSON.stringify(savedTodos));
          }
        }
  
      } else if (e.target.id === "add") {
        // show modal
        toggleModal()
  
      } else if (targetTagToLowerCase === "button") {
        // delete button clicked
  
        // remove todo from localStorage
        for (let i = 0; i < savedTodos.length; i++) {
          let tempId = parseInt(clickedItemParent.getAttribute("data-id"));
  
          if (savedTodos[i].id === tempId) {
            
            savedTodos.splice(i, 1)
            
            localStorage.setItem("todos", JSON.stringify(savedTodos));
          }
        }
  
        // remove todo item from DOM
        e.target.parentNode.remove();
      }
    });
  
    // toggle modal for clicking backdrop
    modal.addEventListener("click", function(e){
  
      if(e.target.parentElement.className === "modal fade show"){
        // hide/show modal
        toggleModal()
      }
    })
  });
  
// Global =>>>>>>>>>>>>>>>>>

const formElement = document.querySelector("form");
const formInput = document.querySelector(".customInput");
let myTodoList = [];
let apiKey = "6819330260a208ee1fdf5db0";

// to get and display data when open we call getAllTodos f eltal
getAllTodos();

//eventsssssssssss========>>>>
formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});

//functionnnnnssssssssss =====>>>>>

// 1) function AddTodo =====>>>>
async function addTodo() {
  let todoInfo = {
    title: formInput.value,
    apiKey: apiKey,
  };

  const objConfig = {
    method: "POST",
    body: JSON.stringify(todoInfo),
    headers: {
      "content-type": "application/json",
    },
  };

  let response = await fetch(
    "https://todos.routemisr.com/api/v1/todos",
    objConfig
  );
  if (response.ok) {
    let data = await response.json();

    if (data.message == "success") {
      console.log("task added");
      await getAllTodos(); //بقوله هنا يستني التودوز وعدين بعمل كلير للفورم
      formElement.reset();
    }
  }
}

// 2) functions getAllTodos and display them ====>>>>>>
async function getAllTodos() {
  const response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );

  if (response.ok) {
    const data = await response.json();

    myTodoList = data.todos;
    console.log(myTodoList.reverse());

    displayTodos();
  }
}

function displayTodos() {
  let box = "";
  for (let i = 0; i < myTodoList.length; i++) {
    box +=  ` <li class="d-flex align-items-center justify-content-between p-2 my-3 border-bottom pb-2">
            ${
              myTodoList[i].completed
                ? ` <span onclick="todoCompleted('${myTodoList[i]._id}')" style="text-decoration: line-through;"  class="taskName"> ${myTodoList[i].title} </span>`
                : ` <span  onclick="todoCompleted('${myTodoList[i]._id}')" class="taskName"> ${myTodoList[i].title}  </span>`
            }
              <p class="date">${myTodoList[i].createdAt.split("T", 1)}</p>
              <div class="d-flex align-items-center justify-content-center gap-3">
                <span class="trashicon" onclick="deleteTodo('${myTodoList[i]._id}')"><i class="fa-solid fa-trash-can"></i>
                </span>
                ${
                  myTodoList[i].completed
                    ? `<span class="checkIcon"><i class="fa-regular fa-circle-check" style="color: #63e6be"></i></span>`
                    : ""
                }
              </div>
            </li>`;
  }

  document.getElementById("menuTasks").innerHTML = box;
}

// 3) function to delete Todo   ====>>>
async function deleteTodo(Id) {
  const todoData = {
    todoId: Id,
  };
  const obj = {
    method: "DELETE",
    body: JSON.stringify(todoData),
    headers: {
      "content-type": "application/json",
    },
  };

  const response = await fetch(`https://todos.routemisr.com/api/v1/todos`, obj);

  if (response.ok) {
    const data = await response.json();
    if (data.message == "success") {
    getAllTodos(); // to display the new list after deleting
    }
  }
}



// 4) function if  task completed ===>>>>

async function todoCompleted(ID){

todoData={
     todoId:ID
}

const obj ={
    method:"PUT",
    body:JSON.stringify(todoData),
    headers:{
        "content-type": " application/json"
    }
}


const response =await fetch("https://todos.routemisr.com/api/v1/todos",obj)

if(response.ok){
    const data = await response.json()
    if(data.message=="success"){
       
     await getAllTodos()
     console.log("completed")
    }
}

}
// Global =>>>>>>>>>>>>>>>>>

const formElement = document.querySelector("form");
const formInput = document.querySelector(".customInput");
const Loading = document.querySelector(".loading");
let myTodoList = [];
let apiKey = "6819330260a208ee1fdf5db0";

//to get and display data when the user open the app  we call getAllTodos here in global
getAllTodos();

//eventsssssssssss========>>>>
formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  if (formInput.value.trim().length > 0) {
    addTodo();
  }
  //don't add the task if the title is empty
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

  showLoading();
  let response = await fetch(
    "https://todos.routemisr.com/api/v1/todos",
    objConfig
  );
  if (response.ok) {
    let data = await response.json();

    if (data.message == "success") {
      toastr.success("Your Task Added");
      await getAllTodos(); //بقوله هنا يستني التودوز وعدين بعمل كلير للفورم
      formElement.reset();
    }
    //  else {
    //   toastr.error("you can't add an empty task ");
    // } // لغيت الالس هنا عشان مبعتش ريكويست زياده للباك اند يفضل ان انا اعمل تشيك علي التايتل ف الاول ف الايفنت سابميت
  }
  hideLoading(); // ف الحالتين سواء اتنفذ او لا اخفي اللودنج
}

// 2) functions getAllTodos and display them ====>>>>>>
async function getAllTodos() {
  showLoading()
  const response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );

  if (response.ok) {
    const data = await response.json();

    myTodoList = data.todos;
    console.log(myTodoList.reverse());

    displayTodos();
   
  }
   hideLoading()
}

function displayTodos() {
  let box = "";
  for (let i = 0; i < myTodoList.length; i++) {
    box += ` <li class="d-flex align-items-center justify-content-between p-2 my-3 border-bottom pb-2">
            ${
              myTodoList[i].completed
                ? ` <span onclick="todoCompleted('${myTodoList[i]._id}')" style="text-decoration: line-through;"  class="taskName"> ${myTodoList[i].title} </span>`
                : ` <span  onclick="todoCompleted('${myTodoList[i]._id}')" class="taskName"> ${myTodoList[i].title}  </span>`
            }
              <div class="d-flex align-items-center justify-content-center gap-3">
                <span class="trashicon" onclick="deleteTodo('${
                  myTodoList[i]._id
                }')"><i class="fa-solid fa-trash-can"></i>
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
  updateProgress()
}

// 3) function to delete Todo   ====>>>
function deleteTodo(Id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
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

      const response = await fetch(
        `https://todos.routemisr.com/api/v1/todos`,
        obj
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message == "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          getAllTodos(); // to display the new list after deleting
        }
      }

      hideLoading();
    }
  });
}

// 4) function if  task completed ===>>>>
function todoCompleted(ID) {
  Swal.fire({
    title: " mark as complete?",
    text: "You won't be able to change this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, complete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading()
      todoData = {
        todoId: ID,
      };

      const obj = {
        method: "PUT",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": " application/json",
        },
      };

      const response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message == "success") {
          Swal.fire({
            title: "Completed!",
            icon: "success",
          });
          await getAllTodos();
          console.log("completed");
        }
      }
      hideLoading()
    }
  });
}

//====>>>> functions To conrtoool loooooading screeeen ===>>>
function showLoading() {
  Loading.classList.remove("d-none");
}
function hideLoading() {
  Loading.classList.add("d-none");
}

//function to control progress par  ====>>>>>>>//
function updateProgress(){

let completedTaskNumber= myTodoList.filter((task)=>task.completed).length;
let totalTasks= myTodoList.length ;

if(myTodoList.length > 0 ){
  document.getElementById("progress").style.width=`${(completedTaskNumber/totalTasks)*100}%`;
} 
else {
  document.getElementById("progress").style.width=0
}


const Spans= document.querySelectorAll(".right-content span");
Spans[0].innerHTML=completedTaskNumber;
Spans[1].innerHTML=totalTasks;

}

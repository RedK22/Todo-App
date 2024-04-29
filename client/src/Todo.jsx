import {useState} from "react";

export default function Todo({todo, setTodos, getTodos}) {
  const [isEditWindowOpen, setIsEditWindowOpen] = useState(false);

  const [editedTodo, setEditedTodo] = useState("");

  // !Update Todo Status
  const updateTodo = async (todoId, todoStatus) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({status: !todoStatus}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    setTodos((currentTodos) => {
      return currentTodos.map((currentTodo) => {
        if (currentTodo._id === todoId) {
          return {...currentTodo, status: !currentTodo.status};
        }
        return currentTodo;
      });
    });
  };

  // !Update Todo Content
  const updateContent = async (todoId, todoData, todoStatus) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({
          todo: editedTodo,
          status: todoStatus,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsEditWindowOpen(!isEditWindowOpen);

      if (res.ok) {
        setTodos((currentTodos) => {
          return currentTodos.map((currentTodo) => {
            if (currentTodo._id === todoId) {
              return {...currentTodo, todo: editedTodo};
            }
            return currentTodo;
          });
        });
      } else {
        console.error("Failed to update todo:", res.statusText);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // !Delete Todo
  const deleteTodo = async (todoId) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    const json = await res.json();

    setTodos((currentTodos) => {
      return currentTodos.filter((currentTodo) => currentTodo._id !== todoId);
    });
  };

  return (
    <>
      <div className="min-w-96 flex justify-between items-center bg-slate-600 px-5 py-2 mt-4 rounded-md">
        <p className="pr-4 max-w-96  break-words">{todo.todo}</p>
        <div className="flex gap-3 justify-center items-center">
          <span
            className="hover:cursor-pointer"
            onClick={() => setIsEditWindowOpen(!isEditWindowOpen)}
          >
            {/* EDIT ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </span>

          <span
            className="hover:cursor-pointer"
            onClick={() => updateTodo(todo._id, todo.status)}
          >
            {todo.status ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                class="w-5 h-5 stroke-green-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                class="w-5 h-5 stroke-red-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                />
              </svg>
            )}
          </span>

          <span
            className="hover:cursor-pointer"
            onClick={() => deleteTodo(todo._id)}
          >
            {/* TRASH ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="w-5 h-5 stroke-red-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </span>
        </div>
      </div>
      <div
        className={`bg-slate-600 flex ${isEditWindowOpen ? `gap-1 p-2` : ``}`}
      >
        {isEditWindowOpen ? (
          <>
            <input
              type="text"
              className=" bg-slate-700 p-2 outline-none rounded-sm focus:outline-none h-7  w-full placeholder:bg-slate-700 focus:bg-slate-700 text-white"
              placeholder="Enter edited Todo"
              onChange={(e) => setEditedTodo(e.target.value)}
            />

            <button
              className="bg-green-600 px-3 rounded-sm"
              onClick={
                editedTodo.length > 0
                  ? () => updateContent(todo._id, todo.todo, todo.status)
                  : undefined
              }
            >
              Confirm
            </button>
          </>
        ) : (
          ""
        )}
      </div>
      {editedTodo.length === 0 && isEditWindowOpen ? (
        <p className="pl-2 text-sm text-red-400 bg-slate-600 flex">
          Please enter some text.
        </p>
      ) : (
        ""
      )}
    </>
  );
}

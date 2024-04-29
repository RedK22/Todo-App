import {useEffect, useState} from "react";
import Todo from "./Todo";

function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  const getTodos = async function () {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) {
        throw new Error("Failed to fetch todos");
      }
      const todos = await res.json();

      setTodos(todos);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({todo: content}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

      setContent("");
      setTodos([...todos, newTodo]);
    }
  };

  return (
    <main className="w-full min-h-screen bg-slate-800 pt-10  text-white ">
      <div className="flex flex-col items-center justify-center gap-5 py-5 ">
        <h1 className="text-3xl font-bold text-center">Todos</h1>

        <form onSubmit={createNewTodo}>
          <input
            type="text"
            placeholder="Enter a new todo"
            className="outline-none rounded-sm focus:outline-none  min-w-52 bg-slate-700 h-full pl-2  placeholder:bg-slate-700 focus:bg-slate-700 text-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            className="rounded-sm bg-sky-400 px-1 py-1 ml-3 font-semibold w-24 hover:bg-sky-500 transition-all"
            type="submit"
          >
            Create Todo
          </button>
        </form>

        <div>
          {todos.length > 0
            ? todos.map((todo) => (
                <Todo
                  key={todo._id}
                  todo={todo}
                  setTodos={setTodos}
                  getTodos={getTodos}
                />
              ))
            : "Please enter a new Todo"}
        </div>
      </div>
    </main>
  );
}

export default App;

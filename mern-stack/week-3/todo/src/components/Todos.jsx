import { useState } from "react";

const Todos = (props) => {
  const [todoArray, setTodoArray] = useState([
    "Write condolences to the widow",
    "Get a haircut",
  ]);

  const [todo, setTodo] = useState("");

  const updateTodos = (e) => {
    e.preventDefault();

    setTodoArray([...todoArray, todo]);
    setTodo("");
  };

  const handleDelete = (e) => {
    const text = e.target.parentElement.innerText.slice(0, -2);
    const newTodoArray = todoArray.filter((todo) => todo !== text);
    setTodoArray(newTodoArray);
  };
  const handleComplete = (e) => {
    e.target.parentElement.parentElement.classList.toggle("completed");
  };

  return (
    <div className="todo-list">
      <form onSubmit={(event) => updateTodos(event)}>
        <div className="outer-border">
          <div className="mid-border">
            <div className="inner-border">
              <input
                type="text"
                placeholder="Add a todo"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>

      <ul>
        {todoArray.map((todo, i) => {
          return (
            <li key={i}>
              <div className="row">
                <span>{todo}</span>
                <button className="complete" onClick={handleComplete}>
                  <img src="/check.png" alt="check" />
                </button>

                <button className="delete" onClick={handleDelete}>
                  X
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Todos;

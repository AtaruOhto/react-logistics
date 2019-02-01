import React from 'react';
import {
  Todo,
  TodoState,
  updateTodoInputText,
  addTodo,
  createTodo,
  deleteTodo,
} from './stores/Todo';

const TodoInput = Todo.withConsumer<TodoState>(
  ({ todoInputText, todos }: TodoState) => (
    <div>
      <input type="text" value={todoInputText} onChange={updateTodoInputText} />
      <button
        onClick={() => {
          addTodo(createTodo(todoInputText));
        }}
      >
        AddTodo
      </button>
      <button
        onClick={() => {
          const target = todos[0];
          if (target) {
            deleteTodo(target.id);
          }
        }}
      >
        deleteTodo
      </button>
    </div>
  ),
);

const TodoList = Todo.withConsumer<TodoState>(({ todos }: TodoState) => (
  <ul>
    {todos.map(todo => (
      <li key={todo.id}>{todo.text}</li>
    ))}
  </ul>
));

export const App = () => (
  <Todo.Provider>
    <header>
      <h1>Todo App</h1>
    </header>
    <main>
      <TodoInput />
      <TodoList />
    </main>
  </Todo.Provider>
);

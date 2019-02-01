import { buildStore, ReactLogisticsOption } from 'react-logistics';
import { SyntheticEvent } from 'react';

let todoIdCounter = 0;

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export interface TodoState {
  todos: Todo[];
  todoInputText: string;
}

const initialState: TodoState = {
  todoInputText: '',
  todos: [],
};

const option: ReactLogisticsOption = {
  exposeGlobal: true /* expose store to global object. you can call store.setState() and getState() directly from console. */,
  saveHistory: true /* saving payload history, enables time machine. */,
};

export const createTodo = (text: string): Todo => {
  todoIdCounter += 1;

  return { id: todoIdCounter, text, done: false };
};

export const Todo = buildStore<TodoState>(initialState, 'MyTodoStore', option);

/* Define Actions. It's completely arbitrary to define actions and you can call store.setState() directly */

export const addTodo = (newTodo: Todo) => {
  Todo.setState({ todos: Todo.getState().todos.concat(newTodo) });
};

export const deleteTodo = (deleteId: number) => {
  Todo.setState({
    todos: Todo.getState().todos.filter(todo => todo.id !== deleteId),
  });
};

export const updateTodoInputText = (e: SyntheticEvent<HTMLInputElement>) => {
  Todo.setState({
    todoInputText: e.currentTarget.value,
  });
};

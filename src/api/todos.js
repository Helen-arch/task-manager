import { client } from '../utils/fetchClient';

export const getTodos = (userId) => {
  return client.get(`/todos?userId=${userId}`);
};

export const createTodo = (newTodo) => {
  return client.post('/todos', newTodo);
};

export const deleteTodo = (todoId) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};

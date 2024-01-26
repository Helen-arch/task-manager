import { TodoItem } from './TodoItem';

export const TodoList = ({
  todos,
  onToggleTodos,
  tempTodo,
  onDeleteTodo,
  editedTodo,
  onEditing,
  onEditSubmit,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onToggleTodos={onToggleTodos}
          onDeleteTodo={onDeleteTodo}
          editedTodo={editedTodo}
          onEditing={onEditing}
          onEditSubmit={onEditSubmit}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};

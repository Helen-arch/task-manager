import { TodoItem } from './TodoItem';

export const TodoList = ({
  todos,
  onToggleTodos,
  tempTodo,
  onDeleteTodo,
  deletedIds,
  toggledTodo,
  editedTodo,
  togglingAll,
  isLoading,
  onEditing,
  onEditSubmit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onToggleTodos={onToggleTodos}
          onDeleteTodo={onDeleteTodo}
          toggledTodo={toggledTodo}
          deletedIds={deletedIds}
          editedTodo={editedTodo}
          togglingAll={togglingAll}
          isLoading={isLoading}
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

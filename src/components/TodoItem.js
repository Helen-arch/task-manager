import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import Calendar from 'react-calendar';

export const TodoItem = ({
  todo,
  onToggleTodos = () => {},
  onDeleteTodo = () => {},
  deletedIds,
  toggledTodo,
  editedTodo,
  togglingAll,
  isLoading,
  onEditing = () => {},
  onEditSubmit = () => {},
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const isTodoEditing = id === editedTodo?.id;
  const inputRef = useRef(null);

  useEffect(() => {
    if (editedTodo) {
      inputRef.current?.focus();
    }
  }, [editedTodo]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      onDoubleClick={() => onEditing(todo)}
    >
      <label className="todo__status-label">
        <input
          checked={completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onToggleTodos({ ...todo, completed: !completed })}
        />
      </label>

      {isTodoEditing
        ? (
          <form
            onSubmit={(event) => onEditSubmit(id, event)}
          >
            <input
              ref={inputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTodo?.title}
              onChange={event => {
                onEditing({ ...todo, title: event.target.value });
              }}
              onKeyUp={(event) => {
                if (event.key === 'Escape') {
                  onEditing(null);
                }
              }}
              onBlur={() => onEditSubmit(id)}
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button className="todo__calendar">20.10.1999</button>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': togglingAll
          || (isLoading && deletedIds?.includes(id))
          || id === 0
          || (isLoading && isTodoEditing)
          || (isLoading && id === toggledTodo?.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

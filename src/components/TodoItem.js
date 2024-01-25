import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';

export const TodoItem = ({
  todo,
  onToggleTodos = () => {},
  onDeleteTodo = () => {},
  editedTodo,
  onEditing = () => {},
  onEditSubmit = () => {},
}) => {
  const {
    id,
    title,
    deadline,
    completed,
  } = todo;

  const isTodoEditing = id === editedTodo?.id;
  const inputRef = useRef(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState(deadline);
  const [day, month, year] = date.split('/');

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

            <button
              className="todo__calendar-button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              {date}
            </button>

            {isCalendarOpen && (
              <div className="todo__calendar">
                <Calendar
                  value={new Date(year, month - 1, day)}
                  onChange={(selected) => {
                    setDate(selected.toLocaleDateString());
                    setIsCalendarOpen(false);
                  }}
                  minDate={new Date()}
                />
              </div>
            )}

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
    </div>
  );
};

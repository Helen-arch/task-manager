import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import Calendar from 'react-calendar';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodosFilter';

const USER_ID = 1;

const Status = {
  All: 'All',
  Active: 'Active',
  Completed: 'Completed',
}

const filters = [
  { href: '/', title: Status.All },
  { href: '/active', title: Status.Active },
  { href: '/completed', title: Status.Completed },
];

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [filterBy, setFilterBy] = useState(Status.All);
  const [submitDisabling, setSubmitDisabling] = useState(false);
  const [tempTodo, setTempTodo] = useState(null);
  const [editedTodo, setEditedTodo] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [day, month, year] = date.split('/');

  const inputRef = useRef(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        throw new Error('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, tempTodo]);

  const completedTodos = todos.filter(todo => todo.completed);
  const uncompletedTodos = todos.filter(todo => !todo.completed);

  const renderedTodos = {
    [Status.All]: todos,
    [Status.Active]: uncompletedTodos,
    [Status.Completed]: completedTodos,
  };

  const newTodo = {
    userId: USER_ID,
    title: title.trim(),
    deadline: date,
    completed: false,
  };

  const handleUpdateTodos = (receivedTodo) => (
    (prevTodos) => {
      const updatedTodos = [...prevTodos];
      const index = updatedTodos
        .findIndex(todo => todo.id === receivedTodo.id);

      updatedTodos.splice(index, 1, receivedTodo);

      return updatedTodos;
    }
  );

  const onToggleTodos = (updated) => {
    return todoService.updateTodo(updated)
      .then(receivedTodo => {
        setTodos(handleUpdateTodos(receivedTodo));
      })
      .catch(() => {
        throw new Error('Unable to update a todo');
      });
  };

  const onUpdateTodos = (updated) => {
    return todoService.updateTodo(updated)
      .then(receivedTodo => {
        setTodos(handleUpdateTodos(receivedTodo));

        setEditedTodo(null);
      })
      .catch(() => {
        throw new Error('Unable to update a todo');
      });
  };

  const onAddTodo = (event) => {
    event.preventDefault();

    if (newTodo.title && !newTodo.title.startsWith(' ')) {
      setSubmitDisabling(true);
      setTempTodo({ ...newTodo, id: 0 });

      todoService.createTodo(newTodo)
        .then(receivedTodo => {
          setTodos(prevTodos => [...prevTodos, receivedTodo]);
          setTitle('');
        })
        .catch(() => {
          throw new Error('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setSubmitDisabling(false);
          setDate(new Date().toLocaleDateString());
        });
    } else {
      throw new Error('Title should not be empty');
    }
  };

  const onDeleteTodo = (todoId) => {
    return todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setEditedTodo(null);
      })
      .catch(() => {
        throw new Error('Unable to delete a todo');
      });
  };

  const onClearCompleted = () => {
    const deletePromises = completedTodos.map((todo) => onDeleteTodo(todo.id));

    Promise.all(deletePromises);
  };

  const onToggleAll = () => {
    const needToggle = completedTodos.length > 0
    && completedTodos.length < todos.length
      ? uncompletedTodos
      : todos;

    const togglePromises = needToggle.map(todo => onUpdateTodos({
      ...todo,
      completed: completedTodos.length !== todos.length,
    }));

    Promise.all(togglePromises);
  };

  const onEditing = (todo) => {
    setEditedTodo(todo);
  };

  const onEditSubmit = ( currentId, event ) => {
    event?.preventDefault();

    const currentTodo = todos.find(todo => todo.id === currentId);

    if (currentTodo.title === editedTodo?.title 
      && currentTodo.deadline === editedTodo?.deadline) {
      setEditedTodo(null);

      return;
    }

    if (!editedTodo?.title 
      && editedTodo.deadline === currentTodo.deadline) {
      onDeleteTodo(currentId);

      return;
    }

    if (editedTodo) {
      onUpdateTodos({
        ...currentTodo,
        title: editedTodo.title.trim(),
        deadline: editedTodo.deadline,
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            aria-label="toggle all"
            className={classNames('todoapp__toggle-all', {
              active: todos.length === completedTodos.length,
            })}
            onClick={onToggleAll}
          />
        )}

        <form onSubmit={onAddTodo}>
          <input
            disabled={submitDisabling}
            value={title}
            ref={inputRef}
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={(event) => setTitle(event.target.value)}
          />
        </form>

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
                inputRef.current?.focus();
                setDate(selected.toLocaleDateString());
                setIsCalendarOpen(false);
              }}
              minDate={new Date()}
            />
          </div>
        )}
      </header>

      <TodoList
        todos={renderedTodos[filterBy]}
        onToggleTodos={onToggleTodos}
        tempTodo={tempTodo}
        onDeleteTodo={onDeleteTodo}
        editedTodo={editedTodo}
        onEditing={onEditing}
        onEditSubmit={onEditSubmit}
      />

      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${uncompletedTodos.length} items left`}
          </span>

          <TodosFilter
            filters={filters}
            filterBy={filterBy}
            onFilterBy={setFilterBy}
          />

          <button
            disabled={!completedTodos.length}
            type="button"
            className="todoapp__clear-completed"
            onClick={onClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </div>
  );
};

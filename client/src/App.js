import React, { useState, useReducer, useEffect } from 'react';
import './App.css';
import assets from './assets';
import Input from './components/Input';
import TodoList from './components/TodoList';
import Modal from './components/Modal';
import * as API from './api/todos';
import { TodosReducer } from './reducers/TodosReducer';

const initialState = {
  todos: [],
  isLoading: false,
  error: null,
};

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [modal, setModal] = useState(false);
  const [state, dispatch] = useReducer(TodosReducer, initialState);
  const [filter, setFilter] = useState('All');
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState(null);
  const [todoIdToDelete, setTodoIdToDelete] = useState(null);

  const mainBackground = darkMode ? 'bg-dark' : 'bg-light';
  const secondaryBackground = darkMode
    ? 'bg-dark-secondary'
    : 'bg-light-secondary';

  const modalBg = darkMode ? 'dark-modal' : 'light-modal';

  const toggleMode = () => setDarkMode((prev) => !prev);

  const handleTaskComplete = (id) => {
    API.toggleCompleted(id, dispatch);
  };

  useEffect(() => {
    API.getTodos(dispatch);
  }, []);

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
    setError(null);
  };

  const addNewTodo = () => {
    if (newTodo.trim() === '') {
      setError('Please submit a non-empty todo!');
    } else {
      const maxSortId = state.todos
        .map((todo) => todo.sortId)
        .reduce((acc, current) => Math.max(acc, current), 0);

      console.log(maxSortId);

      API.addTodo({ task: newTodo, sortId: maxSortId + 1 }, dispatch);
    }
  };

  const handleDeleteTodo = (id) => {
    setTodoIdToDelete(id);
    setModal(true);
  };

  const deleteTodo = () => {
    API.deleteTodo(todoIdToDelete, dispatch);
    setModal(false);
    setTodoIdToDelete(null);
  };

  const closeModal = () => {
    setModal(false);
  };

  const clearCompleted = () => {
    const ids = state.todos
      .filter((todo) => todo.completed)
      .map((todo) => todo._id);
    API.clearCompleted(ids, dispatch);
  };

  const filterTodos = (condition) => {
    switch (condition.toLowerCase()) {
      case 'all':
        return state.todos;
      case 'completed':
        return state.todos.filter((item) => item.completed);
      case 'active':
        return state.todos.filter((item) => !item.completed);
      default:
        return;
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const drag = (e) => {
    e.dataTransfer.setData('id', e.target.id);
  };

  const drop = (e) => {
    e.preventDefault();
    var sourceId = +e.dataTransfer.getData('id');
    var targetId = +e.target.id;

    if (sourceId && targetId) {
      const sourceTodo = {
        id: state.todos.find((todo) => todo.sortId === sourceId)._id,
        sortId: sourceId,
      };

      const targetTodo = {
        id: state.todos.find((todo) => todo.sortId === targetId)._id,
        sortId: targetId,
      };

      API.reorderList(sourceTodo, targetTodo, dispatch);
    }
  };

  const filteredItems = filterTodos(filter);

  const sortedItems = filteredItems.sort((a, b) => {
    if (a.sortId < b.sortId) {
      return -1;
    } else if (a.sortId > b.sortId) {
      return 1;
    } else {
      return 0;
    }
  });

  const bgImage = darkMode ? 'bg-img-dark' : 'bg-img-light';

  return (
    <div className={`wrapper ${mainBackground} ${bgImage}`}>
      {modal && (
        <Modal
          onClick={closeModal}
          onCancel={closeModal}
          onConfirm={deleteTodo}
          bg={modalBg}
        />
      )}
      <div className="inner-wrapper">
        <div className="header">
          <h1>TODO</h1>
          <img
            src={darkMode ? assets.sun : assets.moon}
            onClick={toggleMode}
            alt="moon"
          />
        </div>
        <Input
          bg={secondaryBackground}
          darkMode={darkMode}
          error={error}
          onInputChange={handleInputChange}
          value={newTodo}
          onNewTodoAdd={addNewTodo}
          placeholder={'Create a new Todo'}
        />
        <TodoList
          filter={(filter) => setFilter(filter)}
          clearCompleted={clearCompleted}
          bg={secondaryBackground}
          onTaskComplete={handleTaskComplete}
          onDelete={handleDeleteTodo}
          items={sortedItems}
          darkMode={darkMode}
          onItemDragStart={drag}
          onItemDragOver={allowDrop}
          onItemDrop={drop}
        />
      </div>
    </div>
  );
};

export default App;

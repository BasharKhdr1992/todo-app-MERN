import axios from 'axios';
import * as Types from '../reducers/ActionTypes';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getTodos = async (dispatch) => {
  try {
    const res = await axios.get('/api/v1/todos');
    dispatch({
      type: Types.TODOS_LOADED,
      payload: res.data.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const addTodo = async (todo, dispatch) => {
  try {
    await axios.post('/api/v1/todos', todo, config).then((res) => {
      dispatch({
        type: Types.ADD_TODO,
        payload: res.data.data,
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const toggleCompleted = async (id, dispatch) => {
  try {
    await axios.put(`/api/v1/todos/${id}/toggleCompleted`).then(() => {
      dispatch({
        type: Types.TOGGLE_TODO_COMPLETED,
        payload: id,
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteTodo = async (id, dispatch) => {
  try {
    await axios.delete(`/api/v1/todos/${id}`).then(() => {
      dispatch({
        type: Types.DELETE_TODO,
        payload: id,
      });
    });
  } catch (err) {}
};

export const clearCompleted = async (ids, dispatch) => {
  try {
    await axios
      .post('/api/v1/todos/clearCompleted', { ids }, config)
      .then(() => {
        dispatch({
          type: Types.CLEAR_COMPLETED_TODOS,
        });
      });
  } catch (err) {
    console.log(err);
  }
};

export const reorderList = async (sourceTodo, targetTodo, dispatch) => {
  try {
    await axios
      .post('/api/v1/todos/reorder', { sourceTodo, targetTodo }, config)
      .then(() => {
        dispatch({
          type: Types.REORDER_TODOS,
          payload: { sourceTodo, targetTodo },
        });
      });
  } catch (err) {
    console.log(err);
  }
};

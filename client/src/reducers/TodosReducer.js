import * as Types from './ActionTypes';
export const TodosReducer = (state, action) => {
  switch (action.type) {
    case Types.TODOS_LOADING:
      return { ...state, isLoading: true, error: null };
    case Types.TODOS_LOADED:
      return { ...state, todos: action.payload };
    case Types.ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload] };
    case Types.TODOS_ERR:
      return { ...state, isLoading: false, error: action.payload };
    case Types.TOGGLE_TODO_COMPLETED:
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo._id === action.payload)
            return { ...todo, completed: !todo.completed };
          else return todo;
        }),
      };
    case Types.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo._id !== action.payload),
      };
    case Types.CLEAR_COMPLETED_TODOS:
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };
    case Types.REORDER_TODOS:
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo._id === action.payload.sourceTodo.id) {
            return { ...todo, sortId: action.payload.targetTodo.sortId };
          } else if (todo._id === action.payload.targetTodo.id) {
            return { ...todo, sortId: action.payload.sourceTodo.sortId };
          } else {
            return todo;
          }
        }),
      };
    default:
      return state;
  }
};

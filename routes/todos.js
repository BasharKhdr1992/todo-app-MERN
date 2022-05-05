const express = require('express');

const {
  addTodo,
  getTodos,
  deleteTodo,
  toggleTodoCompleted,
  clearCompletedTodos,
  reorderTodos,
} = require('../controllers/todos');

const router = express.Router();

router.route('/').get(getTodos).post(addTodo);

router.route('/:id').delete(deleteTodo);

router.route('/:id/toggleCompleted').put(toggleTodoCompleted);

router.route('/clearCompleted').post(clearCompletedTodos);

router.route('/reorder').post(reorderTodos);

module.exports = router;

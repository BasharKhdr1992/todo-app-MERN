const Todo = require('../models/Todo');

//@desc Get all todos
//@route GET /api/v1/todos
//@access public
const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find();
    return res.status(200).json({
      success: true,
      data: todos,
      count: todos.length,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc Add new todo
// @route POST /api/v1/todos
// @access public
const addTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);
    return res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((value) => value.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
};

//@desc delete a todo
//@route DELETE /api/v1/todos/:id
//@access public
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: `No Todo found with id:${req.params.id}`,
      });
    }

    await todo.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

//@desc set a todo as completed
//@route PUT /api/v1/todos/:id/completed
//@access public
const toggleTodoCompleted = async (req, res, next) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: `Todo with id: ${id} Not Found`,
      });
    }
    await Todo.findByIdAndUpdate(id, { completed: !todo.completed });
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

//@desc Clear all completed todos
//@route POST /api/v1/todos/clearCompleted
//@access public
const clearCompletedTodos = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const promises = ids.map((id) => Todo.deleteOne({ _id: id }));
    await Promise.all(promises);
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

//@desc Reorder Todos list
//@route POST /api/v1/todos/reorder
//@access public
const reorderTodos = async (req, res, next) => {
  const { sourceTodo, targetTodo } = req.body;
  try {
    await Todo.findByIdAndUpdate(sourceTodo.id, { sortId: targetTodo.sortId });
    await Todo.findByIdAndUpdate(targetTodo.id, { sortId: sourceTodo.sortId });
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

module.exports = {
  getTodos,
  addTodo,
  deleteTodo,
  toggleTodoCompleted,
  clearCompletedTodos,
  reorderTodos,
};

const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  task: {
    type: String,
    trim: true,
    required: [true, 'Please insert some text for the todo'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  sortId: {
    type: Number,
    required: [true, 'Each Todo must have a sort Id'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Todo', TodoSchema);

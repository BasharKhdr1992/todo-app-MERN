const express = require('express');
const dotenv = require('dotenv');
const color = require('colors');
const connectDB = require('./config/db');
const todos = require('./routes/todos');
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();
app.use(express.json());

app.use('/api/v1/todos', todos);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

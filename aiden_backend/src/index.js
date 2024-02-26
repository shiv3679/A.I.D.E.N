const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

// Updated Task Schema and Model to include status and tags
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Low'
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  tags: [String], // An array of strings to store tags
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// POST route to add a task
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET route to fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

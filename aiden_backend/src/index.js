const express = require('express');
const mongoose = require('mongoose');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin
const serviceAccount = require('/home/posiden/aiden-shiv-firebase-adminsdk-4zrkx-ee5a51946e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

// Task Schema and Model
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

// Firebase Auth Middleware
async function authenticateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) return res.sendStatus(401);

  const token = authorizationHeader.split(' ')[1]; // Bearer <token>
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// POST route to add a task, now protected
app.post('/tasks', authenticateToken, async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET route to fetch all tasks, now protected
app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PATCH route to update a task by id, now protected
app.patch('/tasks/:id', authenticateToken, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'dueDate', 'priority', 'completed', 'status', 'tags'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE route to delete a task by id, now protected
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

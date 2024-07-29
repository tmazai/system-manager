const router = require('express').Router();
const Task = require('../models/task.model');
const auth = require('../middleware/auth');

router.use(auth);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Add a new task
router.post('/add', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json('Task added!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'username');
    res.json(task);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Update a task
router.put('/update/:id', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json('Task updated!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json('Task deleted.');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

module.exports = router;
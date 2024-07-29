const router = require('express').Router();
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { io } = require('../server'); // Make sure this path is correct

router.use(auth);

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Add a new project (only accessible by admins)
router.post('/add', roleAuth(['admin']), async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    io.emit('projectUpdate', { action: 'add', project: newProject });
    res.json('Project added!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Get a specific project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json('Project not found');
    }
    res.json(project);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Update a project (only accessible by admins)
router.put('/update/:id', roleAuth(['admin']), async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) {
      return res.status(404).json('Project not found');
    }
    io.emit('projectUpdate', { action: 'update', project: updatedProject });
    res.json('Project updated!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Delete a project (only accessible by admins)
router.delete('/:id', roleAuth(['admin']), async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json('Project not found');
    }
    io.emit('projectUpdate', { action: 'delete', projectId: req.params.id });
    res.json('Project deleted.');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Get tasks for a specific project
router.get('/:id/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id }).populate('assignedTo', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Add a task to a project
router.post('/:id/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json('Project not found');
    }
    const newTask = new Task({
      ...req.body,
      project: project._id
    });
    const savedTask = await newTask.save();
    project.tasks.push(savedTask._id);
    await project.save();
    io.emit('taskUpdate', { action: 'add', task: savedTask });
    res.json('Task added to project!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

module.exports = router;
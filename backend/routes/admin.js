const router = require('express').Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

router.use(auth);
router.use(roleAuth(['admin']));

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Change user role (admin only)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json('Invalid role');
    }
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json('User role updated');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

module.exports = router;
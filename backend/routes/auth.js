const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      throw new Error('Unable to login');
    }
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
console.log('auth.js is loaded');

module.exports = router;
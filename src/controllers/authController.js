// controllers/authController.js
const User = require('../models/User');

const jwt = require('jsonwebtoken');

exports.generateToken = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Create JWT token with user ID
    const token = jwt.sign({ user_id }, 'secret_key', { expiresIn: '1y' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/userController.js

exports.createUser = async (req, res) => {
    try {
      const {phone_number, priority } = req.body;
  
      // Check if the user with the given phone number already exists
      const existingUser = await User.findOne({ phone_number });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User with this phone number already exists' });
      }
  
      // Create a new user
      const newUser = new User({ phone_number, priority });
  
      // Save the new user to the database
      await newUser.save();
  
      res.status(201).json({ status: 'success', data: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
    createUser: exports.createUser,
    generateToken: exports.generateToken,
  };
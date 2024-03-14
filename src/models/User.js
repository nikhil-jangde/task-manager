const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone_number: {
    type: Number,
    required: true
  },
  priority: {
    type: Number,
    required: true
  },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

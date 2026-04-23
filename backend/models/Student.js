const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  Password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

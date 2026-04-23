const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
    trim: true,
  },
  Category: {
    type: String,
    required: true,
    enum: ['Academic', 'Hostel', 'Transport', 'Other'],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  Status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);

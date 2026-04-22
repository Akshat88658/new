const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// @desc    Register a new student
// @route   POST /api/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { Name, Email, Password, Course } = req.body;

    // Check if student already exists
    let student = await Student.findOne({ Email });
    if (student) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create student
    student = new Student({
      Name,
      Email,
      Password: hashedPassword,
      Course
    });

    await student.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Check for student
    const student = await Student.findOne({ Email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(Password, student.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT
    const payload = {
      student: {
        id: student.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, student: { id: student.id, Name: student.Name, Email: student.Email, Course: student.Course } });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Update password
// @route   PUT /api/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const student = await Student.findById(req.student.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, student.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    student.Password = hashedPassword;
    await student.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update course
// @route   PUT /api/update-course
// @access  Private
exports.updateCourse = async (req, res) => {
  try {
    const { Course } = req.body;

    if (!Course) {
      return res.status(400).json({ message: 'Course is required' });
    }

    const student = await Student.findById(req.student.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.Course = Course;
    await student.save();

    res.json({ message: 'Course updated successfully', student: { id: student.id, Name: student.Name, Email: student.Email, Course: student.Course } });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current student details
// @route   GET /api/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-Password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

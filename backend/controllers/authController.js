const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// @desc    Register a new student
// @route   POST /api/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;

    // Validate required fields
    if (!Name || !Email || !Password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if student already exists (duplicate email)
    let student = await Student.findOne({ Email });
    if (student) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create student
    student = new Student({
      Name,
      Email,
      Password: hashedPassword,
    });

    await student.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Validate required fields
    if (!Email || !Password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check for student
    const student = await Student.findOne({ Email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password using bcrypt
    const isMatch = await bcrypt.compare(Password, student.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT
    const payload = {
      student: {
        id: student.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          student: {
            id: student.id,
            Name: student.Name,
            Email: student.Email,
          },
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
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

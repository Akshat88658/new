const express = require('express');
const router = express.Router();
const { register, login, updatePassword, updateCourse, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.put('/update-password', auth, updatePassword);
router.put('/update-course', auth, updateCourse);
router.get('/me', auth, getMe);

module.exports = router;

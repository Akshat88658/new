const express = require('express');
const router = express.Router();
const {
  createGrievance,
  getAllGrievances,
  searchGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
} = require('../controllers/grievanceController');
const auth = require('../middleware/auth');

// All grievance routes are protected — only logged-in users can access
router.post('/', auth, createGrievance);
router.get('/', auth, getAllGrievances);
router.get('/search', auth, searchGrievances);
router.get('/:id', auth, getGrievanceById);
router.put('/:id', auth, updateGrievance);
router.delete('/:id', auth, deleteGrievance);

module.exports = router;

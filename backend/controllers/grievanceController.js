const Grievance = require('../models/Grievance');

// @desc    Submit a new grievance
// @route   POST /api/grievances
// @access  Private
exports.createGrievance = async (req, res) => {
  try {
    const { Title, Description, Category } = req.body;

    if (!Title || !Description || !Category) {
      return res.status(400).json({ message: 'Title, Description, and Category are required' });
    }

    const grievance = new Grievance({
      Title,
      Description,
      Category,
      student: req.student.id,
    });

    await grievance.save();
    res.status(201).json({ message: 'Grievance submitted successfully', grievance });
  } catch (error) {
    console.error('Create grievance error:', error);
    res.status(500).json({ message: 'Server error while creating grievance' });
  }
};

// @desc    View all grievances of logged-in student
// @route   GET /api/grievances
// @access  Private
exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.student.id }).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    console.error('Get grievances error:', error);
    res.status(500).json({ message: 'Server error while fetching grievances' });
  }
};

// @desc    Search grievances by title
// @route   GET /api/grievances/search?title=xyz
// @access  Private
exports.searchGrievances = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Search title query is required' });
    }

    const grievances = await Grievance.find({
      student: req.student.id,
      Title: { $regex: title, $options: 'i' },
    }).sort({ createdAt: -1 });

    res.json(grievances);
  } catch (error) {
    console.error('Search grievances error:', error);
    res.status(500).json({ message: 'Server error while searching grievances' });
  }
};

// @desc    View grievance by ID
// @route   GET /api/grievances/:id
// @access  Private
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findOne({
      _id: req.params.id,
      student: req.student.id,
    });

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    res.json(grievance);
  } catch (error) {
    console.error('Get grievance by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching grievance' });
  }
};

// @desc    Update grievance
// @route   PUT /api/grievances/:id
// @access  Private
exports.updateGrievance = async (req, res) => {
  try {
    const { Title, Description, Category, Status } = req.body;

    const grievance = await Grievance.findOne({
      _id: req.params.id,
      student: req.student.id,
    });

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Update fields if provided
    if (Title) grievance.Title = Title;
    if (Description) grievance.Description = Description;
    if (Category) grievance.Category = Category;
    if (Status) grievance.Status = Status;

    await grievance.save();
    res.json({ message: 'Grievance updated successfully', grievance });
  } catch (error) {
    console.error('Update grievance error:', error);
    res.status(500).json({ message: 'Server error while updating grievance' });
  }
};

// @desc    Delete grievance
// @route   DELETE /api/grievances/:id
// @access  Private
exports.deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findOneAndDelete({
      _id: req.params.id,
      student: req.student.id,
    });

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    res.json({ message: 'Grievance deleted successfully' });
  } catch (error) {
    console.error('Delete grievance error:', error);
    res.status(500).json({ message: 'Server error while deleting grievance' });
  }
};

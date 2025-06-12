const Exam = require('../models/Exam');
const User = require('../models/User');

// Get all exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.json(exams);
  } catch (err) {
    console.error('❌ Failed to fetch exams:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Select exam for user
exports.selectExam = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.selectedExam = req.body.examCode;
    await user.save();
    
    res.json({ message: 'Exam selected', exam: req.body.examCode });
  } catch (err) {
    console.error('❌ Exam selection failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
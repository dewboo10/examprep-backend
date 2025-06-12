const express = require('express');
const router = express.Router();
const { getQuestions } = require('../controllers/questionController');
// GET /api/questions?exam=CAT&day=1
router.get('/', getQuestions);
module.exports = router;

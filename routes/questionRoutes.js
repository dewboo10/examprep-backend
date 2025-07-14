const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
// GET /api/questions?exam=CAT&day=1
router.get('/', (req, res, next) => { console.log('[ROUTE] /api/questions'); next(); }, questionController.getQuestions);
router.get('/topic/:topic', (req, res, next) => { console.log('[ROUTE] /api/questions/topic/:topic'); next(); }, questionController.getQuestionsByTopic);
module.exports = router;

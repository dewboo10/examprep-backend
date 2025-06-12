const express = require("express");
const router = express.Router();
const performanceController = require("../controllers/performanceController");
const authMiddleware = require("../middleware/authMiddleware");

// Get performance stats
router.get("/", authMiddleware, performanceController.getPerformanceStats);

// Reset performance
router.post("/reset", authMiddleware, performanceController.resetPerformance);

module.exports = router;

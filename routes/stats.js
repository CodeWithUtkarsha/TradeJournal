const express = require('express');
const router = express.Router();
const { getPlatformStats } = require('../controllers/statsController');

// @route   GET /api/stats/platform
// @desc    Get real-time platform statistics
// @access  Public
router.get('/platform', getPlatformStats);

module.exports = router;

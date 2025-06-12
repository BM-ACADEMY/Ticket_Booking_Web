const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Get dashboard stats
router.get("/dashboarddata", dashboardController.getDashboardStats);

module.exports = router;
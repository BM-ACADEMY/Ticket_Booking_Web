const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyAdminToken } = require("../middleware/auth"); // adjust path if needed

// ✅ Protect the route using the middleware
router.get("/dashboarddata", verifyAdminToken, dashboardController.getDashboardStats);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users
router.get("/fetch-all-users", userController.getAllUsers);

//get tickets by qrcode
router.get("/by-qrcode/:qrcode", userController.getUserTicketsByQRCode);

// Get user ticket show details with pagination and filter
router.get("/fetch-all-users-with-filter", userController.getUserTicketShowDetails);

router.get("/admins-subadmins", userController.getAdminsAndSubAdmins);

// Get user by ID
router.get("/fetch-all-user-by-id/:user_id", userController.getUserById);

// Create user
router.post("/create-user", userController.createUser);

// Update user
router.put("/update-user/:userId", userController.updateUser);

// Delete user
router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const { verifyAdminToken } = require("../middleware/auth"); // adjust path
const adminController = require("../controllers/adminController"); 

// verify the admin login or sub-admin login

// GET /api/admin/me
router.get("/verify-me", verifyAdminToken, (req, res) => {
  res.status(200).json({ admin: req.admin });
});

// POST forgot password
router.post("/forgot-password", adminController.forgotPassword);

// POST reset password
router.post("/reset-password/:token", adminController.resetPassword);

// GET all admins
router.get("/fetch-all-admin-and-subAdmin",verifyAdminToken ,adminController.getAllAdminsAndSubAdmins);

// GET all admins
router.get("/fetch-all-admin",verifyAdminToken ,adminController.getAllAdmins);

// GET all sub-admins
router.get("/fetch-all-subAdmin",verifyAdminToken ,adminController.getAllSubAdmins);

// GET admin by id
router.get("/:id", verifyAdminToken,adminController.getAdminById);

// POST create admin
router.post("/create-admin-and-subAdmin", adminController.createAdmin);

// verify admin or sub-admin email
router.post("/verify-otp", adminController.verifyOtp);

// POST admin login
router.post("/login", adminController.adminLogin);

// POST admin logout
router.post("/logout", adminController.adminLogout);

// PUT update admin by id
router.put("/update-admin-and-subAdmin/:id", adminController.updateAdmin);

// DELETE admin by id
router.delete("/delete-admin-and subAdmin/:id", adminController.deleteAdmin);

module.exports = router;

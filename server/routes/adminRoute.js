const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController"); // adjust path

// GET all admins
router.get("/fetch-all-admin", adminController.getAllAdmins);

// GET admin by id
router.get("/:id", adminController.getAdminById);

// POST create admin
router.post("/create-admin-and-subAdmin", adminController.createAdmin);

// PUT update admin by id
router.put("/update-admin-and-subAdmin/:id", adminController.updateAdmin);

// DELETE admin by id
router.delete("/delete-admin-and subAdmin/:id", adminController.deleteAdmin);

module.exports = router;

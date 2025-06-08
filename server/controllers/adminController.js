const Admin = require("../models/adminModel"); // adjust path if needed
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Role = require("../models/roleModel"); // adjust path if needed

// Get all admins
exports.getAllAdminsAndSubAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find admin by email or phone
    const admin = await Admin.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // Set token in httpOnly cookie
    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Login successful", admin });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};
// Admin logout
exports.adminLogout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout error", error });
  }
};

// Get all Admins (not SubAdmins)
exports.getAllAdmins = async (req, res) => {
  try {
    // Step 1: Get the role_id for 'Admin'
    const adminRole = await Role.findOne({ name: 'Admin' });

    if (!adminRole) {
      return res.status(404).json({ message: "Admin role not found" });
    }

    // Step 2: Find all admins with that role_id
    const admins = await Admin.find({ role_id: adminRole.role_id }).select("-password");

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all SubAdmins
exports.getAllSubAdmins = async (req, res) => {
  try {
    // Step 1: Get the role_id for 'subAdmin'
    const subAdminRole = await Role.findOne({ name: 'subAdmin' });

    if (!subAdminRole) {
      return res.status(404).json({ message: "subAdmin role not found" });
    }

    // Step 2: Get all admins with role_id matching subAdmin
    const subAdmins = await Admin.find({ role_id: subAdminRole.role_id }).select("-password");

    res.status(200).json(subAdmins);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single admin by id
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Create new admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role_id } = req.body;
    const newAdmin = new Admin({ name, email, phone, password, role_id });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: "Error creating admin", error });
  }
};
// Update admin by id
exports.updateAdmin = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If password is present, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: "Error updating admin", error });
  }
};
// Delete admin by id
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin)
      return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

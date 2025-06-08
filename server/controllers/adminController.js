const Admin = require("../models/adminModel"); // adjust path if needed
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Role = require("../models/roleModel"); // adjust path if needed
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

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

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Manually fetch role using role_id
    const role = await Role.findOne({ role_id: admin.role_id });

    // JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // Clean admin object
    const { password: _, ...adminData } = admin.toObject();

    // Attach role info to response
    const adminWithRole = {
      ...adminData,
      role: {
        role_id: role?.role_id || null,
        name: role?.name || "Unknown",
      },
    };

    // Set token in HTTP-only cookie
    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        admin: adminWithRole,
      });
  } catch (error) {
    console.error("Login error:", error);
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
    const adminRole = await Role.findOne({ name: "Admin" });

    if (!adminRole) {
      return res.status(404).json({ message: "Admin role not found" });
    }

    // Step 2: Find all admins with that role_id
    const admins = await Admin.find({ role_id: adminRole.role_id }).select(
      "-password"
    );

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const randomCode = crypto.randomBytes(3).toString("hex");
    const token = jwt.sign({ code: randomCode }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    user.token = token;
    await user.save();

    const resetLink = `${process.env.CORS_ORIGIN}/reset-password/${token}`;

    await sendMail({
      to: user.email,
      subject: "Reset Your Pegasus Account Password",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
            <div style="background-color: #000; color: #fff; text-align: center; padding: 20px;">
              <h1 style="margin: 0;">Pegasus</h1>
              <p style="margin: 0; font-size: 14px;">Secure Admin Panel</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333;">Reset Your Password</h2>
              <p style="color: #555; font-size: 15px;">
                We received a request to reset your password for your Pegasus account. Click the button below to continue:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p style="color: #777; font-size: 14px;">
                This link will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #aaa; text-align: center;">
                &copy; ${new Date().getFullYear()} Pegasus Admin Panel. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(req.body, "reset password body");

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find admin with matching token
    const user = await Admin.findOne({ token });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Check if embedded randomCode matches
    const decodedCode = decoded.code;
    const tokenData = jwt.verify(user.token, process.env.SECRET_KEY);
    if (tokenData.code !== decodedCode) {
      return res.status(400).json({ message: "Token mismatch" });
    }

    // Set password (will be hashed by pre-save hook)
    user.password = password; // Let pre-save middleware hash it
    user.token = null; // Clear token after use
    await user.save();

    return res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Get all SubAdmins
exports.getAllSubAdmins = async (req, res) => {
  try {
    // Step 1: Get the role_id for 'subAdmin'
    const subAdminRole = await Role.findOne({ name: "subAdmin" });

    if (!subAdminRole) {
      return res.status(404).json({ message: "subAdmin role not found" });
    }

    // Step 2: Get all admins with role_id matching subAdmin
    const subAdmins = await Admin.find({
      role_id: subAdminRole.role_id,
    }).select("-password");

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
    const { name, email, phone, password, confirmPassword, role_id } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      phone,
      password: hashedPassword,
      role_id,
    });

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

    // If password is present, check if it matches confirmPassword
    if (updateData.password) {
      if (updateData.password !== updateData.confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // Hash the password
      updateData.password = await bcrypt.hash(updateData.password, 10);

      // Optional: Remove confirmPassword to avoid storing it
      delete updateData.confirmPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from response

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

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

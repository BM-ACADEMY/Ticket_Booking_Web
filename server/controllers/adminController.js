const Admin = require("../models/adminModel"); // adjust path if needed
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Role = require("../models/roleModel"); // adjust path if needed
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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

    // Check if email is verified
    if (!admin.email_verified) {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      admin.email_otp = otp;
      await admin.save();

      // Send OTP via email
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        to: admin.email,
        subject: "Verify Your Pegasus Account",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
              <div style="background-color: #000; color: #fff; text-align: center; padding: 20px;">
                <h1 style="margin: 0;">Pegasus</h1>
                <p style="margin: 0; font-size: 14px;">Secure Admin Panel</p>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #333;">Verify Your Email</h2>
                <p style="color: #555; font-size: 15px;">
                  Please use the following One-Time Password (OTP) to verify your email address:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <div style="display: inline-block; background-color: #000; color: #fff; padding: 15px 25px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                    ${otp}
                  </div>
                </div>
                <p style="color: #777; font-size: 14px;">
                  This OTP is valid for a limited time. Do not share this code with anyone.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #aaa; text-align: center;">
                  © ${new Date().getFullYear()} Pegasus Admin Panel. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      return res.status(403).json({
        message: "Email not verified. OTP sent to your email.",
        email: admin.email,
      });
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
    // Step 1: Get pagination and filter parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate records to skip
    const name = req.query.name || ""; // Filter by name (optional)
    const phone = req.query.phone || ""; // Filter by phone (optional)

    // Step 2: Get the role_id for 'Admin'
    const adminRole = await Role.findOne({ name: "Admin" }).sort({ createdAt: -1 });

    if (!adminRole) {
      return res.status(404).json({ message: "Admin role not found" });
    }

    // Step 3: Build query for admins
    const query = {
      role_id: adminRole.role_id,
    };

    // Add name filter if provided (case-insensitive partial match)
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive regex
    }

    // Add phone filter if provided (partial match)
    if (phone) {
      query.phone = { $regex: phone, $options: "i" }; // Partial match
    }

    // Step 4: Get total count of matching admins
    const totalAdmins = await Admin.countDocuments(query);

    // Step 5: Find matching admins with pagination
    const admins = await Admin.find(query)
      .select("-password") // Exclude password field
      .skip(skip)
      .limit(limit);

    // Step 6: Calculate total pages
    const totalPages = Math.ceil(totalAdmins / limit);

    // Step 7: Send paginated response
    res.status(200).json({
      admins,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: totalAdmins,
        limit,
      },
    });
  } catch (error) {
    // Enhanced error handling
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find admin with matching token
    const user = await Admin.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check if embedded randomCode matches
    const decodedCode = decoded.code;
    const tokenData = jwt.verify(user.token, process.env.SECRET_KEY);
    if (tokenData.code !== decodedCode) {
      return res.status(400).json({ message: "Token mismatch" });
    }

    // Hash new password manually and save
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
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
    // Step 1: Get pagination and filter parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate records to skip
    const name = req.query.name || ""; // Filter by name (optional)
    const phone = req.query.phone || ""; // Filter by phone (optional)

    // Step 2: Get the role_id for 'subAdmin'
    const subAdminRole = await Role.findOne({ name: "subAdmin" }).sort({ createdAt: -1 });

    if (!subAdminRole) {
      return res.status(404).json({ message: "subAdmin role not found" });
    }

    // Step 3: Build query for sub-admins
    const query = {
      role_id: subAdminRole.role_id,
    };

    // Add name filter if provided (case-insensitive partial match)
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive regex
    }

    // Add phone filter if provided (partial match)
    if (phone) {
      query.phone = { $regex: phone, $options: "i" }; // Partial match
    }

    // Step 4: Get total count of matching sub-admins
    const totalSubAdmins = await Admin.countDocuments(query);

    // Step 5: Get paginated sub-admins
    const subAdmins = await Admin.find(query)
      .select("-password") // Exclude password field
      .skip(skip)
      .limit(limit);

    // Step 6: Calculate total pages
    const totalPages = Math.ceil(totalSubAdmins / limit);

    // Step 7: Send paginated response
    res.status(200).json({
      subAdmins,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: totalSubAdmins,
        limit,
      },
    });
  } catch (error) {
    // Enhanced error handling
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


exports.getAllCheckers = async (req, res) => {
  try {
    // Step 1: Get pagination and filter parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate records to skip
    const name = req.query.name || ""; // Filter by name (optional)
    const phone = req.query.phone || ""; // Filter by phone (optional)

    // Step 2: Get the role_id for 'Checker'
    const checkerRole = await Role.findOne({ name: "Checker" }).sort({ createdAt: -1 });

    if (!checkerRole) {
      return res.status(404).json({ message: "Checker role not found" });
    }

    // Step 3: Build query for checkers
    const query = {
      role_id: checkerRole.role_id,
    };

    // Add name filter if provided (case-insensitive partial match)
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive regex
    }

    // Add phone filter if provided (partial match)
    if (phone) {
      query.phone = { $regex: phone, $options: "i" }; // Partial match
    }

    // Step 4: Get total count of matching checkers
    const totalCheckers = await Admin.countDocuments(query);

    // Step 5: Find matching checkers with pagination
    const checkers = await Admin.find(query)
      .select("-password") // Exclude password field
      .skip(skip)
      .limit(limit);

    // Step 6: Calculate total pages
    const totalPages = Math.ceil(totalCheckers / limit);

    // Step 7: Send paginated response
    res.status(200).json({
      checkers,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: totalCheckers,
        limit,
      },
    });
  } catch (error) {
    // Enhanced error handling
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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
    console.log(req.body, "create admin body");
    
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      phone,
      password: hashedPassword,
      role_id,
      email_otp: otp, // Set OTP for email verification
      email_verified: false, // Initially set to false
    });

    await newAdmin.save();
    // Send OTP via nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code - Pegasus Admin Panel",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
        <div style="background-color: #000; color: #fff; text-align: center; padding: 20px;">
          <h1 style="margin: 0;">Pegasus</h1>
          <p style="margin: 0; font-size: 14px;">Secure Admin Panel</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p style="color: #555; font-size: 15px;">
            Please use the following One-Time Password (OTP) to verify your email address:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #000; color: #fff; padding: 15px 25px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
              ${otp}
            </div>
          </div>
          <p style="color: #777; font-size: 14px;">
            This OTP is valid for a limited time. Do not share this code with anyone.
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

    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: "Error creating admin", error });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.email_otp === Number(otp)) {
      user.email_verified = true;
      user.email_otp = null;
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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



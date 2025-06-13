const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel"); // adjust path if needed
const Role = require("../models/roleModel"); // adjust path if needed

exports.verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ message: "No token found" });

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find admin by ID and exclude password
    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin) return res.status(401).json({ message: "Invalid token" });

    // Fetch role info manually using role_id
    const role = await Role.findOne({ role_id: admin.role_id });
    if (!role) return res.status(403).json({ message: "Role not found" });

    // Attach role info to admin object
    req.admin = {
      ...admin.toObject(),
      role: {
        role_id: role.role_id,
        name: role.name,
      },
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed", error });
  }
};
const Role = require("../models/roleModel");

// GET all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ role_id: 1 });
    res.json({
      success: true,
      message: "Roles retrieved successfully",
      roles: roles,
    });
  } catch (err) {
    res.status(500).json({success:false, message: err.message });
  }
};

// GET single role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ role_id: req.params.id });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({
      success: true,
      message: "Role retrieved successfully",
      role: role,
    });
  } catch (err) {
    res.status(500).json({success:false, message: err.message });
  }
};

// POST create new role
exports.createRole = async (req, res) => {
  try {
    const role = new Role({ name: req.body.name });
    const newRole = await role.save();
    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: newRole,
    });
  } catch (err) {
    res.status(400).json({success:false, message: err.message });
  }
};

// PUT update role
exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findOne({ role_id: req.params.id });
    if (!role) return res.status(404).json({ message: "Role not found" });

    role.name = req.body.name || role.name;
    const updatedRole = await role.save();
    res.json({
      success: true,
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (err) {
    res.status(400).json({success:false, message: err.message });
  }
};

// DELETE role
 exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndDelete({ role_id: req.params.id });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({success:true, message: "Role deleted" });
  } catch (err) {
    res.status(500).json({success:false, message: err.message });
  }
};


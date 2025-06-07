const Role = require("../models/roleModel");

// GET all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ role_id: 1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ role_id: req.params.id });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create new role
exports.createRole = async (req, res) => {
  try {
    const role = new Role({ name: req.body.name });
    const newRole = await role.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update role
exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findOne({ role_id: req.params.id });
    if (!role) return res.status(404).json({ message: "Role not found" });

    role.name = req.body.name || role.name;
    const updatedRole = await role.save();
    res.json(updatedRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE role
 exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndDelete({ role_id: req.params.id });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


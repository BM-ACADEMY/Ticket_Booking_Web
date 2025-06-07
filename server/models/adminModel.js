const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role_id: {
      type: Number,
      required: true,
      ref: 'Role', // references Roles.role_id
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

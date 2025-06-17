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
    token: {
      type: String,
      default: null,
    },
     role_id: {
      type: String, // 👈 Must match Role.role_id (Number)
      required: true,
      ref: "Role", // 👈 Important for population
    },
    email_otp: { type: Number },
    email_verified: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

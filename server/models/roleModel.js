const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const roleSchema = new mongoose.Schema(
  {
    role_id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      enum: ['Admin', 'subAdmin'],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

// Auto-increment role_id
roleSchema.plugin(AutoIncrement, { inc_field: "role_id" });

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;

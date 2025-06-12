const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    trim: true,
  },
  brandLogo: {
    type: String, // Path to uploaded file
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);

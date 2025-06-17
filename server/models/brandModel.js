const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    trim: true,
  },
  brandLogo: {
    type: String,
    required: true,
  },
  brandLink: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);

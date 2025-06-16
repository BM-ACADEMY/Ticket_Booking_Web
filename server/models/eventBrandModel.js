const mongoose = require("mongoose");

const eventBrandSchema = new mongoose.Schema({
  eventBrandName: {
    type: String,
    required: true,
    trim: true,
  },
  eventBrandLogo: {
    type: String, // Path to uploaded file
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("EventBrand", eventBrandSchema);
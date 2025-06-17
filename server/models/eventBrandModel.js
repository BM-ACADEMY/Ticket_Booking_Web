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
  eventBrandLink: {
    type: String, // Path to uploaded file
  },
}, { timestamps: true });

module.exports = mongoose.model("EventBrand", eventBrandSchema);
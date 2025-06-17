const mongoose = require("mongoose");

const brandAssociateSchema = new mongoose.Schema({
  associateName: {
    type: String,
    required: true,
    trim: true,
  },
  associateLogo: {
    type: String, 
    required: true,
  },
  associateLink: {
    type: String, 
  },
}, { timestamps: true });

module.exports = mongoose.model("BrandAssociate", brandAssociateSchema);
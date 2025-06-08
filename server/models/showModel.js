const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    logo: {
      type: String, // This will store the image path or URL
      trim: true,
      default: "",  // Optional: default empty if not provided
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

const Show = mongoose.model("Show", showSchema);
module.exports = Show;

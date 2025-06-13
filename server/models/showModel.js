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
    price:{
      type: Number,
      required: true,
      min: 0,
    },
    logo: {
      type: String, 
      trim: true,
      default: "",  
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

const Show = mongoose.model("Show", showSchema);
module.exports = Show;

const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    show_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    ticket_count: {
      type: Number,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    qr_code_link: {
      type: String,
      // required: true,
      default: null,
    },
    // is_combo: { type: Boolean, default: false },
    payment_method: {
      type: String,
      enum: ["GPay", "Cash", "Mess Bill"],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("Ticket", ticketSchema);

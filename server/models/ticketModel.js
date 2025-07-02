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
      default: null,
    },
    payment_method: {
      type: String,
      enum: ["GPay", "Cash", "Mess Bill"],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("Ticket", ticketSchema);






// const mongoose = require("mongoose");

// const ticketSchema = new mongoose.Schema(
//   {
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // 🆕 Replaces show_id with array
//     show_ids: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Show",
//         required: true,
//       },
//     ],

//     // 🆕 To differentiate ticket behavior
//     ticket_type: {
//       type: String,
//       enum: ["single", "multiple", "combo"],
//       required: true,
//     },

//     ticket_count: {
//       type: Number,
//       required: true,
//     },

//     amount: {
//       type: mongoose.Schema.Types.Decimal128,
//       required: true,
//     },

//     created_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       required: true,
//     },

//     qr_code_link: {
//       type: String,
//       default: null,
//     },

//     payment_method: {
//       type: String,
//       enum: ["GPay", "Cash", "Mess Bill"],
//       required: true,
//     },

//     // 🆕 Track attendance per show for combo ticket
//     attendance: [
//       {
//         show_id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Show",
//         },
//         is_present: {
//           type: Boolean,
//           default: false,
//         },
//         checked_at: {
//           type: Date,
//         },
//       },
//     ],
//   },
//   { timestamps: { createdAt: "created_at", updatedAt: false } }
// );

// module.exports = mongoose.model("Ticket", ticketSchema);

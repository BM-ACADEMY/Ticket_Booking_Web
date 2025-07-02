const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  show_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  marked_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  marked_at: {
    type: Date,
    default: Date.now,
  },
  member_count: {
    type: Number,
    required: true,
  },
  notes:{
    type:String,
  },
  qr_valid: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;





// const attendanceSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   show_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Show',
//     required: true,
//   },
//   ticket_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Ticket',
//   },
//   marked_by_admin_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Admin',
//     required: true,
//   },
//   marked_at: {
//     type: Date,
//     default: Date.now,
//   },
//   member_count: {
//     type: Number,
//     required: true,
//   },
//   notes: {
//     type: String,
//   },
//   qr_valid: {
//     type: Boolean,
//     default: true,
//   },
// }, { timestamps: true });

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  show_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shows',
    required: true,
  },
  marked_by_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admins',
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
  qr_valid: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

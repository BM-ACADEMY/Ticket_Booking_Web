const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  report_date: {
    type: Date,
    required: true,
  },
  show_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
  }],
  generated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);

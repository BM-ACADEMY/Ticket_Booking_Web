const Attendance = require('../models/attendanceModel');
const Ticket=require('../models/ticketModel')
const mongoose=require('mongoose');
// Create attendance record
exports.createAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json({
      success: true,
      message: 'Attendance record created successfully',
      attendance: attendance,
    });
  } catch (error) {
    res.status(400).json({success:false, message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const att = await Attendance.findOne({ user_id: req.params.user_id, show_id: req.params.show_id });
    res.json({ attendance: att });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance', message: error.message });
  }
};


// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const attendanceList = await Attendance.find()
      .populate('user_id', 'name email')
      .populate('show_id', 'title datetime')
      .populate('marked_by_admin_id', 'name email');
    res.json({
      success: true,
      message: 'Attendance records retrieved successfully',
      attendance: attendanceList,
    });
  } catch (error) {
    res.status(500).json({success:false, message: error.message });
  }
};

// Get one attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('user_id', 'name email')
      .populate('show_id', 'title datetime')
      .populate('marked_by_admin_id', 'name email');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({
      success: true,
      message: 'Attendance record retrieved successfully',
      attendance: attendance,
    });
  } catch (error) {
    res.status(500).json({success:false, message: error.message });
  }
};

// Update attendance by ID
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({
      success: true,
      message: 'Attendance record updated successfully',
      attendance: attendance,
    });
  } catch (error) {
    res.status(400).json({success:false, message: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  const { user_id, show_id, member_count,notes } = req.body;

  const ticketSum = await Ticket.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(user_id), show_id: new mongoose.Types.ObjectId(show_id) } },
    { $group: { _id: null, total: { $sum: "$ticket_count" } } }
  ]);
  const ticket_count = ticketSum[0]?.total || 0;

  const qr_valid = ticket_count !== Number(member_count) ? true : false;

  const att = await Attendance.findOneAndUpdate(
    { user_id, show_id },
    {
      user_id,
      show_id,
      marked_by_admin_id: req.adminId, // replace with actual admin ID from auth
      member_count,
      notes,
      qr_valid,
    },
    { new: true, upsert: true }
  );

  res.json({ attendance: att });
};


// Delete attendance by ID
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({success:true, message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({success:false, message: error.message });
  }
};

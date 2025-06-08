const Attendance = require('../models/attendanceModel');

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

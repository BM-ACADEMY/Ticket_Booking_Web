const Attendance = require('../models/attendanceModel');
const Ticket=require('../models/ticketModel')
const mongoose=require('mongoose');
// const { isValidObjectId } = require("mongoose");
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
    const att = await Attendance.findOne({ user_id: req.params.user_id, show_id: req.params.show_id }).sort({ createdAt: -1 });
    res.json({ attendance: att });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance', message: error.message });
  }
};


// Get all attendance records




exports.getAllAttendance = async (req, res) => {
  try {
    // Step 1: Get pagination and filter parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const name = req.query.name?.trim() || "";
    const createdAt = req.query.createdAt?.trim() || "";

    // Step 2: Validate parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit",
      });
    }

    // Step 3: Build query
    const query = {};

    // Add name filter (case-insensitive partial match on user_id.name)
    if (name) {
      query["user_id.name"] = { $regex: name, $options: "i" };
    }

    // Add createdAt filter (match records for the entire day)
    if (createdAt) {
      const startDate = new Date(createdAt);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid createdAt date format. Use YYYY-MM-DD",
        });
      }
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(createdAt);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    // Step 4: Use aggregation for efficient counting and fetching
    const aggregation = [
      { $match: query },
      {
        $lookup: {
          from: "users", // Adjust to match your User collection name
          localField: "user_id",
          foreignField: "_id",
          as: "user_id",
        },
      },
      { $unwind: { path: "$user_id", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "shows", // Adjust to match your Show collection name
          localField: "show_id",
          foreignField: "_id",
          as: "show_id",
        },
      },
      { $unwind: { path: "$show_id", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "admins", // Adjust to match your Admin collection name
          localField: "marked_by_admin_id",
          foreignField: "_id",
          as: "marked_by_admin_id",
        },
      },
      { $unwind: { path: "$marked_by_admin_id", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user_id: { name: 1, email: 1 },
          show_id: { title: 1, datetime: 1 },
          marked_by_admin_id: { name: 1, email: 1 },
          member_count: 1,
          notes: 1,
          qr_valid: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    // Step 5: Execute aggregation for count and data
    const [result] = await Attendance.aggregate([
      ...aggregation,
      {
        $facet: {
          metadata: [{ $count: "totalRecords" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const totalAttendance = result.metadata[0]?.totalRecords || 0;
    const attendanceList = result.data || [];
    const totalPages = Math.ceil(totalAttendance / limit);

    // Step 6: Send paginated response
    res.status(200).json({
      success: true,
      message: "Attendance records retrieved successfully",
      attendance: attendanceList,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: totalAttendance,
        limit,
      },
    });
  } catch (error) {
    console.error("getAllAttendance error:", error); // Log for debugging
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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

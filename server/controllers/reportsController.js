const Report = require('../models/reportsModel');
const mongoose = require('mongoose');
const Ticket = require('../models/ticketModel');
const Admin = require("../models/adminModel");
const Role = require("../models/roleModel");


// Create new report
exports.createReport = async (req, res) => {
  try {
    const { admin_id, report_date, show_ids } = req.body;
    const report = new Report({
      admin_id,
      report_date,
      show_ids,
    });
    await report.save();
    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report: report,
    });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error creating report', error: error.message });
  }
};


exports.getAllReports = async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing adminId" });
    }

    // Populate role_id based on custom Number field
    const currentAdmin = await Admin.findById(adminId).populate({
      path: "role_id",
      model: "Role",
      localField: "role_id",
      foreignField: "role_id",
      justOne: true,
    });

    if (!currentAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const roleName = currentAdmin.role_id?.name;
    if (!roleName) {
      return res.status(400).json({ success: false, message: "Admin role not resolved properly." });
    }

    // Use LOCAL time (IST) to filter today's data
    const now = new Date();
    const localStart = new Date(now.setHours(0, 0, 0, 0));
    const localEnd = new Date(now.setHours(23, 59, 59, 999));

    let adminIdsToQuery = [adminId];

    if (roleName === "Admin") {
      const roles = await Role.find({ name: { $in: ["Admin", "subAdmin"] } });
      const roleIds = roles.map((r) => r.role_id);

      const admins = await Admin.find({ role_id: { $in: roleIds } });
      adminIdsToQuery = admins.map((admin) => admin._id);
    }

    const reports = await Report.find({
      admin_id: { $in: adminIdsToQuery },
      report_date: { $gte: localStart, $lte: localEnd },
    })
      .populate({
        path: "admin_id",
        select: "name email role_id",
      })
      .populate("show_ids", "title datetime location");

    const reportWithStats = await Promise.all(
      reports.map(async (report) => {
        const showIds = report.show_ids.map((show) => show._id);

        const tickets = await Ticket.find({
          created_by: report.admin_id._id,
          show_id: { $in: showIds },
          created_at: { $gte: localStart, $lte: localEnd },
        });

        const totalTickets = tickets.reduce((sum, t) => sum + t.ticket_count, 0);
        const totalAmount = tickets.reduce((sum, t) => sum + parseFloat(t.amount), 0);

        return {
          ...report.toObject(),
          total_tickets_sold: totalTickets,
          total_amount_earned: totalAmount,
          total_shows_booked: report.show_ids.length,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Today's reports retrieved successfully",
      reports: reportWithStats,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reports",
      error: error.message,
    });
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('admin_id', 'name email')
      .populate('show_ids', 'title datetime location');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({
      success: true,
      message: 'Report retrieved successfully',
      report: report,
    });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error fetching report', error: error.message });
  }
};

// Update report by ID
exports.updateReport = async (req, res) => {
  try {
    const { admin_id, report_date, show_ids } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { admin_id, report_date, show_ids },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({
      success: true,
      message: 'Report updated successfully',
      report: report,
    });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error updating report', error: error.message });
  }
};

// Delete report by ID
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({success:true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error deleting report', error: error.message });
  }
};

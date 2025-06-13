const Report = require('../models/reportsModel');
const mongoose = require('mongoose');
const Ticket = require('../models/ticketModel');

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

    // 📅 Get start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // ⏳ Fetch today's reports only
    const reports = await Report.find({
      admin_id: adminId,
      report_date: { $gte: startOfToday, $lte: endOfToday },
    })
      .populate("admin_id", "name email")
      .populate("show_ids", "title datetime location");

    const reportWithStats = await Promise.all(
      reports.map(async (report) => {
        const tickets = await Ticket.find({
          created_by: report.admin_id._id,
          show_id: { $in: report.show_ids.map((show) => show._id) },
          created_at: { $gte: startOfToday, $lte: endOfToday },
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

    res.status(200).json({
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

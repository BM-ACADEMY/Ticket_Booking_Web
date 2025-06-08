const Report = require('../models/reportsModel');

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

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('admin_id', 'name email')
      .populate('show_ids', 'title datetime location');
    res.json({
      success: true,
      message: 'Reports retrieved successfully',
      reports: reports,
    });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error fetching reports', error: error.message });
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

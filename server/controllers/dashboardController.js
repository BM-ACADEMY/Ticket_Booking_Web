const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const Show = require("../models/showModel");

exports.getDashboardStats = async (req, res) => {
  try {
    const { filter = "month" } = req.query; // Default to current month

    // Date filter logic for tickets
    const now = new Date();
    let matchDate = {};

    if (filter === "today") {
      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
      matchDate = { created_at: { $gte: start, $lte: end } };
    } else if (filter === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      matchDate = { created_at: { $gte: startOfWeek } };
    } else if (filter === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      matchDate = { created_at: { $gte: startOfMonth } };
    }

    // Fetch total users
    const totalUsers = await User.countDocuments();

    // Fetch total shows
    const totalShows = await Show.countDocuments();

    // Fetch total tickets and total turnover
    const ticketStats = await Ticket.aggregate([
      { $match: matchDate },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          totalTurnover: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    // Fetch monthly sales data for the chart (last 12 months)
    const monthlyStats = await Ticket.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" },
          },
          revenue: { $sum: { $toDouble: "$amount" } },
        },
      },
      {
        $project: {
          name: {
            $concat: [
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.year" },
            ],
          },
          revenue: 1,
          _id: 0,
        },
      },
      { $sort: { name: 1 } },
    ]);

    const stats = {
      totalUsers,
      totalShows,
      totalTickets: ticketStats[0]?.totalTickets || 0,
      totalTurnover: ticketStats[0]?.totalTurnover || 0,
      confirmedTickets: 0, // Set to 0 since ticketSchema has no status field
      monthlyData: monthlyStats,
    };

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const Show = require("../models/showModel");

exports.getDashboardStats = async (req, res) => {
  try {
    const { filter = "month" } = req.query;
    const admin = req.admin; // From verifyAdminToken middleware
    const roleName = admin.role.name; // Role name from middleware
    const adminId = admin._id; // Admin's user ID

    const now = new Date();
    let matchDate = {};

    // Set date filter based on query parameter
    if (filter === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
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

    // Get total users and shows (same for all roles)
    const totalUsers = await User.countDocuments();
    const totalShows = await Show.countDocuments();

    // Build ticket query based on role
    let ticketQuery = { ...matchDate };

    // For SubAdmins and Checkers, filter tickets by their admin ID
    if (roleName === "subAdmin" || roleName === "Checker") {
      ticketQuery.created_by = adminId; // Assuming tickets have a 'created_by' field linking to Admin ID
    }

    // Calculate ticket stats
    const ticketStats = await Ticket.aggregate([
      { $match: ticketQuery },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          totalTurnover: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    // Today payment breakdown
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let todayPaymentQuery = {
      created_at: { $gte: todayStart, $lte: todayEnd },
    };

    if (roleName === "subAdmin" || roleName === "Checker") {
      todayPaymentQuery.created_by = adminId;
    }

    const todayPaymentStats = await Ticket.aggregate([
      { $match: todayPaymentQuery },
      {
        $group: {
          _id: "$payment_method",
          totalAmount: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    // Total payment breakdown
    let totalPaymentQuery = {};
    if (roleName === "subAdmin" || roleName === "Checker") {
      totalPaymentQuery.created_by = adminId;
    }

    const totalPaymentStats = await Ticket.aggregate([
      { $match: totalPaymentQuery },
      {
        $group: {
          _id: "$payment_method",
          totalAmount: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    // Format payment breakdowns
    const formatPayments = (stats) => {
      const methods = ["GPay", "Cash", "Mess Bill"];
      const result = {};
      methods.forEach((method) => {
        const entry = stats.find((s) => s._id === method);
        result[method] = entry ? entry.totalAmount : 0;
      });
      return result;
    };

    // Monthly data
    let monthlyDataQuery = {
      created_at: {
        $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1),
      },
    };

    if (roleName === "subAdmin" || roleName === "Checker") {
      monthlyDataQuery.created_by = adminId;
    }

    const monthlyData = await Ticket.aggregate([
      { $match: monthlyDataQuery },
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

    // Prepare response
    const stats = {
      totalUsers,
      totalShows,
      totalTickets: ticketStats[0]?.totalTickets || 0,
      totalTurnover: ticketStats[0]?.totalTurnover || 0,
      confirmedTickets: 0, // Assuming this is not yet implemented
      monthlyData,
      todayPayments: formatPayments(todayPaymentStats),
      totalPayments: formatPayments(totalPaymentStats),
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
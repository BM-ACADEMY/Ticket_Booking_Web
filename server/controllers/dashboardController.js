const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const Show = require("../models/showModel");

exports.getDashboardStats = async (req, res) => {
  try {
    const { filter = "month" } = req.query;
    const admin = req.admin;
    const roleName = admin.role.name;
    const adminId = admin._id;

    const now = new Date();
    let matchDate = {};

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

    const totalUsers = await User.countDocuments();
    const totalShows = await Show.countDocuments();

    let ticketQuery = { ...matchDate };
    if (roleName === "subAdmin" || roleName === "Checker") {
      ticketQuery.created_by = adminId;
    }

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

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let todayPaymentQuery = { created_at: { $gte: todayStart, $lte: todayEnd } };
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

    const formatPayments = (stats) => {
      const methods = ["GPay", "Cash", "Mess Bill"];
      const result = {};
      methods.forEach((method) => {
        const entry = stats.find((s) => s._id === method);
        result[method] = entry ? entry.totalAmount : 0;
      });
      return result;
    };

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

    // ========================== Show-wise ticket stats ==========================

    let showTicketQuery = {};
    if (roleName === "subAdmin" || roleName === "Checker") {
      showTicketQuery.created_by = adminId;
    }

    const overallShowTicketStats = await Ticket.aggregate([
      { $match: showTicketQuery },
      {
        $group: {
          _id: "$show_id",
          totalTickets: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "shows",
          localField: "_id",
          foreignField: "_id",
          as: "show",
        },
      },
      { $unwind: "$show" },
      {
        $project: {
          showId: "$show._id",
          showTitle: "$show.title", // ✅ Correct field
          totalTickets: 1,
        },
      },
    ]);

    const todayShowTicketQuery = {
      created_at: { $gte: todayStart, $lte: todayEnd },
    };
    if (roleName === "subAdmin" || roleName === "Checker") {
      todayShowTicketQuery.created_by = adminId;
    }

    const todayShowTicketStats = await Ticket.aggregate([
      { $match: todayShowTicketQuery },
      {
        $group: {
          _id: "$show_id",
          todayTickets: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "shows",
          localField: "_id",
          foreignField: "_id",
          as: "show",
        },
      },
      { $unwind: "$show" },
      {
        $project: {
          showId: "$show._id",
          showTitle: "$show.title", // ✅ Correct field
          todayTickets: 1,
        },
      },
    ]);

    const combineShowStats = () => {
      const map = {};

      overallShowTicketStats.forEach((item) => {
        map[item.showId.toString()] = {
          showId: item.showId,
          showTitle: item.showTitle,
          totalTickets: item.totalTickets,
          todayTickets: 0,
        };
      });

      todayShowTicketStats.forEach((item) => {
        const id = item.showId.toString();
        if (!map[id]) {
          map[id] = {
            showId: item.showId,
            showTitle: item.showTitle,
            totalTickets: 0,
            todayTickets: item.todayTickets,
          };
        } else {
          map[id].todayTickets = item.todayTickets;
        }
      });

      return Object.values(map);
    };

    // ========================== Final Response ==========================

    const stats = {
      totalUsers,
      totalShows,
      totalTickets: ticketStats[0]?.totalTickets || 0,
      totalTurnover: ticketStats[0]?.totalTurnover || 0,
      confirmedTickets: 0,
      monthlyData,
      todayPayments: formatPayments(todayPaymentStats),
      totalPayments: formatPayments(totalPaymentStats),
      showWiseStats: combineShowStats(),
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

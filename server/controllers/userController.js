const User = require("../models/userModel");
const mongoose = require("mongoose");
const Ticket = require("../models/ticketModel");
const Show = require("../models/showModel");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success:false,message: "Server error", error: err });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, phone, notes, is_offline } = req.body;
    const newUser = new User({ name, phone, notes, is_offline });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({success:false, message: "Failed to create user", error: err });
  }
};


exports.getUserTicketShowDetails = async (req, res) => {
  try {
    const { page = 1, limit = 5, filter = "all" } = req.query;

    // Date filter logic
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

    const data = await Ticket.aggregate([
      { $match: matchDate },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "shows",
          localField: "show_id",
          foreignField: "_id",
          as: "show"
        }
      },
      { $unwind: "$show" },
      {
        $group: {
          _id: "$user._id",
          name: { $first: "$user.name" },
          email: { $first: "$user.email" },
          phone: { $first: "$user.phone" },
          notes: { $first: "$user.notes" },
          is_offline: { $first: "$user.is_offline" },
          qr_id: { $first: "$user.qr_id" },
          shows: {
            $push: {
              show_title: "$show.title",
              show_logo: "$show.logo",
              location: "$show.location",
              datetime: "$show.datetime",
              ticket_count: "$ticket_count",
              amount: { $toDouble: "$amount" },
              payment_method: "$payment_method"
            }
          }
        }
      },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    ]);

    const totalUsers = await Ticket.distinct("user_id", matchDate);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total: totalUsers.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalUsers.length / limit)
      }
    });

  } catch (error) {
    console.error("Error in getUserTicketShowDetails:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};



// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({success:false, message: "Failed to update user", error: err });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({success:true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({success:false, message: "Server error", error: err });
  }
};

const User = require("../models/userModel");
const mongoose = require("mongoose");
const Ticket = require("../models/ticketModel");
const Show = require("../models/showModel");
const Admin =require('../models/adminModel');
const { isValidObjectId } = require("mongoose");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

// get all the tickets based on the qrcode
// exports.getUserTicketsByQRCode = async (req, res) => {
//   try {
//     const { qrcode } = req.params;

//     const user = await User.findOne({ qr_id: qrcode });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });
// console.log(user,"user");

//     const data = await Ticket.aggregate([
//       { $match: { user_id: user._id } },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: "$user" },
//       {
//         $lookup: {
//           from: "shows",
//           localField: "show_id",
//           foreignField: "_id",
//           as: "show",
//         },
//       },
//       { $unwind: "$show" },
//       {
//         $group: {
//           _id: "$user._id",
//           name: { $first: "$user.name" },
//           phone: { $first: "$user.phone" },
//           notes: { $first: "$user.notes" },
//           is_offline: { $first: "$user.is_offline" },
//           qr_id: { $first: "$user.qr_id" },
//           created_at:{$first:"$user.created_at"},
//           shows: {
//             $push: {
//               ticket_id: "$_id",
//               show_id: "$show._id",
//               show_title: "$show.title",
//               show_logo: "$show.logo",
//               location: "$show.location",
//               datetime: "$show.datetime",
//               ticket_count: "$ticket_count",
//               amount: { $toDouble: "$amount" },
//               payment_method: "$payment_method",
//             },
//           },
//         },
//       },
//     ]);

//     return res.status(200).json({ success: true, data: data[0] || null });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


exports.getUserTicketsByQRCode = async (req, res) => {
  try {
    const { qrcode } = req.params;
    console.log(`Fetching user with qr_id: ${qrcode}`);

    // Find user by qr_id
    const user = await mongoose.model("User").findOne({ qr_id: qrcode });
    if (!user) {
      console.log(`No user found for qr_id: ${qrcode}`);
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(`User found: _id=${user._id}, name=${user.name}`);

    // Aggregate tickets for the user
    const data = await mongoose.model("Ticket").aggregate([
      {
        $match: {
          user_id: user._id, // Match tickets where user_id equals user._id
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for User model
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true, // Handle missing user
        },
      },
      {
        $lookup: {
          from: "shows", // Collection name for Show model
          localField: "show_id",
          foreignField: "_id",
          as: "show",
        },
      },
      {
        $unwind: {
          path: "$show",
          preserveNullAndEmptyArrays: true, // Handle missing show
        },
      },
      {
        $group: {
          _id: "$user._id",
          name: { $first: "$user.name" },
          phone: { $first: "$user.phone" },
          notes: { $first: "$user.notes" },
          is_offline: { $first: "$user.is_offline" },
          qr_id: { $first: "$user.qr_id" },
          created_at: { $first: "$user.created_at" },
          shows: {
            $push: {
              ticket_id: "$_id",
              show_id: "$show._id",
              show_title: "$show.title",
              show_logo: "$show.logo",
              location: "$show.location",
              datetime: "$show.datetime",
              price: "$show.price",
              ticket_count: "$ticket_count",
              amount: { $toDouble: "$amount" },
              payment_method: "$payment_method",
            },
          },
        },
      },
    ]);

    if (!data[0]) {
      console.log(`No tickets found for user: _id=${user._id}`);
      // Return user data with empty shows array
      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          notes: user.notes,
          is_offline: user.is_offline,
          qr_id: user.qr_id,
          created_at: user.created_at,
          shows: [],
        },
      });
    }

    // Filter out invalid shows (e.g., where show lookup failed)
    data[0].shows = data[0].shows.filter((show) => show.show_id);

    console.log(`Tickets found for user: _id=${user._id}, shows=${data[0].shows.length}`);
    return res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    console.error(`Error fetching tickets for qr_id: ${qrcode}`, err);
    res.status(500).json({ success: false, message: "Server error" });
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
    res
      .status(400)
      .json({ success: false, message: "Failed to create user", error: err });
  }
};



exports.getUserTicketShowDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10, filter = "", createdBy, createdAt } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Validate parameters
    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ success: false, message: "Invalid page or limit" });
    }
    // if (!["all", "today", "week", "month"].includes(filter)) {
    //   return res.status(400).json({ success: false, message: "Invalid filter value" });
    // }
    if (createdBy && !mongoose.isValidObjectId(createdBy)) {
      return res.status(400).json({ success: false, message: "Invalid createdBy ID" });
    }

    let matchDate = {};

    // Apply createdAt filter
    // if (createdAt) {
    //   const start = new Date(createdAt);
    //   start.setHours(0, 0, 0, 0);
    //   const end = new Date(createdAt);
    //   end.setHours(23, 59, 59, 999);
    //   matchDate.created_at = { $gte: start, $lte: end };
    // } else if (filter === "today") {
    //   const now = new Date();
    //   const start = new Date(now.setHours(0, 0, 0, 0));
    //   const end = new Date(now.setHours(23, 59, 59, 999));
    //   matchDate.created_at = { $gte: start, $lte: end };
    // } else if (filter === "week") {
    //   const startOfWeek = new Date();
    //   startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    //   startOfWeek.setHours(0, 0, 0, 0);
    //   matchDate.created_at = { $gte: startOfWeek };
    // } else if (filter === "month") {
    //   const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    //   matchDate.created_at = { $gte: startOfMonth };
    // }

    // Check createdBy role
    let applyCreatedByFilter = false;
    if (createdBy) {
      const creator = await Admin.findById({_id:createdBy}, { role_id: 1 });
      if (!creator) {
        return res.status(404).json({ success: false, message: "Creator not found" });
      }
      if (creator.role_id !== "1") { // SubAdmin or Checker
        applyCreatedByFilter = true;
      }
    }

    // Apply createdBy filter if needed
    if (applyCreatedByFilter) {
      matchDate.created_by = new mongoose.Types.ObjectId(createdBy);
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchDate },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "shows",
          localField: "show_id",
          foreignField: "_id",
          as: "show",
        },
      },
      { $unwind: { path: "$show", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "admins",
          localField: "created_by",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "roles",
          localField: "creator.role_id",
          foreignField: "role_id",
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
      {
        $set: {
          created_by_details: {
            id: "$creator._id",
            name: "$creator.name",
            email: "$creator.email",
            role: {
              $switch: {
                branches: [
                  { case: { $eq: ["$creator.role_id", "1"] }, then: "admin" },
                  { case: { $eq: ["$creator.role_id", "2"] }, then: "subadmin" },
                  { case: { $eq: ["$creator.role_id", "3"] }, then: "checker" },
                ],
                default: "unknown",
              },
            },
            role_id: "$creator.role_id",
            role_name: "$role.name",
          },
        },
      },
      {
        $group: {
          _id: "$user._id",
          name: { $first: "$user.name" },
          email: { $first: "$user.email" },
          phone: { $first: "$user.phone" },
          notes: { $first: "$user.notes" },
          is_offline: { $first: "$user.is_offline" },
          qr_id: { $first: "$user.qr_id" },
          created_at: { $first: "$user.created_at" },
          shows: {
            $push: {
              ticket_id: "$_id",
              show_id: "$show._id",
              show_title: "$show.title",
              show_logo: "$show.logo",
              location: "$show.location",
              datetime: "$show.datetime",
              ticket_count: "$ticket_count",
              qr_code_link: "$qr_code_link",
              amount: { $toDouble: "$amount" },
              payment_method: "$payment_method",
              created_by: "$created_by_details",
            },
          },
        },
      },
      { $sort: { name: 1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limitNum }],
          metadata: [{ $count: "total" }],
        },
      },
    ];

    const [result] = await Ticket.aggregate(pipeline);
    const data = result.data || [];
    const total = result.metadata[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getUserTicketShowDetails:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



exports.getAdminsAndSubAdmins = async (req, res) => {
  try {
    const creators = await Admin.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "role_id",
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role_id: 1,
          role_name: "$role.name",
        },
      },
    ]);
    console.log(creators,'cre');
    
    const mappedCreators = creators.map((creator) => ({
      _id: creator._id,
      name: creator.name,
      email: creator.email,
      role: creator.role_id === "1" ? "admin" : creator.role_id === "2" ? "subadmin" : "checker",
      role_id: creator.role_id,
      role_name: creator.name || "Unknown",
    }));

    res.status(200).json({
      success: true,
      data: mappedCreators,
    });
  } catch (error) {
    console.error("Error in getAdminsAndSubAdmins:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Update user by ID
// exports.updateUser = async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedUser)
//       return res.status(404).json({ message: "User not found" });
//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (err) {
//     res
//       .status(400)
//       .json({ success: false, message: "Failed to update user", error: err });
//   }
// };

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, notes, is_offline } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Only allow specific fields to be updated
    const updateData = { name, phone, notes, is_offline };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(`Error updating user: _id=${req.params.id}`, err);
    res.status(400).json({ success: false, message: "Failed to update user" });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

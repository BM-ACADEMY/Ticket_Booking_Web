const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");
const QRCode = require("qrcode");
const axios = require("axios");
const fs = require("fs");
const Show = require("../models/showModel");
const path = require("path");
const Report = require("../models/reportsModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

exports.createTicket = async (req, res) => {
  try {
    const payload = req.body;
    const firstPayload = Array.isArray(payload) ? payload[0] : payload;
    const userId = firstPayload.user_id;

    // Get user info
    const user = await User.findById({ _id: userId });
    console.log("user:", user);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // ⛔️ Removed QR code image generation
    const qrData = user.qr_id;
    const viewLink = `${process.env.FRONTEND_QRCODE_URL}/${qrData}`;

    // Prepare payload (attach QR link if needed)
    const finalPayload = Array.isArray(payload)
      ? payload.map((p) => ({ ...p, qr_code_link: viewLink }))
      : { ...payload, qr_code_link: viewLink };

    let tickets = [];
    if (Array.isArray(finalPayload)) {
      tickets = await Ticket.insertMany(finalPayload);
    } else {
      const ticket = new Ticket(finalPayload);
      await ticket.save();
      tickets = [ticket];
    }

    // Update report
    const showIds = [...new Set(finalPayload.map((t) => t.show_id.toString()))];
    const adminId = firstPayload.created_by;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Report.findOneAndUpdate(
      { admin_id: adminId, report_date: today },
      {
        $addToSet: { show_ids: { $each: showIds } },
        $setOnInsert: { generated_at: new Date() },
      },
      { upsert: true, new: true }
    );

    // Send WhatsApp Message
    for (const ticket of tickets) {
      try {
        const show = await Show.findById(ticket.show_id);
        if (!show) {
          console.warn(`⚠️ Show not found for ticket ${ticket._id}`);
          continue;
        }

        // Format date & time separately to avoid commas
        // Format date manually (no commas)
        const dateObj = new Date(show.datetime);
        const weekday = dateObj.toLocaleDateString("en-IN", {
          weekday: "short",
          timeZone: "Asia/Kolkata",
        });
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString("en-IN", {
          month: "short",
          timeZone: "Asia/Kolkata",
        });
        const year = dateObj.getFullYear();
        const time = dateObj.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });

        // Final string (space-separated, no commas)
        const formattedShowDate = `${weekday} ${day} ${month} ${year} ${time}`;

        const apiUrl = "http://bhashsms.com/api/sendmsgutil.php";

        // Sanitize inputs to remove commas that might break parameter structure
        const safeUserName = (user.name || "Pegasus 2k25").replace(/,/g, "");
        const safeTitle = (show.title || "Pegasus@123").replace(/,/g, "");
        const safeLocation = (show.location || "Venue").replace(/,/g, "");
        const safeLink = (viewLink || "").replace(/,/g, "");

        const params = {
          user: "Mohithvarshan_rcs",
          pass: "123456",
          sender: "BUZWAP",
          phone: `91${user.phone}`,
          text: "mohit_5654",
          priority: "wa",
          stype: "normal",
          Params: [
            safeUserName,
            ticket.ticket_count || "0",
            safeTitle,
            formattedShowDate,
            safeLocation,
            safeLink,
          ].join(","),
        };
        console.log(params, "params");

        const response = await axios.get(apiUrl, { params });
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(response.data));

        if (response.status === 200) {
          if (response.data.trim() === "") {
            console.warn(
              `⚠️ Empty response for ${user.phone}. Check template or API config.`
            );
          } else {
            console.log(`📤 WhatsApp sent to ${user.phone}:`, response.data);
          }
        } else {
          console.warn(
            `⚠️ Unexpected status for ${user.phone}: ${response.status}`
          );
        }
      } catch (error) {
        console.error(
          `❌ WhatsApp message failed for ${user.phone}:`,
          error.response?.data || error.message
        );
        if (error.response) {
          console.error("Error Response:", error.response.data);
          console.error("Error Status:", error.response.status);
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: "Ticket(s) created and WhatsApp sent",
      data: tickets,
    });
  } catch (error) {
    console.error("Ticket creation error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.getTicketCount = async (req, res) => {
  try {
    const { user_id, show_id } = req.params;

    const count = await Ticket.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id),
          show_id: new mongoose.Types.ObjectId(show_id),
        },
      },
      { $group: { _id: null, total: { $sum: "$ticket_count" } } },
    ]);
    res.json({ ticket_count: count[0]?.total || 0 });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch ticket count", message: error.message });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate("user_id", "name email phone")
      .populate("show_id", "title location datetime")
      .populate("created_by", "name email");
    res.status(200).json({
      success: true,
      message: "Tickets retrieved successfully",
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("user_id", "name email phone")
      .populate("show_id", "title location datetime")
      .populate("created_by", "name email");

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.status(200).json({
      success: true,
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update ticket by ID
// Update a ticket by ID
// exports.updateTicket = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body, {
//       new: true, // Return the updated document
//       runValidators: true, // Ensure model validations are applied
//     });

//     if (!updatedTicket) {
//       return res.status(404).json({
//         success: false,
//         message: "Ticket not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Ticket updated successfully",
//       ticket: updatedTicket,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update ticket",
//       error: error.message,
//     });
//   }
// };

exports.updateTicket = async (req, res) => {
  try {
    const { user_id, tickets } = req.body;

    if (!user_id || !tickets || !Array.isArray(tickets)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: user_id and tickets array are required",
      });
    }

    // Verify user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get existing tickets for the user
    const existingTickets = await Ticket.find({ user_id }).select("show_id");
    const existingShowIds = existingTickets.map((t) => t.show_id.toString());
    const newShowIds = tickets.map((t) => t.show_id.toString());

    // Delete tickets for deselected shows
    const ticketsToDelete = existingShowIds.filter(
      (id) => !newShowIds.includes(id)
    );
    if (ticketsToDelete.length > 0) {
      await Ticket.deleteMany({
        user_id,
        show_id: { $in: ticketsToDelete },
      });
    }

    // Upsert tickets
    const updatedTickets = [];
    for (const ticketData of tickets) {
      const ticket = await Ticket.findOneAndUpdate(
        { user_id, show_id: ticketData.show_id },
        {
          user_id,
          show_id: ticketData.show_id,
          ticket_count: ticketData.ticket_count,
          amount: ticketData.amount,
          payment_method: ticketData.payment_method,
          created_by:
            ticketData.created_by || req.user?._id || "default-admin-id",
          qr_code_link: user.qr_id
            ? `${process.env.FRONTEND_QRCODE_URL}/${user.qr_id}`
            : null,
        },
        { upsert: true, new: true, runValidators: true }
      );
      updatedTickets.push(ticket);
    }

    return res.status(200).json({
      success: true,
      message: "Tickets updated successfully",
      data: updatedTickets,
    });
  } catch (error) {
    console.error("Ticket update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
// Delete ticket by ID
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.admin; // From verifyAdminToken middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID format",
      });
    }

    // Find the ticket
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // ✅ Check if the user is the default super admin
    const isDefaultAdmin = admin.email === "pegasus25coupons@gmail.com";

    // ✅ General role-based permissions
    const isAdmin = admin.role?.role_id === "1"; // Admin role
    const isCreator = ticket.created_by.toString() === admin._id.toString();

    // ❌ If not admin, not creator, and not default admin → block
    if (!isAdmin && !isCreator && !isDefaultAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized - Only admin, creator, or default admin can delete",
      });
    }

    // Delete the ticket
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    // Update report if deleted by creator (optional logic)
    if (isCreator) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await Report.updateOne(
        { admin_id: admin._id, report_date: today },
        { $pull: { show_ids: ticket.show_id } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
      data: {
        deletedTicketId: deletedTicket._id,
        showId: deletedTicket.show_id,
        userId: deletedTicket.user_id,
      },
    });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting ticket",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

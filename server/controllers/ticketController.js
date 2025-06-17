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
// Create new ticket
// Create new ticket(s)
// exports.createTicket = async (req, res) => {
//   try {
//     const payload = req.body;

//     if (!Array.isArray(payload)) {
//       // If it's a single ticket, insert one
//       const ticket = new Ticket(payload);
//       await ticket.save();
//       return res.status(201).json({ success: true, message: 'Ticket created successfully', ticket });
//     } else {
//       // If it's an array of tickets, insert many
//       const tickets = await Ticket.insertMany(payload);
//       return res.status(201).json({ success: true, message: 'Tickets created successfully', tickets });
//     }

//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

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

    // Generate QR Code
    const qrData = user.qr_id;
    const qrFileName = `qr-${user._id}-${Date.now()}.png`;
    const qrDirPath = path.join(__dirname, "../public/qrcodes");

    // ✅ Ensure directory exists
    if (!fs.existsSync(qrDirPath)) {
      fs.mkdirSync(qrDirPath, { recursive: true });
    }

    const qrFilePath = path.join(qrDirPath, qrFileName);
    const viewLink = `${process.env.FRONTEND_QRCODE_URL}/${qrData}`;

    // Save QR code image
    await QRCode.toFile(qrFilePath, qrData);

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
    const showIds = [...new Set(finalPayload.map((t) => t.show_id.toString()))]; // Unique show IDs
    const adminId = firstPayload.created_by;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    await Report.findOneAndUpdate(
      { admin_id: adminId, report_date: today },
      {
        $addToSet: { show_ids: { $each: showIds } }, // avoid duplicate shows
        $setOnInsert: { generated_at: new Date() },
      },
      { upsert: true, new: true }
    );
    // Loop through each ticket and send SMS
    for (const ticket of tickets) {
      const show = await Show.findById(ticket.show_id);
      const ticketDate = new Date(ticket.created_at).toLocaleString("en-IN");

      const message = `Hi ${
        user.name
      }, welcome to Pegasus 2k25! – the crown jewel of CMC!

You have booked ${ticket.ticket_count} ticket(s) for ${
        show.title
      } on ${new Date(show.datetime).toLocaleString("en-IN")} at ${
        show.location
      }.
E-ticket: ${viewLink}
Entry allowed only if you show the e-ticket from this link.

Payment of ₹${parseFloat(ticket.amount)} via ${
        ticket.payment_method
      } received on ${ticketDate}.

To enjoy exclusive access to the Pegasus Food Court throughout the week, please register here:
[Food Court Link]

Craving convenience? We also offer delivery to your doorstep! (Note: Available only for Bagayam and Rehab campuses.)`;

      // await axios.post(
      //   "https://www.fast2sms.com/dev/bulkV2",
      //   {
      //     route: "q",
      //     message,
      //     language: "english",
      //     flash: 0,
      //     numbers: user.phone,
      //   },
      //   {
      //     headers: {
      //       authorization: process.env.FAST2SMS_API_KEY,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
    }

    return res.status(201).json({
      success: true,
      message: "Ticket(s) created and SMS sent",
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
    console.log(req.params, "params");

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
    const ticketsToDelete = existingShowIds.filter((id) => !newShowIds.includes(id));
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
          created_by: ticketData.created_by || req.user?._id || "default-admin-id",
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
    const admin = req.admin; // From your verifyAdminToken middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID format",
      });
    }

    // Find the ticket with associated show data
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Check permissions - only admin or ticket creator can delete
    const isAdmin = admin.role.role_id === "1"; // Assuming "1" is admin role
    const isCreator = ticket.created_by.toString() === admin._id.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Only admin or ticket creator can delete",
      });
    }

    // Delete the ticket
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    // Update report data if needed
    if (isCreator) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await Report.updateOne(
        { admin_id: admin._id, report_date: today },
        { $pull: { show_ids: ticket.show_id } }
      );
    }

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: "Server error while deleting ticket",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

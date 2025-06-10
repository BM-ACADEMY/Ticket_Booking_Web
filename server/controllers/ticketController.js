const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");
const QRCode = require("qrcode");
const axios = require("axios");
const fs = require("fs");
const Show = require("../models/showModel");
const path = require("path");
const Report = require("../models/reportsModel");
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
    const qrLink = `${process.env.BASE_URL}/qrcodes/${qrFileName}`;

    // Save QR code image
    await QRCode.toFile(qrFilePath, qrData);

    const finalPayload = Array.isArray(payload)
      ? payload.map((p) => ({ ...p, qr_code_link: qrLink }))
      : { ...payload, qr_code_link: qrLink };

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
E-ticket: ${qrLink}
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

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
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
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure model validations are applied
    });

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};

// Delete ticket by ID
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res
      .status(200)
      .json({ success: false, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Ticket = require('../models/ticketModel');

// Create new ticket
exports.createTicket = async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json({success:true, message: 'Ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('user_id', 'name email phone')
      .populate('show_id', 'title location datetime')
      .populate('created_by', 'name email');
    res.status(200).json({
      success: true,
      message: 'Tickets retrieved successfully',
      data: tickets
    });
  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

// Get single ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user_id', 'name email phone')
      .populate('show_id', 'title location datetime')
      .populate('created_by', 'name email');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.status(200).json({
      success: true,
      message: 'Ticket retrieved successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

// Update ticket by ID
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.status(200).json({success:true, message: 'Ticket updated successfully', ticket });
  } catch (error) {
    res.status(500).json({success:false, error: error.message });
  }
};

// Delete ticket by ID
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.status(200).json({success:false, message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

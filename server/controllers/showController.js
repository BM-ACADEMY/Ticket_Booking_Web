const Show = require("../models/showModel");

// Get all shows
// GET /api/shows/fetch-all-shows?page=1&limit=5
exports.getAllShowsforticketlist = async (req, res) => {
  try {
    const shows = await Show.find().sort({ createdAt: -1 }); // Fetch all, newest first

    res.status(200).json({
      success: true,
      message: "Shows retrieved successfully",
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get a single show by ID
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.status(200).json({
      success: true,
      message: "Show retrieved successfully",
      data: show,
    });
  } catch (error) {
    res.status(500).json({success:false, message: "Server error", error });
  }
};

// Create a new show
  exports.createShow = async (req, res) => {
    try {
      const { title, location, datetime,price } = req.body;

      
      let logoPath = "";

      if (req.file) {
        const folder = title.replace(/\s+/g, "_");
        logoPath = `${process.env.BACKEND_URL}/uploads/${folder}/${req.file.filename}`;
      }

      const newShow = new Show({ title, location, datetime,price, logo: logoPath });
      await newShow.save();
      res.status(201).json({
        success: true,
        message: "Show created successfully",
        data: newShow,
      });
    } catch (error) {
      res.status(400).json({success:false, message: "Failed to create show", error });
    }
  };

// Update a show by ID
exports.updateShow = async (req, res) => {
  try {
    let logoPath = req.body.logo;

    if (req.file) {
      const title = req.body.title || "default";
      const folder = title.replace(/\s+/g, "_");
      logoPath = `${process.env.BACKEND_URL}/uploads/${folder}/${req.file.filename}`;
    }

    const updatedShow = await Show.findByIdAndUpdate(
      req.params.id,
      { ...req.body, logo: logoPath },
      { new: true, runValidators: true }
    );

    if (!updatedShow) return res.status(404).json({ message: "Show not found" });
    res.status(200).json({
      success: true,
      message: "Show updated successfully",
      data: updatedShow,
    });
  } catch (error) {
    res.status(400).json({success:false, message: "Failed to update show", error });
  }
};

// Delete a show by ID
exports.deleteShow = async (req, res) => {
  try {
    const deletedShow = await Show.findByIdAndDelete(req.params.id);
    if (!deletedShow) return res.status(404).json({ message: "Show not found" });
    res.status(200).json({success:true, message: "Show deleted successfully" });
  } catch (error) {
    res.status(500).json({success:false, message: "Server error", error });
  }
};

exports.getAllShowsforEvent = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;          // current page number
    const limit = parseInt(req.query.limit) || 10;       // number of records per page
    const skip = (page - 1) * limit;

    const total = await Show.countDocuments();           // total number of shows

    const shows = await Show.find()
      .sort({ createdAt: -1 })                           // newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Shows retrieved successfully",
      data: shows,
      pagination: {
        total,                                           // total records
        page,                                            // current page
        limit,                                           // items per page
        totalPages: Math.ceil(total / limit),           // total pages
      },
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

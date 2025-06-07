const Show = require("../models/showModel");

// Get all shows
exports.getAllShows = async (req, res) => {
  try {
    const shows = await Show.find();
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single show by ID
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.status(200).json(show);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new show
exports.createShow = async (req, res) => {
  try {
    const { title, location, datetime } = req.body;
    const newShow = new Show({ title, location, datetime });
    await newShow.save();
    res.status(201).json(newShow);
  } catch (error) {
    res.status(400).json({ message: "Failed to create show", error });
  }
};

// Update a show by ID
exports.updateShow = async (req, res) => {
  try {
    const updatedShow = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedShow) return res.status(404).json({ message: "Show not found" });
    res.status(200).json(updatedShow);
  } catch (error) {
    res.status(400).json({ message: "Failed to update show", error });
  }
};

// Delete a show by ID
exports.deleteShow = async (req, res) => {
  try {
    const deletedShow = await Show.findByIdAndDelete(req.params.id);
    if (!deletedShow) return res.status(404).json({ message: "Show not found" });
    res.status(200).json({ message: "Show deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

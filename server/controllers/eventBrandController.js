const EventBrand = require("../models/eventBrandModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create Event Brand
exports.createEventBrand = async (req, res) => {
  try {
    const { eventBrandName } = req.body;

    if (!eventBrandName || !req.file) {
      return res.status(400).json({ success: false, message: "Event brand name and logo are required" });
    }

    const folder = eventBrandName.replace(/\s+/g, "_");
    const logoPath = `${process.env.BACKEND_URL}/Uploads/eventBrands/${folder}/${req.file.filename}`;

    const newEventBrand = new EventBrand({
      eventBrandName,
      eventBrandLogo: logoPath,
    });

    await newEventBrand.save();
    res.status(201).json({ success: true, message: "Event brand created successfully", data: newEventBrand });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create event brand", error: err.message });
  }
};

// Get All Event Brands
exports.getAllEventBrands = async (req, res) => {
  try {
    const eventBrands = await EventBrand.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: eventBrands });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Event Brand
exports.updateEventBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const eventBrand = await EventBrand.findById(id);
    if (!eventBrand) return res.status(404).json({ success: false, message: "Event brand not found" });

    const newEventBrandName = req.body.eventBrandName || eventBrand.eventBrandName;
    let updatedLogoPath = eventBrand.eventBrandLogo;

    // If a new file is uploaded
    if (req.file) {
      // Delete the old file if it exists
      const oldPath = path.join(__dirname, "..", eventBrand.eventBrandLogo.replace(process.env.BACKEND_URL, ""));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      const folder = newEventBrandName.replace(/\s+/g, "_");
      updatedLogoPath = `${process.env.BACKEND_URL}/Uploads/eventBrands/${folder}/${req.file.filename}`;
    }

    eventBrand.eventBrandName = newEventBrandName;
    eventBrand.eventBrandLogo = updatedLogoPath;

    await eventBrand.save();
    res.status(200).json({ success: true, message: "Event brand updated successfully", data: eventBrand });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update event brand", error: err.message });
  }
};

// Delete Event Brand
exports.deleteEventBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const eventBrand = await EventBrand.findById(id);
    if (!eventBrand) return res.status(404).json({ message: "Event brand not found" });

    const logoPath = path.join(__dirname, "..", eventBrand.eventBrandLogo.replace(process.env.BACKEND_URL, ""));
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    await EventBrand.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Event brand deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
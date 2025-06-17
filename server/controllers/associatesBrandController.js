const BrandAssociate = require("../models/associatesModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create Brand Associate
exports.createBrandAssociate = async (req, res) => {
  try {
    const { associateName,associateLink } = req.body;

    if (!associateName || !req.file) {
      return res.status(400).json({ success: false, message: "Associate name and logo are required" });
    }

    const folder = associateName.replace(/\s+/g, "_");
    const logoPath = `${process.env.BACKEND_URL}/Uploads/brandAssociates/${folder}/${req.file.filename}`;

    const newBrandAssociate = new BrandAssociate({
      associateName,
      associateLink,
      associateLogo: logoPath,
    });

    await newBrandAssociate.save();
    res.status(201).json({ success: true, message: "Brand associate created successfully", data: newBrandAssociate });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create brand associate", error: err.message });
  }
};

// Get All Brand Associates
exports.getAllBrandAssociates = async (req, res) => {
  try {
    const brandAssociates = await BrandAssociate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true,message:"Fetch associate sponser Successfully", data: brandAssociates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Brand Associate
exports.updateBrandAssociate = async (req, res) => {
  try {
    const { id } = req.params;
    const brandAssociate = await BrandAssociate.findById(id);
    if (!brandAssociate) return res.status(404).json({ success: false, message: "Brand associate not found" });

    const newAssociateName = req.body.associateName || brandAssociate.associateName;
    const associateLink=req.body.associateLink || brandAssociate.associateLink
    let updatedLogoPath = brandAssociate.associateLogo;

    // If a new file is uploaded
    if (req.file) {
      // Delete the old file if it exists
      const oldPath = path.join(__dirname, "..", brandAssociate.associateLogo.replace(process.env.BACKEND_URL, ""));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      const folder = newAssociateName.replace(/\s+/g, "_");
      updatedLogoPath = `${process.env.BACKEND_URL}/Uploads/brandAssociates/${folder}/${req.file.filename}`;
    }

    brandAssociate.associateName = newAssociateName;
    brandAssociate.associateLink = associateLink;
    brandAssociate.associateLogo = updatedLogoPath;

    await brandAssociate.save();
    res.status(200).json({ success: true, message: "Brand associate updated successfully", data: brandAssociate });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update brand associate", error: err.message });
  }
};

// Delete Brand Associate
exports.deleteBrandAssociate = async (req, res) => {
  try {
    const { id } = req.params;
    const brandAssociate = await BrandAssociate.findById(id);
    if (!brandAssociate) return res.status(404).json({ message: "Brand associate not found" });

    const logoPath = path.join(__dirname, "..", brandAssociate.associateLogo.replace(process.env.BACKEND_URL, ""));
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    await BrandAssociate.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Brand associate deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
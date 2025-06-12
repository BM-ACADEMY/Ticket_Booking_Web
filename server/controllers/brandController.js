const Brand = require("../models/brandModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create Brand
exports.createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;

    if (!brandName || !req.file) {
      return res.status(400).json({ success: false, message: "Brand name and logo are required" });
    }

    const folder = brandName.replace(/\s+/g, "_");
    const logoPath = `${process.env.BACKEND_URL}/uploads/brands/${folder}/${req.file.filename}`;

    const newBrand = new Brand({
      brandName,
      brandLogo: logoPath,
    });

    await newBrand.save();
    res.status(201).json({ success: true, message: "Brand created successfully", data: newBrand });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create brand", error: err.message });
  }
};


// Get All Brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ success: true, data: brands });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });

    const newBrandName = req.body.brandName || brand.brandName;
    let updatedLogoPath = brand.brandLogo;

    // If a new file is uploaded
    if (req.file) {
      // Delete the old file if it exists
      const oldPath = path.join(__dirname, "..", brand.brandLogo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      const folder = newBrandName.replace(/\s+/g, "_");
      updatedLogoPath = `${process.env.BACKEND_URL}/uploads/brands/${folder}/${req.file.filename}`;
    }

    brand.brandName = newBrandName;
    brand.brandLogo = updatedLogoPath;

    await brand.save();
    res.status(200).json({ success: true, message: "Brand updated successfully", data: brand });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update brand", error: err.message });
  }
};

// Delete Brand
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    if (fs.existsSync(brand.brandLogo)) {
      fs.unlinkSync(brand.brandLogo);
    }

    await Brand.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Brand deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

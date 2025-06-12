const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const upload = require("../middleware/brandUpload");

// POST Brand
router.post("/create-brand", upload.single("brandLogo"), brandController.createBrand);

// GET All Brands
router.get("/fetch-all-brands", brandController.getAllBrands);

// PUT Brand
router.put("/update-brand/:id", upload.single("brandLogo"), brandController.updateBrand);

// DELETE Brand
router.delete("/delete-brand/:id", brandController.deleteBrand);

module.exports = router;

const express = require("express");
const router = express.Router();
const eventBrandController = require("../controllers/eventBrandController");
const upload = require("../middleware/eventBrandUpload");

// POST Event Brand
router.post("/create-event-brand", upload.single("eventBrandLogo"), eventBrandController.createEventBrand);

// GET All Event Brands
router.get("/fetch-all-event-brands", eventBrandController.getAllEventBrands);

// PUT Event Brand
router.put("/update-event-brand/:id", upload.single("eventBrandLogo"), eventBrandController.updateEventBrand);

// DELETE Event Brand
router.delete("/delete-event-brand/:id", eventBrandController.deleteEventBrand);

module.exports = router;
const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");
const upload = require("../middleware/upload");

// GET all shows
router.get("/fet-all-shows", showController.getAllShows);

// GET single show by ID
router.get("/fetch-show-by-id/:id", showController.getShowById);

// POST create a new show with logo upload
router.post("/create-show", upload.single("logo"), showController.createShow);

// PUT update show with logo upload
router.put("/update-show/:id", upload.single("logo"), showController.updateShow);

// DELETE show by ID
router.delete("/delete-show/:id", showController.deleteShow);

module.exports = router;

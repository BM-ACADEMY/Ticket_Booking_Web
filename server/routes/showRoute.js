const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");

// GET all shows
router.get("/fet-all-shows", showController.getAllShows);

// GET single show by ID
router.get("/fetch-show-by-id/:id", showController.getShowById);

// POST create a new show
router.post("/create-show", showController.createShow);

// PUT update show by ID
router.put("/update-show/:id", showController.updateShow);

// DELETE show by ID
router.delete("/delete-show/:id", showController.deleteShow);

module.exports = router;

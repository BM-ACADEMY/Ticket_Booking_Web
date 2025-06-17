const express = require("express");
const router = express.Router();
const brandAssociateController = require("../controllers/associatesBrandController");
const upload = require("../middleware/associatesBrandUpload");

// POST Brand Associate
router.post("/create-brand-associate", upload.single("associateLogo"), brandAssociateController.createBrandAssociate);

// GET All Brand Associates
router.get("/fetch-all-brand-associates", brandAssociateController.getAllBrandAssociates);

// PUT Brand Associate
router.put("/update-brand-associate/:id", upload.single("associateLogo"), brandAssociateController.updateBrandAssociate);

// DELETE Brand Associate
router.delete("/delete-brand-associate/:id", brandAssociateController.deleteBrandAssociate);

module.exports = router;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const brandName = req.body.brandName || "default";
    const folderName = brandName.replace(/\s+/g, "_");
    const uploadPath = path.join(__dirname, "..", "uploads", "brands", folderName);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext;
    cb(null, filename);
  },
});

const brandUpload = multer({ storage });

module.exports = brandUpload;

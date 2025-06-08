const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const showTitle = req.body.title || "default";
    const folderPath = path.join(__dirname, "../public/uploads/", showTitle.replace(/\s+/g, "_"));

    fs.mkdirSync(folderPath, { recursive: true }); // ensure directory exists
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;

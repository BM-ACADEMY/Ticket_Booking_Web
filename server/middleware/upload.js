const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body.title?.replace(/\s+/g, "_") || "default";
    const dir = path.join(__dirname, "../uploads", folder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});


const upload = multer({ storage });

module.exports = upload;

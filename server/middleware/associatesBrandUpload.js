const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const associateName = req.body.associateName || "default";
    const folderName = associateName.replace(/\s+/g, "_");
    const uploadPath = path.join(__dirname, "..", "Uploads", "brandAssociates", folderName);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext;
    cb(null, filename);
  },
});

const brandAssociateUpload = multer({ storage });

module.exports = brandAssociateUpload;
const multer = require("multer");
// Uploaded files are persisted by the controller, not on Render's ephemeral disk.

const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 5 }
});

module.exports = upload;

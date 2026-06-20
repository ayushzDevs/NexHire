const multer = require("multer");

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const allowedExtensions = [".pdf", ".docx"];

function fileFilter(req, file, cb) {
  const ext = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();

  // check BOTH mimetype AND extension — mimetype alone can be spoofed by the client
  const mimeOk = allowedMimeTypes.includes(file.mimetype);
  const extOk = allowedExtensions.includes(ext);

  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1,                  // exactly one file per request
  },
});

module.exports = upload;
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + file.originalname;
    cb(null, fileName);
  },
});
module.exports = multer({ storage });

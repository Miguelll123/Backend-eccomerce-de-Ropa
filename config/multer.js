const multer = require("multer");
const path = require("path");

const UPLOAD_DIR = "./uploads";

// Save files into ./uploads with a unique filename while keeping the extension
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if(allowedTypes.includes(file.mimetype)) cb(null,true);
    else cb(new Error('Tipo de archivo no permitido'),false);
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { upload };
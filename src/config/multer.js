const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers s'ils n'existent pas
const uploadDirs = [
  'public/images/events',
  'public/images/news',
  'public/images/team',
  'public/images/donations',
  'public/images/quotes'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'public/images/events'; // Par défaut
    
    if (req.baseUrl.includes('/news')) folder = 'public/images/news';
    else if (req.baseUrl.includes('/members')) folder = 'public/images/team';
    else if (req.baseUrl.includes('/donations')) folder = 'public/images/donations';
    else if (req.baseUrl.includes('/quotes')) folder = 'public/images/quotes';
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtrage des fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (JPEG, JPG, PNG, WEBP, GIF)'));
  }
};

// Configuration multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Upload multiple images (pour événements)
const uploadMultiple = upload.array('images', 10); // Max 10 images

// Upload simple
const uploadSingle = upload.single('image');

module.exports = { upload, uploadMultiple, uploadSingle };

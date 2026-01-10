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
    
    // Vérifier le path complet (baseUrl + path)
    const fullPath = req.baseUrl + req.path;
    console.log('Multer destination - fullPath:', fullPath);
    
    if (fullPath.includes('/news')) folder = 'public/images/news';
    else if (fullPath.includes('/members')) folder = 'public/images/team';
    else if (fullPath.includes('/donations')) folder = 'public/images/donations';
    else if (fullPath.includes('/quotes')) folder = 'public/images/quotes';
    
    console.log('Dossier de destination:', folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log('Nom de fichier généré:', filename);
    cb(null, filename);
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
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: fileFilter
});

// Upload multiple images (pour événements)
const uploadMultiple = upload.array('images', 10); // Max 10 images

// Upload simple
const uploadSingle = upload.single('image');

module.exports = { upload, uploadMultiple, uploadSingle };

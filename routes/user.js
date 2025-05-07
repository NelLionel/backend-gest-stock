const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

// Route pour créer un nouvel utilisateur
router.post('/create', userController.createUser);

// Route pour récupérer tous les utilisateurs
router.get('/', userController.getAllUsers);

// Route pour récupérer un utilisateur spécifique par ID
router.get('/:id', userController.getUserById);

// Route pour mettre à jour un utilisateur spécifique par ID
router.put('/:id', userController.updateUser);

// Route pour supprimer un utilisateur spécifique par ID
router.delete('/:id', userController.deleteUser);

// Route pour rechercher des utilisateurs par nom
router.get('/search', userController.searchUsers);

// Middleware pour la gestion des fichiers téléchargés
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles'); // Répertoire de stockage des images de profil
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id + '-' + Date.now() + '.' + file.originalname.split('.').pop()); // Utilisation de l'ID de la requête et du nom de fichier d'origine
    }
});
const upload = multer({ storage: storage });

// Route pour la mise à jour de la photo de profil
router.put('/:id/photo', upload.single('photo'), userController.updateProfilePhoto);

module.exports = router;

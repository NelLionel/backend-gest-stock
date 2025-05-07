const express = require('express');
const router = express.Router();
const FournisseurController = require('../controllers/fournisseurController');

// Route pour créer un fournisseur
router.post('/fournisseurs', FournisseurController.createFournisseur);

// Route pour récupérer un fournisseur par ID
router.get('/fournisseurs/:id', FournisseurController.getFournisseurById);

// Route pour récupérer tous les fournisseurs
router.get('/fournisseurs', FournisseurController.getAllFournisseurs);

// Route pour mettre à jour un fournisseur par ID
router.put('/fournisseurs/:id', FournisseurController.updateFournisseur);

// Route pour supprimer un fournisseur par ID
router.delete('/fournisseurs/:id', FournisseurController.deleteFournisseur);

module.exports = router;

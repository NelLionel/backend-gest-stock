const express = require('express');
const router = express.Router();
const ProduitController = require('../controllers/produitController');

// Route pour créer un produit
router.post('/produits', ProduitController.createProduit);

// Route pour récupérer un produit par ID
router.get('/produits/:id', ProduitController.getProduitById);

// Route pour récupérer tous les produits
router.get('/produits', ProduitController.getAllProduits);

// Route pour mettre à jour un produit par ID
router.put('/produits/:id', ProduitController.updateProduit);

// Route pour supprimer un produit par ID
router.delete('/produits/:id', ProduitController.deleteProduit);

module.exports = router;

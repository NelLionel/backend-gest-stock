const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

// Route pour créer une catégorie
router.post('/categories', CategoryController.createCategory);

// Route pour récupérer une catégorie par ID
router.get('/categories/:id', CategoryController.getCategoryById);

// Route pour récupérer toutes les catégories
router.get('/categories', CategoryController.getAllCategories);

// Route pour mettre à jour une catégorie par ID
router.put('/categories/:id', CategoryController.updateCategory);

// Route pour supprimer une catégorie par ID
router.delete('/categories/:id', CategoryController.deleteCategory);

module.exports = router;

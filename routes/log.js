const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Route pour créer un nouveau log
router.post('/create', logController.createLog);

// Route pour récupérer un log spécifique par son ID
router.get('/:id', logController.getLogById);

// Route pour mettre à jour un log spécifique par son ID
router.put('/:id', logController.updateLog);

// Route pour supprimer un log spécifique par son ID
router.delete('/:id', logController.deleteLog);

// Route pour récupérer tous les logs
router.get('/', logController.getAllLogs);

module.exports = router;

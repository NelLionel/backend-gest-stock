const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Récupérer toutes les notifications d'un utilisateur
router.get('/user/:userId', notificationController.getAllNotifications);

// Récupérer le nombre de notifications non lues d'un utilisateur
router.get('/user/:userId/unread-count', notificationController.getUnreadCount);

// Marquer une notification comme lue
router.post('/read/:id', notificationController.markAsRead);

// Ajouter une nouvelle notification
router.post('/', notificationController.createNotification);

// Supprimer une notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

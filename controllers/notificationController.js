const { Notification, User } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
let io;

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tfeai2022@gmail.com',
    pass: 'ipxyiipmmgjoaisd'
  }
});

class NotificationController {

  setIo(newIo) {
    io = newIo;
  }

  // Liste de toutes les notifications d'un utilisateur
  async getAllNotifications(req, res) {
    const userId = req.params.userId;
    try {
      const notifications = await Notification.findAll({ where: { user_id: userId } });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des notifications', error: error.message });
    }
  }

  // Récupérer le nombre de notifications non lues d'un utilisateur
  async getUnreadCount(req, res) {
    const userId = req.params.userId;
    try {
      const count = await Notification.count({ where: { user_id: userId, read: false } });
      res.status(200).json({ unreadCount: count });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du nombre de notifications non lues', error: error.message });
    }
  }

  // Marquer une notification comme lue
  async markAsRead(req, res) {
    const notificationId = req.params.id;
    try {
      const notification = await Notification.findByPk(notificationId);
      if (notification) {
        notification.read = true;
        await notification.save();
        res.status(200).json(notification);
      } else {
        res.status(404).json({ message: 'Notification non trouvée' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la notification', error: error.message });
    }
  }

  // Ajouter une nouvelle notification
  async createNotification(req, res) {
    try {
      const newNotification = await Notification.create(req.body);
      res.status(201).json(newNotification);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de la notification', error: error.message });
    }
  }

  // Supprimer une notification
  async deleteNotification(req, res) {
    const notificationId = req.params.id;
    try {
      const notification = await Notification.findByPk(notificationId);
      if (notification) {
        await notification.destroy();
        res.status(204).json({ message: 'Notification supprimée avec succès' });
      } else {
        res.status(404).json({ message: 'Notification non trouvée' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de la notification', error: error.message });
    }
  }

  // Envoyer une notification
  async sendNotification(userId, message) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        console.error('Utilisateur non trouvé pour l\'ID:', userId);
        return;
      }

      let user_id = userId;
      console.log(userId, message);
      const notification = await Notification.create({ user_id, message });
      io.emit(`notification-${userId}`, notification);

      // Envoyer un e-mail
      const mailOptions = {
        from: 'tfeai2022@gmail.com',
        to: user.email,
        subject: 'Nouvelle Notification',
        text: message
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'email:', error);
        } else {
          console.log('Email envoyé:', info.response);
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  }
}

module.exports = new NotificationController();

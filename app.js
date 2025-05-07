require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const nodemailer = require('nodemailer');
//const { checkProjectDeadlines } = require('./cron_job/project_cronjobs');
//const { checkTaskDeadlines } = require('./cron_job/task_cronjobs');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const logsRoutes = require('./routes/log');
const notificationRoutes = require('./routes/notification');
const categoryRoutes = require('./routes/category');
const produitRoutes = require('./routes/produit');
const fournisseurRoutes = require('./routes/fournisseur');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Ajouter Socket.io au contrôleur des notifications
const NotificationController = require('./controllers/notificationController');
NotificationController.setIo(io);

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pour vérifier le token JWT et ajouter l'utilisateur au req si valide
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

// Serve static files from the uploads/profiles directory
app.use('/uploads/profiles', express.static('uploads/profiles'));
// Serve static files from the uploads/documents directory
app.use('/uploads/documents', express.static('uploads/documents'));

/* Configure la politique des ressources cross-origin (CORS)
app.use(helmet.crossOriginResourcePolicy({
  policy: "cross-origin"
}));
*/

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/api/logs', logsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/produit', produitRoutes);
app.use('/api/fournisseur', fournisseurRoutes);



// Fonction pour envoyer une notification
const sendNotification = async (userId, message) => {
  const notification = await Notification.create({ userId, message });
  io.emit(`notification-${userId}`, notification);

  // Envoyer un e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'user-email@example.com', // Change this to the actual user email
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
};

// Appel de la fonction checkProjectDeadlines
//checkProjectDeadlines(); // Appel immédiat lors du démarrage du serveur
//checkTaskDeadlines(); // Appel immédiat lors du démarrage du serveur

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).send({ error: 'Not found' });
});

// Gestion des autres erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

// Socket.io connexion
io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté');
  
  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;  // pour les tests et autres besoins

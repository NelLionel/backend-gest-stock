const { verifyToken } = require('../middleware/authJwt');
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/check-email', authController.checkEmailExists); // Ajoutez cette ligne
router.put('/:id/update-password', authController.updatePassword);
// router.get('/logout', authController.signout);

// Exemple de route protégée
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Access granted' });
});

module.exports = router;
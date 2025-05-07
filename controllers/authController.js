const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailService = require('../services/mailService');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
let io;
const config = require('../config/auth.config'); // Assurez-vous que le chemin est correct


// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tfeai2022@gmail.com',
      pass: 'ipxyiipmmgjoaisd'
    }
});

class AuthController {

    setIo(newIo) {
        io = newIo;
    }

    async register (req, res) {
        try {
            const { email, password, name, role, phone, address, company, profilePicture } = req.body;
    
            // Check if user already exists
            const existingUser = await User.findOne({ where: { email: email } });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }
            
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create the user
            const newUser = await User.create({ 
                email, 
                password: hashedPassword,
                name, 
                role, 
                phone,
                address, 
                company,
                profilePicture: 'images/profiles/profile-default.png',
            });
    
            // Generate a token
            const token = jwt.sign({ userId: newUser.id, email: newUser.email },  config.secret, { expiresIn: '1h' }); // Replace 'YOUR_SECRET_KEY' with a strong secret key
    
            // Store the token in the session
            // req.session.token = token;
    
            res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    async login (req, res) {
        try {
            const { email, password } = req.body;
    
            const user = await User.findOne({ where: { email } });
    
            if (!user) {
                return res.status(401).json({ error: "Email ou mot de passe incorrect" });
            }
    
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }
    
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                config.secret,
                { expiresIn: '1h' }
            );
    
            // Store the token in the session
            // req.session.token = token;
    
            res.status(200).json({token: token, user: user });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    };
    
    async forgetPassword (req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });
    
            if (!user) {
                return res.status(401).json({ error: 'Email not found' });
            }
    
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = await bcrypt.hash(resetToken, 10);
            
            user.resetToken = hashedToken;
            user.resetTokenExpiration = Date.now() + 3600000;  // 1 hour
            await user.save();
    
            //mailService.sendMail(email, 'Password Reset Link', `Click on the link to reset your password: http://localhost:4200/reset-password/${resetToken}`);
            //const message = "Click on the link to reset your password: http://localhost:4200/reset-password/${resetToken}"
            
            // Envoyer un e-mail
            const mailOptions = {
                from: 'tfeai2022@gmail.com',
                to: email,
                subject: 'Password Reset Link',
                text: `Click on the link to reset your password: http://localhost:4200/reset-password/${resetToken}`
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                console.error('Erreur lors de l\'envoi de l\'email:', error);
                } else {
                console.log('Email envoyé:', info.response);
                }
            });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    async updatePassword (req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.params.id; // Obtenir l'ID de l'utilisateur à partir des paramètres d'URL
    
            // Recherchez l'utilisateur par son ID
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
    
            // Vérifiez si l'ancien mot de passe correspond
            const validPassword = await bcrypt.compare(oldPassword, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
            }
    
            // Hash du nouveau mot de passe
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
            // Mettre à jour le mot de passe de l'utilisateur dans la base de données
            user.password = hashedNewPassword;
            await user.save();
    
            res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    async resetPassword (req, res) {
        try {
            const { token, newPassword } = req.body;
    
            const user = await User.findOne({
                where: {
                    resetToken: token,
                    resetTokenExpiration: { [Op.gt]: Date.now() }
                }
            });
    
            if (!user) {
                return res.status(401).json({ error: 'Token is invalid or has expired' });
            }
    
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetToken = null;
            user.resetTokenExpiration = null;
            await user.save();
    
            res.status(200).json({ message: 'Password updated successfully' });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    async checkEmailExists  (req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                console.log('No email provided in request body');
                return res.status(400).json({ error: 'Email is required' });
            }
            console.log('Email received:', email); // Ajoutez cette ligne pour debug
    
            const user = await User.findOne({ where: { email } });
    
            if (user) {
                res.status(200).json({ exists: true });
            } else {
                res.status(404).json({ exists: false, message: 'Email not found' });
            }
        } catch (error) {
            console.log('Error in checkEmailExists:', error); // Ajoutez cette ligne pour debug
            res.status(500).json({ error: error.message });
        }
    };
    
    
    // exports.signout = async (req, res) => {
    //     try {
    //         req.session.destroy((err) => {
    //             if (err) {
    //                 return res.status(500).send({ message: err.message });
    //             }
    //             res.status(200).send({ message: "You've been signed out!" });
    //         });
    //     } catch (error) {
    //         res.status(500).send({ message: error.message });
    //     }
    // };
}

module.exports = new AuthController();
const { User, Project, ManagerProjectMap } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { createLog2 } = require('./logController'); // Importer la fonction createLog2 pour enregistrer les journaux
const path = require('path');
const fs = require('fs');
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

class UserController {

  setIo(newIo) {
    io = newIo;
  }
  
  // Liste de tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);

      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a récupéré la liste de tous les utilisateurs`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'User',
      //   type_operation: 'retrieve_all'
      // };
      // await createLog2(user, message, data);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
    }
  }

  // Trouver un utilisateur spécifique par ID
  async getUserById(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);
      if (user) {
        res.status(200).json(user);

        // Enregistrer un journal après l'exécution réussie de la méthode
        // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
        // const message = `${user} a récupéré l'utilisateur avec l'ID ${userId}`;
        // const data = {
        //   id_user: req.user.id,
        //   model_name: 'User',
        //   type_operation: 'retrieve_by_id',
        //   id_model_object: userId
        // };
        // await createLog2(user, message, data);
      } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      console.log(req.body);
      // Hash du mot de passe avant de l'enregistrer dans la base de données
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
  
      const newUser = await User.create(req.body);
      console.log('new', newUser);
      
      // Envoyer un e-mail
      const mailOptions = {
        from: 'tfeai2022@gmail.com',
        to: newUser.email,
        subject: "Vos identifiants d'accès à CICA-BTP",
        text: `VOICI VOS INFORMATIONS D'ACCES À CICA-BTP \nEmail : ${newUser.email} \nMot de passe : password \nVeuillez changer votre mot de passe une fois connecté`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'email:', error);
          return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error: error.message });
        } else {
          console.log('Email envoyé:', info.response);
          return res.status(201).json(newUser);
        }
      });
  
      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a créé un nouvel utilisateur avec l'ID ${newUser.id}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'User',
      //   type_operation: 'create',
      //   id_model_object: newUser.id
      // };
      // await createLog2(user, message, data);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);
      if (user) {
        const updatedUser = await user.update(req.body);
        res.status(200).json(updatedUser);

        // Enregistrer un journal après l'exécution réussie de la méthode
        // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
        // const message = `${user} a mis à jour l'utilisateur avec l'ID ${userId}`;
        // const data = {
        //   id_user: req.user.id,
        //   model_name: 'User',
        //   type_operation: 'update',
        //   id_model_object: userId
        // };
        // await createLog2(user, message, data);
      } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error: error.message });
    }
  }

  async updateProfilePhoto(req, res) {
    const userId = req.params.id;
    const photoPath = req.file.path; // Chemin du fichier téléchargé
    const originalPhotoName = req.file.originalname; // Nom original de l'image

    try {
        const user = await User.findByPk(userId);
        if (user) {
            // Supprimer l'ancienne photo de profil si elle existe
            if (user.profilePicture) {
              const oldPhotoPath = path.join(__dirname, '..', '..', 'uploads', 'profiles', user.profilePicture);
              if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
              }
            }
            // Mettre à jour le chemin et le nom original de la photo de profil dans la base de données
            user.profilePicture = photoPath;
            user.originalPhotoName = originalPhotoName;
            await user.save();

            console.log('chemin', user.save())
            res.status(200).json(user);

            // Enregistrer un journal après l'exécution réussie de la méthode
            // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
            // const message = `${user} a mis à jour la photo de profil de l'utilisateur avec l'ID ${userId}`;
            // const data = {
            //   id_user: req.user.id,
            //   model_name: 'User',
            //   type_operation: 'update',
            //   id_model_object: userId
            // };
            // await createLog2(user, message, data);
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo de profil', error: error.message });
    }
  }

  // Methode pour supprimer un utilisateur
  async deleteUser(req, res) {
    const userId = req.params.id; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

    try {
      // Supprimer les entrées dans ManagerProjectMap associées à cet utilisateur
      await ManagerProjectMap.destroy({
        where: {
          id_manager: userId // Supprime toutes les entrées où l'utilisateur est le manager
        }
      });

      // Supprimer l'utilisateur de la table User
      await User.destroy({
        where: {
          id: userId
        }
      });

      res.status(204).json({ message: 'Utilisateur supprimé avec succès' });

      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a supprimé l'utilisateur avec l'ID ${userId}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'User',
      //   type_operation: 'delete',
      //   id_model_object: userId
      // };
      // await createLog2(user, message, data);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
    }
  }

  // Rechercher des utilisateurs par nom (ou autre attribut si nécessaire)
  async searchUsers(req, res) {
    const query = req.query.q;
    try {
      const users = await User.findAll({
        where: {
          name: {
            [Op.iLike]: '%' + query + '%'
          }
        }
      });
      res.status(200).json(users);

      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a recherché des utilisateurs avec le critère ${query}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'User',
      //   type_operation: 'search',
      //   search_query: query
      // };
      // await createLog2(user, message, data);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la recherche des utilisateurs', error: error.message });
    }
  }

}

module.exports = new UserController();

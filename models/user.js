'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {



      // User.belongsToMany(models.Skill, {
      //   through: 'UserSkillMap',
      //   as: 'skills',
      //   foreignKey: 'user_id',
      //   otherKey: 'skill_id'
      // });
    }
  }




  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Marquer la colonne 'id' comme clé primaire
      autoIncrement: true // Si la colonne 'id' est auto-incrémentée
    },
    name: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true // L'email doit être unique pour l'authentification
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    company: DataTypes.STRING,
    skill: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    salt: DataTypes.STRING, // Pour le sel utilisé lors de la cryptographie
    resetToken: DataTypes.STRING, // Pour la réinitialisation du mot de passe
    resetTokenExpiration: DataTypes.DATE, // Date d'expiration du token de réinitialisation
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
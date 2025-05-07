'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Marquer la colonne 'id' comme clé primaire
      autoIncrement: true // Si la colonne 'id' est auto-incrémentée
    },
    message: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    

  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};
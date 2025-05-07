'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fournisseur extends Model {
    static associate(models) {
      // Un fournisseur peut avoir plusieurs produits
      Fournisseur.hasMany(models.Produit, {
        foreignKey: 'fournisseurId',
        as: 'produits',
      });
    }
  }
  
  Fournisseur.init({
    nom: DataTypes.STRING,
    adresse: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Fournisseur',
  });
  
  return Fournisseur;
};

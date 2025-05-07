'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produit extends Model {
    static associate(models) {
      // Une relation "Produit" appartient à une "Category"
      Produit.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });
      
      // Une relation "Produit" appartient à un "Fournisseur"
      Produit.belongsTo(models.Fournisseur, {
        foreignKey: 'fournisseurId',
        as: 'fournisseur',
      });
    }
  }
  
  Produit.init({
    nom: DataTypes.STRING,
    description: DataTypes.TEXT,
    quantite: DataTypes.INTEGER,
    prix: DataTypes.FLOAT,
    categoryId: DataTypes.INTEGER,
    fournisseurId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Produit',
  });
  
  return Produit;
};

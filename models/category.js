'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Une catégorie peut avoir plusieurs produits
      Category.hasMany(models.Produit, {
        foreignKey: 'categoryId',
        as: 'produits',
      });
    }
  }
  
  Category.init({
    nom: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Category',
  });
  
  return Category;
};

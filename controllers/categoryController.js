const { Category } = require('../models');

class CategoryController {
  // Méthode pour créer une nouvelle catégorie
  async createCategory(req, res) {
    try {
      const newCategory = await Category.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer une catégorie spécifique par son ID
  async getCategoryById(req, res) {
    const categoryId = req.params.id;
    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer toutes les catégories
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching all categories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour mettre à jour une catégorie spécifique par son ID
  async updateCategory(req, res) {
    const categoryId = req.params.id;
    try {
      let category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Mettre à jour les attributs de la catégorie avec les données fournies dans le corps de la requête
      category = await category.update(req.body);

      res.status(200).json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour supprimer une catégorie spécifique par son ID
  async deleteCategory(req, res) {
    const categoryId = req.params.id;
    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await category.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new CategoryController();

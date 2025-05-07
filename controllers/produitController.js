const { Produit, Category, Fournisseur } = require('../models');

class ProduitController {
  // Méthode pour créer un nouveau produit
  async createProduit(req, res) {
    try {
      const { nom, description, quantite, prix, categoryId, fournisseurId } = req.body;
      
      // Créer le produit
      const newProduit = await Produit.create({
        nom,
        description,
        quantite,
        prix,
        categoryId,
        fournisseurId
      });
      
      res.status(201).json(newProduit);
    } catch (error) {
      console.error('Error creating produit:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer un produit spécifique par son ID
  async getProduitById(req, res) {
    const produitId = req.params.id;
    try {
      const produit = await Produit.findByPk(produitId, {
        include: [
          { model: Category, as: 'category' },
          { model: Fournisseur, as: 'fournisseur' }
        ]
      });
      
      if (!produit) {
        return res.status(404).json({ message: 'Produit not found' });
      }

      res.status(200).json(produit);
    } catch (error) {
      console.error('Error fetching produit by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer tous les produits
  async getAllProduits(req, res) {
    try {
      const produits = await Produit.findAll({
        include: [
          { model: Category, as: 'category' },
          { model: Fournisseur, as: 'fournisseur' }
        ]
      });
      
      res.status(200).json(produits);
    } catch (error) {
      console.error('Error fetching all produits:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour mettre à jour un produit spécifique par son ID
  async updateProduit(req, res) {
    const produitId = req.params.id;
    try {
      let produit = await Produit.findByPk(produitId);
      if (!produit) {
        return res.status(404).json({ message: 'Produit not found' });
      }

      // Mettre à jour les attributs du produit
      produit = await produit.update(req.body);
      
      res.status(200).json(produit);
    } catch (error) {
      console.error('Error updating produit:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour supprimer un produit spécifique par son ID
  async deleteProduit(req, res) {
    const produitId = req.params.id;
    try {
      const produit = await Produit.findByPk(produitId);
      if (!produit) {
        return res.status(404).json({ message: 'Produit not found' });
      }
      
      await produit.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting produit:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new ProduitController();

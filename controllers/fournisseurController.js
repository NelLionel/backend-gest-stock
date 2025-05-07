const { Fournisseur } = require('../models');

class FournisseurController {
  // Méthode pour créer un nouveau fournisseur
  async createFournisseur(req, res) {
    try {
      const { nom, adresse, email, telephone } = req.body;

      // Créer un fournisseur
      const newFournisseur = await Fournisseur.create({
        nom,
        adresse,
        email,
        telephone
      });

      res.status(201).json(newFournisseur);
    } catch (error) {
      console.error('Error creating fournisseur:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer un fournisseur spécifique par son ID
  async getFournisseurById(req, res) {
    const fournisseurId = req.params.id;
    try {
      const fournisseur = await Fournisseur.findByPk(fournisseurId, {
        include: {
          model: Produit,
          as: 'produits'
        }
      });

      if (!fournisseur) {
        return res.status(404).json({ message: 'Fournisseur not found' });
      }

      res.status(200).json(fournisseur);
    } catch (error) {
      console.error('Error fetching fournisseur by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer tous les fournisseurs
  async getAllFournisseurs(req, res) {
    try {
      const fournisseurs = await Fournisseur.findAll({
        include: {
          model: Produit,
          as: 'produits'
        }
      });

      res.status(200).json(fournisseurs);
    } catch (error) {
      console.error('Error fetching all fournisseurs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour mettre à jour un fournisseur par ID
  async updateFournisseur(req, res) {
    const fournisseurId = req.params.id;
    try {
      let fournisseur = await Fournisseur.findByPk(fournisseurId);
      if (!fournisseur) {
        return res.status(404).json({ message: 'Fournisseur not found' });
      }

      // Mettre à jour les informations du fournisseur
      fournisseur = await fournisseur.update(req.body);

      res.status(200).json(fournisseur);
    } catch (error) {
      console.error('Error updating fournisseur:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour supprimer un fournisseur par ID
  async deleteFournisseur(req, res) {
    const fournisseurId = req.params.id;
    try {
      const fournisseur = await Fournisseur.findByPk(fournisseurId);
      if (!fournisseur) {
        return res.status(404).json({ message: 'Fournisseur not found' });
      }

      await fournisseur.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting fournisseur:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new FournisseurController();

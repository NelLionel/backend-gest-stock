const { Worker } = require('../models');
const { Sequelize, Op } = require('sequelize');

class WorkerController {
  // Méthode pour créer un nouveau travailleur
  async createWorker(req, res) {
    try {
      const newWorker = await Worker.create(req.body);
      res.status(201).json(newWorker);

      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a créé un nouveau travailleur avec l'ID ${newWorker.id}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Worker',
      //   type_operation: 'create',
      //   id_model_object: newWorker.id
      // };
      // await createLog(user, message, data);
    } catch (error) {
      console.error('Error creating worker:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour supprimer un travailleur
  async deleteWorker(req, res) {
    const workerId = req.params.id;
    try {
      const worker = await Worker.findByPk(workerId);
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
      await worker.destroy();
      res.status(204).end();

      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a supprimé le travailleur avec l'ID ${workerId}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Worker',
      //   type_operation: 'delete',
      //   id_model_object: workerId
      // };
      // await createLog(user, message, data);
    } catch (error) {
      console.error('Error deleting worker:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer un worker spécifique par son ID
  async getWorkerById(req, res) {
    const workerId = req.params.id;
    try {
      const worker = await Worker.findByPk(workerId);
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
      res.status(200).json(worker);

      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a récupéré les détails du travailleur avec l'ID ${workerId}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Worker',
      //   type_operation: 'retrieve',
      //   id_model_object: workerId
      // };
      // await createLog(user, message, data);
    } catch (error) {
      console.error('Error fetching Worker by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour mettre à jour un worker spécifique par son ID
  async updateWorker(req, res) {
    const workerId = req.params.id;
    try {
      let worker = await Worker.findByPk(workerId);
      if (!worker) {
        return res.status(404).json({ message: 'worker not found' });
      }

      // Mettre à jour les attributs du worker avec les données fournies dans le corps de la requête
      worker = await worker.update(req.body);

      res.status(200).json(worker);

      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a mis à jour le travailleur avec l'ID ${workerId}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Worker',
      //   type_operation: 'update',
      //   id_model_object: workerId
      // };
      // await createLog(user, message, data);
    } catch (error) {
      console.error('Error updating worker:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer les travailleurs d'un projet spécifique
  async getWorkersByProject(req, res) {
    const projectId = req.params.projectId;
    try {
      const workers = await Worker.findAll({ where: { id_project: projectId } });

      // Enregistrer un journal après l'exécution réussie de la méthode
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a récupéré les travailleurs du projet avec l'ID ${projectId}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Worker',
      //   type_operation: 'retrieve_by_id',
      //   id_model_object: projectId
      // };
      // await createLog(user, message, data);

      res.status(200).json(workers);
    } catch (error) {
      console.error('Error fetching workers by project:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer tous les travailleurs
  async getAllWorkers(req, res) {
    try {
      const workers = await Worker.findAll();

      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a récupéré tous les travailleurs`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Worker',
      //   type_operation: 'retrieve_all'
      // };
      // await createLog(user, message, data);

      res.status(200).json(workers);
    } catch (error) {
      console.error('Error fetching all workers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new WorkerController();

const { Log } = require('../models');

class LogController {
    async createLog2(user, message, data) {
        try {
            await Log.create({
                message: message,
                data: data,
                user: user
            });
        } catch (error) {
            console.error('Error creating log:', error);
        }
    }
  // Méthode pour créer un nouveau log
  async createLog(req, res) {
    try {
      const newLog = await Log.create(req.body);
      res.status(201).json(newLog);
    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer un log spécifique par son ID
  async getLogById(req, res) {
    const logId = req.params.id;
    try {
      const log = await Log.findByPk(logId);
      if (!log) {
        return res.status(404).json({ message: 'Log not found' });
      }
      res.status(200).json(log);
    } catch (error) {
      console.error('Error fetching log by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour récupérer tous les logs
  async getAllLogs(req, res) {
    try {
      const logs = await Log.findAll();
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching all logs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour mettre à jour un log spécifique par son ID
  async updateLog(req, res) {
    const logId = req.params.id;
    try {
      let log = await Log.findByPk(logId);
      if (!log) {
        return res.status(404).json({ message: 'Log not found' });
      }

      // Mettre à jour les attributs du log avec les données fournies dans le corps de la requête
      log = await log.update(req.body);

      res.status(200).json(log);
    } catch (error) {
      console.error('Error updating log:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Méthode pour supprimer un log spécifique par son ID
  async deleteLog(req, res) {
    const logId = req.params.id;
    try {
      const log = await Log.findByPk(logId);
      if (!log) {
        return res.status(404).json({ message: 'Log not found' });
      }
      await log.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting log:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new LogController();

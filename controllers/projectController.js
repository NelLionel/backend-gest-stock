const { Project, TaskGroup, Task, User, TaskUserMap, Checklist, Comment } = require('../models');
const { createLog2 } = require('./logController');
const moment = require('moment'); // Import de Moment.js

const { Sequelize, Op } = require('sequelize');

class ProjectController {
  
  // Liste de tous les projets
  async getAllProjects(req, res) {
    try {
        const projects = await Project.findAll({
            include: [
                {
                    model: Task,
                    as: 'tasks',
                    include: [
                        {
                            model: Checklist,
                            as: 'checklists',
                        },
                        {
                            model: Comment,
                            as: 'comments',
                        },
                    ],
                },
            ],
        });

        const projectData = await Promise.all(
            projects.map(async (project) => {
                const totalTasks = project.tasks.length;
                const totalComments = project.tasks.reduce(
                    (sum, task) => sum + task.comments.length,
                    0
                );

                const totalChecklists = project.tasks.reduce(
                    (sum, task) => sum + task.checklists.length,
                    0
                );

                const totalDoneChecklists = project.tasks.reduce(
                    (sum, task) =>
                        sum +
                        task.checklists.filter(
                            (checklist) => checklist.status === 'done'
                        ).length,
                    0
                );

                const progressPercentage =
                    totalChecklists > 0
                        ? ((totalDoneChecklists / totalChecklists) * 100).toFixed(2)
                        : 0;

                return {
                    ...project.toJSON(),
                    totalTasks,
                    totalComments,
                    progressPercentage,
                };
            })
        );

        res.status(200).json(projectData);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des projets',
            error: error.message,
        });
    }
}


async getProjectsByClient(req, res) {
  try {
      const clientId = req.params.id;
      const projects = await Project.findAll({
          where: {
              client_id: clientId
          },
          include: [
              {
                  model: Task,
                  as: 'tasks',
                  include: [
                      {
                          model: Checklist,
                          as: 'checklists',
                      },
                      {
                          model: Comment,
                          as: 'comments',
                      },
                  ],
              },
          ],
      });

      const projectData = await Promise.all(
          projects.map(async (project) => {
              const totalTasks = project.tasks.length;
              const totalComments = project.tasks.reduce(
                  (sum, task) => sum + task.comments.length,
                  0
              );

              const totalChecklists = project.tasks.reduce(
                  (sum, task) => sum + task.checklists.length,
                  0
              );

              const totalDoneChecklists = project.tasks.reduce(
                  (sum, task) =>
                      sum +
                      task.checklists.filter(
                          (checklist) => checklist.status === 'done'
                      ).length,
                  0
              );

              const progressPercentage =
                  totalChecklists > 0
                      ? ((totalDoneChecklists / totalChecklists) * 100).toFixed(2)
                      : 0;

              return {
                  ...project.toJSON(),
                  totalTasks,
                  totalComments,
                  progressPercentage,
              };
          })
      );

      res.status(200).json(projectData);
  } catch (error) {
      res.status(500).json({
          message: 'Erreur lors de la récupération des projets',
          error: error.message,
      });
  }
}


  // La liste de tous les projet par site manager
  async getProjectsBySiteManager(req, res) {
    try {
        const siteManagerId = req.params.id;
        const projects = await Project.findAll({
            where: {
                siteManager_id: siteManagerId
            },
            include: [
                {
                    model: Task,
                    as: 'tasks',
                    include: [
                        {
                            model: Checklist,
                            as: 'checklists',
                        },
                        {
                            model: Comment,
                            as: 'comments',
                        },
                    ],
                },
            ],
        });

        const projectData = await Promise.all(
            projects.map(async (project) => {
                const totalTasks = project.tasks.length;
                const totalComments = project.tasks.reduce(
                    (sum, task) => sum + task.comments.length,
                    0
                );

                const totalChecklists = project.tasks.reduce(
                    (sum, task) => sum + task.checklists.length,
                    0
                );

                const totalDoneChecklists = project.tasks.reduce(
                    (sum, task) =>
                        sum +
                        task.checklists.filter(
                            (checklist) => checklist.status === 'done'
                        ).length,
                    0
                );

                const progressPercentage =
                    totalChecklists > 0
                        ? ((totalDoneChecklists / totalChecklists) * 100).toFixed(2)
                        : 0;

                return {
                    ...project.toJSON(),
                    totalTasks,
                    totalComments,
                    progressPercentage,
                };
            })
        );

        res.status(200).json(projectData);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des projets',
            error: error.message,
        });
    }
}


  async getProjectsForSiteManager(req, res) {
    try {
      const siteManagerId = req.params.id;

      // Récupérer tous les projets dont siteManager_id est égal à l'id de l'utilisateur connecté
      const projects = await Project.findAll({
        where: {
          siteManager_id: siteManagerId
        }
      });

      // Récupérer le total des tâches pour ces projets spécifiques
      const projectIds = projects.map(project => project.id);
      const totalTasks = await Task.count({
        where: {
          project_id: {
            [Op.in]: projectIds
          }
        }
      });

      // Récupérer le nombre de projets par statut
      const statusList = ['in-progress', 'late', 'completed', 'to-do'];
      const projectStatusCounts = await Project.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
        ],
        where: {
          siteManager_id: siteManagerId,
          status: {
            [Op.in]: statusList
          }
        },
        group: ['status']
      });

      // Récupérer le nombre de projets par type de projet
      const projectTypeCounts = await Project.findAll({
        attributes: [
          'project_type',
          [Sequelize.fn('COUNT', Sequelize.col('project_type')), 'count']
        ],
        where: {
          siteManager_id: siteManagerId
        },
        group: ['project_type']
      });

      // Préparer la réponse
      const response = {
        totalProjects: projects.length,
        totalTasks,
        projectStatusCounts,
        projectTypeCounts
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets pour le site manager:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des projets pour le site manager', error: error.message });
    }
  }


  async getProjectsForClient(req, res) {
    try {
      const clientId = req.params.id;

      // Récupérer tous les projets dont client_id est égal à l'id de l'utilisateur connecté
      const projects = await Project.findAll({
        where: {
          client_id: clientId
        }
      });

      // Récupérer le total des tâches pour ces projets spécifiques
      const projectIds = projects.map(project => project.id);
      const totalTasks = await Task.count({
        where: {
          project_id: {
            [Op.in]: projectIds
          }
        }
      });

      // Récupérer le nombre de projets par statut
      const statusList = ['in-progress', 'late', 'completed', 'to-do'];
      const projectStatusCounts = await Project.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
        ],
        where: {
          client_id: clientId,
          status: {
            [Op.in]: statusList
          }
        },
        group: ['status']
      });

      // Récupérer le nombre de projets par type de projet
      const projectTypeCounts = await Project.findAll({
        attributes: [
          'project_type',
          [Sequelize.fn('COUNT', Sequelize.col('project_type')), 'count']
        ],
        where: {
          client_id: clientId
        },
        group: ['project_type']
      });

      // Préparer la réponse
      const response = {
        totalProjects: projects.length,
        totalTasks,
        projectStatusCounts,
        projectTypeCounts
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets pour le client:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des projets pour le client', error: error.message });
    }
  }

  async getProjectStatistics(req, res) {
    try {
      // Nombre total de projets
      const totalProjects = await Project.count();

      // Nombre total de tâches tous projets confondus
      const totalTasks = await Task.count();

      // Statuts spécifiques à inclure dans les statistiques
      const statusList = ['in-progress', 'late', 'completed', 'to-do'];

      // Nombre total de projets par statut spécifique
      const projectStatusCounts = await Project.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
        ],
        where: {
          status: {
            [Op.in]: statusList
          }
        },
        group: ['status']
      });

      // Nombre total d'utilisateurs, excluant les utilisateurs avec le rôle 'admin'
      const totalUsers = await User.count({
        where: {
          role: {
            [Op.ne]: 'admin'
          }
        }
      });

      // Nombre total de projets par type de projet
      const projectTypeCounts = await Project.findAll({
        attributes: [
          'project_type',
          [Sequelize.fn('COUNT', Sequelize.col('project_type')), 'count']
        ],
        group: ['project_type']
      });

      // Calcul des statistiques des jours travaillés sur un projet par mois
      const projects = await Project.findAll();
      const today = moment();

      const projectWorkDaysByMonth = projects.map(project => {
        const startDate = moment(project.start_date);
        if (startDate.isAfter(today)) {
          return {
            projectId: project.id,
            projectName: project.name,
            monthsWorked: 0,
            totalDaysWorked: 0
          };
        }

        const totalDaysWorked = today.diff(startDate, 'days');
        const monthsWorked = today.diff(startDate, 'months');

        return {
          projectId: project.id,
          projectName: project.name,
          monthsWorked: monthsWorked,
          totalDaysWorked: totalDaysWorked
        };
      });

      // Préparation de la réponse JSON
      const statistics = {
        totalProjects,
        totalTasks,
        projectStatusCounts,
        totalUsers,
        projectTypeCounts,
        projectWorkDaysByMonth
      };

      res.status(200).json(statistics);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
    }
  }

  
  // Méthode pour récupérer le projet associé aux tâches gérées par un utilisateur spécifique
  async getProjectByTaskManager(req, res) {
    try {
      const managerId = req.params.id;

      // Trouver l'utilisateur dans la table intermédiaire TaskUserMap
      const taskUserMap = await TaskUserMap.findOne({
        where: {
          user_id: managerId
        }
      });

      if (!taskUserMap) {
        return res.status(404).json({ message: 'Aucune tâche trouvée pour cet utilisateur' });
      }

      // Trouver la tâche à partir de l'id de la tâche trouvée dans TaskUserMap
      const task = await Task.findByPk(taskUserMap.task_id);

      if (!task) {
        return res.status(404).json({ message: 'Aucune tâche trouvée pour cet utilisateur' });
      }

      // Récupérer le projet auquel appartient cette tâche
      const project = await Project.findByPk(task.project_id);

      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé pour cette tâche' });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error('Erreur lors de la récupération du projet pour le gestionnaire de tâche:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du projet pour le gestionnaire de tâche', error: error.message });
    }
  }



  // Fonction pour récupérer le nombre total de projets
  async getTotalProjects(req, res) {
    try {
      const totalProjects = await Project.count();
      // Enregistrer un journal après la récupération du nombre total de projets
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a récupéré le nombre total de projets`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Project',
      //   type_operation: 'retrieve'
      // };
      // await createLog2(user, message, data);
      
      res.status(200).json({ totalProjects });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du nombre total de projets', error: error.message });
    }
  }

  // Trouver un projet spécifique par ID
  async getProjectById(req, res) {
    const projectId = req.params.id;
    try {
      const project = await Project.findByPk(projectId);
      if (project) {
        // Enregistrer un journal après la récupération du projet par ID
        // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
        // const message = `${user} a récupéré le projet avec l'ID ${projectId}`;
        // const data = {
        //   id_user: req.user.id,
        //   model_name: 'Project',
        //   type_operation: 'retrieve_by_id',
        //   id_model_object: projectId
        // };
        // await createLog2(user, message, data);
        
        // Convertir la chaîne JSON en objet JavaScript
        const schedules = JSON.parse(project.schedules);
        // Remplacer l'attribut schedules de l'objet projet par l'objet JavaScript
        project.schedules = schedules;
        
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: 'Projet non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du projet', error: error.message });
    }
  }

  // Recuperer la date de debut du projet
  async getProjectHoraire(req, res) {
    const projectId = req.params.id;
    try {
      const project = await Project.findByPk(projectId);
      if (project) {
        // Enregistrer un journal après la récupération des horaires du projet par ID
        // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
        // const message = `${user} a récupéré les horaires du projet avec l'ID ${projectId}`;
        // const data = {
        //   id_user: req.user.id,
        //   model_name: 'Project',
        //   type_operation: 'retrieve_by_id',
        //   id_model_object: projectId
        // };
        // await createLog2(user, message, data);
        
        res.status(200).json({ start_date: project.start_date, expected_end_date: project.expected_end_date, schedules: JSON.parse(project.schedules)});
      } else {
        res.status(404).json({ message: 'Projet non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du projet', error: error.message });
    }
  }

  // Récupérer pour un projet tous les task group avec tous les task correspondant
  async getTaskGroupsAndTasksForProject(req, res) {
    const projectId = req.params.id;
    try {
      // Trouver le projet par ID avec ses task groups associés
      const projectWithTaskGroups = await Project.findByPk(projectId, {
        include: [{
          model: TaskGroup,
          as: 'task_group',
          include: {
            model: Task,
            as: 'tasks'
          }
        }]
      });

      if (!projectWithTaskGroups) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }

      // Enregistrer un journal après la récupération des task groups et des tasks pour le projet
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a récupéré les task groups et les tasks pour le projet avec l'ID ${projectId}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Project',
      //   type_operation: 'retrieve',
      //   id_model_object: projectId
      // };
      // await createLog2(user, message, data);
      
      // Retourner le projet avec les task groups et les tasks correspondants
      res.status(200).json(projectWithTaskGroups);
    } catch (error) {
      console.error('Erreur lors de la récupération des task groups et des tasks pour le projet :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des task groups et des tasks pour le projet' });
    }
  }


  // Ajouter un nouveau projet
  async createProject(req, res) {
    try {
      console.log(req.body);
      const newProject = await Project.create(req.body);
      
      // Enregistrer un journal après la création du projet
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a créé un nouveau projet avec l'ID ${newProject.id}`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Project',
      //   type_operation: 'create',
      //   id_model_object: newProject.id
      // };
      // await createLog2(user, message, data);
      
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création du projet', error: error.message });
    }
  }

  // Mettre à jour un projet
  async updateProject(req, res) {
    const projectId = req.params.id;
    try {
      const project = await Project.findByPk(projectId);
      if (project) {
        const updatedProject = await project.update(req.body);
        
        // Enregistrer un journal après la mise à jour du projet
        // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
        // const message = `${user} a mis à jour le projet avec l'ID ${projectId}`;
        // const data = {
        //   id_user: req.user.id,
        //   model_name: 'Project',
        //   type_operation: 'update',
        //   id_model_object: projectId
        // };
        // await createLog2(user, message, data);
        
        res.status(200).json(updatedProject);
      } else {
        res.status(404).json({ message: 'Projet non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du projet', error: error.message });
    }
  }

  // Mettre a jour le statut d'un projet
  async updateProjectStatus(req, res) {
    const projectId = req.params.id;
    const { status } = req.body;
    try {
      const project = await Project.findByPk(projectId);
      if (project) {
        await project.update({ status });
        
        // Enregistrer un journal après la mise à jour du statut du projet
        // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
        // const message = `${user} a mis à jour le statut du projet avec l'ID ${projectId}`;
        // const data = {
        //   id_user: req.user.id,
        //   model_name: 'Project',
        //   type_operation: 'update',
        //   id_model_object: projectId,
        //   new_status: status
        // };
        // await createLog2(user, message, data);
        
        res.status(200).json({ message: 'Statut du projet mis à jour avec succès' });
      } else {
        res.status(404).json({ message: 'Projet non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du statut du projet', error: error.message });
    }
  }

  // Ajouter une nouvelle méthode pour mettre à jour les horaires d'un projet
  async updateProjectSchedules(req, res) {
    const projectId = req.params.id;
    const { schedules } = req.body; // Récupérer les nouveaux horaires à partir du corps de la requête

    try {
      const project = await Project.findByPk(projectId);
      if (project) {
        // Mettre à jour uniquement l'attribut 'schedules' du projet
        await project.update({ schedules });
        
        // Enregistrer un journal après la mise à jour des horaires du projet
        // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
        // const message = `${user} a mis à jour les horaires du projet avec l'ID ${projectId}`;
        // const data = {
        //   id_user: req.user.id,
        //   model_name: 'Project',
        //   type_operation: 'update',
        //   id_model_object: projectId
        // };
        // await createLog2(user, message, data);
        
        res.status(200).json({ message: 'Horaires du projet mis à jour avec succès' });
      } else {
        res.status(404).json({ message: 'Projet non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour des horaires du projet', error: error.message });
    }
  }


  // Supprimer un projet
  async deleteProject(req, res) {
    const projectId = req.params.id;
    try {
      const project = await Project.findByPk(projectId);
      if (project) {
        await project.destroy();
        
        // Enregistrer un journal après la suppression du projet
        // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
        // const message = `${user} a supprimé le projet avec l'ID ${projectId}`;
        // const data = {
        //   id_user: req.user.id,
        //   model_name: 'Project',
        //   type_operation: 'delete',
        //   id_model_object: projectId
        // };
        // await createLog2(user, message, data);
        
        res.status(204).json({ message: 'Projet supprimé avec succès' });
      } else {
        res.status(404).json({ message: 'Projet non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du projet', error: error.message });
    }
  }

  // Rechercher des projets par nom (ou autre attribut si nécessaire)
  async searchProjects(req, res) {
    const query = req.query.q;
    try {
      const projects = await Project.findAll({
        where: {
          name: {
            [Op.iLike]: '%' + query + '%'
          }
        }
      });
      
      // Enregistrer un journal après la recherche des projets
      // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
      // const message = `${user} a effectué une recherche de projets avec le terme "${query}"`;
      // const data = {
      //   id_user: req.user.id,
      //   model_name: 'Project',
      //   type_operation: 'search',
      //   search_term: query
      // };
      // await createLog2(user, message, data);
      
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la recherche des projets', error: error.message });
    }
  }

  async getProjectGanttTasks(req, res) {
    const projectId = req.params.id;
  
    try {
      const project = await Project.findByPk(projectId, {
        include: [{
          model: TaskGroup,
          as: 'task_group',
          include: {
            model: Task,
            as: 'tasks'
          }
        }, {
          model: Task,
          as: 'tasks'
        }]
      });
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      const calculateProgress = (startDate, endDate) => {
        if (!startDate || !endDate) {
          return 0;
        }
  
        const start = new Date(startDate.split('-').reverse().join('-')).getTime();
        const end = new Date(endDate.split('-').reverse().join('-')).getTime();
        const today = new Date().getTime();
  
        if (isNaN(start) || isNaN(end)) {
          return 0;
        }
  
        if (start > today) {
          return 0;
        }
  
        const totalDuration = end - start;
        const elapsedDuration = Math.min(today - start, totalDuration);
  
        return Math.max(Math.floor((elapsedDuration / totalDuration) * 100), 0);
      };
  
      const isValidDate = (date) => {
        const [day, month, year] = date.split('-');
        const parsedDate = new Date(`${year}-${month}-${day}`);
        return !isNaN(parsedDate.getTime());
      };
  
      const formatDateString = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
      };
  
      let uniqueIdCounter = 1;
      const generateUniqueId = () => uniqueIdCounter++;
  
      const tasks = project.tasks.map(task => ({
        id: generateUniqueId(),
        originalId: task.id,
        name: task.name,
        start: isValidDate(task.start_date) ? formatDateString(new Date(task.start_date.split('-').reverse().join('-'))) : null,
        end: isValidDate(task.expected_end_date) ? formatDateString(new Date(task.expected_end_date.split('-').reverse().join('-'))) : null,
        progress: isValidDate(task.start_date) && isValidDate(task.expected_end_date) 
          ? calculateProgress(formatDateString(new Date(task.start_date.split('-').reverse().join('-'))), formatDateString(new Date(task.expected_end_date.split('-').reverse().join('-'))))
          : 0,
        dependencies: task.task_group_id ? task.task_group_id.toString() : ''
      }));
  
      const taskGroups = project.task_group.map(group => {
        const groupTasks = group.tasks.filter(task => isValidDate(task.start_date) && isValidDate(task.expected_end_date));
        const startDates = groupTasks.map(task => new Date(task.start_date.split('-').reverse().join('-')));
        const endDates = groupTasks.map(task => new Date(task.expected_end_date.split('-').reverse().join('-')));
  
        const groupStart = startDates.length ? new Date(Math.min(...startDates)) : null;
        const groupEnd = endDates.length ? new Date(Math.max(...endDates)) : null;
  
        const groupStartStr = groupStart ? formatDateString(groupStart) : null;
        const groupEndStr = groupEnd ? formatDateString(groupEnd) : null;
  
        return {
          id: generateUniqueId(),
          originalId: group.id,
          name: group.name,
          start: groupStartStr,
          end: groupEndStr,
          progress: groupStartStr && groupEndStr 
            ? calculateProgress(groupStartStr, groupEndStr)
            : 0,
          dependencies: ''
        };
      });
  
      let ganttTasks = [];
      const usedIds = new Set();
      const originalIdToNewIdMap = new Map();
  
      taskGroups.forEach(group => {
        if (!usedIds.has(group.id)) {
          group.progress = calculateProgress(group.start, group.end);
          ganttTasks.push(group);
          usedIds.add(group.id);
          originalIdToNewIdMap.set(group.originalId, group.id);
  
          const dependentTasks = tasks.filter(task => task.dependencies === group.originalId.toString());
          dependentTasks.forEach(task => {
            task.dependencies = group.id.toString();
            if (!usedIds.has(task.id)) {
              ganttTasks.push(task);
              usedIds.add(task.id);
            }
          });
        }
      });
  
      tasks.forEach(task => {
        if (!originalIdToNewIdMap.has(task.originalId)) {
          if (!usedIds.has(task.id)) {
            ganttTasks.push(task);
            usedIds.add(task.id);
          }
        }
      });
  
      return res.json(ganttTasks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while fetching project tasks and task groups' });
    }
  }
}  

function calculateProgress(projectStart, startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const today = new Date().getTime();

  const totalDuration = end - start;
  const elapsedDuration = Math.min(today - start, totalDuration);

  return Math.max(Math.floor((elapsedDuration / totalDuration) * 100), 0);
}

module.exports = new ProjectController();

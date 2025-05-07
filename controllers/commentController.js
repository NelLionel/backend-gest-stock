const { Comment, User, ResponseComment } = require('../models');
const { createLog2 } = require('./logController');

class CommentController {
  
    async createComment(req, res) {
        try {
            const { task_id, user_id, text } = req.body;
            const comment = await Comment.create({ task_id: task_id, user_id: user_id, text });
            
            // Enregistrer un journal après la création du commentaire
            // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
            // const message = `${user} a créé un commentaire pour la tâche avec l'ID ${task_id}`;
            // const data = {
            //     id_user: req.user.id,
            //     model_name: 'Comment',
            //     id_model_object: comment.id,
            //     type_operation: 'create'
            // };
            // await createLog2(user, message, data);
            
            res.status(201).json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création du commentaire.' });
        }
    }

    async createResponse(req, res) {
        try {
            const { taskId, mainCommentId, text } = req.body;
            const response = await Comment.create({ task_id: taskId, main_comment_id: mainCommentId, text });
            
            // Enregistrer un journal après la création de la réponse au commentaire
            // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
            // const message = `${user} a créé une réponse pour le commentaire principal avec l'ID ${mainCommentId}`;
            // const data = {
            //     id_user: req.user.id,
            //     model_name: 'ResponseComment',
            //     id_model_object: response.id,
            //     type_operation: 'create'
            // };
            // await createLog2(user, message, data);
            
            res.status(201).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création de la réponse.' });
        }
    }

    async updateComment(req, res) {
        try {
            const { commentId } = req.params;
            const { text } = req.body;
            await Comment.update({ text }, { where: { id: commentId } });
            
            // Enregistrer un journal après la mise à jour du commentaire
            // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
            // const message = `${user} a mis à jour le commentaire avec l'ID ${commentId}`;
            // const data = {
            //     id_user: req.user.id,
            //     model_name: 'Comment',
            //     id_model_object: commentId,
            //     type_operation: 'update'
            // };
            // await createLog2(user, message, data);
            
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la modification du commentaire.' });
        }
    }

    async deleteComment(req, res) {
        try {
            const { commentId } = req.params;
            await Comment.destroy({ where: { id: commentId } });
            
            // Enregistrer un journal après la suppression du commentaire
            // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
            // const message = `${user} a supprimé le commentaire avec l'ID ${commentId}`;
            // const data = {
            //     id_user: req.user.id,
            //     model_name: 'Comment',
            //     id_model_object: commentId,
            //     type_operation: 'delete'
            // };
            // await createLog2(user, message, data);
            
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du commentaire.' });
        }
    }

    // Déclarez la méthode includeResponses comme une méthode de classe ou utilisez une fonction fléchée
    includeResponses = async (comments) => {
        for (const comment of comments) {
            const responses = await comment.get('response_comments');
            if (responses.length > 0) {
                // Récupérez les réponses des réponses de manière récursive
                comment.dataValues.responses = await this.includeResponses(responses);
            }
        }
        return comments;
    }
  
    /*async getAllComments(req, res) {
        const taskId = req.params.taskId;
        try {
            // Récupérer tous les commentaires pour la tâche spécifiée
            const topLevelComments = await Comment.findAll({
                where: { task_id: taskId },
                include: [],
                raw: true
            });

            // Fonction récursive pour inclure toutes les réponses
            const includeResponses = async (comments) => {
                for (const comment of comments) {
                    const subComments = await Comment.findAll({
                        where: { main_comment_id: comment.id },
                        raw: true
                    });

                    if (subComments.length > 0) {
                        comment.sub_comments = await includeResponses(subComments);
                    }
                }
                return comments;
            };

            // Inclure toutes les réponses pour chaque commentaire de niveau supérieur
            const commentsWithResponses = await includeResponses(topLevelComments);
            
            // Enregistrer un journal après la récupération de tous les commentaires
            // const user = req.user.name; // Obtenez le nom de l'utilisateur connecté
            // const message = `${user} a récupéré tous les commentaires pour la tâche avec l'ID ${taskId}`;
            // const data = {
            //     id_user: req.user.id,
            //     model_name: 'Comment',
            //     type_operation: 'retrieve_all'
            // };
            // await createLog2(user, message, data);

            res.status(200).json(commentsWithResponses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commentaires.' });
        }
    }*/
  

    async getAllComments(req, res) {
        const taskId = req.params.taskId;
        try {
            // Récupérer tous les commentaires de niveau supérieur pour la tâche spécifiée, en incluant les informations de l'utilisateur
            const topLevelComments = await Comment.findAll({
                where: { task_id: taskId },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email', 'profilePicture'] // Sélectionner les attributs que vous voulez récupérer
                    }
                ]
            });
    
            // Fonction récursive pour inclure toutes les réponses
            const includeResponses = async (comments) => {
                for (const comment of comments) {
                    const subComments = await Comment.findAll({
                        where: { main_comment_id: comment.id },
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['id', 'name', 'email', 'profilePicture']
                            }
                        ]
                    });
    
                    if (subComments.length > 0) {
                        comment.sub_comments = await includeResponses(subComments);
                    }
                }
                return comments;
            };
    
            // Inclure toutes les réponses pour chaque commentaire de niveau supérieur
            const commentsWithResponses = await includeResponses(topLevelComments);
    
            res.status(200).json(commentsWithResponses);
        } catch (error) {
            console.error("Error in getAllComments:", error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commentaires.' });
        }
    }
        
}

module.exports = new CommentController();

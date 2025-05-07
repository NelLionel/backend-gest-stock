'use strict';
const bcrypt = require('bcrypt');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     // Création d'un utilisateur admin
     await queryInterface.bulkInsert('Users', [{
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('password', 10), // Remplacer 'password' par le mot de passe réel
      role: 'admin',
      company: 'Company1',
      phone: '1234567890',
      address: '123 Admin St',
      salt: 'salt', // Ajoutez la valeur réelle si nécessaire
      resetToken: 'resetToken', // Ajoutez la valeur réelle si nécessaire
      resetTokenExpiration: new Date(), // Ajoutez la valeur réelle si nécessaire
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // // Création d'un utilisateur project manager
    // await queryInterface.bulkInsert('Users', [{
    //   name: 'Project Manager',
    //   email: 'projectmanager@example.com',
    //   password: await bcrypt.hash('password', 10), // Remplacer 'password' par le mot de passe réel
    //   role: 'projectManager',
    //   company: 'Company2',
    //   phone: '2345678901',
    //   address: '456 Project St',
    //   salt: 'salt', // Ajoutez la valeur réelle si nécessaire
    //   resetToken: 'resetToken', // Ajoutez la valeur réelle si nécessaire
    //   resetTokenExpiration: new Date(), // Ajoutez la valeur réelle si nécessaire
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);

    // // Création d'un responsable de tâche
    // await queryInterface.bulkInsert('Users', [{
    //   name: 'Manager Task 1',
    //   email: 'managertask1@example.com',
    //   password: await bcrypt.hash('password', 10), // Remplacer 'password' par le mot de passe réel
    //   role: 'taskManager',
    //   company: 'Company Task',
    //   skill: 'Compétence en Electronique',
    //   phone: '234567890158',
    //   address: '4568 Task St',
    //   salt: 'salt', // Ajoutez la valeur réelle si nécessaire
    //   resetToken: 'resetToken', // Ajoutez la valeur réelle si nécessaire
    //   resetTokenExpiration: new Date(), // Ajoutez la valeur réelle si nécessaire
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);

    // // Création d'un responsable de tâche
    // await queryInterface.bulkInsert('Users', [{
    //   name: 'Manager Task 2',
    //   email: 'managertask2@example.com',
    //   password: await bcrypt.hash('password', 10), // Remplacer 'password' par le mot de passe réel
    //   role: 'taskManager',
    //   company: 'Company Task',
    //   skill: 'Compétence en Maçonnerie',
    //   phone: '234567890158',
    //   address: '4568 Task St',
    //   salt: 'salt', // Ajoutez la valeur réelle si nécessaire
    //   resetToken: 'resetToken', // Ajoutez la valeur réelle si nécessaire
    //   resetTokenExpiration: new Date(), // Ajoutez la valeur réelle si nécessaire
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);

    // // Création d'un utilisateur site manager
    // await queryInterface.bulkInsert('Users', [{
    //   name: 'Site Manager',
    //   email: 'sitemanager@example.com',
    //   password: await bcrypt.hash('password', 10), // Remplacer 'password' par le mot de passe réel
    //   role: 'siteManager',
    //   company: 'Company3',
    //   phone: '3456789012',
    //   address: '789 Site St',
    //   salt: 'salt', // Ajoutez la valeur réelle si nécessaire
    //   resetToken: 'resetToken', // Ajoutez la valeur réelle si nécessaire
    //   resetTokenExpiration: new Date(), // Ajoutez la valeur réelle si nécessaire
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);

    // // Création d'un utilisateur client
    // await queryInterface.bulkInsert('Users', [{
    //   name: 'Client',
    //   email: 'client@example.com',
    //   password: await bcrypt.hash('password', 10), // Remplacer 'password' par le mot de passe réel
    //   role: 'client',
    //   company: 'Company4',
    //   phone: '4567890123',
    //   address: '987 Client St',
    //   salt: 'salt', // Ajoutez la valeur réelle si nécessaire
    //   resetToken: 'resetToken', // Ajoutez la valeur réelle si nécessaire
    //   resetTokenExpiration: new Date(), // Ajoutez la valeur réelle si nécessaire
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);

    // // Création d'un utilisateur works manager
    // await queryInterface.bulkInsert('Users', [{
    //   name: 'Works Manager',
    //   email: 'worksmanager@example.com',
    //   password: await bcrypt.hash('password', 10), // Remplacer 'password' par le mot de passe réel
    //   role: 'worksManager',
    //   company: 'Company5',
    //   phone: '5678901234',
    //   address: '654 Works St',
    //   salt: 'salt', // Ajoutez la valeur réelle si nécessaire
    //   resetToken: 'resetToken', // Ajoutez la valeur réelle si nécessaire
    //   resetTokenExpiration: new Date(), // Ajoutez la valeur réelle si nécessaire
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);
  },

  async down (queryInterface, Sequelize) {
    // Supprimer tous les utilisateurs
    await queryInterface.bulkDelete('Users', null, {});
  }
};

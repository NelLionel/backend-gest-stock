'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true, 
        defaultValue: '' 
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        asIn: ['admin', 'projetManager', 'taskManager', 'siteManager', 'client', 'worksManager'],
        allowNull: false
      },
      company: {
        type: Sequelize.STRING,
        allowNull: true
      },
      skill: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING, 
        allowNull: true
      },

      resetToken: {
        type: Sequelize.STRING, 
        allowNull: true
      },

      resetTokenExpiration: {
        type: Sequelize.DATE, 
        allowNull: true
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
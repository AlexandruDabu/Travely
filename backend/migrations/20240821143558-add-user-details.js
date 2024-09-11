'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'country', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown'
    });

    await queryInterface.addColumn('Users', 'city', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown'
    });

    await queryInterface.addColumn('Users', 'bio', {
      type: DataTypes.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'imageurl', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'imageurl');
    await queryInterface.removeColumn('Users', 'bio');
    await queryInterface.removeColumn('Users', 'city');
    await queryInterface.removeColumn('Users', 'country');
  }
};

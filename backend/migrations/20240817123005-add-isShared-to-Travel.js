'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Travels', 'isShared', {
      type:Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Travels', 'isShared')
  }
};

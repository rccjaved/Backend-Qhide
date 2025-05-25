'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('appointments', 'actual_start_time', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('appointments', 'average_wait_seconds', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('appointments', 'average_wait_seconds');
    await queryInterface.removeColumn('appointments', 'actual_start_time');
  }
};

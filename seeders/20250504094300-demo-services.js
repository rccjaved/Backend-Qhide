'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('services', [
      {
        id: 1,
        name: 'Cardiology',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Dermatology',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('services', null, {});
  }
};

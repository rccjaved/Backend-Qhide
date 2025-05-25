'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('hospitals', [
      {
        id: 1,
        name: 'City Hospital',
        latitude: 40.7128,
        longitude: -74.0060,
        city: 'New York',
        address: '123 City St',
        phone: '123-456-7890',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Green Valley Hospital',
        latitude: 34.0522,
        longitude: -118.2437,
        city: 'Los Angeles',
        address: '456 Valley Rd',
        phone: '098-765-4321',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hospitals', null, {});
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      { 
        id: 1,
        name: 'admin', 
        created_at: new Date(), 
        updated_at: new Date() 
      },
      { 
        id: 2,
        name: 'user', 
        created_at: new Date(), 
        updated_at: new Date() 
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tickets', [
      {
        user_id: 1,  // User John Doe
        hospital_id: 1,
        service_id: 1,
        ticket_number: 'TKT001',
        status: 'pending',
        estimated_wait_time: 30,
        created_at	: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,  // User Jane Doe
        hospital_id: 2,
        service_id: 2,
        ticket_number: 'TKT002',
        status: 'completed',
        estimated_wait_time: 45,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tickets', null, {});
  }
};

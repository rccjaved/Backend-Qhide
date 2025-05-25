'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('hospital_services', [ // <-- lowercase snake_case
      {
        hospital_id: 1,
        service_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        hospital_id: 2,
        service_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hospital_services', null, {}); // <-- also here
  }
};

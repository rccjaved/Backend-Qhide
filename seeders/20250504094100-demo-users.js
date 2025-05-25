'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    const hashedPassword1 = await bcrypt.hash('hashedpassword123', saltRounds);
    const hashedPassword2 = await bcrypt.hash('hashedpassword456', saltRounds);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword1,
        phone: '1112223333',
        gender: 'other',
        city: 'Chicago',
        country: 'USA',
        address: '789 Admin Blvd',
        role_id: 1, 
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()

      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword2,
        phone: '0987654321',
        gender: 'female',
        city: 'Los Angeles',
        country: 'USA',
        address: '456 Elm St',
        role_id: 2, 
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword2,
        phone: '1234567890',
        gender: 'male',
        city: 'New York',
        country: 'USA',
        address: '123 Main St',
        role_id: 2,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};

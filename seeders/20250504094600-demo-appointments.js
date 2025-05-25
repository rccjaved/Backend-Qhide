'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('appointments', [
      {
        user_id: 1,
        hospital_id: 4,
        slot_date: '2025-05-10',
        slot_time: '10:00:00',
        doctor_name: 'Dr. Anhar Basunbul',
        specialty: 'Cardiology',
        expected_queue_number: 1,
        status: 'confirmed',
        notes: 'Routine heart check-up',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        hospital_id: 4,
        slot_date: '2025-05-10',
        slot_time: '10:30:00',
        doctor_name: 'Dr. Osama Bawazeer',
        specialty: 'Dermatology',
        expected_queue_number: 2,
        status: 'pending',
        notes: 'Skin rash consultation',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 3,
        hospital_id: 4,
        slot_date: '2025-05-11',
        slot_time: '11:00:00',
        doctor_name: 'Dr. Watfah',
        specialty: 'Pediatrics',
        expected_queue_number: 3,
        status: 'confirmed',
        notes: 'Child vaccination',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        hospital_id: 4,
        slot_date: '2025-05-06',
        slot_time: '11:00:00',
        doctor_name: 'Dr. Ahmed Zmi',
        specialty: 'ENT',
        expected_queue_number: 4,
        status: 'confirmed',
        notes: 'Needs to check ears',
        created_at: new Date(),
        updated_at: new Date()
      },
      
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('appointments', null, {});
  }
};

// models/appointment.js

module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    hospital_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    slot_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    slot_time: {
      type: DataTypes.TIME,
      allowNull: false
    },

    doctor_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    specialty: {
      type: DataTypes.STRING,
      allowNull: true
    },

    expected_queue_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },

    status: {
      type: DataTypes.ENUM('pending','confirmed','cancelled','completed'),
      allowNull: false,
      defaultValue: 'pending'
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // ← New columns:
    actual_start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },

    average_wait_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    }

  }, {
    tableName: 'appointments',
    underscored: true,
    timestamps: true
  });

  Appointment.associate = models => {
    Appointment.belongsTo(models.User,     { foreignKey: 'user_id' });
    Appointment.belongsTo(models.Hospital, { foreignKey: 'hospital_id' });
    Appointment.hasOne(models.AppointmentTicket, { foreignKey: 'appointment_id' });
    // If you have HospitalQueue or other models, you can add more associations here
  };

  return Appointment;
};

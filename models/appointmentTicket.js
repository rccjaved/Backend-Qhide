module.exports = (sequelize, DataTypes) => {
    const AppointmentTicket = sequelize.define('AppointmentTicket', {
      appointment_id: { type: DataTypes.INTEGER, unique: true },
      ticket_number: DataTypes.INTEGER,
      generated_at: DataTypes.DATE
    }, {
      tableName: 'appointment_tickets',
      timestamps: false
    });
    AppointmentTicket.associate = models => {
      AppointmentTicket.belongsTo(models.Appointment, { foreignKey: 'appointment_id' });
    };
    return AppointmentTicket;
  };
  
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hospital_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ticket_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    estimated_wait_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'tickets',
    underscored: true,
    timestamps: true 
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, { foreignKey: 'user_id' });
    Ticket.belongsTo(models.Hospital, { foreignKey: 'hospital_id' });
    Ticket.belongsTo(models.Service, { foreignKey: 'service_id' });
  };

  return Ticket;
};

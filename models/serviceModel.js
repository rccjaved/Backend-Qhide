'use strict';

module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'services',
    underscored: true,
    timestamps: true
  });

  Service.associate = (models) => {
    Service.belongsToMany(models.Hospital, {
      through: 'hospital_services',
      foreignKey: 'service_id'
    });
  };

  return Service;
};

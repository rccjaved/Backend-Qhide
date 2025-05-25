'use strict';
module.exports = (sequelize, DataTypes) => {
  const HospitalService = sequelize.define('HospitalService', {
    hospital_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Hospitals',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Services',
        key: 'id'
      }
    }
  }, {
    tableName: 'hospital_services',
    underscored: true,
    timestamps: true
  });

  return HospitalService;
};

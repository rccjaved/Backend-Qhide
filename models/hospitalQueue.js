module.exports = (sequelize, DataTypes) => {
    const HospitalQueue = sequelize.define('HospitalQueue', {
      hospital_id: { type: DataTypes.INTEGER, primaryKey: true },
      current_number: DataTypes.INTEGER,
      updated_at: DataTypes.DATE
    }, {
      tableName: 'hospital_queues',
      timestamps: false
    });
    HospitalQueue.associate = models => {
      HospitalQueue.belongsTo(models.Hospital, { foreignKey: 'hospital_id' });
    };
    return HospitalQueue;
  };
  
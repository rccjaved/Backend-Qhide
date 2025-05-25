// models/hospital.js
module.exports = (sequelize, DataTypes) => {
    const Hospital = sequelize.define('Hospital', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'hospitals',
      timestamps: true,
      underscored: true
    });
  
    // Define associations here
    Hospital.associate = (models) => {
      // Adding the many-to-many relationship with Service
      Hospital.belongsToMany(models.Service, { 
        through: 'hospital_services', // Junction table name
        foreignKey: 'hospital_id' 
      });
  
      // You can also add other associations as needed
      // For example, if a hospital has many tickets, you can use:
      // Hospital.hasMany(models.Ticket, { foreignKey: 'hospital_id' });
    };
  
    return Hospital;
  };
  
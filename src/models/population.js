'use strict';
module.exports = (sequelize, DataTypes) => {
  const Population = sequelize.define('Population', {
    location_id: DataTypes.INTEGER,
    male: DataTypes.INTEGER,
    female: DataTypes.INTEGER,
    total: DataTypes.INTEGER
  }, {});
  Population.associate = function(models) {
    // associations can be defined here
    Population.belongsTo(models.Location, {
      foreignKey: 'location_id'
    })
  };
  return Population;
};
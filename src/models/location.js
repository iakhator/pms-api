'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    location_name: DataTypes.STRING,
    sub_location: DataTypes.STRING,
    parent: DataTypes.BOOLEAN
  }, {});
  Location.associate = function(models) {
    // associations can be defined here
    Location.hasOne(models.Population, {
      foreignKey: 'location_id'
    })
  };
  return Location;
};
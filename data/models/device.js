module.exports = function (sequelize, DataTypes) {
  const device = sequelize.define('device', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    tableName: 'device'
  });
  device.associate = function (models) {
    device.hasOne(models.apiSession);
    device.belongsToMany(models.notification, {
      through: models.notificationByDevice
    });
  }
  return device;
}

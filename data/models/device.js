module.exports = function (sequelize, DataTypes) {
  const device = sequelize.define('device', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      nullable: true
    },
    os: {
      type: DataTypes.STRING,
      nullable: true
    },
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

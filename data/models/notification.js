const uuidv4 = require('uuid/v4');

module.exports = function (sequelize, DataTypes) {
  const notification = sequelize.define('notification', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    tableName: 'notification'
  });
  notification.associate = function (models) {
    notification.belongsToMany(models.users, {
      through: models.notificationByUser,
      foreignKey: 'notificationId',
      otherKey: 'userId'
    });
    notification.belongsToMany(models.device, {
      through: models.notificationByDevice,
      foreignKey: 'notificationId',
      otherKey: 'deviceId'
    });
  }
  return notification;
}

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
    data: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        try {
          return JSON.parse(this.getDataValue('data'));
        } catch(ex) {
          return this.getDataValue('data');
        }
      },
      set(val) {
        this.setDataValue('data', JSON.stringify(val));
      },
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
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

/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notificationByDevice', {
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'device',
        key: 'id'
      }
    },
    notificationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notification',
        key: 'id'
      }
    },
    received: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    }
  }, {
    tableName: 'notificationByDevice',
    freezeTableName: true,
    defaultScope: {
      attributes: []
    }
  });
};

/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notificationByUser', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    }
  }, {
    tableName: 'notificationByUser',
    freezeTableName: true,
    defaultScope: {
      attributes: [
        'notificationId',
        'userId'
      ]
    }
  });
};

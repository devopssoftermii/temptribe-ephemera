const uuidv4 = require('uuid/v4');

module.exports = function (sequelize, DataTypes) {
  const apiSession = sequelize.define('apiSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: function () {
        return uuidv4();
      },
      primaryKey: true
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'apiSession'
  });
  apiSession.associate = function (models) {
    apiSession.belongsTo(models.users);
    apiSession.hasOne(models.device);
  }
  return apiSession;
}

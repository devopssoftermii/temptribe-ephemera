module.exports = function(sequelize, DataTypes) {
  const apiSession = sequelize.define('apiSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  }, {
    tableName: 'apiSession'
  });
  apiSession.associate = function(models) {
    apiSession.belongsTo(models.users);
  }
  return apiSession;
}

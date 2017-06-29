module.exports = function(sequelize, DataTypes) {
  const APISession = sequelize.define('apiSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  }, {
    tableName: 'apiSession'
  });
  APISession.associate = function(models) {
    APISession.belongsTo(models.users);
  }
  return APISession;
}

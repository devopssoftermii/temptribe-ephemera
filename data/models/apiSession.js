module.exports = function(sequelize, DataTypes) {
  const APISession = sequelize.define('apiSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
      primaryKey: true
    }
  });
}

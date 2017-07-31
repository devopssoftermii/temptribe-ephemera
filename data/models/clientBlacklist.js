/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientBlacklist', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    clientID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    datestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    }
  }, {
    tableName: 'clientBlacklist',
    timestamps: false,
    freezeTableName: true,
    defaultScope: {
      attributes: []
    }
  });
};

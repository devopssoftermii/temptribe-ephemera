/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientFavourites', {
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
    dateStamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    }
  }, {
    tableName: 'clientFavourites',
    timestamps: false,
    freezeTableName: true,
    defaultScope: {
      attributes: []
    }
  });
};

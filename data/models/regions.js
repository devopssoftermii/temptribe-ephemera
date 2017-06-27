/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('regions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(1)'
    }
  }, {
    tableName: 'regions'
  });
};

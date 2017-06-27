/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userTimesheetsStatuses', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statusName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    showHighlighted: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'userTimesheetsStatuses'
  });
};

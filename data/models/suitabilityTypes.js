/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('suitabilityTypes', {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((1))'
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    },
    SortOrder: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'suitabilityTypes'
  });
};

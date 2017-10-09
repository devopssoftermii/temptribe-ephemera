/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {

  var venueTubeLink = sequelize.define('venueTubeLink', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tubeStationsID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'venueTubeLink',
    timestamps: false,
    freezeTableName: true
  });

  return venueTubeLink;
};

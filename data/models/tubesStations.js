/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  var tubeStations = sequelize.define('tubeStations', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    links: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'tubeStations',
    timestamps: false,
    freezeTableName: true,
    scopes: {
      standard: {
        attributes: ['id', 'description', 'links', 'notes']
      }
    }
  });
  tubeStations.associate = function (models) {
    tubeStations.belongsToMany(models.venues,{
        through: 'venueTubeLink',
        foreignKey: 'tubeStationID'
      });
  };

  return tubeStations;
};

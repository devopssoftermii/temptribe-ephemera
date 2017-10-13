/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  var dressCodes = sequelize.define('dressCodes', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    JobRoleTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ShortDescription: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'dressCodes',
    timestamps: false,
    freezeTableName: true,
    defaultScope: {
      attributes: [
        ['ShortDescription', 'shortDescription'],
        'description',
        'title'
      ]
    },
    scopes: {
      standard: {
        attributes: []
      },
      full: {
        attributes: [
          ['ShortDescription', 'shortDescription'],
          'description',
          'title'
        ]
      },
    }
  });
  dressCodes.associate = function(models) {
    dressCodes.hasMany(models.eventShifts, { foreignKey: 'dressCodeId' });
  }
  return dressCodes;
};

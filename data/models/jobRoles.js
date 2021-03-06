/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  var jobRoles = sequelize.define('jobRoles', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    jobRoleTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hourlyRate: {
      type: "MONEY",
      allowNull: true
    },
    hourlyRateToClient: {
      type: "MONEY",
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
    IsMale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    IsFemale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    }
  }, {
    tableName: 'jobRoles',
    timestamps: false,
    freezeTableName: true,
    scopes: {
      metadata: {
        attributes: []
      },
      standard: {
        attributes: ['title']
      },
      full: {
        attributes: ['title', 'description']
      }
    }
  });
  jobRoles.associate = function (models) {
    jobRoles.hasMany(models.eventShifts, {foreignKey: 'jobRoleId'});
  }
  return jobRoles;
};

/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userTrainingSessionApplications', {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TrainingSessionID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DateModified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LastAction: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'UserTrainingSessionApplications',
    timestamps: false,
    freezeTableName: true
  });
};

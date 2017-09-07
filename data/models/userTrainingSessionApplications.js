/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  var userTrainingSessionApplications =  sequelize.define('userTrainingSessionApplications', {
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
      //TODO need to fix the below line which is currently erroring on create of a new record
      //defaultValue: '(getdate())'
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

  userTrainingSessionApplications.associate = function(models) {
    userTrainingSessionApplications.belongsTo(models.trainingSessions, {
      as: 'trainingSession',
      foreignKey: 'TrainingSessionID',
      targetKey: 'ID'
    });
    userTrainingSessionApplications.belongsTo(models.users, {
      as: 'user',
      foreignKey: 'UserID',
      targetKey: 'ID'
    });
  }

  return userTrainingSessionApplications;
};

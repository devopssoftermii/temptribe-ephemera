/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  var userTimesheets = sequelize.define('userTimesheetsCompleted', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    breaks: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    worked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('getdate')
    },
    dateLastModified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('getdate')
    },
    FeedbackID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    FeedbackDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CommentVisible: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    tableName: 'userTimesheetsCompleted',
    timestamps: false,
    freezeTableName: true,
  });
  userTimesheets.associate = function (models) {
    userTimesheets.belongsTo(models.users, {
      as: 'user',
      foreignKey: 'userId'
    });
    userTimesheets.belongsTo(models.users, {
      as: 'lastModifiedBy',
      foreignKey: 'lastModifiedBy'
    });
    userTimesheets.belongsTo(models.eventShifts, {
      as: 'shift',
      foreignKey: 'eventShiftId'
    });
    userTimesheets.belongsTo(models.userTimesheets, {
      as: 'timesheet',
      foreignKey: 'userTimesheetId'
    });
    userTimesheets.belongsTo(models.events, {
      as: 'event',
      foreignKey: 'eventId'
    });
  }
  return userTimesheets;
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userTimesheetsCompleted', {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UserTimesheetID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EventShiftID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EventID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    StartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    EndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Breaks: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    Worked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    Comments: {
      type: DataTypes.TEXT,
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
    DateLastModified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FeedbackID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FeedbackDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CommentVisible: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'userTimesheetsCompleted'
  });
};

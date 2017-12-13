/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  var userTimesheets = sequelize.define('userTimesheets', {
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
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    useAgain: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    staffConfirmed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    worked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    paid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    dateStamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('getdate')
    },
    clientFeedbackID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    clientFeedbackDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CommentVisible: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    appliedOnPlatform: {
      type: DataTypes.STRING,
      allowNull: true
    },
    actionedBy: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'userTimesheets',
    timestamps: false,
    freezeTableName: true,
    scopes: {
      refOnly: {
        attributes: ['id', 'status']
      },
      booked: {
        where: {
          status: {
            $or: [4, 7]
          }
        },
      },
      onlyBooked: {
        where: {
          status: 4
        }
      },
      onlyApplied: {
        where: {
          status: 1
        }
      },
      applied: {
        where: {
          status: {
            $or: [1, 2]
          }
        },
      },
      active: {
        where: {
          status: {
            $or: [1, 4]
          }
        },
      },
      cancelled: {
        where: {
          status: 7
        }
      },
      history: {
        where: {
          $not: {
            status: 2
          }
        },
      }
    }
  });
  userTimesheets.associate = function (models) {
    userTimesheets.belongsTo(models.users, {as: 'user'});
    userTimesheets.belongsTo(models.eventShifts, {
      as: 'shift',
      foreignKey: 'eventShiftId'
    });
    userTimesheets.hasMany(models.userTimesheetsCompleted, {
      as: 'timesheetsCompleted',
      foreignKey: 'userTimesheetID'
    });
    userTimesheets.addScope('byUser', function(id = null) {
      var returnScope = {
        attributes: ['id', 'status', 'dateStamp'],
        include: [
          {
            attributes: ['id'],
            model: models.users,
            as: 'user',
          }
        ],
        required: !!id,
      }
      if (id) {
        returnScope.include[0].where = {
          id
        }
      }
      return returnScope;
    });
    userTimesheets.addScope('fetchOne', function(userId, eventShiftId) {
      return {
        attributes: [
          'id',
          'status',
          'eventShiftId',
          'userId',
          'appliedOnPlatform',
          'dateStamp'
        ],
        where: {
          userId,
          eventShiftId
        },
        order: [
          ['dateStamp', 'DESC']
        ],
        limit: 1
      }
    });
  }
  return userTimesheets;
};

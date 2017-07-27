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
    }
  }, {
    tableName: 'userTimesheets',
    timestamps: false,
    freezeTableName: true,
    scopes: {
      refOnly: {
        attributes: ['id', 'status']
      },
      confirmed: {
        where: {
          status: {
            $or: [4, 7]
          }
        }
      },
      applied: {
        where: {
          status: {
            $or: [1, 2]
          }
        }
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
        }
      }
    }
  });
  userTimesheets.associate = function (models) {
    userTimesheets.belongsTo(models.users, {as: 'user'});
    userTimesheets.belongsTo(models.eventShifts, {
      as: 'shift',
      foreignKey: 'eventShiftId'
    });
  }
  userTimesheets.preScope = function (models) {
    models
      .eventShifts
      .preScope(models);
    userTimesheets.addScope('staff', function (era) {
      return {
        attributes: ['id'],
        include: [
          {
            model: models
              .eventShifts
              .scope({
                method: ['staff', 'standard', era]
              }),
            as: 'shift'
          }
        ]
      }
    });
    userTimesheets.addScope('byUser', function (id = null) {
      var returnScope = {
        attributes: ['id', 'status'],
        include: [
          {
            attributes: ['id'],
            model: models.users,
            as: 'user',
          }
        ],
        order: [
          ['updated', 'DESC']
        ],
        required: true,
      }
      if (id) {
        returnScope.include[0].where = {
          id
        }
      }
      return returnScope;
    });
  }
  return userTimesheets;
};

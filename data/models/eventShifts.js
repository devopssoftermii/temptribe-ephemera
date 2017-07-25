/* jshint indent: 1 */

const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  var eventShifts = sequelize.define('eventShifts', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hourlyRate: {
      type: "MONEY",
      allowNull: true
    },
    hourlyRateToClient: {
      type: "MONEY",
      allowNull: true
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    originalStartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    originalFinishTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    finishTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    },
    DivisionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((1))'
    },
    Ambassador: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    duration: {
      type: DataTypes.VIRTUAL(DataTypes.FLOAT, ['originalStartTime', 'originalFinishTime']),
      allowNull: false,
      get() {
        return (moment(this.get('originalFinishTime')).diff(this.get('originalStartTime'), 'hours', true) + 24) % 24;
      }
    },
    estimatedPay: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, ['duration', 'hourlyRate']),
      allowNull: false,
      get() {
        return Math.round(this.get('duration') * this.get('hourlyRate'));
      }
    }
  }, {
    tableName: 'eventShifts',
    timestamps: false,
    freezeTableName: true
  });
  eventShifts.associate = function (models) {
    eventShifts.belongsTo(models.events, {as: 'event'});
    eventShifts.belongsTo(models.jobRoles, {as: 'jobRole'});
    eventShifts.belongsTo(models.dressCodes, {as: 'dressCode'});
    eventShifts.hasMany(models.userTimesheets, {
      foreignKey: 'eventShiftId',
      as: 'timesheets'
    });
    eventShifts.belongsToMany(models.suitabilityTypes, {
      through: models.eventShiftSuitabilityTypes,
      foreignKey: 'EventShiftId',
      otherKey: 'SuitabilityTypeId'
    });
  };
  eventShifts.preScope = function (models) {
    models
      .events
      .preScope(models);
    eventShifts.addScope('staff', function (detail, era = null, ...args) {
      var user,
        notUser,
        status,
        filters;
      var sortDir = 'ASC';
      for (var i = 1; i > -1; i--) {
        if (args.length > i) {
          if ('string' === typeof(args[i]) && ['confirmed', 'applied', 'cancelled', 'history'].indexOf(args[i]) !== -1) {
            status = args[i];
          } else if ('favourite' === args[i]) {
            favourite = true;
          } else if ('notUser' === args[i]) {
            notUser = true;
          } else if ('number' === typeof(args[i])) {
            user = args[i];
          } else if ('object' === typeof(args[i])) {
            filters = args[i];
          }
        }
      }
      var favourite = filters? filters.favourite: null;
      var eventScope = [{
        method: ['staff', detail, favourite]
      }];
      if (era) {
        eventScope.push(era);
      }
      var include = {
        events: {
          model: models
            .events
            .scope(eventScope),
          as: 'event'
        },
        suitabilityTypes: {
          model: models.suitabilityTypes,
          attributes: [
            ['ID', 'id'],
          ],
          through: {
            model: models.eventShiftSuitabilityTypes,
            attributes: []
          },
        },
      };
      var attributes = [
        'id',
        [
          sequelize.fn('convert', sequelize.literal('VARCHAR(5)'), sequelize.col('originalStartTime'), 108),
          'startTime'
        ],
        [
          sequelize.fn('convert', sequelize.literal('VARCHAR(5)'), sequelize.col('originalFinishTime'), 108),
          'endTime'
        ]
      ];
      if (detail !== 'metadata') {
        include.dressCodes = {
          model: models
            .dressCodes
            .scope(detail),
          as: 'dressCode'
        };
        include.jobRoles = {
          model: models
            .jobRoles
            .scope(detail),
          as: 'jobRole'
        };
        attributes.push('qty', 'duration', 'hourlyRate', 'estimatedPay');
      }
      var timesheetScopes = ['refOnly'];
      if (notUser && user) {
        timesheetScopes.push({
          method: ['byUser', user, false]
        });
      } else if (user) {
        timesheetScopes.push({
          method: ['byUser', user]
        });
      }
      if (status) {
        timesheetScopes.push(status);
        if (status === 'history') {
          sortDir = 'DESC';
        }
      }
      var where = null;
      if (filters) {
        Object
          .keys(filters.include)
          .forEach(function (modelName) {
            if (include[modelName]) {
              include[modelName].where = filters.include[modelName].where;
            }
          });
        where = filters.where;
      }
      if (timesheetScopes.length > 1) {
        include.userTimesheets = {
          model: models
            .userTimesheets
            .scope(timesheetScopes),
          as: 'timesheets'
        };
      }
      var result = {
        required: true,
        attributes,
        include: Object.keys(include).map(function(key) {
          return include[key];
        }),
        order: [
          [
            {
              model: models.events,
              as: 'event'
            },
            'eventDate',
            sortDir
          ],
          ['originalStartTime', sortDir]
        ]
      };
      if (where) {
        result.where = where;
      }
      return result;
    });
  }
  return eventShifts;
};

var moment = require('moment');

module.exports = {
  sortByShift: function(reverse = false) {
    return function(a, b) {
      var as = a.startTime.split(':').map(function(part) {
        return parseInt(part, 10);
      });
      var bs = b.startTime.split(':').map(function(part) {
        return parseInt(part, 10);
      });
      return (a.event.eventDate.setHours(as[0], as[1]) - b.event.eventDate.setHours(bs[0], bs[1])) * (reverse? -1: 1);
    }
  },
  formatShift: function(shift, favourites, detail, stripTimesheets, hideComments) {
    favourites = new Set(favourites);
    if (detail === 'metadata') {
      if (shift.hasOwnProperty('duration')) {
        delete shift.duration;
      }
      if (shift.hasOwnProperty('estimatedPay')) {
        delete shift.estimatedPay;
      }
    }
    if (stripTimesheets) {
      shift.timesheets = [];
    }
    // if (hideComments && shift.event.comments && (!shift.timesheets[0] || shift.timesheets[0].status !== 4)) {
    //   shift.event.comments = '';
    // }
    shift.favourite = favourites.has(shift.event.client.id);
    if (shift.suitabilityTypes && Array.isArray(shift.suitabilityTypes)) {
      shift.suitabilityTypes = shift.suitabilityTypes.map(function(stype) {
        if (stype.id) {
          return stype.id;
        }
        return stype;
      });
    }
    return shift;
  },
  formatShiftList: function(shiftList, favourites, detail, stripTimesheets, hideComments, pageInfo = null) {
    if (pageInfo) {
      var {
        page,
        limit,
        after
      } = pageInfo;
      var lowerBound = 0;
      var total = Math.ceil(shiftList.count / limit);
      var outPage = {
        size: limit,
        total
      };
      if (page) {
        page = Math.min(total, Math.max(page, 0));
        lowerBound = (page - 1) * limit;
        outPage.current = page;
      } else if (after) {
        lowerBound = shiftList.rows.findIndex(function(shift) {
          return shift.id === after;
        }) + 1;
        outPage.skip = lowerBound;
      }
      return {
        total: shiftList.count,
        shifts: shiftList.rows.slice(lowerBound, lowerBound + limit).map(function(shift) {
          return module.exports.formatShift(shift.get({ plain: true }), favourites, detail, stripTimesheets, hideComments);
        }),
        page: outPage
      }
    } else {
      return {
        total: shiftList.count,
        shifts: shiftList.rows.map(function(shift) {
          return module.exports.formatShift(shift.get({ plain: true }), favourites, detail, stripTimesheets, hideComments);
        })
      }
    }
  },
  dedupe: function(shiftList) {
    var uniqueIDs = {};
    var uniqueShifts = [];
    shiftList.forEach(function(shift) {
      if (!uniqueIDs[shift.id]) {
        uniqueIDs[shift.id] = true;
        uniqueShifts.push(shift);
      }
    });
    return uniqueShifts.sort(sortByShift());
  },
  getClashingShifts: function(models, sequelize, shift, userId, status = 'booked') {
    var date = moment(shift.event.eventDate).format('YYYY-MM-DD');
    var start = moment(shift.originalStartTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
    var finish = moment(shift.originalFinishTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
    var timesheetsInclude = {
      model: models.userTimesheets.scope([{
        method: ['byUser', userId]
      }, status]),
      as: 'timesheets',
    };
    var clashingShifts = models.eventShifts.findAll({
      attributes: [],
      include: [{
        model: models.events,
        as: 'event',
        attributes: ['id'],
        where: [{
          $and: [
            sequelize.literal('event.eventDate = \'' + date + '\''),
          ]
        }]
      }, timesheetsInclude],
      order: [
        [timesheetsInclude, 'dateStamp', 'DESC']
      ],
      where: {
        $or: [{
          $and: [
            sequelize.literal('originalStartTime >= \'' + start + '\''),
            sequelize.literal('originalStartTime <= \'' + finish + '\''),
          ]
        }, {
          $and: [
            sequelize.literal('originalFinishTime >= \'' + start + '\''),
            sequelize.literal('originalFinishTime <= \'' + finish + '\''),
          ]
        }, {
          $and: [
            sequelize.literal('originalFinishTime >= \'' + finish + '\''),
            sequelize.literal('originalStartTime <= \'' + start + '\''),
          ]
        }]
      }
    });
    if (status === 'booked') {
      clashingShifts = clashingShifts.filter(function(shift) {
        if (shift.timesheets[0].status === 7) {
          return false;
        }
        return true;
      });
    }
    return clashingShifts;
  },
  isFullyStaffed: function(shift) {
    return shift.getTimesheets().then(function(timesheets) {
      return timesheets.filter(function(timesheet) {
        return timesheet.status === 4;
      }).length >= shift.qty;
    });
  },
  isEventFullyStaffed: function(sequelize, eventId) {
    return sequelize.query('dbo.usp_IsEventFullyStaffed :eventId', {
      replacements: {
        eventId
      },
      type: sequelize.QueryTypes.SELECT
    }).then(function(result) {
      return !!result.IsFullyStaffed;
    });
  },
  checkEventStatus: function(sequelize, shift) {
    return module.exports.isEventFullyStaffed(sequelize, shift.event.id).then(function(staffed) {
      if (!staffed && shift.event.status === 3) {
        return shift.event.update({
          status: 2
        }).then(function(event) {
          return shift;
        })
      } else if (staffed && shift.event.status === 2) {
        return shift.event.update({
          status: 3
        }).then(function(event) {
          return shift;
        })
      } else {
        return shift;
      }
    }).catch(function(err) {
      throw err;
    });
  },
  bookUserOnShift: function(models, sequelize, shift, userId, favourite = false) {
    return module.exports.isFullyStaffed(shift).then(function(fullyStaffed) {
      var eventShiftId = shift.id;
      var status = !fullyStaffed && favourite? 4: 1;
      return models.userTimesheets.create({
        eventShiftId,
        userId,
        status,
        appliedOnPlatform: 'app'
      }).catch(function(err) {
        throw err;
      });
    }).then(function(timesheet) {
      if (timesheet.status === 4) {
        return module.exports.getClashingShifts(models, sequelize, shift, userId, 'applied').then(function(otherShifts) {
          return Promise.all(otherShifts.map(function(otherShift) {
            return otherShift.timesheets[0].update({
              status: 7,
              dateStamp: sequelize.fn('getdate')
            }).then(function() {
              return module.exports.checkEventStatus(sequelize, otherShift);
            }).catch(function(err) {
              throw err;
            });
          })).catch(function(err) {
            throw err;
          });
        }).then(function() {
          return timesheet.status;
        }).catch(function(err) {
          throw err;
        });
      } else {
        return timesheet.status;
      }
    }).then(function(status) {
      return module.exports.checkEventStatus(sequelize, shift).then(function() {
        return status;
      });
    }).catch(function(err) {
      throw err;
    });
  }
}

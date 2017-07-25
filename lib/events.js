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
  formatShift: function(shift, favourites, detail = null) {
    favourites = new Set(favourites);
    if (detail === 'metadata') {
      if (shift.hasOwnProperty('duration')) {
        delete shift.duration;
      }
      if (shift.hasOwnProperty('estimatedPay')) {
        delete shift.estimatedPay;
      }
    }
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
  formatShiftList: function(shiftList, favourites, detail, pageInfo = null) {
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
          return module.exports.formatShift(shift.get({ plain: true }), favourites, detail);
        }),
        page: outPage
      }
    } else {
      return {
        total: shiftList.count,
        shifts: shiftList.rows.map(function(shift) {
          return module.exports.formatShift(shift.get({ plain: true }), favourites, detail);
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
  getClashingShifts: function(models, sequelize, shift, userId, status = 'confirmed') {
    var date = moment(shift.event.eventDate).format('YYYY-MM-DD');
    var start = moment(shift.originalStartTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
    var finish = moment(shift.originalFinishTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
    return models.eventShifts.findAll({
      include: [{
        model: models.events,
        as: 'event',
        where: [{
          $and: [
            sequelize.literal('event.eventDate = \'' + date + '\''),
          ]
        }]
      }, {
        model: models.userTimesheets.scope([{
          method: ['byUser', userId]
        }, status]),
        as: 'timesheets'
      }],
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
      }
    }).then(function(result) {
      return !!result[0].IsFullyStaffed;
    });
  },
  checkEventStatus: function(sequelize, shift, transaction) {
    return module.exports.isEventFullyStaffed(sequelize, shift.event.id).then(function(staffed) {
      if (!staffed && shift.event.status === 3) {
        return shift.event.update({
          status: 2
        }, {
          transaction
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
    return sequelize.transaction(function(t) {
      return module.exports.isFullyStaffed(shift).then(function(fullyStaffed) {
        var eventShiftId = shift.id;
        return models.userTimesheets.findOne({
          where: {
            eventShiftId,
            userId
          }
        }).then(function(timesheet) {
          var status = !fullyStaffed && favourite? 4: 1;
          if (timesheet) {
            return timesheet.update({
              status
            }, {
              transaction: t
            }).catch(function(err) {
              throw err;
            });
          } else {
            return models.userTimesheets.create({
              eventShiftId,
              userId,
              status
            }, {
              transaction: t
            }).catch(function(err) {
              throw err;
            });
          }
        }).then(function(timesheet) {
          if (timesheet.status === 4) {
            return module.exports.getClashingShifts(models, sequelize, shift, userId, 'applied').then(function(otherShifts) {
              return Promise.all(otherShifts.map(function(otherShift) {
                return otherShift.timesheets[0].update({
                  status: 7
                }, {
                  transaction: t
                }).then(function() {
                  return module.exports.checkEventStatus(sequelize, otherShift, t);
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
          return module.exports.checkEventStatus(sequelize, shift, t).then(function() {
            return status;
          });
        }).catch(function(err) {
          throw err;
        });
      });
    });
  }
}

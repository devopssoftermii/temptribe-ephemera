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
  getClashingShifts: function(models, sequelize, shift, userId) {
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
        }, 'confirmed']),
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
  isFullyStaffed: function(sequelize, shiftId) {
    return sequelize.query('dbo.usp_IsEventFullyStaffed :shiftId', {
      replacements: {
        shiftId
      }
    });
  },
  bookUserOnShift: function(models, sequelize, eventShiftId, userId, confirm = false) {
    return models.userTimesheets.upsert({
      eventShiftId,
      userId,
      status: confirm? 4: 1
    });
  }
}

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
  formatShift: function(shift, detail) {
    if (detail === 'metadata') {
      if (shift.hasOwnProperty('duration')) {
        delete shift.duration;
      }
      if (shift.hasOwnProperty('estimatedPay')) {
        delete shift.estimatedPay;
      }
    }
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
  formatShiftList: function(shiftList, detail, page = 1, after = null) {
    var limit = parseInt(process.env.SHIFTLIST_PAGE_SIZE, 10);
    var lowerBound = 0;
    var total = Math.ceil(shiftList.count / limit);
    var pageInfo = {
      size: limit,
      total
    };
    if (page) {
      page = Math.min(total, Math.max(page, 0));
      lowerBound = (page - 1) * limit;
      pageInfo.current = page;
    } else if (after) {
      lowerBound = shiftList.rows.findIndex(function(shift) {
        return shift.id === after;
      }) + 1;
      pageInfo.skip = lowerBound;
    }
    return {
      total: shiftList.count,
      shifts: shiftList.rows.slice(lowerBound, lowerBound + limit).map(function(shift) {
        return module.exports.formatShift(shift.get({ plain: true }), detail);
      }),
      page: pageInfo
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
  }
}

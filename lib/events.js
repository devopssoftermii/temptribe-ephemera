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
    if (detail === 'listonly' && shift.duration && shift.estimatedPay) {
      delete shift.duration;
      delete shift.estimatedPay;
    }
    if (shift.suitabilityTypes && Array.isArray(shift.suitabilityTypes)) {
      shift.suitabilityTypes = shift.suitabilityTypes.map(function(stype) {
        if ('object' === typeof(stype) && stype.id) {
          return stype.id;
        }
        return stype;
      });
    }
    return shift;
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

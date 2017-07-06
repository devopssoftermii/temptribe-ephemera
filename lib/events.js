module.exports = {
  sortByShift: function(reverse = false) {
    function(a, b) {
      var as = a.startTime.split(':').map(function(part) {
        return parseInt(part, 10);
      });
      var bs = b.startTime.split(':').map(function(part) {
        return parseInt(part, 10);
      });
      return (a.event.eventDate.setHours(as[0], as[1]) - b.event.eventDate.setHours(bs[0], bs[1])) * (reverse? -1: 1);
    },
  }
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

module.exports = {
  sortByShift: function(a, b) {
    var as = a.startTime.split(':').map(function(part) {
      return parseInt(part, 10);
    });
    var bs = b.startTime.split(':').map(function(part) {
      return parseInt(part, 10);
    });
    return a.event.eventDate.setHours(as[0], as[1]) - b.event.eventDate.setHours(bs[0], bs[1]);
  }
}

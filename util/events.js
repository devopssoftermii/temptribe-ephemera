module.exports = {
  splitTime: function(timeString) {
    return timeString.split(':').map(function(part) {
      return parseInt(part, 10);
    });
  }
}

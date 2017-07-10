const moment = require('moment');

module.exports = function(req, models, output) {
  if (!req.body.f || !req.body.f.d || !Array.isArray(req.body.f.d)) {
    throw new Error('Date selection (f[d]) is a required filter for this endpoint');
  }
  var filterDates = new Set(req.body.f.d);
  var datesList = [];
  var datesSearch = [];
  for (var i = 0; i < 14; i++) {
    if (filterDates.has(i)) {
      datesList.push(i);
      datesSearch.push(moment().add(i, 'days').format('YYYYMMDD'));
    }
  }
  if (!datesList.length) {
    throw new Error('Date selection (f[d]) is a required filter for this endpoint');
  }
  output.key.dates = datesList;
  if (!output.scope.include.events) {
    output.scope.include.events = {
      as: 'event',
      where: {
        $and: []
      }
    };
  }
  output.scope.include.events.where.$and.push({
    eventDate: {
      $in: datesSearch
    }
  });
}

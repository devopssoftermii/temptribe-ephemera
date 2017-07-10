const moment = require('moment');

module.exports = function(req, models, output) {
  if (!req.body.f || req.body.f.d || !Array.isArray(req.body.f.d)) {
    throw new Error('Date selection (f[d]) is a required filter for this endpoint');
  }
  var filterDates = new Set(req.body.f.d);
  var datesList = [];
  var datesSearch = [];
  for (var i = 0; i < 14; i++) {
    if (filterDates.has(i)) {
      datesList.add(i);
      datesSearch.add(moment().add(i, 'days').toDate());
    }
  }
  if (!datesList.length) {
    throw new Error('Date selection (f[d]) is a required filter for this endpoint');
  }
  output.key.dates = datesList;
  if (!output.scope.include) {
    output.scope.include = [];
  }
  output.scope.include.push({
    model: models.events,
    attributes: [],
    where: {
      eventDate: {
        $in: datesSearch
      }
    },
    required: true
  });

}

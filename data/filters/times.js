const moment = require('moment');
const HttpError = require('../../lib/errors/HttpError');

module.exports = function(req, models, output) {
  if (!req.body.f || !Array.isArray(req.body.f.t)) {
    return;
  }
  var sequelize = req.app.locals.sequelize;
  var [startTime, endTime] = req.body.f.t.map(i => parseFloat(i));
  if (isNaN(startTime) || isNaN(endTime) || endTime < startTime || startTime < 6 || endTime > 30) {
    throw new HttpError(422, {message: 'Invalid time selection (f[t])'});
  }
  output.key.times = [startTime, endTime];
  if (!output.scope.where) {
    output.scope.where = {
      $and: []
    };
  }
  output.scope.where.$and.push(
    sequelize.literal('originalStartTime >= \'' + moment('1900-01-01 00:00:00.000').add(startTime - 0.5, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSS') + '\''),
    sequelize.literal('originalFinishTime <= \'' + moment('1900-01-01 00:00:00.000').add(endTime + 0.5, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSS') + '\'')
  );
}

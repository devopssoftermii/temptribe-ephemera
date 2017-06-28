module.exports = function(req, res, next) {
  var sequelize = req.app.locals.sequelize;
  var models = req.app.locals.models;
  models.users.findById(req.user.id, {
    attributes: [],
    include: [{
      attributes: ['id'],
      model: models.userTimesheets,
      as: 'timesheets',
      where: {
        status: 4
      },
      include: [{
        model: models.eventShifts,
        attributes: [
          'id',
          [sequelize.fn('convert', sequelize.literal('VARCHAR(5)'), sequelize.col('originalStartTime'), 108), 'startTime'],
          [sequelize.fn('convert', sequelize.literal('VARCHAR(5)'), sequelize.col('originalFinishTime'), 108), 'endTime'],
          'originalStartTime',
          'originalFinishTime',
          'hourlyRate',
        ],
        as: 'shift',
        required: true,
        include: [{
          model: models.events,
          attributes: [
            'id',
            'comments',
            'title',
            'subtitle'
          ],
          as: 'event',
          where: {
            eventDate: {
              $gt: sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))
            }
          },
          include: [{
            model: models.venues,
            attributes: [
              'name',
              'address1',
              'address2',
              'town',
              'county',
              'postcode',
              'mapLink',
              [sequelize.fn(
                'concat',
                '/images/venuePhotos/',
                sequelize.fn(
                  'convert',
                  sequelize.literal('VARCHAR(10)'),
                  sequelize.col('timesheets->shift->event->venue.id')
                ),
                '.jpg'
              ), 'imageURL']
            ],
            as: 'venue'
          }, {
            model: models.clients,
            attributes: [['clientName', 'name']],
            as: 'client'
          }]
        }, {
          model: models.dressCodes,
          attributes: [
            ['ShortDescription', 'shortDescription'],
            'description'
          ],
          as: 'dressCode'
        }, {
          model: models.jobRoles,
          attributes: [
            'title'
          ],
          as: 'jobRole'
        }]
      }]
    }]
  }).then(function(result) {
    res.json(result.timesheets.map(function(timesheet) {
      return timesheet.shift;
    }));
  }).catch(function(err) {
    res.status(500).json(null);
  });
}

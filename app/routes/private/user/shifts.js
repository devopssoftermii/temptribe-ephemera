module.exports = function(req, res, next) {
  var sequelize = req.app.locals.sequelize;
  var models = req.app.locals.models;
  models.users.findById(226890, {
    attributes: [],
    include: [{
      attributes: [],
      model: models.userTimesheets,
      as: 'timesheets',
      where: {
        status: 4
      },
      include: [{
        model: models.eventShifts,
        attributes: [
          sequelize.col('id'),
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
            sequelize.col('id'),
            sequelize.col('comments'),
            sequelize.col('title'),
            sequelize.col('subtitle')
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
              sequelize.col('name'),
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
                  sequelize.col('id')
                ),
                '.jpg'
              ), 'imageURL']
            ],
            as: 'venue'
          }, {
            model: models.clients,
            attributes: ['clientName'],
            as: 'client'
          }]
        }, {
          model: models.dressCodes,
          attributes: [
            ['ShortDescription', 'shortDescription'],
            sequelize.col('description')
          ],
          as: 'dressCode'
        }, {
          model: models.jobRoles,
          attributes: [
            sequelize.col('title')
          ],
          as: 'jobRole'
        }]
      }]
    }]
  }).then(function(result) {
    res.json(result.timesheets);
  });
}

/* jshint indent: 1 */

const parse = require('../../lib/parse');

module.exports = function (sequelize, DataTypes) {
  var events = sequelize.define('events', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    eventReference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lolaContactID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    managerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        return parse.links(this.getDataValue('comments'));
      }
    },
    internalComments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    clientsVenueAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    websiteTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    promoteOnWebsite: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(0)'
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    },
    regionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(1)',
      primaryKey: true
    },
    dateReminderSent: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateModified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notesForClient: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    divisionID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    invoiceID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paymentTerm: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((1))'
    },
    totalAmount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '((0))'
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    financeComments: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'events',
    timestamps: false,
    freezeTableName: true
  });
  events.associate = function (models) {
    events.belongsTo(models.clients, {as: 'client'});
    events.belongsTo(models.users, {as: 'clientContact'});
    events.belongsTo(models.venues, {as: 'venue'});
    events.hasMany(models.eventShifts, {foreignKey: 'eventId'});
  }
  events.preScope = function (models) {
    events
      .addScope('staff', function (detail, blacklist, favourite = null) {
        var attributes = [
          'id',
          [
            sequelize.fn('convert', sequelize.literal('DATE'), sequelize.col('eventDate')),
            'eventDate'
          ],
        ];
        var clientInclude = {
          model: models
            .clients
            .scope(detail),
          as: 'client',
          where: {
            id: {
              $and: [{
                $notIn: blacklist
              }]
            }
          }
        };
        if (favourite) {
          clientInclude.where.id.$and.push({
            $in: favourite
          });
        }
        var include = [clientInclude];
        if (detail !== 'metadata') {
          attributes.push('title', 'subtitle');
          include.push({
            model: models
              .venues
              .scope(detail),
            as: 'venue'
          });
        }
        if (detail === 'full') {
          attributes.push('comments');
        }
        return {
          attributes,
          include
        }
      });
    events.addScope('future', {
      where: {
        eventDate: {
          $gte: sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))
        }
      }
    });
    events.addScope('past', {
      where: {
        eventDate: {
          $lte: sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))
        }
      }
    });
  }
  return events;
};
/* jshint indent: 1 */
var moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  var venues = sequelize.define('venues', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    town: {
      type: DataTypes.STRING,
      allowNull: true
    },
    county: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mapLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    directions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    regionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(1)',
      primaryKey: true
    },
    Avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Latitude: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    Longitude: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    imageURL: {
      type: DataTypes.VIRTUAL(DataTypes.STRING, ['id', 'updatedAt']),
      allowNull: false,
      get() {
        //return `/images/venuePhotos/${this.get('id')}.jpg?c=${moment.utc(this.get('updatedAt')).unix()}`;
        return `/images/venuePhotos/${this.get('id')}.jpg`;
      }
    }
  }, {
    tableName: 'venues',
    freezeTableName: true,
    scopes: {
      standard: {
        attributes: ['id', 'name', 'imageURL']
      },
      full: {
        attributes: [
          'id',
          'name',
          'address1',
          'address2',
          'town',
          'county',
          'postcode',
          'mapLink',
          'directions',
          'imageURL'
        ]
      }
    }
  });
  venues.associate = function (models) {
    venues.hasMany(models.events, {foreignKey: 'venueId'});
    venues.hasMany(models.users, {foreignKey: 'venueID'});
    venues.belongsToMany(models.tubeStations,{
      through: 'venueTubeLink',
      foreignKey: 'venueID'
    });
  };
  return venues;
};

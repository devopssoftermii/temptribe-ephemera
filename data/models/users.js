/* jshint indent: 1 */
const parse = require('../../lib/parse');
const uuidv4 = require('uuid/v4');

module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    surname: {
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
      allowNull: true,
      get() {
        return this.getDataValue('telephone')? parse.phone(this.getDataValue('telephone')): '';
      }
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        return this.getDataValue('fax')? parse.phone(this.getDataValue('fax')): '';
      }
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        return this.getDataValue('mobile')? parse.phone(this.getDataValue('mobile')): '';
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferredDaytimeContact: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preferredEveningContact: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preferredWorkTime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hasTransport: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hasDrivingLicence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    experienceLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    myExperience: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    myProfile: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    myAvailability: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    myRequirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lolaComments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lolaRating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reference1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reference2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registrationCodeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    worked: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    photoApproved: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    newPhotoWaitingApproval: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    signupMethod: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    superUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    otherInformation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registrationComplete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    },
    staffTermsAgreed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    trainingComplete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((1))'
    },
    previousStatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    regionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((1))',
      primaryKey: true
    },
    registrationStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((1))'
    },
    otherLanguages: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    divisionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((1))'
    },
    zCardDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    passwordLastModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    },
    referralCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shiftPreference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userGUID: {
      type: DataTypes.UUID,
      defaultValue: function () {
        return uuidv4();
      },
    },
    eventPackNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ambassador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    invitedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    invitedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    foundthrough: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    StatusChangeDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ChangePasswordAtNextLogon: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    Salt: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '(CONVERT([varchar](max),newid(),0))'
    },
    staffTermsAcceptedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'users',
    freezeTableName: true,
    hasTrigger: true,
    scopes: {
      includeOnly: {
        attributes: [
          'id'
        ]
      },
      apiUser: {
        attributes: [
          'id',
          'email',
          'ambassador',
          'lolaRating',
          'gender',
          'userTypeID',
          'status'
        ],
        where: {
          status: 1
        }
      },
      newRegistration: {
        attributes: [
          'dob',
          'registrationDate',
          'registrationStatus',
          'invitedDate',
          'foundthrough',
          'nationality',
          'experienceLevel',
          'myExperience',
          'myProfile',
          'userGUID',
          'invitedBy'
        ],
        where: {
          status: 0,
          userTypeID: 3,
          registrationStatus: 1
        },
        order: [
          ['experienceLevel', 'DESC'],
          ['registrationDate', 'ASC']
        ]
      },
      testOnly: {
        where: {
          email: {
            $like: process.env.INVITE_TEST_EMAIL_MATCH
          }
        }
      }
    }
  });
  users.associate = function (models) {
    users.prototype.getDevices = function() {
      return this.getApiSessions({
        include: [{
          model: models.device,
          required: true
        }]
      }).then(function(sessions) {
        return sessions.map(function(session) {
          return session.device;
        });
      });
    };
    users.prototype.recordNotification = function(notification) {
      return this.getDevices().then((devices) => {
        if (!devices.length) {
          return {
            user: this,
            devices: []
          };
        }
        return Promise.all([
          this.addNotification(notification),
          Promise.all(devices.map(function(device) {
            return device.addNotification(notification);              
          }))
        ]).then(() => {
          return {
            user: this,
            devices
          };
        });
      });
    }
    users.belongsTo(models.venues, {as: 'venue', foreignKey: 'venueID'});
    users.belongsTo(models.users, {foreignKey: 'invitedBy'});
    users.hasMany(models.events, {foreignKey: 'clientContactId'});
    users.hasMany(models.userPhotos, {
      foreignKey: 'UserId',
      as: 'photos',
    });
    users.hasMany(models.userPhotos, {
      foreignKey: 'UserId',
      as: 'mainPhoto',
    });
    users.hasMany(models.userTimesheets, {
      foreignKey: 'userId',
      as: 'timesheets'
    });
    users.hasMany(models.apiSession);
    users.belongsToMany(models.suitabilityTypes, {
      through: models.userSuitabilityTypes,
      foreignKey: 'UserID',
      otherKey: 'SuitabilityTypeID'
    });
    users.belongsToMany(models.clients, {
      through: models.clientFavourites,
      as: 'favouritedBy',
      foreignKey: 'UserID',
      otherKey: 'ClientID'
    });
    users.belongsToMany(models.clients, {
      through: models.clientBlacklist,
      as: 'blacklistedBy',
      foreignKey: 'UserID',
      otherKey: 'ClientID'
    });
    users.belongsToMany(models.notification, {
      through: models.notificationByUser,
      foreignKey: 'userId',
      otherKey: 'notificationId'
    });
    // users.belongsToMany(models.trainingSessions, {
    //   through: models.userTrainingSessionApplications,
    //   as: 'trainingSessions',
    //   foreignKey: 'UserID',
    //   otherKey: 'TrainingSessionID'
    // });
    users.addScope('profile', {
      attributes: [
        'id',
        'firstname',
        'surname',
        'email',
        'mobile',
        'registrationDate'
      ],
      include: [
        {
          model: models.userPhotos,
          as: 'photos',
        },
        {
          model: models.userPhotos.scope('mainPhoto'),
          as: 'mainPhoto',
        },
      ]
    });
    users.addScope('login', function (params) {
      return {
        where: {
          $and: {
            email: params.email,
            password: sequelize.fn('dbo.udf_CalculateHash', sequelize.fn('concat', params.password, sequelize.col('salt'))),
            status: 1
          }
        }
      };
    });
  }
  return users;
};

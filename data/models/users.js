/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var users = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		userTypeID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
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
			allowNull: true
		},
		fax: {
			type: DataTypes.STRING,
			allowNull: true
		},
		mobile: {
			type: DataTypes.STRING,
			allowNull: true
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
		}
	}, {
		tableName: 'users',
		timestamps: false,
		freezeTableName: true,
	});
	users.associate = function(models) {
		users.belongsTo(models.venues, { as: 'venue' });
		users.hasMany(models.events, { foreignKey: 'clientContactId' });
		users.hasMany(models.userPhotos, { foreignKey: 'UserId', as: 'photos' });
		users.hasMany(models.userTimesheets, { foreignKey: 'userId', as: 'timesheets' });
		users.hasMany(models.apiSession);
		users.belongsToMany(models.suitabilityTypes, {
			as: 'suitabilityTypes',
			through: models.userSuitabilityTypes,
			foreignKey: 'UserID',
			otherKey: 'SuitabilityTypeID'
		});
		models.userTimesheets.preScope(models);
		users.addScope('shifts', function(status) {
			return {
				attributes: [],
				include: [{
					model: models.userTimesheets.scope('staff', status),
					as: 'timesheets'
				}]
			};
		});
		users.addScope('profile', {
			attributes: [
        'id',
        'firstname',
        'surname',
        'email',
        'mobile',
      ],
      include: [{
        model: models.userPhotos,
        as: 'photos',
      }]
		});
		users.addScope('login', function(params) {
			return {
				attributes: [
					'id',
					'email'
				],
				where: {
					$and: {
						email: params.email,
						password: sequelize.fn('dbo.udf_CalculateHash', sequelize.fn('concat', params.password, sequelize.col('salt')))
					}
				},
			};
    });
	}
	return users;
};

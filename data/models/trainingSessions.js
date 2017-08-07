/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var trainingSessions = sequelize.define('trainingSessions', {
		ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		TotalPlaces: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		SessionDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		StartTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		EndTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		VenueID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		LolaManagerID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((1))'
		},
		DateCreated: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: '(getdate())'
		},
		DateModified: {
			type: DataTypes.DATE,
			allowNull: true
		},
		ModifiedBy: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		OlympicsOnly: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((0))'
		},
		SessionTypeID: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'TrainingSessions',
		timestamps: false,
		freezeTableName: true
	});
	trainingSessions.associate = function(models) {
    trainingSessions.belongsToMany(models.trainingSessions, {
      through: models.userTrainingSessionApplications,
      as: 'trainingSession',
      foreignKey: 'TrainingSessionID',
      otherKey: 'UserID',
    });
	}
};

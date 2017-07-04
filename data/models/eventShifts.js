/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var eventShifts = sequelize.define('eventShifts', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		hourlyRate: {
			type: "MONEY",
			allowNull: true
		},
		hourlyRateToClient: {
			type: "MONEY",
			allowNull: true
		},
		qty: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		originalStartTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		originalFinishTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		startTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		finishTime: {
			type: DataTypes.DATE,
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
		dateCreated: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: '(getdate())'
		},
		DivisionID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((1))'
		},
		Ambassador: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		Rating: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Gender: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'eventShifts',
		timestamps: false,
		freezeTableName: true
	});
	eventShifts.associate = function(models) {
		eventShifts.belongsTo(models.events, { as: 'event' });
		eventShifts.belongsTo(models.jobRoles, { as: 'jobRole' });
		eventShifts.belongsTo(models.dressCodes, { as: 'dressCode' });
		eventShifts.hasMany(models.userTimesheets, { foreignKey: 'eventShiftId', as: 'timesheets' });
	};
	eventShifts.preScope = function(models) {
		models.events.preScope(models);
		['Future', 'Past'].forEach(function(scope) {
			eventShifts.addScope('staff' + scope, {
				attributes: [
					'id',
					[sequelize.fn('convert', sequelize.literal('VARCHAR(5)'), sequelize.col('originalStartTime'), 108), 'startTime'],
					[sequelize.fn('convert', sequelize.literal('VARCHAR(5)'), sequelize.col('originalFinishTime'), 108), 'endTime'],
					'originalStartTime',
					'originalFinishTime',
					'hourlyRate',
				],
				required: true,
				include: [{
					model: models.events.scope(['staff', scope.toLowerCase()]),
					as: 'event'
				}, {
					model: models.dressCodes,
					as: 'dressCode'
				}, {
					model: models.jobRoles,
					as: 'jobRole'
				}],
				order: [[
					eventShifts.associations.event, 'eventDate', 'ASC'
				], [
					'startTime', 'ASC'
				]],
			});
		});
	}
	return eventShifts;
};

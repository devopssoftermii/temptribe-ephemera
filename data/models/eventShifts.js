/* jshint indent: 1 */

const moment = require('moment');

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
		},
		duration: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			get() {
				return (moment(this.getDataValue('originalStartTime')).diff(this.getDataValue('originalFinishTime'), 'hours', true) + 24) % 24;
			}
		},
		estimatedPay: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			get() {
				return Math.round(this.getDataValue('duration') * this.getDataValue('hourlyRate'));
			}
		}
	}, {
		tableName: 'eventShifts',
		timestamps: false,
		freezeTableName: true,
	});
	eventShifts.associate = function(models) {
		eventShifts.belongsTo(models.events, { as: 'event' });
		eventShifts.belongsTo(models.jobRoles, { as: 'jobRole' });
		eventShifts.belongsTo(models.dressCodes, { as: 'dressCode' });
		eventShifts.hasMany(models.userTimesheets, { foreignKey: 'eventShiftId', as: 'timesheets' });
	};
	eventShifts.preScope = function(models) {
		models.events.preScope(models);
		eventShifts.addScope('staff', function(time, detail) {
			return {
				attributes: [
					'id',
					[sequelize.fn('convert', sequelize.literal('VARCHAR(5)'), sequelize.col('originalStartTime'), 108), 'startTime'],
					[sequelize.fn('convert', sequelize.literal('VARCHAR(5)'), sequelize.col('originalFinishTime'), 108), 'endTime'],
					'originalStartTime',
					'originalFinishTime',
					'duration',
					'hourlyRate',
					'estimatedPay'
				],
				required: true,
				include: [{
					model: models.events.scope([{ method: ['staff', detail]}, time]),
					as: 'event'
				}, {
					model: models.dressCodes.scope(detail),
					as: 'dressCode'
				}, {
					model: models.jobRoles.scope(detail),
					as: 'jobRole'
				}],
			}
		});
	}
	return eventShifts;
};

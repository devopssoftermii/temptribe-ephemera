/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('eventShifts', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		eventID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		jobRoleID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		dressCodeID: {
			type: DataTypes.INTEGER,
			allowNull: true
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
};

/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var userTimesheets = sequelize.define('userTimesheets', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		startTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		endTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		breaks: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		comments: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		useAgain: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '(1)'
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '(0)'
		},
		staffConfirmed: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '(0)'
		},
		worked: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '(0)'
		},
		paid: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '(0)'
		},
		dateStamp: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: '(getdate())'
		},
		clientFeedbackID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((0))'
		},
		clientFeedbackDescription: {
			type: DataTypes.STRING,
			allowNull: true
		},
		updated: {
			type: DataTypes.DATE,
			allowNull: true
		},
		CommentVisible: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'userTimesheets',
		timestamps: false,
		freezeTableName: true,
		scopes: {
			refOnly: {
				attributes: ['status'],
			},
			confirmed: {
				where: {
					status: 4
				},
			},
			applied: {
				where: {
					status: 1
				},
			},
			cancelled: {
				where: {
					status: 7
				},
			},
			history: {
				where: {
					$not: {
						status: 2
					}
				}
			}
		}
	});
	userTimesheets.associate = function(models) {
		userTimesheets.belongsTo(models.users, { as: 'user' });
		userTimesheets.belongsTo(models.eventShifts, { as: 'shift', foreignKey: 'eventShiftId' });
	}
	userTimesheets.preScope = function(models) {
		models.eventShifts.preScope(models);
		userTimesheets.addScope('staff', function(era) {
			return {
				attributes: ['id'],
				include: [{
					model: models.eventShifts.scope({ method: ['staff', era, 'minimal'] }),
					as: 'shift'
				}]
			}
		});
		userTimesheets.addScope('byUser', function(id) {
			return {
				include: [{
					attributes: [],
					model: models.users,
					as: 'user',
					where: {
						id
					},
					order: [['updated', 'DESC']],
					limit: 1
				}],
				required: true
			}
		});
	}
	return userTimesheets;
};

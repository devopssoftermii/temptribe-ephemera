/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var suitabilityTypes = sequelize.define('suitabilityTypes', {
		ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Description: {
			type: DataTypes.STRING,
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
		SortOrder: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'suitabilityTypes',
		timestamps: false,
		freezeTableName: true,
		defaultScope: {
			attributes: [
				['ID', 'id'],
				['Description', 'name']
			],
			where: {
				Status: 1
			},
			order: [
				['SortOrder', 'ASC']
			]
		}
	});
	suitabilityTypes.associate = function(models) {
		suitabilityTypes.belongsToMany(models.users, {
			as: 'users',
			through: models.userSuitabilityTypes,
			foreignKey: 'SuitabilityTypeID',
			otherKey: 'UserID'
		});
		suitabilityTypes.belongsToMany(models.eventShifts, {
			as: 'eventShifts',
			through: models.eventShiftSuitabilityTypes,
			foreignKey: 'SuitabilityTypeId',
			otherKey: 'EventShiftId'
		});
	}
	return suitabilityTypes;
};

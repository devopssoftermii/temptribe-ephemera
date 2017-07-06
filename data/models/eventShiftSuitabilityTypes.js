/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('eventShiftSuitabilityTypes', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		EventShiftId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'eventShifts',
				key: 'id'
			}
		},
		SuitabilityTypeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'suitabilityTypes',
				key: 'ID'
			}
		},
		DateCreated: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'EventShiftSuitabilityTypes',
		timestamps: false,
		freezeTableName: true,
		defaultScope: {
			attributes: []
		}
	});
};

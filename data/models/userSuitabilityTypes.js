/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userSuitabilityTypes', {
		ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		UserID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		SuitabilityTypeID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		DateCreated: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: '(getdate())'
		}
	}, {
		tableName: 'userSuitabilityTypes',
		timestamps: false,
		freezeTableName: true
	});
};

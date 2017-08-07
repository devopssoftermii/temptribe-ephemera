/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userTrainingSessions', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		userID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		dateStamp: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: '(getdate())'
		}
	}, {
		tableName: 'userTrainingSessions',
		timestamps: false,
		freezeTableName: true
	});
};

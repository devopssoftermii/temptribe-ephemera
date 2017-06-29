/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var userPhotos = sequelize.define('userPhotos', {
		ID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		UserID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		FileName: {
			type: DataTypes.STRING,
			allowNull: true
		},
		IsMainImage: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((0))'
		},
		Version: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((1))'
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
		}
	}, {
		tableName: 'userPhotos',
		timestamps: false,
		freezeTableName: true
	});
	userPhotos.associate = function(models) {
		userPhotos.belongsTo(models.users, { as: 'user' });
	}
	return userPhotos;
};

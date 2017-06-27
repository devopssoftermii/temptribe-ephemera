/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('clients', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		clientName: {
			type: DataTypes.STRING,
			allowNull: true
		},
		clientType: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		clientSize: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		address1: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address2: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address3: {
			type: DataTypes.STRING,
			allowNull: true
		},
		town: {
			type: DataTypes.STRING,
			allowNull: true
		},
		county: {
			type: DataTypes.STRING,
			allowNull: true
		},
		postcode: {
			type: DataTypes.STRING,
			allowNull: true
		},
		telephone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		fax: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		website: {
			type: DataTypes.STRING,
			allowNull: true
		},
		requirements: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		lolaComments: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '(1)'
		},
		dateStamp: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: '(getdate())'
		},
		regionID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '(1)',
			primaryKey: true
		},
		emailInvoice: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		paymentTerm: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((1))'
		},
		attachTimesheetToInvoice: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: '0'
		},
		accountNumber: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: '(N'
		},
		invoiceBankAccountID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((1))'
		},
		unpaidBreaks: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		tableName: 'clients',
		timestamps: false,
		freezeTableName: true
	});
};

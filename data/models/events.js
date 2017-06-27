/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('events', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		eventReference: {
			type: DataTypes.STRING,
			allowNull: true
		},
		clientID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		clientContactID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		lolaContactID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		venueID: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		managerID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		comments: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		internalComments: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		clientsVenueAddress: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		websiteTitle: {
			type: DataTypes.STRING,
			allowNull: true
		},
		promoteOnWebsite: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '(0)'
		},
		eventDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		dateCreated: {
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
		dateReminderSent: {
			type: DataTypes.DATE,
			allowNull: true
		},
		dateModified: {
			type: DataTypes.DATE,
			allowNull: true
		},
		notesForClient: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		divisionID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		invoiceID: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		paymentTerm: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '((1))'
		},
		totalAmount: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: '((0))'
		},
		subtitle: {
			type: DataTypes.STRING,
			allowNull: true
		},
		financeComments: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'events',
		timestamps: false,
		freezeTableName: true
	});
};
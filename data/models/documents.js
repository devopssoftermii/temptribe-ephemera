
module.exports = function(sequelize, DataTypes) {
    var documents = sequelize.define('documents', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        file: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cat_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        org_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        contenttype: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tags: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        originalFile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        order: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        /*IsTrainingVideos: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        IsLink: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },*/
    }, {
        tableName: 'Documents',
        timestamps: false,
        freezeTableName: true,
    });

    documents.associate = function(models) {
        documents.belongsTo(models.documentCategory, {
            as: 'documentCategory',
            foreignKey: 'cat_ID',
            targetKey: 'ID'
        });
        documents.belongsTo(models.users, {
            as: 'user',
            foreignKey: 'userID',
            targetKey: 'id'
        });
    }

    return documents;
};
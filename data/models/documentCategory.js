
module.exports = function(sequelize, DataTypes) {
    var documentCategory = sequelize.define('documentCategory', {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        parent_ID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        depth: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lineage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },

    }, {
        tableName: 'DocumentCategory',
        timestamps: false,
        freezeTableName: true,
    });

    documentCategory.associate = function(models) {
        documentCategory.hasMany(models.documents, {
            foreignKey: 'cat_ID',
        });
    };

    return documentCategory;
};
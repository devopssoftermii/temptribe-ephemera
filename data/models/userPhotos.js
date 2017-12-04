/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  var userPhotos = sequelize.define('userPhotos', {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    freezeTableName: true,
    defaultScope: {
      where: {
        Status: 1
      }
    }
  });
  userPhotos.associate = function (models) {
    userPhotos.belongsTo(models.users, {as: 'User'});
    userPhotos.addScope('mainPhoto', {
      attributes: [
        ['FileName', 'filename']
      ],
      where: {
        IsMainImage: 1,
        Status: 1
      }
    });
  }
  return userPhotos;
};

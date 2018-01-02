module.exports = function (sequelize, DataTypes) {
  const faqs = sequelize.define('faqs', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    typeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    answerText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    markAsNew: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    tableName: 'faqs',
    scopes: {
      staff: {
        where: {
          typeID: 3,
          status: 1
        },
        order: [[
          'orderNumber',
          'ASC'
        ]]
      }
    }
  });
  return faqs;
}

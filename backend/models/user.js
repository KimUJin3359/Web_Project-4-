'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // user는 room을 여러개 가질 수 있음
      models.user.hasMany(models.room, {foreignKey: "user_id"})
    }
  };
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profile: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    paranoid: true
  });
  return user;
};
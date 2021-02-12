"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class game_result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.game_result.belongsTo(models.user, {
        foreignKey: "user_id",
        sourceKey: "neos_id",
      });
    }
  }
  game_result.init(
    {
      user_id: DataTypes.INTEGER,
      time: DataTypes.FLOAT,
      ten: DataTypes.INTEGER,
      point: DataTypes.FLOAT,
      text: DataTypes.STRING,
      yaku: DataTypes.STRING,
      bet: DataTypes.FLOAT,
      kfc: DataTypes.FLOAT,
      rate: DataTypes.FLOAT,
      tumo_count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "game_result",
      underscored: true,
    }
  );
  return game_result;
};

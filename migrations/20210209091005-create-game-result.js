"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("game_results", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      time: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      ten: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      point: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      yaku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bet: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      tehai: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      tumo_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("game_results");
  },
};

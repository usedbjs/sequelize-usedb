const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:");

const Post = sequelize.define("Post", {
  caption: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();
module.exports = { Post };

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Inshorts", "Adii2202", "@Root123", {
  host: "127.0.0.1",
  dialect: "mysql",
});

const User = require("./User")(sequelize, Sequelize);
const Newshorts = require("./Newshorts");

module.exports = {
  sequelize,
  User,
  Newsshorts,
};

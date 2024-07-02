const { Sequelize } = require("sequelize");
// require("dotenv").config();

const sequelize = new Sequelize("Inshorts", "Adii2202", "@Root123", {
  host: "127.0.0.1",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => {
    console.log("Unable to connect to the database:");
    console.log("Error: ", err.message);
    console.log("Details: ", err);
  });

module.exports = sequelize;

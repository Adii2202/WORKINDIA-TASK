const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routers/userRoute.js");
const adminRoutes = require("./routers/adminRoutes.js");
const sequelize = require("./config/config.js");


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log("Database connected.");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

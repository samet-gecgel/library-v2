const config = require("../views/config");
const Sequelize = require("sequelize");
require('dotenv').config()

const sequelize = new Sequelize({
  host: config.db.host,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  dialect: "mysql",
  
  
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("mysql server connected");
  } catch (err) {
    console.log("mysql server connection failed", err);
  }
}

connect();

module.exports = sequelize;

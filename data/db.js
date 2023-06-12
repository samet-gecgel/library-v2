const config = require("../views/config");
const Sequelize = require("sequelize");
require('dotenv').config()

const sequelize = new Sequelize(config.db.urlDB);

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

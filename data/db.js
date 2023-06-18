const config = require("../config");
const Sequelize  = require('sequelize');
const mysql2 = require('mysql2');
require('dotenv').config()

const sequelize = new Sequelize(config.db.urlDB, {
  dialect: 'mysql',
  dialectModule: mysql2,
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

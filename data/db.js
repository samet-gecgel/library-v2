const config = require("../views/config");
const Sequelize = require("sequelize");
require('dotenv').config()

const sequelize = new Sequelize("mysql://root:zXZUv5b3BBj3eIGvj9ot@containers-us-west-201.railway.app:6960/railway");

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

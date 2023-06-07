//const config = require("../views/config");
const Sequelize = require("sequelize");
require('dotenv').config()

const sequelize = new Sequelize('mysql://mmvtzo3jlxzn824eswnw:pscale_pw_ha6zy1kcEYKOiSBThKrYdTPreOAvu3CBzrAMDiq8kK7@aws.connect.psdb.cloud/library-v2', {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true
  }
}});

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

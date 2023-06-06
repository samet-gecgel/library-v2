const config = require("../views/config");
const Sequelize = require("sequelize");
// const mysql = require("mysql2");

const sequelize = new Sequelize('mysql://uui3nylnhqs5fcjm:1ouI0np0GxdxgBggQ1r9@bwpu3iu7vxlxpddpbzdg-mysql.services.clever-cloud.com:3306/bwpu3iu7vxlxpddpbzdg');

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

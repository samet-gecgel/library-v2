const config = require("../views/config");
const Sequelize = require("sequelize");
// const mysql = require("mysql2");

const sequelize = new Sequelize(
  'bwpu3iu7vxlxpddpbzdg', 
  'uui3nylnhqs5fcjm', 
  '1ouI0np0GxdxgBggQ1r9', {
  dialect: "mysql",
  host:  'bwpu3iu7vxlxpddpbzdg-mysql.services.clever-cloud.com',
  define: {
    timestamps: false
  },
  port : 3306,
  // dialectModule: mysql,
  storage: "./session.mysql",
  
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

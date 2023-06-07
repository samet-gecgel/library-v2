const config = require("../views/config");
const Sequelize = require("sequelize");
// const mysql = require("mysql2");

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  dialect: "mysql",
  host: config.db.host,
  define: {
    timestamps: false
  },
  port : config.db.port,
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

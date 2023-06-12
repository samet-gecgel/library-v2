require('dotenv').config();

const config = {
  db : {
      connectionLimit: 1,
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
      urlDB : `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`
  },
  email: {
      username : "sametgecgel68@hotmail.com",
      password : "Sgrio1453.",
      from : "sametgecgel68@hotmail.com"
  }
};

module.exports = config;
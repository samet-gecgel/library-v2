const config = {
  db : {
      connectionLimit: 1,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
  },
  email: {
      username : "sametgecgel68@hotmail.com",
      password : "Sgrio1453.",
      from : "sametgecgel68@hotmail.com"
  }
};

module.exports = config;
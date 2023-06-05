// express
const express = require('express');
const app = express();

const cookieParser = require("cookie-parser");
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");
const bodyParser = require('body-parser');


// node modules
const path = require('path');
// const env = require('./env');

// routes
const siteRoutes = require("./routes/site");

// custom modules
const sequelize = require('./data/db');
const locals = require("./middlewares/locals");

// template engine
app.set("view engine", "ejs");

// models
const Book = require("./models/book");
const User = require("./models/user");

// middleware
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(session({
  secret : "02072001Sgrio",
  resave : false , 
  saveUninitialized : false,
  cookie :{
   maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store : new SequelizeStore({
    db : sequelize
  })  
}));

app.use(locals);
app.use(csurf());
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/views", express.static(path.join(__dirname, "public")));
app.use('/css', express.static(__dirname + '/public/css'));
app.use("/resim",express.static(path.join(__dirname , "/public/resim")))

app.use(siteRoutes);

Book.belongsTo(User, { as: 'users', foreignKey: 'userid' });
User.hasMany(Book, { as: 'books', foreignKey: 'userid' });

(async () => {
  // await sequelize.sync({ force: true });
  // await Book.sync({ alter: true });
  // await User.sync({ alter: true });
})();






const port = 3000;
app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda çalışıyor.`);
});

module.exports = app;


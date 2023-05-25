const express = require('express');
const env = require('./env');
const path = require('path')
const app = express();
const siteRoutes = require("./routes/site");
// const authRoutes = require("./routes/auth");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const locals = require("./middlewares/locals")
const csurf = require("csurf");

const SequelizeStore = require("connect-session-sequelize")(session.Store);
// const sequelize = require("./data/db");

const Book = require("./models/book");
const User = require("./models/user");
const sequelize = require('./data/db');

app.use(cookieParser());
app.use(session({
  secret : "hello world",
  resave : false , 
  saveUninitialized : false,
  cookie :{
   maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store : new SequelizeStore({
    db : sequelize
  })  
}))
app.use(csurf());

Book.belongsTo(User,{
  foreignKey: {
      allowNull: true
  }
});
User.hasMany(Book);

(async () => {
  // await sequelize.sync({ force: true });
  // await Book.sync({ alter: true });
  // await User.sync({ alter: true });
})();


app.use(locals);

app.set("view engine", "ejs");
app.use(express.urlencoded({extended : false}))

app.use("/views", express.static(path.join(__dirname, "public")));
app.use('/css', express.static(__dirname + '/public/css'));

app.use("/resim",express.static(path.join(__dirname , "/public/resim")))
app.use(bodyParser.urlencoded({ extended: false }));

app.use(siteRoutes);
// app.use("/account", authRoutes)


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda çalışıyor.`);
});


const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../views/config");
const crypto = require("crypto");
const { Op } = require("sequelize");

exports.get_register = async function (req, res) {

  try{
    return res.render("register",{
      // csrfToken: req.csrfToken()
    });
  }
  catch(err){
    console.log(err, req.csrfToken());
  }
}

exports.post_register = async function (req,res){
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password,10);

  try{
    const user = await User.findOne({where : {email : email}});
    if(user){
      req.session.message = { text : "Girdiğiniz email adresiyle daha önce kayıt olunmuş" , class: "warning"};
      return res.redirect("/register");
    }
    const newUser = await User.create({
      fullname : fullname,
      email : email, 
      password : hashedPassword
    });

      emailService.sendMail({
      from: "sametgecgel68@hotmail.com",
      to: newUser.email,
      subject: "Hesabınızı oluşturuldu.",
      text: "Hesabınızı başarılı şekilde oluşturuldu."
  });

    req.session.message = { text : "Hesabınıza tekrar giriş yapabilirsiniz"  , class: "success"};

    return res.redirect("/login");
  }catch(err){
    console.log(err);
  }

}

exports.get_login = async function (req, res) {
  const message = req.session.message;
  delete req.session.message;

  try{
    return res.render("login",{
      message : message,
      csrfToken: req.csrfToken()
    });
  }
  catch(err){
    console.log(err);
  }
}


exports.post_login = async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  
  try{
    
    const user = await User.findOne({
      where: {
        email : email
      }
    });
    
    if (!user) {
      return res.render("login", {
        message: { text : "E-Mail Hatalı" , class: "warning"}
      });
    }
    
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      
      req.session.isAuth = true;
      req.session.fullname = user.fullname;
      req.session.userid = user.userid;
      
      const url = req.query.returnUrl ? req.query.returnUrl : "/anasayfa";
      
      return res.redirect(url);
    }
    
    return res.render("login", {
      message: { text : "Parola Hatalı" , class: "warning"}
    });
    
    
  }
  catch(err){
    console.log(err);
  }
}

exports.get_reset = async function (req, res) {
  const message = req.session.message;
  delete req.session.message;

  try{
    return res.render("reset-password",{
      message : message
    });
  }
  catch(err){
    console.log(err, req.csrfToken());
  }
}

exports.post_reset = async function (req, res) {
  const email = req.body.email;

  try{
    var token = crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({where : {email : email}});

    if(!user){
      req.session.message = { text : "Email Bulunamadı" , class: "warning"};
      return res.redirect("reset-password");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + (1000 * 60 *60);
    await user.save();

    emailService.sendMail({
      from: config.email.from,
      to: email,
      subject: "Parola Sıfırlama",
      html : `
      <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
      <p>
          <a href="http://127.0.0.1:3000/new-password/${token}">Parola Sıfırla<a/>
      </p>
  `
  });

  req.session.message = {text : "Parolanızı sıfırlamak için eposta adresinizi kontrol ediniz.", class : "success"};
  res.redirect("/login");

  }
  catch(err){
    console.log(err, req.csrfToken());
  }
}

exports.get_newpassword = async function(req, res) {
  const token = req.params.token;

  try {
      const user = await User.findOne({
          where: {
              resetToken: token,
              resetTokenExpiration: {
                  [Op.gt]: Date.now()
              }
          }
      });

      return res.render("new-password", {
          token: token,
          userid: user.userid
      });
  }
  catch(err) {
      console.log(err);
  }
}

exports.post_newpassword = async function(req, res) {
  const token = req.body.token;
  const userid = req.body.userid;
  const newPassword = req.body.password;

  try {
      const user = await User.findOne({
          where: {
              resetToken: token,
              resetTokenExpiration: {
                  [Op.gt]: Date.now()
              },
              userid: userid
          }
      });

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetToken = null;
      user.resetTokenExpiration = null;
      
      await user.save();

      req.session.message = {text: "parolanız güncellendi", class:"success"};
      return res.redirect("/login");
  }
  catch(err) {
      console.log(err);
  }
}
exports.get_logout = async function (req, res) {
  try{
    await req.session.destroy();
    return res.redirect("/login");
  }
  catch(err){
    console.log(err);
  }
}
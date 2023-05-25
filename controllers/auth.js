const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../views/config");

exports.get_register = async function (req, res) {

  try{
    return res.render("register",{
      csrfToken: req.csrfToken()
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
      return res.redirect("register");
    }
    const newUser = await User.create({
      fullname : fullname,
      email : email, 
      password : hashedPassword
    });

    // var mailOptions = {
    //   from: config.email.user,
    //   to: newUser.email,
    //   subject: 'Hesabınız Oluşturuldu',
    //   text: 'Hesabınız başarılı şekilde oluşturuldu'
    // };

    // emailService.sendMail(mailOptions, function(error, info){
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });

    req.session.message = { text : "Hesabınıza tekrar giriş yapabilirsiniz"  , class: "success"};

    return res.redirect("login");
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
      
      const url = req.query.returnUrl ? req.query.returnUrl : "/";
      
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


exports.get_logout = async function (req, res) {
  try{
    await req.session.destroy();
    return res.redirect("/login");
  }
  catch(err){
    console.log(err);
  }
}
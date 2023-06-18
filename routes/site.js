const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const authController = require("../controllers/auth");
const csrf = require("../middlewares/csrf");
const User = require("../models/user");
const { Op } = require('sequelize');

router.get("/register", csrf,  authController.get_register);
router.post("/register", authController.post_register);
router.get("/login", csrf, authController.get_login);
router.post("/login",authController.post_login);

router.get("/reset-password", csrf, authController.get_reset);
router.post("/reset-password",authController.post_reset);

router.get("/new-password/:token",csrf, authController.get_newpassword);
router.post("/new-password", authController.post_newpassword);

router.get("/logout", csrf, authController.get_logout);

router.get("/delete/:kitapno", csrf , async function(req, res){
  if (!req.session.isAuth) {
    return res.redirect("/login?returnUrl=" + req.originalUrl);
  }
  const kitapno = req.params.kitapno;
  try {
    const book = await Book.findByPk(kitapno);

    if (book && book.userid === req.session.userid) {
      return res.render("delete", {
        book: book
      });
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete/:kitapno", async function(req, res){
  const kitapno = req.body.kitapno;
  try {
    const book = await Book.findByPk(kitapno);
    if (book && book.userid === req.session.userid) {
      await book.destroy();
      return res.redirect("/?action=delete");
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.get("/kitapekle", csrf, async function (req, res) {
  if(!req.session.isAuth){
    return res.redirect("/anasayfa");
  }
  try {
    res.render("kitapekle");
  } catch (err) {
    console.log(err);
  }
});
router.post("/kitapekle", async function (req, res) {
  const kitapadi = req.body.kitapadi;
  const yazaradi = req.body.yazaradi;
  const yayinevi = req.body.yayinevi;
  const sayfasayisi = req.body.sayfasayisi;
  const kategori = req.body.kategori;
  const resim = req.body.resim;
  const userid = req.session.userid;

  try {
    Book.create({
      kitapadi : kitapadi,
      yazaradi : yazaradi,
      yayinevi : yayinevi,
      sayfasayisi : sayfasayisi,
      kategori : kategori,
      resim : resim,
      userid : userid
    })
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
router.get("/kitapDuzenle/:kitapno", csrf, async function (req, res) {
  if(!req.session.isAuth){
    return res.redirect("/anasayfa");
  }
  const kitapno = req.params.kitapno;
  try {
    const book = await Book.findByPk(kitapno)

    if (book) {
      return res.render("kitapDuzenle",{
        book :book
      }
      );
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
router.post("/kitapDuzenle/:kitapno", async function (req, res) {
  
  const kitapno = req.params.kitapno;
  console.log(req.body);
  const kitapadi = req.body.kitapadi;
  const yazaradi = req.body.yazaradi;
  const yayinevi = req.body.yayinevi;
  const sayfasayisi = req.body.sayfasayisi;
  const kategori = req.body.kategori;
  const resim = req.body.resim;
  const userid = req.session.userid;
  console.log(kitapno, kitapadi, yazaradi, yayinevi, sayfasayisi, kategori, resim, userid);
  try {
    const book = await Book.findByPk(kitapno);
    if (book) {
      book.kitapadi = kitapadi;
      book.yazaradi = yazaradi;
      book.yayinevi = yayinevi;
      book.sayfasayisi = sayfasayisi;
      book.kategori = kategori;
      book.resim = resim;
      book.userid = userid;
  
      const updatedBook = await book.save();
      if (updatedBook) {
        return res.redirect("/");
      }
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});


router.get("/", function (req, res) {
  res.redirect("/anasayfa");
});

router.get("/profil/:userid", async function (req, res) {
  const userid = req.session.userid;
  if (!req.session.isAuth) {
    return res.redirect("/anasayfa");
  }
  try {
    const user = await User.findByPk(userid);

    
      return res.render("profil", {
        users: user
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:kitapno", async function (req, res) {
  const kitapno = req.params.kitapno;
  if (!req.session.isAuth) {
    return res.redirect("/anasayfa");
  }
  try {
    const book = await Book.findByPk(kitapno);

    if (book && book.userid === req.session.userid) {
      return res.render("kitapdetay", {
        books: book
      });
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.get("/", csrf, async function (req, res) {
  if (!req.session.isAuth) {
    return res.redirect("/anasayfa");
  }
  try {
    const books = await Book.findAll({ where: { userid: req.session.userid } });
    const users = await User.findAll({ where: { userid: req.session.userid } });
    res.render("kitaplar", { books: books, users: users });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/anasayfa");
  }
  try {
    const searchQuery = req.body.arama;
    const books = await Book.findAll({
      where: {
        userid: req.session.userid,
        [Op.or]: [
          { kitapadi: { [Op.like]: `%${searchQuery}%` } },
          { yazaradi: { [Op.like]: `%${searchQuery}%` } },
          { kategori: { [Op.like]: `%${searchQuery}%` } }
        ]
      }
    });
    const users = await User.findAll({ where: { userid: req.session.userid } });
    res.render("arama", { books: books, users: users });
  } catch (err) {
    console.log(err);
  }
});
  

module.exports = router;
// const searchQuery = req.body.arama;
//     const book = await Book.findAll({
      
//       where: {
//         [Op.or]: [
//           { kitapadi: { [Op.like]: `%${searchQuery}%` } },
//           { yazaradi: { [Op.like]: `%${searchQuery}%` } },
//           { kategori: { [Op.like]: `%${searchQuery}%` } },
//         ],
//         userid: req.session.userid,
//       },
//     });
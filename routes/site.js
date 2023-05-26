const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const authController = require("../controllers/auth");
const csrf = require("../middlewares/csrf")

router.get("/register", csrf,  authController.get_register);
router.post("/register", authController.post_register);
router.get("/login", csrf, authController.get_login);
router.post("/login",authController.post_login);

router.get("/logout", csrf, authController.get_logout);

router.get("/delete/:kitapno",async function(req,res){
  if(!req.session.isAuth){
    return res.redirect("/login?returnUrl="+ req.originalUrl);
  }
  const kitapno = req.params.kitapno;
  try{
    const book = await Book.findByPk(kitapno);

    if(book){
      return res.render("delete",{
        book:book
      });
    }
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
})

router.post("/delete/:kitapno",async function(req,res){
  const kitapno = req.body.kitapno;
  try{
    const book = await Book.findByPk(kitapno);
    if(book){
      await book.destroy();
      return res.redirect("/?action=delete");
    }
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
})

router.get("/kitapekle", csrf, async function (req, res) {
  if(!req.session.isAuth){
    return res.redirect("/login");
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

  try {
    Book.create({
      kitapadi : kitapadi,
      yazaradi : yazaradi,
      yayinevi : yayinevi,
      sayfasayisi : sayfasayisi,
      kategori : kategori,
      resim : resim
    })
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
router.get("/kitapDuzenle/:kitapno", csrf, async function (req, res) {
  if(!req.session.isAuth){
    return res.redirect("/login");
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
  
  const kitapno = req.body.kitapno;
  const kitapadi = req.body.kitapadi;
  const yazaradi = req.body.yazaradi;
  const yayinevi = req.body.yayinevi;
  const sayfasayisi = req.body.sayfasayisi;
  const kategori = req.body.kategori;
  const resim = req.body.resim;

  try {

    const book = await Book.findByPk(kitapno);
    if(book){
      book.kitapadi =kitapadi;
      book.yazaradi = yazaradi;
      book.yayinevi = yayinevi;
      book.sayfasayisi = sayfasayisi;
      book.kategori = kategori;
      book.resim = resim;

      await book.save();
      return res.redirect("/");
    }
    res.redirect("/");

  } catch (err) {
    console.log(err);
  }
});

router.use("/anasayfa", function (req, res) {
  res.render("anasayfa");
});

router.use("/profil", function (req, res) {
  if(!req.session.isAuth){
    return res.redirect("/login");
  }
  res.render("profil");
});

// router.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   db.query(
//     "SELECT * FROM books WHERE username = ?",
//     username,
//     (err, result) => {
//       if (err) {
//         throw err;
//       }
//       if (result.length > 0) {
//         bcrypt.compare(password, result[0].password, (err, match) => {
//           if (err) {
//             throw err;
//           }
//           if (match) {
//             res.send("Logged in successfully");
//           } else {
//             res.send("Incorrect username or password");
//           }
//         });
//       } else {
//         res.send("Incorrect username or password");
//       }
//     }
//   );
// });

// router.get("/register", (req, res) => {
//   res.render("register");
// });

// router.post("/register", (req, res) => {
//   const { username, password } = req.body;
//   bcrypt.hash(password, saltRounds, (err, hash) => {
//     if (err) {
//       throw err;
//     }
//     const user = { username, password: hash };
//     db.query("INSERT INTO users SET ?", user, (err, result) => {
//       if (err) {
//         throw err;
//       }
//       res.redirect("/login");
//     });
//   });
// });


router.use("/:kitapno", async function (req, res) {
  const kitapno = req.params.kitapno;
  const userid = req.params.userid;
  if(!req.session.isAuth){
    return res.redirect("/login");
  }
  try {
    const books = await Book.findByPk(kitapno);

    if (books) {
      return res.render("kitapdetay", {
        books: books
            });
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
router.get("/", csrf,  async function (req, res) {
  try {
    const book = await Book.findAll();
    if(!req.session.isAuth){
      return res.redirect("/login");
    }
    console.log(book);
    // const sayi = "SELECT COUNT(kitapno) as count FROM books";
    // const sira = 'SELECT * FROM books ORDER BY kitapadi, yazaradi, kategori';
    
    res.render("home", {
      books: book
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/", async (req, res) => {
  const searchQuery = req.body.arama;
  const query = `SELECT * FROM books WHERE kitapadi LIKE '%${searchQuery}%' OR yazaradi LIKE '%${searchQuery}%' OR kategori LIKE '%${searchQuery}%'`;
  const [books] = await db.execute(query);

  res.render("home", { books });
});

module.exports = router;

module.exports = function(req,res,next){
    res.locals.isAuth = req.session.isAuth;
    res.locals.fullname = req.session.fullname;
    res.locals.userid = req.session.userid;
    res.locals.kitapno = req.params.kitapno;
    next();}
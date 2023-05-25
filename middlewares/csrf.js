module.exports = (req, res, next) => {
    res.locals.csrftoken = req.csrfToken();
    next();
}
const jwt = require('jsonwebtoken');
const SECRETKEY = "Login"
const getUser = (req, res, next) => {
    const token = req.cookies.token ?? null
    user = { username: "Account" };
    req.account = user;

    if (token == null) {
        next();
    } else {
        jwt.verify(token, SECRETKEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.account = user;
            next();
        });
    } 
}


module.exports = getUser;
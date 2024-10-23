const jwt = require('jsonwebtoken');
const SECRETKEY = "Login";

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(401);
    }
    
    jwt.verify(token, SECRETKEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken
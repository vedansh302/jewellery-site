const jwt = require('jsonwebtoken');
const SECRETKEY = "Login";

const authmiddleware = (req,res,next)=>{
    const token = req.cookies.token
    if(!token){
        return res.status(401).redirect('/login')
    }
    try {
        const decoded = jwt.verify(token,SECRETKEY)
        req.user = decoded.id
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authmiddleware
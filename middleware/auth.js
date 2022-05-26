const config = require("config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    //get token from header
    const token = req.header('x-auth-token');

    //check if not token
    if (!token) {
        return res.status(401).json({ msg: 'authorization denied NT' })
    }

    //verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user; //take request user and assign it to decoded
        next();

    } catch (error) {
        res.status(401).json({ msg: 'authorization denied' });

    }
}

module.exports = authMiddleware;
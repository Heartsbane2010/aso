const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ "message": "Unauthorized" });
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err); // Log the error for debugging
                return res.status(403).json({ "message": "Forbidden" });
            };
            req.user = decoded.UserInfo.id;
            req.roles = decoded.UserInfo.roles;
            req.email = decoded.UserInfo.email;
            next();
        }
    )
};

module.exports = verifyJWT;
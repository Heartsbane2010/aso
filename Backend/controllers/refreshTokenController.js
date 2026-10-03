const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;//Obtaining cookies from request object
    if(!cookies?.jwt) return res.sendStatus(401) //Checking if the jwt in the cookies object exists.
    console.log(cookies.jwt);
    refreshToken = cookies.jwt;

    //Check if refresh token matches with the one in the DB
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        return res.status(403).json({ "message": "forbidden"})
    }

     // Evaluate jwt from cookie and compare with the user in the database  
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.status(403).json({ "message": "forbidden" });
            const roles = Object.values(foundUser.roles).filter(Boolean);

            //Refresh token is valid, create new access token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '4h' }
            );
            res.json({ accessToken });//If compared values are true, send a new access token to the client(user).
        }
    )
};

module.exports = { handleRefreshToken };
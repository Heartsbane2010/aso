const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    // Check if the user in the database cooresponds to the user logging in(The request).
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        //Retrieving values inside of roles
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // Create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '4h'}
        );

        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '5d'}
        );

        //Save Refresh token with current user to DB
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        //Send refreshToken as an http only cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

        //Save accessToken as json for subsequent authentications
        res.json({ accessToken });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = { handleLogin };
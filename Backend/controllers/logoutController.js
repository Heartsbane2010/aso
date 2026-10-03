const User = require('../models/User');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content

    const refreshToken = cookies.jwt;

    //Check if user with this refresh token exists
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
        return res.sendStatus(204);
    }

    //Delete refresh token in DB
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    
    //Clear cookie on client side
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }); //Secure: true in production
    res.sendStatus(204);
};

module.exports = { handleLogout };
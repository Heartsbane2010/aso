const User = require("../models/User");
const bcrypt = require("bcryptjs");

const handleNewUser = async (req, res) => {
    const { firstname, lastname, email, pwd } = req.body;

    if (!firstname || !lastname || !email || !pwd) {
        return res.status(400).json({ message: "All fields are required" });
    }
    //Check for existing user
    const userExists = await User.findOne({ email }).exec();
    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    try {
        //Hash password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //Create and store the new user
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPwd
        });
        console.log(newUser);
        res.status(201).json({ message: `New user ${email} created` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };
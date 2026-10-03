const PrayerRequest = require('../models/PrayerRequest');

const handleNewPrayerRequest = async (req, res) => {
    const { fullname, email, title, request } = req.body;

    if (!fullname || !email || !title || !request) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        //Create and store the new prayer request
        const newPrayerRequest = await PrayerRequest.create({
            userId: req.user,
            fullname,
            email,
            title,
            request
        });
        res.status(201).json({ message: `New prayer request from ${fullname} created` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPrayerRequests = async (req, res) => {
    try {
        const userId = req.user; // Assuming the user ID is attached to the request object by your authentication middleware
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const prayerRequests = await PrayerRequest.find({ userId }); // Find by the user's ID rather than the prayer request's ID, assuming you want to fetch all prayer requests for that user
        res.status(200).json(prayerRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewPrayerRequest, getPrayerRequests };
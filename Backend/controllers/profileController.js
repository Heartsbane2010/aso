const User = require('../models/User');

// Get user profile by ID
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user;// Grab the vaildated ID attached by our middleware
        const user = await User.findById(userId).select('-password -refreshToken'); // Exclude sensitive fields like password and refreshToken
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            membershipDate: user.membershipDate,
            churchInvolvement: user.churchInvolvement,
        });// Send user data as JSON response
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile by ID
const updateUserProfile = async (req, res) => {
    console.log('---Incoming request debug---');
    console.log('Extracted user ID from token:', req.user);
    try {
        const userId = req.user;// Extract the user ID from the request object, which is set by the authentication middleware
        // Extract variables from the request body with clean fallbacks if a field isn't provided
        const updateData = {
            phone: req.body.phone || undefined,
            gender: req.body.gender || undefined,
            dateOfBirth: req.body.dateOfBirth || undefined,
            membershipDate: req.body.membershipDate || undefined,
            churchInvolvement: req.body.churchInvolvement || undefined
        };
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -refreshToken'); // Exclude sensitive fields like password and refreshToken
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getUserProfile, updateUserProfile };
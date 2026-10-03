const Users = require("../models/User");

// Update user profile picture
const updateProfilePicture = async (req, res) => {
    try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
    
            const fileUrl = `/uploads/${req.file.filename}`;
            const userId = req.body.userId;
    
            if (userId) {
                const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: fileUrl }, { new: true });
                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }
    
                return res.status(200).json({
                    message: 'Image uploaded successfully',
                    url: fileUrl,
                    user: updatedUser
                });
            }
    
            res.status(200).json({
                message: 'Image uploaded successfully, but no user was attached to persist it yet.',
                url: fileUrl
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ message: 'Server error!', error: error.message });
        }
};

module.exports = { updateProfilePicture };
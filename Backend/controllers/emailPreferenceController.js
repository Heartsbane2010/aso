const User = require('../models/User');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const handleEmailPreference = async (req, res) => {
    const { emailNewsletter, textAlerts, eventNotifications } = req.body;
    const userId = req.user; 
    const email = req.email; // Get the email from the request object

    try {
        // Update the user's email preferences in the database
        await User.findByIdAndUpdate(userId, {
            preferences: {
                emailNewsletter,
                textAlerts,
                eventNotifications
            }
        });

        if (emailNewsletter || eventNotifications) {
            // Send email notification
            const { error } = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Email Preferences Updated',
                html: `
                    <h3>Preferences Saved Successfully</h3>
                    <p>Here is your current setup</p>
                    <ul>
                        <li>Email Newsletter: <strong>${emailNewsletter ? 'Enabled' : 'Disabled'}</strong></li>
                        <li>Event Notifications: <strong>${eventNotifications ? 'Enabled' : 'Disabled'}</strong></li>
                    </ul>
                `
            });

            if (error) {
                console.error('Resend Error:', error);
                return res.status(200).json({ success: true, message: 'Preferences saved, but email notification failed'})
            }
            return res.status(200).json({ success: true, message: 'Preferences updated successfully!' });
        }
    } catch (err) {
        console.error('Error updating email preferences:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { handleEmailPreference }; 
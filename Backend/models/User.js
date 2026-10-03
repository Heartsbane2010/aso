const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    membershipDate: {
        type: Date,
        default: Date.now
    },
    churchInvolvement: {
        type: String,
        required: false
    },
    profilePicture: { type: String },
    preferences: {
        emailNewsletter: { type: Boolean, default: true },
        textAlerts: { type: Boolean, default: true },
        eventNotifications: { type: Boolean, default: true }
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number  
    },
    refreshToken: String
});

module.exports = mongoose.model("User", userSchema);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const uploadProfilePic = require('./middleware/upload');
const connectDB = require('./config/dbConn');
const User = require('./models/User');

const app = express();
connectDB();

//Built in middleware to handle incoming requests with JSON payloads and URL-encoded data, as well as to handle cookies and CORS.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(credentials); // Handle credentials before CORS
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'))//Serve uploaded images statically
app.use(express.static('public'));//Serve static files from the public directory


//Routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT); // Apply JWT verification middleware to all routes below this line
app.use('/prayer-request', require('./routes/prayerRequest'));
app.post('/upload-profile-pic', require('./routes/profilePicture'));
app.use('/profile', require('./routes/profile'));
app.use('/email-preference', require('./routes/emailPreference'));


const PORT = process.env.PORT || 4000;
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

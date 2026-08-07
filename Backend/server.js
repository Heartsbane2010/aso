require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConn');

const app = express();
connectDB();


app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.json());

//Routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/auth'))

const PORT = process.env.PORT || 4000;
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

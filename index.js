const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require('./connect');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 8001;

//Requiring all the routes
const staticRoute = require('./routes/staticRouter');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');

//Connecting to MongoDb
connectToMongoDB('<Your MongoDB Cluster URI>')
    .then(() => {
        console.log('MongoDB Connected!');
    })

//Setting up ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

//Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Using the required routes
app.use('/', checkAuth, staticRoute);
app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use('/user', userRoute);

//Listening to the request
app.listen(PORT, () => {
    console.log(`Server started at PORT:${PORT}`);
})

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./util/router.js');
const db = require('./db/schemas.js');
const dbConnection = require('./db/connection.js')
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

// Use express and export it
const app = express();
module.exports.app = app;

//OAuth strategies require a 'verify' function that receives accessToken
//for accessing FB API. Function must invoke 'cb' with a user object
//which will be set at req.user in route handlers after authentication

//Make a strategy for FB authentication

passport.use(new Strategy({
    clientID: '1773647686219809',
    clientSecret: '98066769ab9c63ce02a5c8586f3e10fb',
    callbackURL: 'http://localhost:4040/login/facebook/oauth'
  },
//facebook sends back tokens and profile
  function(accessToken, refreshToken, profile, cb) {
  	 return cb(null, profile);
  }));

//Serialize and deserialize users out of the session.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Use middleware for logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Use body-parser for parsing JSON in the request body
app.use(bodyParser.json());

// Serve the static client HTML files
app.use(express.static(path.join(__dirname, '/../client/public')));
// Serve the static client React files
app.use('/dist', express.static(path.join(__dirname, '/../client/dist')));
// Serve the node modules
app.use('/lib', express.static(path.join(__dirname, '/../node_modules')));

// Listen for requests on /api and then use the router to determine
// what happens with the requests
app.use('/api', router);

// Check to see if there is a port environment variable or just use port 4040 instead
const port = process.env.PORT || 4040;

// Start the actual server listening on the port variable
app.listen(port, function (err) {
  // If there is an error log it
  if (err) { console.error(err); }
  // If there is not an error console log what port the server is running on
  else { console.log('Server running on port %s', port) }
})
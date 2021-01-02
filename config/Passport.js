
var passport = require('passport');
var keys = require('./keys')
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.google.GOOGLE_CLIENT_ID,
            clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://fkrdm.com:5000/auth/google/redirect"
        }, (accessToken, refreshToken, profile, done) => {
            // passport callback function
            //check if user already exists in our db with the given profile ID
            console.log(profile)
        })
);
module.exports = passport
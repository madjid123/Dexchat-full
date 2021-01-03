const mongoose = require('mongoose')
var keys = require('./keys')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require("../model/User.model")

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: keys.google.GOOGLE_CLIENT_ID,
                clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://fkrdm.com:5000/auth/google/callback"
            }, async (accessToken, refreshToken, profile, done) => {
                // passport callback function
                //check if user already exists in our db with the given profile ID
                console.log(accessToken, refreshToken)
                const newUser = {
                    googleId: profile.id,
                    name: profile.emails[0].value.split("@")[0],
                    email: profile.emails[0].value
                }

                try {
                    let user = await User.findOne({ googleId: profile.id })

                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (err) {
                    console.error(err)
                }


            }));
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}  
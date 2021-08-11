const mongoose = require("mongoose");
var keys = require("./keys");
var GoogleStrategy = require("passport-google-oauth20").Strategy,
  User = require("../model/User");
const LocalStrategy = require("passport-local").Strategy;
const sha256 = require("js-sha256");
const passport = require("passport");

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.GOOGLE_CLIENT_ID,
      clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://fkrdm.com:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // passport callback function
      //check if user already exists in our db with the given profile ID
      const newUser = {
        googleId: profile.id,
        name: profile.emails[0].value.split("@")[0],
        email: profile.emails[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          user = { name: user.name, id: user.id };
          done(null, user);
        } else {
          user = await User.create(newUser);
          user = { name: user.name, id: user.id };
          done(null, user);
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      password = sha256(password);
      console.log("email ,pass ", username, password);
      User.findOne({ email: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        if (user.password != password) {
          return done(null, false, { message: "Incorrect password." });
        }
        console.log(user);
        return done(null, user);
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});
module.exports = passport;

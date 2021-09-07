import mongoose from "mongoose";
import keys from "./keys";
import GoogleStrategy from "passport-google-oauth20";
import User, { UserSchema } from "../model/User";
import LocalStrategy from "passport-local";
import sha256 from "js-sha256";
import passport from "passport";


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: keys.google.GOOGLE_CLIENT_ID,
      clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://fkrdm.com:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // passport callback function
      //check if user already exists in our db with the given profile ID


      try {
        if (profile !== undefined && profile.emails !== undefined) {
          const newUser = {
            name: profile.emails.at(0)?.value.split("@")[0],
            email: profile.emails.at(0)?.value,
            googleId: profile.id,
          } as UserSchema;
          let user = await User.findOne({ googleId: profile.id });
          let _user;
          if (user) {
            _user = { name: user?.name, id: user.id };
            done(null, _user);
          } else {
            _user = await User.create(newUser);
            _user = { name: _user.name, id: _user.id };
            done(null, _user);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      password = sha256.sha256(password);
      User.findOne({ email: username }, (err: mongoose.CallbackError, user: UserSchema) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        if (user.password != password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id: any, done) => {
  done(null, id);
});
export default passport;

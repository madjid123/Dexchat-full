import mongoose from "mongoose";
import keys from "./keys";
import GoogleStrategy from "passport-google-oauth20";
import User, { UserType } from "../model/User";
import LocalStrategy from "passport-local";
import sha256 from "js-sha256";
import passport from "passport";


export interface PassportUserType {
  _id: mongoose.Types.ObjectId,
  username: string,
  email: string
}
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: keys.google.GOOGLE_CLIENT_ID,
      clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {


      try {
        if (profile !== undefined && profile.emails !== undefined) {
          const newUser = {
            username: profile.emails.at(0)?.value.split("@")[0],
            email: profile.emails.at(0)?.value,
            googleId: profile.id,
          } as UserType;
          let user = await User.findOne({ googleId: profile.id });
          let _user;
          if (user !== null) {
            _user = { username: user?.username, id: user._id };
            done(null, _user);
          } else {
            _user = await User.create(newUser);
            _user = { name: _user.username, id: _user._id };
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
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        password = sha256.sha256(password);
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password != password) {
          return done(null, false, { message: "Incorrect password." });
        }

        const passportUser: PassportUserType = { _id: user._id, username: user.username, email: user.email, }
        return done(null, passportUser);
      } catch (e) {
        let err = e as Error;
        console.error(err.message)
        return done(err)
      }
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

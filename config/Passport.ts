import mongoose from "mongoose";
import GoogleStrategy from "passport-google-oauth20";
import User, { UserType } from "../model/User";
import LocalStrategy from "passport-local";
import sha256 from "js-sha256";
import passport from "passport";
import isEqual from "lodash.isequal";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";
import dotenv from "dotenv";
import { Request } from "express";
dotenv.config();
export type PassportUserType = Omit<UserType, "password">;
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      session: false,
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
        const passportUser = {
          username: user.username,
          email: user.email,
          _id: user._id,
          image: user.image,
        };
        return done(null, passportUser, undefined);
      } catch (e) {
        let err = e as Error;
        console.error(err.message, false, undefined);
        return done(err);
      }
    }
  )
);
const SECRET_KEY = process.env.SECRET_KEY || "you-got-that-right!";
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(
    opts,
    async (req: Request, jwtPayload: Omit<UserType, "image">, done) => {
      // Find the user by ID in the payload and call done with the user object
      try {
        const user = jwtPayload;
        const dbUser = await User.findById(user._id);
        if (dbUser === null) throw new Error("User not found");
        const dbUserCred = {
          _id: dbUser._id.toHexString(),
          username: dbUser.username,
          email: dbUser.email,
          password: dbUser.password,
        };
        const userCred = {
          _id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
        };
        if (isEqual(userCred, dbUserCred)) {
          const reqUser = {
            username: dbUser.username,
            email: dbUser.email,
            _id: dbUser._id,
            image: dbUser.image,
          };
          req.user = reqUser;
          return done(null, reqUser);
        } else {
          throw new Error("The authentication token is no longer valid");
        }

        // const user: Record<string, string> = jwtPayload;
      } catch (err) {
        const error = err as Error;
        console.error(error);
        done(error.message, false);
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

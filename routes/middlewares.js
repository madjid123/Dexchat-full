const express = require("express");

const isAuth = (req, res, next) => {
  console.log("isAuth", req.session.passport);
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json("User is not authenticated");
  }
};

module.exports = isAuth;

const express = require("express");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json("User is not authenticated");
  }
};

module.exports = isAuth;

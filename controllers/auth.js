const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

//router object is similar to app object in server js
//however, it only has router functionality
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  //check if user exists
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already taken");
  }
  //check if password and confirmPassword are the same
  if (req.body.password != req.body.confirmPassword) {
    return res.send("Password and confirm password must match");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  //create user in database
  const user = await User.create(req.body);
  res.send(`Thanks for signing up ${user.username}`);

  //   res.redirect();
});

module.exports = router;

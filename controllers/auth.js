const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const isSignedIn = require("../middleware/is-signed-in.js");

//router object is similar to app object in server js
//however, it only has router functionality
router.get("/sign-up", isSignedIn, (req, res) => {
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

  //keep them logged in since they just created the account
  req.session.user = {
    username: user.username,
    _id: user._id,
  };

  //save the session and redirect back to home page as a logged in user
  req.session.save(() => {
    res.redirect("/");
  });
});

router.get("/sign-in", isSignedIn, (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again");
  }

  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );

  if (!validPassword) {
    return res.send("Login failed. Please try again");
  }
  //we have verified the user and passwords match
  //create a session with the user
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  req.session.save(() => {
    res.redirect("/");
  });
});

router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
module.exports = router;

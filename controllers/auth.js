const express = require("express");
const router = express.Router();

//router object is similar to app object in server js
//however, it only has router functionality
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

module.exports = router;

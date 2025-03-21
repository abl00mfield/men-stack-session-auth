// controllers/fruits.js
const express = require("express");
const router = express.Router();

const Fruit = require("../models/fruit.js");

router.get("/new", (req, res) => {
  res.status(200).render("fruits/new.ejs");
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.name.trim()) {
      throw new Error("Invalid input: The name field cannot be empty");
    }
    await Fruit.create(req.body);
    req.session.message = "Fruit Sucessfully Created!";
    res.redirect("/fruits");
  } catch (err) {
    console.log(err.message);
    req.session.message = err.message;
    res.redirect("/fruits");
  }
});

router.get("/", async (req, res) => {
  const foundFruits = await Fruit.find();
  res.render("fruits/index.ejs", { fruits: foundFruits });
});

module.exports = router;

const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const authController = require("./controllers/auth.js");
const session = require("express-session");

//initialize express app
const app = express();

//configure settings
dotenv.config();
// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

//connect to mongo DB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));
//router code is a type of middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/auth", authController);
//anything using auth will automatically be forward to the router code

//mount routes
app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

//tell the app to listen
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

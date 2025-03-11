const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const authController = require("./controllers/auth.js");
const fruitController = require("./controllers/fruits.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

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

//store the session in the database
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

//res.locals makes information available to templates
//res is the response object which is part of our
//communication with the client
app.use((req, res, next) => {
  if (req.session.message) {
    res.locals.message = req.session.message;
    req.session.message = null;
    //now we reset the message so it doesn't persist
  }
  next(); //calls the next middleware function or route handler
  //route handlers are actually a type of middleware
});

//this passes the user to any view
app.use(passUserToView);

app.use("/auth", authController);
app.use("/fruits", fruitController);
//anything using auth will automatically be forward to the router code

//mount routes
app.get("/", (req, res) => {
  res.status(200).render("index.ejs");
});

//protected route user must be logged in for access
//pass is signed in middleware to function to determine
//if user is signed in
app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}`);
});

//catch all route should always be listed last
app.get("*", (req, res) => {
  res.status(404).render("error.ejs", { msg: "Page Not Found" });
});
//tell the app to listen
const handleServerError = (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Warning! Port ${port} is already in use!`);
  } else {
    console.log("Error: ", err);
  }
};

app
  .listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  })
  .on("error", handleServerError);

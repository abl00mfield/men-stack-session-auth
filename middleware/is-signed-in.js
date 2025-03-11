const isSignedIn = (req, res, next) => {
  if (req.session.user) {
    if (req.path === "/sign-in/" || req.path === "/sign-up/") {
      return res.redirect("/");
    }
    return next();
  }
  res.redirect("/auth/sign-in");
};

module.exports = isSignedIn;

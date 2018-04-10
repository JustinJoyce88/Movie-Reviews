var express = require("express"),
  app = express(),
  request = require("request"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  contactRoutes = require("./routes/contact"),
  passport = require("passport"),
  LocalStrategy = require('passport-local'),
  methodOverride = require("method-override"),
  Movie = require("./models/movie"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds"),
  commentRoutes = require("./routes/comments"),
  movieRoutes = require("./routes/movies"),
  indexRoutes = require("./routes/index");

app.locals.moment = require("moment");

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "This is the secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//-------------------------------------
var url = process.env.DBURL || "mongodb://localhost/movieDB";
mongoose.connect(url);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  next();
});
app.use("/contact", contactRoutes);
// seedDB();

app.use(indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("Movie Review server has started.");
});
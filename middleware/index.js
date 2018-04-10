var Movie = require("../models/movie"),
Comment = require("../models/comment"),
middlewareObj = {};

middlewareObj.movieOwnership = function(req, res, next){
  //is user logged in?
  if (req.isAuthenticated()) {
    Movie.findById(req.params.id, function (err, foundMovie) {
      if (err || !foundMovie) {
        req.flash("error", "Movie not found.");
        res.redirect("back");
      } else {
        //does user own movie?
        if (foundMovie.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "Permission denied.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in.");
    res.redirect("back");
  }
};

middlewareObj.commentOwnership = function(req, res, next){
  //is user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Comment not found.");
        res.redirect("back");
      } else {
        //does user own comment?
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "Permission denied.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in.");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in.");
  res.redirect("/login");
};

module.exports = middlewareObj;
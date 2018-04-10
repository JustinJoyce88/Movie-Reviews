var express = require("express"),
  router = express.Router({
    mergeParams: true
  }),
  Movie = require("../models/movie"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

//NEW COMMENT - view new comment page
router.get("/new", middleware.isLoggedIn, function (req, res) {
  Movie.findById(req.params.id, function (err, movie) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        movie: movie
      });
    }
  });
});

//CREATE COMMENT - posts the comment
router.post("/", middleware.isLoggedIn, function (req, res) {
  Movie.findById(req.params.id, function (err, movie) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/movies");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          movie.comments.push(comment);
          movie.save();
          res.redirect("/movies/" + movie._id);
        }
      });
    }
  });
});

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.commentOwnership, function (req, res) {
  Movie.findById(req.params.id, function(err, foundMovie){
    if(err || !foundMovie) {
      req.flash("error", "Something went wrong.");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        req.flash("error", "Something went wrong.");
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          movie_id: req.params.id,
          comment: foundComment
        });
      }
    });
  });
});

//UPDATE COMMENT
router.put("/:comment_id/", middleware.commentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      res.redirect("/movies/" + req.params.id);
    }
  });
});

//DESTROY COMMENT
router.delete("/:comment_id", middleware.commentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted.");
      res.redirect("/movies/" + req.params.id);
    }
  });
});

module.exports = router;
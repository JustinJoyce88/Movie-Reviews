var express = require("express"),
  router = express.Router(),
  Movie = require("../models/movie"),
  middleware = require("../middleware"),
  request = require("request"),
  multer = require("multer"),
  storage = multer.diskStorage({
    filename: function (req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  }),
  imageFilter = function (req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return callback(new Error("Only image files are allowed."), false);
    }
    callback(null, true);
  },
  upload = multer({
    storage: storage,
    fileFilter: imageFilter
  }),
  cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "justinupload",
  api_key: '946456241342922',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//INDEX - Show all Movies
router.get("/", function (req, res) {
  if (req.query.search) {
    var regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Movie.find({
      name: regex
    }, function (err, allMovies) {
      if (err) {
        req.flash("error", err);
      } else {
        if (allMovies.length < 1) {
          req.flash("warning", "Found no Movies. Please search again.");
          return res.redirect("movies/index");
        }
        res.render("movies/index", {
          movies: allMovies,
          page: "movies"
        });
      }
    });
  } else {
    Movie.find({}, function (err, allMovies) {
      if (err) {
        req.flash("error", err);
      } else {
        res.render("movies/index", {
          movies: allMovies,
          page: "movies"
        });
      }
    });
  }
});

//CREATE - add new Movie to DB
router.post("/", middleware.isLoggedIn, upload.single("image"), function (req, res) {
  cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    req.body.movie.image = result.secure_url;
    req.body.movie.image_id = result.public_id;
    req.body.movie.author = {
      id: req.user._id,
      username: req.user.username
    };
    newMovie = {
      name: req.body.movie.name,
      image: req.body.movie.image,
      description: req.body.movie.description,
      author: req.body.movie.author,
      rating: req.body.movie.rating,

    };
    Movie.create(newMovie, function (err, newlyCreated) {
      if (err) {
        req.flash("error", err);
      } else {
        res.redirect("/movies");
      }
    });
  });
});

//NEW - show form to create new movie
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("movies/new");
});

//SHOW - show information for selected movie
router.get("/:id", function (req, res) {
  Movie.findById(req.params.id).populate("comments").exec(function (err, foundMovie) {
    if (err || !foundMovie) {
      req.flash("error", "Movie not found.");
      res.redirect("back");
    } else {
      res.render("movies/show", {
        movie: foundMovie
      });
    }
  });
});

//EDIT
router.get("/:id/edit", middleware.movieOwnership, function (req, res) {
  Movie.findById(req.params.id, function (err, foundMovie) {
    res.render("movies/edit", {
      movie: foundMovie
    });
  });
});

//UPDATE
router.put("/:id", middleware.movieOwnership, function (req, res) {
  newData = {
    name: req.body.movie.name,
    image: req.body.movie.image,
    description: req.body.movie.description,
    rating: req.body.movie.rating,
  };
  Movie.findByIdAndUpdate(req.params.id, {
    $set: newData
  }, function (err, updatedMovie) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      req.flash("success", "Successfully Updated!");
      res.redirect("/movies/" + req.params.id);
    }
  });
});

//DESTROY
router.delete("/:id", middleware.movieOwnership, function (req, res) {
  Movie.findByIdAndRemove(req.params.id, function (err, deleteMovie) {
    if (err) {
      req.flash("error", "Something went wrong");
      res.redirect("/movies");
    } else {
      res.redirect("/movies");
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
var mongoose = require("mongoose");
var movie = require("./models/movie");
var Comment = require("./models/comment");

var data = [{
    name: "Blue Springs",
    image: "http://www.ringfineart.com/wp-content/uploads/2014/02/Blue-Springs-1.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Wechiva Springs",
    image: "https://tripwheels.files.wordpress.com/2013/06/wekiwa-springs-1.jpg?w=1200",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Devil's Den Spring",
    image: "https://i.pinimg.com/736x/74/93/a6/7493a62ae35c0bbe52926f5aa78267bb.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];

function seedDB() {
  movie.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("removed movies!");

    data.forEach(function (seed) {
      movie.create(seed, function (err, movie) {
        if (err) {
          console.log(err);
        } else {
          console.log("Added a movie");
          Comment.create({
              text: "I wish there was internet here.",
              author: "Homer"
            },
            function (err, comment) {
              if (err) {
                console.log(err);
              } else {
                movie.comments.push(comment._id);
                movie.save();
                console.log("Created new comment");
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
const Course = require('../models/course'),
      Comment    = require('../models/comment');

const middelwareObj = {
  checkCourseOwnership: (req, res, next) => {
    // Is user logged in?
    if(req.isAuthenticated()) {
      Course.findById(req.params.id, (err, foundCourse) => {
        if(err) {
          req.flash('error', 'Course not found');
          res.redirect('back');
        } else {
          // Does user own Course?
          if(foundCourse.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash('error', 'You do not have permission to do that');
            res.redirect('back');
          }
        }
      });
    } else {
      req.flash('error', 'You must be logged in to do that');
      res.redirect('back');
    }
  },

  checkCommentOwnership: (req, res, next) => {
    // Is user logged in?
    if(req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
          res.redirect('back');
        } else {
          // Does user own course?
          if(foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash('error', 'You do not have permission to do that');
            res.redirect('back');
          }
        }
      });
    } else {
      req.flash("error", "You must be logged in to do that");
      res.redirect('back');
    }
  },
  
  isLoggedIn: (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect('/login');
  }

};

module.exports = middelwareObj;
const express     = require('express'),
      router      = express.Router({mergeParams: true}),
      Course      = require('../models/course'),
      Comment     = require('../models/comment'),
      middleware  = require('../middleware');

// NEW COMMENT ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // find course by ID
    Course.findById(req.params.id, (err, foundCourse) => {
        if(err) {
            console.log(err);
            res.redirect("/courses");
        } else {
            res.render("comments/new", {course: foundCourse});
        }
    });
    
});

// CREATE COMMENT Logic
router.post("/", middleware.isLoggedIn, (req, res) => {
    // locate course by ID
    Course.findById(req.params.id, (err, course) => {
        if(err) {
            console.log(err);
            res.redirect('/courses');
        } else {
            // create comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    req.flash('error', 'Something went wrong');
                    console.log(err);
                } else {
                    // add user id and username to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    // connect course to comment
                    course.comments.push(comment);
                    course.save();
                    // redirect to SHOW page
                    req.flash('success', "Successfully added comment")
                    res.redirect("/courses/" + course._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect('back');
        } else {
        res.render("comments/edit", {course_id: req.params.id, comment: foundComment});
        }
    });
});


// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/courses/' + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, err => {
        if(err) {
            res.redirect('back');
        }
        res.redirect('/courses/' + req.params.id);
    });
});



module.exports = router;
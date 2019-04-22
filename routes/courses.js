const express     = require('express'),
      router      = express.Router(),
      Course  = require('../models/course'),
      middleware  = require('../middleware');

// INDEX Route - Show all courses
router.get("/", (req, res) => {
    // Get all courses from DB
    Course.find({}, (err, allCourses) => {
        if (err) {
             console.log(err);
        } else {
            res.render("courses/index", {courses:allCourses});
        }
    });
    //res.render('courses', {courses: courses});
});

// CREATE Route
router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCourse = {name: name, price: price, image: image, description: desc, author: author};
    // create a new Course and save to 
    Course.create(newCourse, (err, course) => {
        if(err) {
            console.log(err);
            res.redirect('back');
        } else {
            // redirect back to "courses"
            res.redirect("/courses");
        }
    });
});

// NEW Route - Show form to create new course
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("courses/new");
});

// SHOW Route - Show info on each individual cCourse - /courses/:id
router.get("/:id", (req, res) => {
    // find Course with provided id
    Course.findById(req.params.id).populate("comments").exec((err, foundCourse) => {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCourse);
            // render show page with Course object
            res.render("courses/show", {course: foundCourse});
        }
    });
});

// EDIT ROUTE

router.get('/:id/edit', middleware.checkCourseOwnership, (req, res) => {
    Course.findById(req.params.id, (err, foundCourse) => {
        res.render('courses/edit', {course: foundCourse});
    });
});

// UPDATE ROUTE
router.put('/:id', middleware.checkCourseOwnership, (req, res) => {
    Course.findByIdAndUpdate(req.params.id, req.body.course, (err, updatedCourse) => {
        if(err) {
            res.redirect('/courses');
        } else {
            res.redirect('/courses/' + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkCourseOwnership, (req, res) => {
    Course.findByIdAndRemove(req.params.id, err => {
        if(err) {
            res.redirect('/courses');
        } else {
            res.redirect('/courses');
        }
    })
})


// // Middleware - use on any route you want your user to be logged in to view.
// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/');
// }



module.exports = router;
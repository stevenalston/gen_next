const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose'),
      passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      methodOverride = require('method-override'),
      flash          = require('connect-flash'),
      Comment        = require('./models/comment'),
      Course         = require('./models/course'),
      User           = require('./models/user'),
      seedDB         = require('./seeds');
// Connect mongo and setup new database course

// Require Routes
const   authRoutes          = require('./routes/index'),
        commentRoutes       = require('./routes/comments'),
        coursesRoutes    = require('./routes/courses');


mongoose.connect('mongodb://localhost/gen_next');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(flash());
//seedDB(); // seed the database

// PASSPORT AUTHENTICATION
app.use(require('express-session')({
    secret: "Zaely is still the cutest baby!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Course.create(
//     {
//         name: "Coder Camp",
//         image: "https://3t7bol18ef963l8x6yzv7ja1-wpengine.netdna-ssl.com/wp-content/uploads/2017/07/on-ground_coding_bootcamps_2.jpg",
//         description: "This is a fun and interesting first look into programming course. Learn the essentials giving students the perfect environment to learn about programming fundamentals and enjoy many classroom activities."
//     },
// (err, course) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("Newly created Course!");
//         console.log(course);
//     }
// });

// route paths
app.use('/', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/courses/:id/comments', commentRoutes);

// listen for the server
app.listen(process.env.PORT, process.env.IP, () => console.log("GenNext Courses App started!!"));


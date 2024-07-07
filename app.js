const env = require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user.js");
const Committee = require("./models/commitees.js");
const Event = require("./models/events.js");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MONGO_URL = "mongodb://127.0.0.1:27017/unifete";
const userRouter = require("./routes/user.js");
const Feedback = require("./models/feedback.js");
const { error } = require('console');
const authRole = require("./authRole.js");
const http = require('http');
const server = http.Server(app);
const nodemailer = require('nodemailer');
const multer = require('multer');
const { storage } = require('./cloudConfig.js');
const upload = multer({ storage });
const dbUrl = process.env.ATLASDB_URL || MONGO_URL; // Use local URL if environment variable is not set

if (!dbUrl) {
  console.error("Error: MongoDB connection URL is not set in environment variables.");
  process.exit(1);
}

if (!process.env.SECRET) {
  console.error("Error: Secret for session is not set in environment variables.");
  process.exit(1);
}

// MONGODB SET UP
async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDb is successfully connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process if MongoDB connection fails
  }
}
main();

// Session Store Setup
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", (e) => {
  console.error("ERROR IN MONGOSTORE!", e);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

// Middleware to parse request bodies
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT SET UP
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

app.use((req, res, next) => {
  res.locals.role = req.user ? req.user.role : 'guest';
  next();
});

// Routes
app.use("/", userRouter);

// Authentication Middleware
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
}

app.get("/", (req, res) => {
    console.log("Root is working");
    res.send("Root is working");
  });
  
  app.get("/lander", async (req, res) => {
    res.render("index.ejs");
  });
  
  app.get("/subscription", async (req, res) => {
    res.render("sub.ejs");
  });
  
  // Route for Student dashBoard
  app.get("/dashboard/student", authRole('student'), async (req, res) => {
    try {
      const currentDate = new Date();
      const events = await Event.find({ date: { $gt: currentDate } });
      req.flash("success", "Student dashboard loaded successfully");
      res.render("dashboardstudent.ejs", { events: events });
    } catch (err) {
      console.error("Error fetching upcoming events:", err);
      req.flash("error", "Error fetching upcoming events");
      res.redirect("/");
    }
  });
  
  // Feedback system
  app.post('/submit-feedback', async (req, res) => {
    const { event_id, name, email, venueRating, eventExperienceRating, description } = req.body;
    try {
      const feedback = new Feedback({
        event_id,
        name,
        email,
        venueRating,
        eventExperienceRating,
        description
      });
  
      await feedback.save();
      req.flash("success", "Feedback submitted successfully");
      res.redirect('/dashboard/student');
    } catch (error) {
      req.flash("error", "Error saving feedback: " + error.message);
      res.redirect('/dashboard/student');
    }
  });
  
  app.get("/feedback", async (req, res) => {
    try {
      const today = new Date();
      const events = await Event.find({ date: { $lt: today } });
      res.render('feedback.ejs', { events: events });
    } catch (err) {
      console.error('Error fetching events:', err);
      req.flash("error", "Error fetching events");
      res.redirect('/');
    }
  })
  
  // Upcoming events
  app.get("/upcomingevents", async (req, res) => {
    try {
      const events = await Event.find({});
      const commitees = await Committee.find({});
      res.render("upcomingevents.ejs", { events: events, committees: commitees });
    } catch (err) {
      console.error("Error fetching upcoming events:", err);
      req.flash("error", "Error fetching upcoming events");
      res.redirect("/");
    }
  });
  
  // Registration for events
  app.get("/student/registration", isLoggedIn, async (req, res) => {
    try {
      const events = await Event.find({ approval_status: 'Approved' });
      res.render('registerevent.ejs', { events: events });
    } catch (err) {
      console.error('Error fetching events:', err);
      req.flash("error", "Error fetching events");
      res.redirect('/dashboard/student');
    }
  });
  
  app.post("/studentemail", isLoggedIn, async function (req, res) {
    try {
      const event = await Event.findById(req.body.event);
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'zoyah768@gmail.com',
          pass: 'ksha odyf dfyw eptm'
        }
      });
  
      var mailOptions = {
        from: 'zoyah768@gmail.com',
        to: req.body.email,
        subject: 'Thank you for Registering',
        html: `
          <p>Thank you for completing the registration process for ${event.name} on ${event.date.toDateString()}!</p>
          <p>Your participation is highly valued, and we are currently processing your request to be added to the event group. Rest assured, you will be part of the group shortly. If you have any further questions or need assistance, feel free to reach out. We look forward to your active involvement in the upcoming event!</p>
          <br>
          <p>-UniFete</p>
        `
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error sending email:', error);
          req.flash("error", "Error sending email");
        } else {
          console.log('Email sent: ' + info.response);
          req.flash("success", "Registration successful! Confirmation email sent.");
        }
        res.redirect("/dashboard/student");
      });
    } catch (error) {
      console.error('Error fetching event details:', error);
      req.flash("error", "Error fetching event details");
      res.redirect("/dashboard/student");
    }
  });
  
  // Route for committee dashboard
  app.get('/dashboard/committee', authRole('committee'), async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate('committeeName').exec();
  
      if (!user.committeeName) {
        req.flash("error", "No committee assigned to the user");
        return res.status(400).redirect('/');
      }
  
      const committeeId = user.committeeName._id;
      const events = await Event.find({ committee_id: committeeId });
  
      res.render('dashboardcommittee', { curruser: user, events });
    } catch (error) {
      console.error('Error fetching events:', error);
      req.flash("error", "Error fetching events");
      res.redirect('/');
    }
  });
  
  // Committee dashboard features
  app.get("/committee/eventlist", authRole('committee'), async (req, res) => {
    res.render("requestevent.ejs");
  });
  
  app.post('/committee/eventlist', authRole('committee'), upload.single('image'), async (req, res) => {
    const { name, description, date, venue } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId).populate('committeeName').exec();
    const committeeName = user.committeeName;
    const committeeId = committeeName._id;
  
    const event = new Event({
      name,
      description,
      date,
      venue,
      committee_id: committeeId,
      committee_name: committeeName.name,
      image: req.file.path // Assuming the uploaded file path is stored in req.file.path
    });
  
    await event.save();
    res.redirect("/dashboard/committee");
  });
  
  app.get("/event/:id", async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render("eventdetails.ejs", { event: event });
  });
  
  app.get("/committee/events/requests", authRole('committee'), async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate('committeeName').exec();
  
      if (!user.committeeName) {
        req.flash("error", "No committee assigned to the user");
        return res.status(400).redirect('/');
      }
  
      const committeeId = user.committeeName._id;
      const events = await Event.find({ committee_id: committeeId });
  
      res.render('eventrequests.ejs', { curruser: user, events });
    } catch (error) {
      console.error('Error fetching event requests:', error);
      req.flash("error", "Error fetching event requests");
      res.redirect('/');
    }
  });
  
  app.get("/admin", authRole('admin'), async (req, res) => {
    const students = await User.find({ role: "student" });
    res.render("admin.ejs", { students: students });
  });
  
  app.get("/committees", authRole('admin'), async (req, res) => {
    const committees = await Committee.find({});
    res.render("committee.ejs", { committees: committees });
  });
  
  app.post('/committees', authRole('admin'), upload.single('image'), async (req, res) => {
    const { name, description, contact_email, contact_name, facebook, twitter, linkedin, instagram } = req.body;
  
    const committee = new Committee({
      name,
      description,
      contact_email,
      contact_name,
      facebook,
      twitter,
      linkedin,
      instagram,
      image: req.file.path
    });
  
    await committee.save();
    res.redirect('/committees');
  });
  
  app.get("/committees/:id", authRole('admin'), async (req, res) => {
    const { id } = req.params;
    const committee = await Committee.findById(id);
    res.render("committeeDetails.ejs", { committee: committee });
  });
  
  app.post("/committees/:id/delete", authRole('admin'), async (req, res) => {
    const { id } = req.params;
    await Committee.findByIdAndDelete(id);
    res.redirect("/committees");
  });
  
  app.get("/login", (req, res) => {
    res.render("login.ejs");
  });
  
  app.get("/register", async (req, res) => {
    res.render("register.ejs");
  });
  
  // Error Handling
  app.use((req, res, next) => {
    const err = new ExpressError("Page Not Found", 404);
    next(err);
  });
  
  app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
  });
  
  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });

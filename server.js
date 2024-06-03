const express = require("express"); 
const app = express(); 
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError=require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const User=require("./models/user.js");
const Committee=require("./models/commitees.js");
const Event=require("./models/events.js");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MONGO_URL = "mongodb://127.0.0.1:27017/unifete";
const userRouter=require("./routes/user.js");
const Feedback=require("./models/feedback.js");
const { error } = require('console');
const authRole=require("./authRole.js");
var http = require('http');
var server = http.Server(app);
var nodemailer = require('nodemailer');
const multer = require('multer');
main()
  .then(() => {
    console.log("MongoDb is successfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    
app.use("/",userRouter);
app.get("/", (req, res) => {
  console.log("Root is working");
  res.send("Root is working");
});
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curruser=req.user;
  next();
})

app.use((req, res, next) => {
  res.locals.role = req.user ? req.user.role : 'guest';
  next();
});


app.get("/lander", async (req, res) => {
res.render("index.ejs");
});
app.get("/subscription",async(req,res)=>{
  res.render("sub.ejs");
})
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
    res.redirect('/dashboard/student');
  } catch (error) {
    res.status(500).send("Error saving feedback: " + error.message);
  }
});
app.get("/feedback",async(req,res)=>{
  try {
    const events = await Event.find({});
    // Render the registration form and pass the events data to it
    res.render('feedback.ejs', { events: events });
} catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send('Internal Server Error');
}
})

//Route for Student dashBoard
app.get("/dashboard/student", authRole('student'), async (req, res) => {
  try {
    // Fetch events from the database that are after the current date
    const currentDate = new Date();
    const events = await Event.find({ date: { $gt: currentDate } });

    // Flash a success message
    req.flash("success", "Student dashboard loaded successfully");

    // Render the dashboardstudent.ejs template with the filtered events data
    res.render("dashboardstudent.ejs", { events: events });
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    req.flash("error", "Error fetching upcoming events");
    res.redirect("/"); // Redirect to the homepage or an error page
  }
});

app.get("/upcomingevents", async (req, res) => {
  try {
    // Fetch events from the database
    const events = await Event.find({});

    // Render the upcomingevents.ejs template with the events data
    res.render("upcomingevents.ejs", { events: events });
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    req.flash("error", "Error fetching upcoming events");
    res.redirect("/"); // Redirect to the homepage or an error page
  }
});

// Route for committee dashboard
app.get('/dashboard/committee', authRole('committee'), async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('committeeName').exec();
    
    if (!user.committeeName) {
      return res.status(400).send('No committee assigned to the user');
    }
    
    const committeeId = user.committeeName._id;
    const events = await Event.find({ committee_id: committeeId }); // Adjust field name as necessary

    res.render('dashboardcommittee', { curruser: user, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Internal Server Error');
  }
});
//COMMITTEE DASHBOARD FEATURES

app.get("/committee/eventlist",authRole('committee'),async(req,res)=>{
  res.render("requestevent.ejs");
})
app.get("/committee/venue",authRole('committee'),async(req,res)=>{
  res.render("venue.ejs");
})

app.post('/send_email', async (req, res) => {
  try {
    // Save form data to the database
    const event = new Event({
      committee_id: req.body.committeeId,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      ocuppancy: req.body.occupancySize,
      roomtype: req.body.roomType
    });

    await event.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'zoyah768@gmail.com',
        pass: 'ksha odyf dfyw eptm',
      }
    });

    const mailOptions = {
      from: 'zoyah768@gmail.com',
      to:'zoyah768@gmail.com',
      subject: 'New Event Request',
      text: `New event request: ${req.body.name}`,
      html: `
            <p>Committee Name: ${req.body.committee_id.name}</p>
           
            <p>Event Description: ${req.body.description}</p>
            <p>Date: ${req.body.date}</p>
            <p>Room Required: ${req.body.roomType}</p>
            <p>Expected Attendees: ${req.body.occupancySize}</p>
            <br>
          <p>Please check your dashboard for further details and  provide approval</p>
        `
    };

    await transporter.sendMail(mailOptions);

    res.redirect("/dashboard/committee");
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).send('Internal server error');
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Route to handle event request submission
app.post('/send_email', authRole('committee'), upload.single('image'), async (req, res) => {
  try {
    // Retrieve the user's committee ID
    const userCommitteeId = req.user.committee_id;

    // Create a new Event object with request data
    const event = new Event({
      committee_id: userCommitteeId,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      occupancy: req.body.occupancySize,
      roomtype: req.body.roomType,
      image: req.file.path, // Save the image path
    });

    // Save the event to the database
    await event.save();

    // Redirect to committee dashboard after successful submission
    res.redirect("/dashboard/committee");
  } catch (error) {
    console.error('Error processing event request:', error);
    req.flash("error", "Error processing event request. Please try again.");
    res.redirect("/dashboard/committee");
  }
});


app.get("/student/registration", async (req, res) => {
  try {
      const events = await Event.find({});
      // Render the registration form and pass the events data to it
      res.render('registerevent.ejs', { events: events });
  } catch (err) {
      console.error('Error fetching events:', err);
      res.status(500).send('Internal Server Error');
  }
});

app.post("/studentemail", async function (req, res) {
  try {
      // Fetch event details using the event ID from the request body
      const event = await Event.findById(req.body.event);

      // Create nodemailer transporter
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'zoyah768@gmail.com',
              pass: 'ksha odyf dfyw eptm'
          }
      });

      // Mail options with event details
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

      // Send email
      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
              console.error('Error sending email:', error);
              // response.status(500).send('Internal Server Error');
          } else {
              console.log('Email sent: ' + info.response);
              // response.status(200).send('Email Sent Successfully');
          }
          res.redirect("/dashboard/student");
      });
  } catch (error) {
      console.error('Error fetching event details:', error);
      response.status(500).send('Internal Server Error');
  }
});


app.post('/events/:eventId/approval', authRole('faculty'),async (req, res) => {
  const { eventId } = req.params;
  const { approvalStatus } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.approval_status = approvalStatus;
    await event.save();
    res.redirect("/dashboard/faculty");
  } catch (error) {
    console.error('Error updating approval status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/events', async (req, res) => {
  try {
      // Fetch all events from the database
      const events = await Event.find();
      res.render('dashboardcommittee.ejs', { events });
  } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).send('Internal server error');
  }
});
//set up required
// app.get('/committee/events',authRole('committee'), async (req, res) => {
//   try {
//       // Fetch all events from the database
//       const userId = req.user._id;

//       const events = await Event.find({{ committee_id: userId });
//       res.render('dashboardcommittee.ejs', { events });
//   } catch (error) {
//       console.error('Error fetching events:', error);
//       res.status(500).send('Internal server error');
//   }
// });
// Route to render individual event page
app.get('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
      // Fetching the event 
      const event = await Event.findById(eventId);
      if (!event) {
          return res.status(404).send('Event not found');
      }
      res.render('show', { event });
  } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).send('Internal server error');
  }
});

// Route for faculty dashboard
app.get("/dashboard/faculty",authRole('faculty'), async (req, res) => {
  try {
  
    const events = await Event.find(); 
    res.render('dashboardfaculty', {events});
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/search', async (req, res) => {
  try {
      const searchTerm = req.query.term;

      const searchResults = await Event.find({
          $or: [
              { name: { $regex: searchTerm, $options: 'i' } }, 
              { description: { $regex: searchTerm, $options: 'i' } } 
          ]
      });

      res.json(searchResults);
  } catch (error) {
      console.error('Error performing search:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"PAGE NOT FOUND !"));
});

app.use((err,req,res,next)=>{
let{statusc="500",message="Something went wrong"}=err;
res.status(500).render("error.ejs",{message});

});

app.listen(6009, () => {
  console.log("Server is listening to port");
});

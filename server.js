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

// Route for student dashboard

app.get("/lander", async (req, res) => {
res.render("index.ejs");
});
app.get("/subscription",async(req,res)=>{
  res.render("sub.ejs");
})
app.get("/feedback",async(req,res)=>{
  res.render("feedback.ejs");
})

//Route for Student dashBoard
app.get("/dashboard/student", authRole('student'),async (req, res) => {
 
  req.flash("success", "Student dashboard loaded successfully");
  res.render("dashboardstudent.ejs");
});
app.get("/upcomingevents",async (req, res) => {
  res.render("upcomingevents.ejs");
  });
// Route for committee dashboard
app.get("/dashboard/committee",authRole('committee'),async (req, res) => {
  try {
    
    const events = await Event.find({ committee_id:"65d9af4fcd04c37880c941e2" });

    
    res.render('dashboardcommittee.ejs', { events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Internal Server Error');
  }
  //req.flash("success", "Committee dashboard loaded successfully");
  
});
//COMMITTEE DASHBOARD FEATURES

app.get("/committee/eventlist",authRole('committee'),async(req,res)=>{
  res.render("requestevent.ejs");
})
app.get("/committee/venue",authRole('committee'),async(req,res)=>{
  res.render("venue.ejs");
})

// app.post('/send_email', async (req, res) => {
//   try {
//     // Save form data to the database
//     const event = new Event({
//       committee_id: req.body.committeeId,
//       name: req.body.name,
//       description: req.body.description,
//       date: req.body.date,
//       ocuppancy: req.body.occupancySize,
//       roomtype: req.body.roomType
//     });

//     await event.save();

//     // Send email
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'urjabahad27@gmail.com',
//         pass: 'vxpbfxincqurlszt'
//       }
//     });

//     const mailOptions = {
//       from: 'urjabahad27@gmail.com',
//       to: 'zoyah768@gmail.com',
//       subject: 'New Event Request',
//       text: `New event request: ${req.body.name}`,
//       html: `
//             <p>Committee Name: Codecell</p>
           
//             <p>Event Description: ${req.body.description}</p>
//             <p>Date: ${req.body.date}</p>
//             <p>Room Required: ${req.body.roomType}</p>
//             <p>Expected Attendees: ${req.body.occupancySize}</p>
//             <br>
//           <p>Please check your dashboard for further details and  provide approval</p>
//         `
//     };

//     await transporter.sendMail(mailOptions);

//     res.redirect("/dashboard/committee");
//   } catch (error) {
//     console.error('Error processing form submission:', error);
//     res.status(500).send('Internal server error');
//   }
// });
app.post('/send_email', async (req, res) => {
  try {
    // Find the committee by name
    const committeeName = req.body.committeeName;
    const committee = await Committee.findOne({ name: committeeName });
    
    if (!committee) {
      // Handle the case where the committee is not found
      return res.status(404).send('Committee not found');
    }

    // Save form data to the database
    const event = new Event({
      committee_id: committee._id, // Use the committee ID
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      occupancy: req.body.occupancySize,
      roomtype: req.body.roomType
    });

    await event.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'urjabahad27@gmail.com',
        pass: 'vxpbfxincqurlszt'
      }
    });

    const mailOptions = {
      from:  res.locals.curruser.email,
      to: 'zoyah768@gmail.com',
      subject: 'New Event Request',
      text: `New event request: ${req.body.name}`,
      html: `
            <p>Committee Name: ${committee.name}</p> <!-- Use the committee name -->
            <p>Event Description: ${req.body.description}</p>
            <p>Date: ${req.body.date}</p>
            <p>Room Required: ${req.body.roomType}</p>
            <p>Expected Attendees: ${req.body.occupancySize}</p>
            <br>
            <p>Please check your dashboard for further details and provide approval</p>
        `
    };

    await transporter.sendMail(mailOptions);

    res.redirect("/dashboard/committee");
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).send('Internal server error');
  }
});

app.get("/student/registration",async(req,res)=>{
  res.render("registerevent.ejs");
})
app.post("/studentemail", function (req, response) {
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'urjabahad27@gmail.com',
          pass: 'vxpbfxincqurlszt'
      }
  });
  
  var mailOptions = {
      from: 'urjabahad27@gmail.com', 
      to: req.body.email, 
      subject: 'Thank you for Resgistering',
      html: `
          <p>Thank you for completing the registration process! Your participation is highly valued, and we are currently processing your request to be added to the event group. Rest assured, you will be part of the group shortly. If you have any further questions or need assistance, feel free to reach out. We look forward to your active involvement in the upcoming event!</p>
          <br>
          <p>-UniFete</p>
      `
  };

  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log("Email sent: " + info.response);
      }
      response.redirect("/dashboard/student");
  });
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
      res.render('event.ejs', { events });
  } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).send('Internal server error');
  }
});
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

// const env=require('dotenv').config();
// const express = require("express"); 
// const app = express(); 
// const path = require("path");
// const mongoose = require("mongoose");
// const methodOverride = require("method-override");
// const ExpressError=require("./utils/ExpressError.js");
// const ejsMate = require("ejs-mate");
// const session = require("express-session");
// const MongoStore=require("connect-mongo");
// const flash = require("connect-flash");
// const User=require("./models/user.js");
// const Committee=require("./models/commitees.js");
// const Event=require("./models/events.js");
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const MONGO_URL = "mongodb://127.0.0.1:27017/unifete";
// const userRouter=require("./routes/user.js");
// const Feedback=require("./models/feedback.js");
// const { error } = require('console');
// const authRole=require("./authRole.js");
// var http = require('http');
// var server = http.Server(app);
// var nodemailer = require('nodemailer');
// const multer = require('multer');
// const { storage } = require('./cloudConfig.js');
// const upload = multer({storage})
// const dbUrl=process.env.ATLASDB_URL; 
// //MONGODB SET UP
// main()
//   .then(() => {
//     console.log("MongoDb is successfully connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
//   // await mongoose.connect(dbUrl);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));
// const store=MongoStore.create({
//   mongoUrl:dbUrl,
//   crypto:{
//       secret:process.env.SECRET,
//   },
//   touchAfter:24*3600,
// });
// store.on("error",()=>{
//   console.log("ERROR IN MONGOSTORE!",error);
// })
// const sessionOptions={
// store,
// secret:process.env.SECRET,
// resave:false,
// saveUninitialized:true,
// cookie:{
//   expires:Date.now()+7*24*60*60*1000,
//   maxAge:7*24*60*60*1000,
//   httpOnly:true,

// }
// };
// app.use(session(sessionOptions));
// // app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: false }));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());

// //PASSPORT SET UP
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());    
// app.use("/",userRouter);
// app.get("/", (req, res) => {
//   console.log("Root is working");
//   res.send("Root is working");
// });
// //MIDDLEWARE
// app.use((req,res,next)=>{
//   // res.locals.success=req.flash("success");
//   // res.locals.error=req.flash("error");
//   res.locals.curruser=req.user;
//   next();
// })

// app.use((req, res, next) => {
//   res.locals.role = req.user ? req.user.role : 'guest';
//   next();
// });


// app.get("/lander", async (req, res) => {
// res.render("index.ejs");
// });
// app.get("/subscription",async(req,res)=>{
//   res.render("sub.ejs");
// })

// //Route for Student dashBoard
// app.get("/dashboard/student", authRole('student'), async (req, res) => {
//   try {
//     // Fetch events from the database that are after the current date
//     const currentDate = new Date();
//     const events = await Event.find({ date: { $gt: currentDate } });
//     // req.flash("success", "Student dashboard loaded successfully");
//     res.render("dashboardstudent.ejs", { events: events });
//   } catch (err) {
//     console.error("Error fetching upcoming events:", err);
//     // req.flash("error", "Error fetching upcoming events");
//     res.redirect("/");
//   }
// });
// //1.FEEDBACK SYSTEM
// app.post('/submit-feedback', async (req, res) => {
//   const { event_id, name, email, venueRating, eventExperienceRating, description } = req.body;

//   try {
//     const feedback = new Feedback({
//       event_id,
//       name,
//       email,
//       venueRating,
//       eventExperienceRating,
//       description
//     });

//     await feedback.save();
//     res.redirect('/dashboard/student');
//   } catch (error) {
//     res.status(500).send("Error saving feedback: " + error.message);
//   }
// });
// app.get("/feedback",async(req,res)=>{
//   try {
//     const today = new Date();
//     const events = await Event.find({date: { $lt: today }})
//     res.render('feedback.ejs', { events: events });
// } catch (err) {
//     console.error('Error fetching events:', err);
//     res.status(500).send('Internal Server Error');
// }
// })
// //2.UPCOMING EVENTS 
// app.get("/upcomingevents", async (req, res) => {
//   try {
//     const events = await Event.find({});
 //       const commitees=await Committee.find({});
//     res.render("upcomingevents.ejs", { events: events ,committees:committees});
//   } catch (err) {
//     console.error("Error fetching upcoming events:", err);
//     // req.flash("error", "Error fetching upcoming events");
//     res.redirect("/"); 
//   }
// });

// //3.Registration for events 
// app.get("/student/registration", async (req, res) => {
//   try {
//       const events = await Event.find({ approval_status: 'Approved' });
//       res.render('registerevent.ejs', { events: events });
//   } catch (err) {
//       console.error('Error fetching events:', err);
//       res.status(500).send('Internal Server Error');
//   } 

// });

// app.post("/studentemail", async function (req, res) {
//   try {
//       // Fetch event details using the event ID from the request body
//       const event = await Event.findById(req.body.event);

//       // Create nodemailer transporter
//       var transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//               user: 'zoyah768@gmail.com',
//               pass: 'ksha odyf dfyw eptm'
//           }
//       });

//       // Mail options with event details
//       var mailOptions = {
//           from: 'zoyah768@gmail.com',
//           to: req.body.email,
//           subject: 'Thank you for Registering',
//           html: `
//               <p>Thank you for completing the registration process for ${event.name} on ${event.date.toDateString()}!</p>
//               <p>Your participation is highly valued, and we are currently processing your request to be added to the event group. Rest assured, you will be part of the group shortly. If you have any further questions or need assistance, feel free to reach out. We look forward to your active involvement in the upcoming event!</p>
//               <br>
//               <p>-UniFete</p>
//           `
//       };

//       // Send email
//       transporter.sendMail(mailOptions, function (error, info) {
//           if (error) {
//               console.error('Error sending email:', error);
//               // response.status(500).send('Internal Server Error');
//           } else {
//               console.log('Email sent: ' + info.response);
//               // response.status(200).send('Email Sent Successfully');
//           }
//           res.redirect("/dashboard/student");
//       });
//   } catch (error) {
//       console.error('Error fetching event details:', error);
//       response.status(500).send('Internal Server Error');
//   }
// });

// // Route for committee dashboard
// app.get('/dashboard/committee', authRole('committee'), async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId).populate('committeeName').exec();
    
//     if (!user.committeeName) {
//       return res.status(400).send('No committee assigned to the user');
//     }
    
//     const committeeId = user.committeeName._id;
//     const events = await Event.find({ committee_id: committeeId }); // Adjust field name as necessary

//     res.render('dashboardcommittee', { curruser: user, events });
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// //COMMITTEE DASHBOARD FEATURES

// //1.Request for events
// app.get("/committee/eventlist",authRole('committee'),async(req,res)=>{
//   res.render("requestevent.ejs");
// })

// app.post('/send_email', authRole('committee'), upload.single("event[image]"), async (req, res) => {
//   try {
//     const userCommitteeId = req.user.committeeName;
//     const url = req.file.path;
//     const filename = req.file.filename; 
//     const event = new Event({
//       committee_id: userCommitteeId,
//       name: req.body.name,
//       description: req.body.description,
//       date: req.body.date,
//       occupancy: req.body.occupancySize,
//       roomtype: req.body.roomType,
//       image : { url, filename }
//     });
//     // console.log(req.file);
//     await event.save();
//     res.redirect("/dashboard/committee");
//     // res.send(res.file);
//   }catch(error) {
//     console.error('Error saving event:', error);
//     res.status(500).send('Internal Server Error');
//   }
//   //   const transporter = nodemailer.createTransport({
//   //           service: 'gmail',
//   //           auth: {
//   //             user: 'zoyah768@gmail.com',
//   //             pass: 'ksha odyf dfyw eptm',
//   //           }
//   //         });
      
//   //         const mailOptions = {
//   //           from: 'zoyah768@gmail.com',
//   //           to:'zoyah768@gmail.com',
//   //           subject: 'New Event Request',
//   //           text: New event request: ${req.body.name},
//   //           html: `
//   //           <p>Dear Admin,</p>
//   //           <br>
//   //           <p>We have submitted a new event request. Please find the details below:</p>
//   //           <br>
//   //           <p><strong>Committee Name:</strong> ${req.body.committee_id.name}</p>
//   //           <p><strong>Event Name:</strong> ${req.body.name}</p>
//   //           <p><strong>Event Description:</strong> ${req.body.description}</p>
//   //           <p><strong>Date:</strong> ${req.body.date}</p>
//   //           <p><strong>Room Type Required:</strong> ${req.body.roomType}</p>
//   //           <p><strong>Expected Number of Attendees:</strong> ${req.body.occupancySize}</p>
//   //           <br>
//   //           <p>We kindly request you to review the event details and provide your approval through the committee dashboard.</p>
//   //           <br>
//   //           <p>Thank you!</p>
            
//   //             `
//   //         };
      
//   //         await transporter.sendMail(mailOptions);
//   //   res.redirect("/dashboard/committee");
//   // } catch (error) {
//   //   console.error('Error processing event request:', error);
//   //   req.flash("error", "Error processing event request. Please try again.");
//   //   res.redirect("/dashboard/committee");
//   // }
    
// });

// // 2.Venue Availabilty System
// app.get("/committee/venue", authRole('committee'), async (req, res) => {
//   try {
//     // Fetch events from the database
//     const events = await Event.find({});
//     // Render the venue availability page and pass the events data to it
//     res.render('venue.ejs', { events: events });
//   } catch (err) {
//     console.error('Error fetching events:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/events', async (req, res) => {
//   try {
//       // Fetch all events from the database
//       const events = await Event.find();
//       res.render('dashboardcommittee.ejs', { events });
//   } catch (error) {
//       console.error('Error fetching events:', error);
//       res.status(500).send('Internal server error');
//   }
// });
// // Route to render individual event page
// app.get('/events/:eventId', async (req, res) => {
//   const { eventId } = req.params;
//   try {
//       const event = await Event.findById(eventId);
//       if (!event) {
//           return res.status(404).send('Event not found');
//       }
//       res.render('show', { event });
//   } catch (error) {
//       console.error('Error fetching event:', error);
//       res.status(500).send('Internal server error');
//   }
// });

// // Route for FACULTY DASHBOARD
// app.get("/dashboard/faculty",authRole('faculty'), async (req, res) => {
//   try {
  
//     const events = await Event.find(); 
//     res.render('dashboardfaculty', {events});
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).send('Internal server error');
//   }
// });
// //1.APPROVAL SYSTEM
// app.post('/events/:eventId/approval', authRole('faculty'),async (req, res) => {
//   const { eventId } = req.params;
//   const { approvalStatus } = req.body;
//   try {
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     event.approval_status = approvalStatus;
//     await event.save();
//     res.redirect("/dashboard/faculty");
//   } catch (error) {
//     console.error('Error updating approval status:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // 2.Search for event in databsase
// app.get('/search', async (req, res) => {
//   try {
//       const searchTerm = req.query.term;

//       const searchResults = await Event.find({
//           $or: [
//               { name: { $regex: searchTerm, $options: 'i' } }, 
//               { description: { $regex: searchTerm, $options: 'i' } } 
//           ]
//       });

//       res.json(searchResults);
//   } catch (error) {
//       console.error('Error performing search:', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// });

// //ERROR HANDLING
// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"PAGE NOT FOUND !"));
// });
// //CUSTOM ERROR
// app.use((err,req,res,next)=>{
// let{statusc="500",message="Something went wrong"}=err;
// res.status(500).render("error.ejs",{message});

// });
// //PORT
// app.listen(6009, () => {
//   console.log("Server is listening to port");
// });

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
var http = require('http');
var server = http.Server(app);
var nodemailer = require('nodemailer');
const multer = require('multer');
const { storage } = require('./cloudConfig.js');
const upload = multer({ storage })
const dbUrl = process.env.ATLASDB_URL;

// MONGODB SET UP
main()
  .then(() => {
    console.log("MongoDb is successfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
      secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("ERROR IN MONGOSTORE!",error);
})
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
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT SET UP
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", userRouter);

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
})

app.use((req, res, next) => {
  res.locals.role = req.user ? req.user.role : 'guest';
  next();
});

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
})

app.post('/send_email', authRole('committee'), upload.single("event[image]"), async (req, res) => {
  try {
    const userCommitteeId = req.user.committeeName;
    const url = req.file.path;
    const filename = req.file.filename;
    const event = new Event({
      committee_id: userCommitteeId,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      occupancy: req.body.occupancySize,
      roomtype: req.body.roomType,
      image: { url, filename }
    });

    await event.save();
    req.flash("success", "Event request submitted successfully");
    res.redirect("/dashboard/committee");
  } catch (error) {
    console.error('Error saving event:', error);
    req.flash("error", "Error saving event");
    res.redirect("/dashboard/committee");
  }
});

// Venue availability system
app.get("/committee/venue", authRole('committee'), async (req, res) => {
  try {
    const events = await Event.find({});
    res.render('venue.ejs', { events: events });
  } catch (err) {
    console.error('Error fetching events:', err);
    req.flash("error", "Error fetching events");
    res.redirect("/dashboard/committee");
  }
});

app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.render('dashboardcommittee.ejs', { events });
  } catch (error) {
    console.error('Error fetching events:', error);
    req.flash("error", "Error fetching events");
    res.redirect("/");
  }
});

app.get('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      req.flash("error", "Event not found");
      return res.status(404).redirect('/');
    }
    res.render('show', { event });
  } catch (error) {
    console.error('Error fetching event:', error);
    req.flash("error", "Error fetching event");
    res.redirect('/');
  }
});

// Route for faculty dashboard
app.get("/dashboard/faculty", authRole('faculty'), async (req, res) => {
  try {
    const events = await Event.find();
    res.render('dashboardfaculty', { events });
  } catch (error) {
    console.error('Error fetching events:', error);
    req.flash("error", "Error fetching events");
    res.redirect('/');
  }
});

// Approval system
app.post('/events/:eventId/approval', authRole('faculty'), async (req, res) => {
  const { eventId } = req.params;
  const { approvalStatus } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      req.flash("error", "Event not found");
      return res.status(404).redirect("/dashboard/faculty");
    }

    event.approval_status = approvalStatus;
    await event.save();
    req.flash("success", "Event approval status updated successfully");
    res.redirect("/dashboard/faculty");
  } catch (error) {
    console.error('Error updating approval status:', error);
    req.flash("error", "Error updating approval status");
    res.redirect("/dashboard/faculty");
  }
});

// Search for event in database
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

// ERROR HANDLING
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND !"));
});

// CUSTOM ERROR
app.use((err, req, res, next) => {
  let { statusc = "500", message = "Something went wrong" } = err;
  res.status(statusc).render("error.ejs", { message });
});

// PORT
app.listen(6009, () => {
  console.log("Server is listening to port 6009");
});
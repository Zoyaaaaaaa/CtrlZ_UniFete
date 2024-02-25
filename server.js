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
const { error } = require('console');
const authRole=require("./middleware.js");
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
app.use("/",userRouter);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    

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


// Route for student dashboard

app.get("/lander", async (req, res) => {
res.render("index.ejs");
});
app.get("/subscription",async(req,res)=>{
  res.render("sub.ejs");
})
//Route for Student dashBoard
app.get("/dashboard/student", async (req, res) => {
 
  req.flash("success", "Student dashboard loaded successfully");
  res.render("dashboardstudent.ejs");
});
app.get("/upcomingevents",async (req, res) => {
  res.render("upcomingevents.ejs");
  });
// Route for committee dashboard
app.get("/dashboard/committee",async (req, res) => {
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

app.get("/committee/eventlist",async(req,res)=>{
  res.render("requestevent.ejs");
})
app.get("/committee/venue",async(req,res)=>{
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
        user: 'urjabahad27@gmail.com',
        pass: 'vxpbfxincqurlszt'
      }
    });

    const mailOptions = {
      from: 'urjabahad27@gmail.com',
      to: 'zoyah768@gmail.com',
      subject: 'New Event Request',
      text: `New event request: ${req.body.name}`,
      html: `
            <p>Committee Name: Codecell</p>
           
            <p>Event Description: ${description}</p>
            <p>Date: ${date}</p>
            <p>Room Required: ${roomType}</p>
            <p>Expected Attendees: ${occupancySize}</p>
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
app.post('/events/:eventId/approval',authRole('faculty'), async (req, res) => {
  const { eventId } = req.params;
  const { approvalStatus } = req.body;
  try {
    const event = await Event.findById(eventId).populate('committee._id');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.approval_status = approvalStatus;
    await event.save();
    res.status(200).json({ message: 'Approval status updated successfully', event });
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
app.get("/dashboard/faculty", async (req, res) => {
  try {
    
    const events = await Event.find();
    
   
    res.render('dashboardfaculty', {events});
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Internal server error');
  }
});





app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"PAGE NOT FOUND !"));
});

app.use((err,req,res,next)=>{
let{statusc="500",message="Something went wrong"}=err;
res.status(500).render("error.ejs",{message});

});


// const sampleEvents = [
//   {
//     committee_id: "65d9af4fcd04c37880c941e2",
//     name: "Verge Conflict",
//     description: "An event to bid and code to win be the game.",
//     approval_status: "Pending",
//     ocuppancy: 150,
//     roomtype: "Other",
//     date: futureDate
//   },
//   {
//     committee_id: "65d9af4fcd04c37880c941e2",
//     name: "Newbiethon",
//     description: "A 6 hour coding hackathon for first year students to get a glimpse of coding and building and innovating for good",
//     approval_status: "Approved",
//     ocuppancy: 100,
//     roomtype: "Labs",
//     date: futureDate
//   },
//   // Add other sample events here
// ];


// // Insert sample data into the database
// Event.insertMany(sampleEvents)
//   .then(() => {
//     console.log('Sample data inserted successfully');
//     //mongoose.connection.close(); // Close the connection after insertion
//   })
//   .catch(err => console.error('Error inserting sample data:', err));

app.listen(6009, () => {
  console.log("Server is listening to port");
});

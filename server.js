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
  // res.locals.curruser=req.user;
  next();
})
function authRole(role){
  return(req,res,next)=>{
    if(req.user.role!=role){
      return res.send("not allowed!")
    }
    next();
  }
}
function authUser(req,res,next){
  if(req.user==null){

  }
}
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new Student({
//         email:"az@gmail.com",
//         username:"Zoiz",
//     });
//    let registereduser=await User.register(fakeUser,"hellocode");
//    console.log(registereduser);
// })
// Route for student dashboard

app.get("/lander", async (req, res) => {
res.render("index.ejs");
});
//Route for Student dashBoard
app.get("/dashboard/student", async (req, res) => {
 
  req.flash("success", "Student dashboard loaded successfully");
  res.render("studentcommittee.ejs");
});
// Route for committee dashboard
app.get("/dashboard/committee", async (req, res) => {
  try {
    // Fetch events associated with the committee (replace 'committeeId' with actual ID)
    const events = await Event.find({ committee_id:"65d9af4fcd04c37880c941e2" });

    // Render the EJS template and pass event data
    // res.render("dashboardcommittee.ejs");
    res.render('dashboardcommittee.ejs', { events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Internal Server Error');
  }
  //req.flash("success", "Committee dashboard loaded successfully");
  
});
//COMMITTEE DASHBOARD FEATURES
app.get("/committee/venueavailability", async (req, res) => {
  res.render("/committee/venueavailabilty.ejs");
  });
app.get("/committee/requestevent",async(req,res)=>{
  res.render("/committee/venueavailabilty.ejs");
})
app.get("committee/approval",async(req,res)=>{
  res.render("committee/approval.ejs");
})
app.post('/events/:eventId/approval', async (req, res) => {
  const { eventId } = req.params;
  const { approvalStatus } = req.body;
  try {
    const event = await Event.findById(eventId);
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
      // Fetch the event by ID from the database
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
    // Fetch committees data from the database or wherever it's stored
    const events = await Event.find();
    
    // Render the dashboardfaculty.ejs template and pass the committees data
    res.render('dashboardfaculty', {events});
  } catch (error) {
    console.error('Error fetching committees:', error);
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

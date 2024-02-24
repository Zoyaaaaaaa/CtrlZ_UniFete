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
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new Student({
//         email:"az@gmail.com",
//         username:"Zoiz",
//     });
//    let registereduser=await User.register(fakeUser,"hellocode");
//    console.log(registereduser);
// })
// Route for student dashboard

app.get("/dashboard/student", async (req, res) => {

  req.flash("success", "Student dashboard loaded successfully");
  res.render("dashboardstudent.ejs");
});

// Route for faculty dashboard
app.get("/dashboard/faculty", async (req, res) => {

  req.flash("success", "Faculty dashboard loaded successfully");
  res.render("dashboardfaculty.ejs");
});

// Route for committee dashboard
app.get("/dashboard/committee", async (req, res) => {
 
  req.flash("success", "Committee dashboard loaded successfully");
  res.render("dashboardcommittee.ejs");
});

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"PAGE NOT FOUND !"));
});

app.use((err,req,res,next)=>{
let{statusc="500",message="Something went wrong"}=err;
res.status(500).render("error.ejs",{message});

});

app.get("/stdent/dashboard",async(req,res)=>{
  res.render("student/studentdashboard.ejs")
})
app.get("/login",async(req,res)=>{
  res.render("login.ejs")
})  
// const newEvent = new Event({
   
//       committee_id: "65d9af4fcd04c37880c941de",
//       name: " TechnoVate",
//       description: "A hackathon to unleash your coding skills",
//       date: new Date("2024-07-15"),
//       approval_status: "Pending"
  
// });

// newEvent.save()
//   .then(event => {
//     console.log('Event saved successfully:', event);
//   })
//   .catch(error => {
//     console.error('Error saving event:', error);
//   });

app.listen(6009, () => {
  console.log("Server is listening to port");
});

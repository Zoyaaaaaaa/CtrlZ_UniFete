const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");


const ExpressError=require("../utils/ExpressError.js");
router.get("/signup",(req,res)=>{
   res.render("users/signup.ejs")
});

router.post("/signup", async (req, res) => {
    let { username, email, password ,role} = req.body;
    const newUser = new User({ email, username ,role});
   
    User.register(newUser, password, (error, registeredUser) => {
        if (error) {
            console.error(error);
            req.flash("error", "Already have an account. Login");
            return res.redirect("/signup");
        } else {
            console.log(registeredUser);
            req.login(registeredUser, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Error logging in");
                    return res.redirect("/login");
                }
                
                let dashboardUrl = `/dashboard/${req.body.role}`;
                return res.redirect(dashboardUrl);
            });
        }
    });
    
});

router.get("/login",async(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
 //   req.flash("success", "Welcome to UniFete");
 let dashboardUrl = `/dashboard/${req.body.role}`;
 return res.redirect(dashboardUrl);
});


router.get("/logout",async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
       // req.flash("success","You logged Out");
        res.redirect("/lander");
    })
})
// router.get("/add-fake-user", async (req, res) => {
//     try {
//         // Create a new fake user
//         const fakeUser = new User({
//             name: "Emir Kait",
//             email: "emir@example.com",
//             role: "student" // Set the role as needed
//         });

//         // Save the fake user to the database
//         await fakeUser.save();

//         res.send("Fake user added successfully!");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error adding fake user.");
//     }
// });
module.exports=router;
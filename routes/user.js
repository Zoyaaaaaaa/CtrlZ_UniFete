// const express=require("express");
// const router=express.Router();
// const User=require("../models/user.js");
// const passport=require("passport");
// const LocalStrategy=require("passport-local");
// const authRole=require("../authRole.js");
// const ExpressError=require("../utils/ExpressError.js");
// const flash = require("connect-flash");
// router.get("/signup",(req,res)=>{
//    res.render("users/signup.ejs")
// });

// router.post("/signup", async (req, res) => {
//     let { username, email, password ,role} = req.body;
//     const newUser = new User({ email, username ,role});
   
//     User.register(newUser, password, (error, registeredUser) => {
//         if (error) {
//             console.error(error);
//             req.flash("error", "Already have an account. Login");
//             return res.redirect("/signup");
//         } else {
//             console.log(registeredUser);
//             req.login(registeredUser, (err) => {
//                 if (err) {
//                     console.error(err);
//                     req.flash("error", "Error logging in");
//                     return res.redirect("/login");
//                 }
                
//                 let dashboardUrl = `/dashboard/${req.body.role}`;
//                 return res.redirect(dashboardUrl);
//             });
//         }
//     });
    
// });

// router.get("/login",async(req,res)=>{
//     res.render("users/login.ejs");
// });

// router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
//     // Authentication successful, redirect to appropriate dashboard
//     let dashboardUrl;
//     if (req.user.role === 'student') {
//         dashboardUrl = '/dashboard/student';
//     } else if (req.user.role === 'faculty') {
//         dashboardUrl = '/dashboard/faculty';
//     } else if (req.user.role === 'committee') {
//         dashboardUrl = '/dashboard/committee';
//     } else {
//         // Handle unknown roles or edge cases
//         req.flash('error', 'Unknown user role');
//         dashboardUrl = '/';
//     }
//     res.redirect(dashboardUrl);
// });




// router.get("/logout",async(req,res,next)=>{
//     req.logout((err)=>{
//         if(err){
//           return  next(err);
//         }
//        req.flash("success","You logged Out");
//         res.redirect("/lander");
//     })
// })
// // router.get("/add-fake-user", async (req, res) => {
// //     try {
// //         // Create a new fake user
// //         const fakeUser = new User({
// //             name: "Emir Kait",
// //             email: "emir@example.com",
// //             role: "student" // Set the role as needed
// //         });

// //         // Save the fake user to the database
// //         await fakeUser.save();

// //         res.send("Fake user added successfully!");
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).send("Error adding fake user.");
// //     }
// // });
// module.exports=router;
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const authRole = require("../authRole.js");
const ExpressError = require("../utils/ExpressError.js");
const flash = require("connect-flash");
router.use(flash());
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password, role } = req.body;
        const newUser = new User({ email, username, role });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                console.error(err);
                req.flash("error", "Error logging in");
                return res.redirect("/login");
            }
            let dashboardUrl = `/dashboard/${req.body.role}`;
            req.flash("success", "Signup successful. You have been logged in.");
            res.redirect(dashboardUrl);
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error signing up. Please try again.");
        res.redirect("/signup");
    }
});

router.get("/login", async (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    try {
        let dashboardUrl;
        if (req.user.role === 'student') {
            dashboardUrl = '/dashboard/student';
        } else if (req.user.role === 'faculty') {
            dashboardUrl = '/dashboard/faculty';
        } else if (req.user.role === 'committee') {
            dashboardUrl = '/dashboard/committee';
        } else {
            req.flash('error', 'Unknown user role');
            dashboardUrl = '/';
        }
        req.flash("success", "Login successful.");
        res.redirect(dashboardUrl);
    } catch (error) {
        console.error(error);
        req.flash("error", "Error logging in. Please try again.");
        res.redirect("/login");
    }
});

router.get("/logout", async (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                console.error(err);
                req.flash("error", "Error logging out. Please try again.");
                return res.redirect("/lander");
            }
            req.flash("success", "You have been logged out.");
            res.redirect("/lander");
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error logging out. Please try again.");
        res.redirect("/lander");
    }
});

module.exports = router;

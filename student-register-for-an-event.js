var express = require('express');
var http = require('http');
var path = require('path');
var nodemailer = require('nodemailer');

var app = express();
var server = http.Server(app);
var port = 3001; 

app.set("port", port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "student"))); 

// Routing
app.get("/", function (req, response) {
    response.sendFile(path.join(__dirname, "student/index3.html"));
});

app.post("/send_email", function (req, response) {
    var committeeId = req.body.committeeId;
    var name = req.body.name; 
    var description = req.body.description;
    var date = req.body.date;
    var occupancySize = req.body.occupancySize;
    var roomType = req.body.roomType;


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'urjabahad27@gmail.com',
            pass: 'vxpbfxincqurlszt'
        }
    });
    var recipients = ['urjabahad27@gmail.com'];

    var mailOptions = {
        from: 'urjabahad27@gmail.com', 
        to: recipients, 
        subject: 'Thank you for Resgistering',
        html: `
            <p>Thank you for registering, you will be added to the event group shortly. </p>
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
        response.redirect("/");
    });
});

// Initialize Web Server
server.listen(port, function () {
    console.log("Starting server on port " + port);
});

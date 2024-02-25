var express = require('express');
var http = require('http');
var path = require('path');
var nodemailer = require('nodemailer');

var app = express();
var server = http.Server(app);
var port = 5000; 

app.set("port", port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "page"))); 

// Routing
app.get("/", function (req, response) {
    response.sendFile(path.join(__dirname, "page/index.html"));
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
    //var additionalMessage = 'Click here to Approve or Disapprove the request:';
    var linkUrl = '';

    var mailOptions = {
        from: 'urjabahad27@gmail.com', 
        to: recipients, 
        subject: 'Request for Approval of Event',
        html: `
            <p>Committee Name: ${name}</p>
            <p>Committee Id: ${committeeId}</p>
            <p>Event Description: ${description}</p>
            <p>Date: ${date}</p>
            <p>Room Required: ${roomType}</p>
            <p>Expected Attendees: ${occupancySize}</p>
            <br>
            <a href="${linkUrl}">Click here to Approve or Disapprove the request</a>
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

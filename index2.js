var express = require('express');
var http = require('http');
var path = require('path');
var nodemailer = require('nodemailer');

var app = express();
var server = http.Server(app);
var port = 8000;

app.set("port", port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "pages")));

// Routing
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "pages/index2.html"));
});

app.post("/send_approval", function (req, res) {
    var approvalStatus = req.body.approvalStatus;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'urjabahad27@gmail.com',
            pass: 'vxpbfxincqurlszt'
        }
    });
    var recipients = ['urjabahad27@gmail.com'];

    var mailOptions = {
        from: recipients,
        to: 'urjabahad27@gmail.com',
        subject: 'Approval Status',
        html: `
            <p>Status: ${approvalStatus}</p>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send("Error sending email");
        } else {
            console.log("Email sent: " + info.response);
            res.redirect("/");
        }
    });
});

// Initialize Web Server
server.listen(port, function () {
    console.log("Starting server on port " + port);
});

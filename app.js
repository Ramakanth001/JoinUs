// Express init
var express = require('express');
var app = express();

// Used to connect to DB
var mysql = require('mysql2');

// Middleware that parses incoming request bodies, making the data accessible in req.body.
var bodyParser = require("body-parser");

// DB connection from config
var connection = require('./config/db');

// Used to send mails
var nodemailer = require("nodemailer");

// For authentication
var session = require('express-session');
var authRoutes = require('./auth/authRoutes');

// Required for environment variables
require('dotenv').config();

// Set up EJS as view engine
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Serve TinyMCE statically from node_modules
var path = require('path');
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/auth', authRoutes);

// Protect admin routes
var { isAuthenticated } = require('./auth/authController');

app.get('/admin_dashboard', isAuthenticated, function (req, res) {
  console.log("Admin session in dashboard:", req.session); // Debugging session
  res.render('admin_dashboard');
});

// Email sender setup - credentials in .env
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Handle sending emails
app.post("/admin/send-mail", isAuthenticated, function (req, res) {
  var emailContent = req.body.email_content;

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: "recipient@example.com", // Change this to send to real users
    subject: "Newsletter Update",
    html: emailContent
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.redirect('/admin_dashboard');
    }
  });
});

// Configuring custom HTML using Embedded JS - EJS
app.get("/", function (request, response) {
  var q = 'SELECT COUNT(*) as count FROM users';
  connection.query(q, function (error, results) {
    if (error) throw error;
    var user_count = results[0].count;
    response.render("home", { count: user_count });
  });
});

app.post("/register", function (request, response) {
  console.log("POST REQUEST SENT TO " + request.body.email);
  var person = {
    email: request.body.email,
    subscribed: 1,
  };
  connection.query('INSERT INTO users SET ?', person, function (error, result) {
    if (error) throw error;
    response.redirect("/");
  });
});

app.get("/admin_login", function (req, res) {
  res.render("admin_login");
});

app.get("/admin/groups", function (req, res) {
  var q = `SELECT DISTINCT dl_groups.dl_name FROM users JOIN dl_groups ON users.group_id = dl_groups.id;`;

  connection.query(q, function (error, results) {
    if (error) throw error;
    var groups = results.map(row => row.dl_name);
    res.json({ groups });
  });
});

// Start server
app.listen(8080, function () {
  console.log("Listening on port 8080!");
  console.log("Access using http://localhost:8080");
});



// app.get("/", function(request, response) {
//   response.send("Hi! You came to the root page.");
// });

// app.get("/joke", function(request, response) {
//   response.send("It's indeed a joke");
// });

// app.get("/joke/serious", function(request, response) {
//   response.send("It's not a joke. Be serious");
// });

// app.get("/random_num", function(request, response) {
//   var rand_num = Math.floor(Math.random() * 10)+1;
//   response.send("The Random number from 1-10 is : "  + rand_num)
// });

// A connection to DB and fetching data from ot without EJS
// app.get("/", function(request, response) {
//   var q = 'SELECT COUNT(*) as count FROM users';
//   connection.query(q, function (error, results) {
//     if (error) throw error;
//     var msg = "We have " + results[0].count + " users";
//     response.send(msg);
//     });
//   });
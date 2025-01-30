// Express init
var express =  require('express');
var app = express();

//used to connect to DB
var mysql = require('mysql2'); 

// Middleware that  parses incoming request bodies, making the data accessible in req.body.
var bodyParser = require("body-parser");

// DB connection from config
var connection = require('./config/db');


//Used to send mails
var nodemailer = require("nodemailer");

// For authentication purpose
var session = require('express-session');
var authRoutes = require('./auth/authRoutes');

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/auth', authRoutes);

// Protect admin routes
var { isAuthenticated } = require('./auth/authController');
app.get('/admin_dashboard', isAuthenticated, function(req, res) {
  res.render('admin_dashboard');
});

// Used to export creds from envvironment
require('dotenv').config();

// Email sender setup - creds in .env
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Configuring custom HTML using Embedded JS - EJS
app.get("/", function(request, response) {
  var q = 'SELECT COUNT(*) as count FROM users';
  connection.query(q, function (error, results) {
    if (error) throw error;
    // var msg = "We have " + results[0].count + " users";
    var user_count = results[0].count;
    response.render("home", {count:user_count});
    });
  });

app.post("/register", function(request, response){
  console.log("POST REQUEST SENT TO " + request.body.email);
  var person = {
    email: request.body.email,
    subscribed: 1,
  };
  connection.query('INSERT INTO users SET ?', person, function(error, result) {
    if (error) throw error;
    console.log(error);
    console.log(result);
    response.redirect("/");
  });
});
  

app.get("/admin_login", function(req, res) {
  res.render("admin_login");
});

app.get("/admin/groups", function(req, res) {
  var q = `
      SELECT DISTINCT dl_groups.dl_name 
      FROM users 
      JOIN dl_groups ON users.group_id = dl_groups.id;
  `;

  connection.query(q, function (error, results) {
      if (error) throw error;

      var groups = results.map(row => row.dl_name);
      res.json({ groups });
  });
});



app.listen(8080, function() {
  console.log("Listening on 8080 port!");
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
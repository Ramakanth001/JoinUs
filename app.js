// Express init
var express = require('express');
var app = express();
var path = require('path');

// Middleware
var bodyParser = require("body-parser");
var session = require('express-session');
var nodemailer = require("nodemailer");
var multer = require('multer');
require('dotenv').config();

// DB connection from config
var connection = require('./config/db');
var authRoutes = require('./auth/authRoutes');
var { isAuthenticated } = require('./auth/authController');

// Set EJS as view engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/auth', authRoutes);

// File upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Admin routes
app.get('/admin_dashboard', isAuthenticated, function(req, res) {
  res.render('admin_dashboard');
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ location: `/uploads/${req.file.filename}` });
});

// Email sender setup
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post("/admin/send-mail", upload.single('file'), function(req, res) {
    const { recipient, subject, email_content } = req.body;
    const attachment = req.file ? {
        filename: req.file.originalname,
        path: req.file.path
    } : null;

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        html: email_content,
        attachments: attachment ? [attachment] : []
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Failed to send email.");
        } else {
            console.log("Email sent:", info.response);
            res.redirect("/admin_dashboard");
        }
    });
});

// Root Route
app.get("/", function(request, response) {
  var q = 'SELECT COUNT(*) as count FROM users';
  connection.query(q, function (error, results) {
    if (error) throw error;
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
    response.redirect("/");
  });
});
  
app.get("/admin_login", function(req, res) {
  res.render("admin_login");
});

app.get("/admin/groups", function(req, res) {
  var q = `SELECT DISTINCT dl_groups.dl_name FROM users JOIN dl_groups ON users.group_id = dl_groups.id;`;
  connection.query(q, function (error, results) {
      if (error) throw error;
      var groups = results.map(row => row.dl_name);
      res.json({ groups });
  });
});

// Start the server
app.listen(8080, function() {
    console.log("Listening on port 8080");
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
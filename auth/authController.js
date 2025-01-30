var bcrypt = require('bcrypt');
var connection = require('../config/db'); // Import database connection
var util = require('util');

const query = util.promisify(connection.query).bind(connection); // Convert query to use async/await

// Admin login function
exports.login = async function(req, res) {
    try {
        const { username, password } = req.body;
        
        // Fetch admin details
        const results = await query('SELECT * FROM admins WHERE username = ?', [username]);

        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].password);
            if (match) {
                req.session.admin = username;
                console.log(`✅ Admin '${username}' logged in successfully!`);
                console.log("Session after login:", req.session);  // Debugging session data

                return res.redirect('/admin_dashboard');  // Redirect to dashboard after login
            }
        }

        console.log("❌ Invalid credentials!");
        return res.status(401).send('Invalid credentials');
    } catch (error) {
        console.error("❌ Login error:", error);
        return res.status(500).send('Internal Server Error');
    }
};

// Logout function
exports.logout = function(req, res) {
    req.session.destroy(() => {
        console.log("✅ Admin logged out");
        res.redirect('/admin_login');
    });
};

// Middleware to protect admin routes
exports.isAuthenticated = function(req, res, next) {
    console.log("Checking authentication...");
    console.log("Session data:", req.session);  // Debug session

    if (req.session && req.session.admin) {
        console.log("✅ Admin is authenticated:", req.session.admin);
        return next();
    } else {
        console.log("❌ Not authenticated. Redirecting to login.");
        return res.redirect('/admin_login');  // Redirect to correct login page
    }
};

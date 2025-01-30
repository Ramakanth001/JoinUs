var express = require('express');
var router = express.Router();
var authController = require('../auth/authController'); 
// Correct relative path

router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Check if admin is authenticated
router.get('/is-authenticated', (req, res) => {
  if (req.session.admin) {
    res.json({ authenticated: true, admin: req.session.admin });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;

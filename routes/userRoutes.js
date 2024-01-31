const express = require("express");
const signupController = require("../controllers/signup.js");
const loginController = require("../controllers/login.js");

const router = express.Router();

//Routes are declared here
router.post('/signup', signupController);
router.post('/login', loginController);

module.exports = router;

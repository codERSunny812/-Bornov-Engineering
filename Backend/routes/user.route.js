const express = require('express');
const { registerUser, loginUser } = require('../controller/user.controller');

const Userrouter = express.Router();



// Register route
Userrouter.post('/register',registerUser);

// Login route
Userrouter.post('/login',loginUser);

module.exports = Userrouter;
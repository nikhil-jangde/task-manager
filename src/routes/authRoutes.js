// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {generateToken, createUser} = require('../controllers/authController');
 
router.post('/createUser',createUser);
// POST /api/auth/token/:user_id
router.post('/token/:user_id', generateToken);


module.exports = router;

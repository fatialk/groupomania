const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require("../middleware/auth");

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/users/:id', auth, userCtrl.hasApprouved);
module.exports = router;
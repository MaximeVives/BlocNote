let express = require('express');
let router = express.Router();
let authController = require('../controllers/authController');

/* POST register page */
router.post('/register', authController.register);

/* POST login page*/
router.get('/login', authController.login);

/* POST reset token page*/
router.get('/reset', authController.reset_token);

/* GET long life token*/
router.put('/long_token', authController.longlifetoken);

module.exports = router;
